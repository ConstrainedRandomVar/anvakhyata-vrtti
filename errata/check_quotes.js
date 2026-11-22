#!/usr/bin/env node
// Verifies every citation quote in errata.json and judgement.json: the quote must be a substring of the cited source's text
// for the cited sūtra. Normalisation: whitespace, daṇḍas (। ॥) and hyphens/dashes are removed on both sides; nothing else.
// A quote with "…" is checked as pieces that must all occur, in order. Kāśikā quotes are also checked against the current
// upstream kashika.txt if a copy is given (UPSTREAM_KASHIKA=/path, default /tmp/adup/sutraani/kashika.txt) — reported, not failed.
// Usage: node check_quotes.js
const fs = require('fs'), path = require('path'), os = require('os');
const DATA = path.join(process.env.ASHTADHYAYI_DATA || path.join(os.homedir(), 'Projects/ashtadhyayi-data'), 'sutraani/');
const PV = Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync(path.join(__dirname, '../prathamavritti/prathamavritti.json'), 'utf8')).entries).map(([k, e]) => [k, Object.assign({ anuvritti: e.anuvritti_note }, e)]));   // the released prathamāvṛtti text
const J = f => { const d = JSON.parse(fs.readFileSync(f, 'utf8')); return d.data && !Array.isArray(d.data) ? d.data : d; };
const SUTRAS = Object.fromEntries(JSON.parse(fs.readFileSync(DATA + 'data.txt', 'utf8')).data.map(x => [x.i, x]));
const FILE = { 'Kāśikā': 'kashika', 'Siddhānta-kaumudī': 'kaumudi', 'Laghu-kaumudī': 'laghukaumudi', 'Mahābhāṣya': 'bhashya', 'Nyāsa': 'nyaas',
  'Padamañjarī': 'padamanjari', 'Bālamanoramā': 'balamanorama', 'Tattvabodhinī': 'tattvabodhini', 'sūtrārtha (ashtadhyayi.com)': 'sutrartha' };
const COMM = {}; for (const f of new Set(Object.values(FILE))) COMM[f] = J(DATA + f + '.txt');
const upF = process.env.UPSTREAM_KASHIKA || '/tmp/adup/sutraani/kashika.txt';
const UP = fs.existsSync(upF) ? J(upF) : null;
const sid = n => { const [a, p, s] = n.split('.'); return a + p + s.padStart(3, '0'); };
const norm = s => String(s || '').replace(/[\s।॥\-‐-―]/g, '');
const has = (text, quote) => { const t = norm(text); let at = 0;
  for (const piece of String(quote).split('…').map(norm).filter(Boolean)) { const k = t.indexOf(piece, at); if (k < 0) return false; at = k + piece.length; } return true; };
function textOf(source, on) {
  const id = sid(on);
  if (source.startsWith('prathamāvṛtti')) { const e = PV[on] || {}; const fld = { padaccheda: 'padaccheda', artha: 'artha', 'anuvṛtti': 'anuvritti', 'samāsa': 'samasa' }[source.split(', ')[1]]; return e[fld]; }
  if (source.startsWith('ashtadhyayi.com data.txt, field s')) return (SUTRAS[id] || {}).s;
  const f = FILE[source]; if (!f) throw new Error('unknown source ' + source);
  const v = COMM[f][id]; return v && typeof v === 'object' ? [v.sa, v.sd].join(' ') : v;
}
const errata = JSON.parse(fs.readFileSync(path.join(__dirname, 'errata.json'), 'utf8'));
const jud = JSON.parse(fs.readFileSync(path.join(__dirname, 'judgement.json'), 'utf8'));
const groups = [['errata.json', errata], ['judgement.json / for_your_judgement', jud.for_your_judgement], ['judgement.json / withdrawn', jud.withdrawn]];
let total = 0, pass = 0, upTotal = 0, upPass = 0; const fails = [], upMiss = [];
for (const [g, list] of groups) for (const e of list) for (const c of e.citations) {
  total++; let ok = false;
  try { ok = has(textOf(c.source, c.on), c.quote); } catch (err) { fails.push(`${g} ${e.sutra_no}: ${err.message}`); continue; }
  if (ok) pass++; else fails.push(`${g} ${e.sutra_no}: ${c.source} on ${c.on}: “${c.quote}”`);
  if (c.source === 'Kāśikā' && UP) { upTotal++; if (has(UP[sid(c.on)], c.quote)) upPass++; else upMiss.push(`${e.sutra_no}: Kāśikā on ${c.on}: “${c.quote}”`); }
}
// the "now" of every main item must still be in data.txt (an / pc fields)
let nowOk = 0, nowN = 0; const nowFail = [];
for (const e of errata) { if (!/^(an|pc)/.test(e.field)) continue; nowN++; const s = SUTRAS[e.id]; const fv = e.field === 'an' ? s.an : s.pc;
  if (e.field === 'an' ? fv === e.now : fv.includes(e.now)) nowOk++; else nowFail.push(e.sutra_no); }
console.log(`quotes verbatim in the cited source: ${pass}/${total}`);
fails.forEach(f => console.log('  FAIL ' + f));
console.log(`"now" values present in current data.txt: ${nowOk}/${nowN}` + (nowFail.length ? ' — missing: ' + nowFail.join(', ') : ''));
if (UP) { console.log(`Kāśikā quotes also in the current upstream kashika.txt: ${upPass}/${upTotal}`); upMiss.forEach(m => console.log('  upstream differs: ' + m)); }
else console.log('(no upstream kashika.txt copy found — upstream check skipped)');
process.exit(fails.length || nowFail.length ? 1 : 0);
