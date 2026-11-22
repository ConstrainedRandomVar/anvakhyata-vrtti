#!/usr/bin/env node
// Sūtras that need SPECIAL handling (Harsha 2026-11-17: "find what other sūtras (especially nipātana) fall in this bucket"). Free detectors only;
// one row per sūtra with every reason it is flagged. → special.html + summary. Recompute: node tools/special.js (after node build.js)
'use strict';
const fs = require('fs'), path = require('path');
const R = require('./recs.js')(), D = path.join(__dirname, '..'), AD = path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani/');
const L = f => { const d = JSON.parse(fs.readFileSync(AD + f, 'utf8')); return d.data && !Array.isArray(d.data) ? d.data : d; };
const K = L('kashika.txt');
const T = require('../rolepilot/roles.json'), F = require('../rolepilot/fallback.json'), REV = require('../rolepilot/review-all.json');
const HANDR = fs.existsSync(path.join(D, 'rolepilot/hand-roles.json')) ? require('../rolepilot/hand-roles.json') : {};
const sents = t => (String(t || '').match(/[^।॥]+[।॥]?/g) || []).map(x => x.trim()).filter(x => x.replace(/[।॥]/g, '').trim());
const nz = t => String(t || '').replace(/[\s।॥]/g, '');
const rows = {}; const add = (n, b, why) => { (rows[n] = rows[n] || { n, s: R[n].s, gen: R[n].genC, b: {} }).b[b] = why; };
const B = {
  nip: 'nipātana — the references give a derivation (base / suffix / operation) our vṛtti does not state',
  both: 'Gemini review: both the role vṛtti and the old one are wrong (fix list)',
  fb: 'Gemini review: role vṛtti wrong, old one shown instead (fallback)',
  noroles: 'no role table (extraction failed) — old engine only, no student view',
  kv: 'the Kāśikā sentence used as “KV” is not its gloss (a vārttika / gaṇasūtra / later discussion) — every check that reads KV saw the wrong text',
  gap: 'a paribhāṣā the references use is still not in our steps',
};
for (const r of Object.values(R)) {
  if (HANDR[r.n]) continue;   // already hand-crafted
  const kvFull = String(K[r.id] || ''), pv = String((r.pv && (r.pv.arthaFull || r.pv.artha)) || '');
  // 1. nipātana whose derivation the references give but we do not
  if ((r.roleKind || r.kind) === 'nipatana' || r.kind === 'nipātana') {
    const rest = sents(kvFull).slice(1).join(' ') + ' ' + pv;
    if (/(प्रत्ययः|प्रत्ययो|प्रत्ययान्त|आदेशः|आदेशो|लोपः|लोपो|पूर्वात्|धातोः|धातोर्|आगमः|आगमो)/.test(rest) && !/प्रत्यय|आदेश|लोप|धातोः|पूर्वात्|आगम/.test(r.genC || ''))
      add(r.n, 'nip', (rest.match(/[^।]*(प्रत्यय|आदेश|लोप|पूर्वात्|धातो|आगम)[^।]*/) || [''])[0].trim().slice(0, 140));
  }
  if (F.fix[r.n]) add(r.n, 'both', F.fix[r.n].newProblem || '');
  if (F.fallback[r.n]) add(r.n, 'fb', F.fallback[r.n].why || '');
  if (!T[r.n]) add(r.n, 'noroles', '');
  // 5. wrong KV sentence: a vārttika / gaṇasūtra, or ≥4 sentences in while an earlier sentence already reads as the gloss
  if (r.kv && kvFull) { const ss = sents(kvFull), i = ss.findIndex(x => nz(x).includes(nz(r.kv).slice(0, 25)));
    const earlier = ss.slice(0, Math.max(0, i)).find(x => /भवत|भवन्त|वेदितव्य|निपात्य/.test(x) && !/वक्तव्य|ग०सू/.test(x));
    if (/वक्तव्य|उपसङ्ख्यान|उपसंख्यान|ग०सू/.test(r.kv) || (i >= 4 && earlier)) add(r.n, 'kv', `used: “${r.kv.slice(0, 80)}” · likely gloss: “${(earlier || ss[0] || '').slice(0, 80)}”`); }
  if (r.pbGap && r.pbGap.length) add(r.n, 'gap', r.pbGap.map(g => g.pid).join(', '));
}
const list = Object.values(rows).sort((a, b) => { const k = n => n.split('.').map(x => String(x).padStart(3, '0')).join('.'); return k(a.n).localeCompare(k(b.n)); });
const cnt = {}; for (const r of list) for (const b in r.b) cnt[b] = (cnt[b] || 0) + 1;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
fs.writeFileSync(path.join(D, 'special.html'), `<!doctype html><meta charset="utf-8"><title>Sūtras needing special handling</title>
<style>body{font-family:"Noto Serif Devanagari",serif;margin:16px;font-size:14px}table{border-collapse:collapse;width:100%}td,th{border-top:1px solid #ddd;padding:5px;vertical-align:top;text-align:left}th{background:#f5f5f5;position:sticky;top:0}.b{display:inline-block;font-size:11px;border-radius:4px;padding:0 5px;margin:1px 3px 1px 0;background:#eef}.w{color:#555;font-size:12px}label{margin-right:12px}</style>
<h2>Sūtras needing special handling — ${list.length} sūtras</h2><p>Recompute: <code>node build.js && node tools/special.js</code>. Filter:
${Object.keys(B).map(b => `<label><input type="checkbox" checked data-b="${b}" onchange="f()"> ${b} (${cnt[b] || 0})</label>`).join('')}</p>
<p>${Object.entries(B).map(([b, t]) => `<b>${b}</b>: ${esc(t)}`).join('<br>')}</p>
<table><thead><tr><th>sūtra</th><th>our vṛtti</th><th>why flagged</th></tr></thead><tbody>
${list.map(r => `<tr data-bs="${Object.keys(r.b).join(' ')}"><td><a href="vrtti.html#${r.n}"><b>${r.n}</b></a><br>${esc(r.s)}</td><td>${esc(r.gen)}</td><td>${Object.entries(r.b).map(([b, w]) => `<div><span class="b">${b}</span><span class="w">${esc(w)}</span></div>`).join('')}</td></tr>`).join('\n')}
</tbody></table><script>function f(){const on=new Set([...document.querySelectorAll('input[data-b]')].filter(x=>x.checked).map(x=>x.dataset.b));for(const tr of document.querySelectorAll('tbody tr'))tr.style.display=tr.dataset.bs.split(' ').some(b=>on.has(b))?'':'none'}</script>`);
const multi = list.filter(r => Object.keys(r.b).length > 1).length;
console.log(JSON.stringify({ sutras: list.length, byBucket: cnt, inMoreThanOne: multi }));
