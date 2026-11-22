#!/usr/bin/env node
// Merge the Gemini page readings of the prathamāvṛtti into one entry per sūtra, check every field against the
// independent Google Vision OCR of the same page, and extract the anuvṛtti ranges from the भाषार्थ notes.
// Usage: node merge.js  → ../prathama.json  (+ prints a consensus summary)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = process.env.PV_ROOT || path.join(process.env.HOME, 'Projects/sanskrit-texts/prathamavritti');
const DEV = '०१२३४५६७८९';
const toAsc = s => s.replace(/[०-९]/g, d => DEV.indexOf(d));
// normalise for comparison: the Vision OCR's systematic old-glyph misreads, punctuation, spacing
const fixOCR = t => t.replace(/(^|[\s\-—=\[(])श्र(?=[ािीुूृेैोौं:ः\s\-—]|[क-ह])/g, '$1अ').replace(/(^|[\s\-—=\[(])श्रा/g, '$1आ').replace(/(^|[\s\-—=\[(])प्रा(?=[तच])/g, '$1आ')
  .replace(/श्रौ/g, 'औ').replace(/श्रो/g, 'ओ').replace(/\|/g, '।');
const norm = t => toAsc(fixOCR(t || '')).replace(/[\s।॥|,.;:—\-–=()\[\]'"‘’`*]/g, '').replace(/ऽ/g, '');
// best similarity of a short string a inside a long text b (ratio of matched chars via LCS on a sliding window)
function lcs(a, b) { const m = a.length, n = b.length; if (!m || !n) return 0; let prev = new Array(n + 1).fill(0), cur = new Array(n + 1).fill(0); for (let i = 1; i <= m; i++) { for (let j = 1; j <= n; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]); [prev, cur] = [cur, prev]; } return prev[n]; }
function within(a, b) {
  a = norm(a); b = norm(b); if (!a) return null; if (b.includes(a)) return 1;
  // locate the region of b sharing the most with a: anchor on the rarest 4-gram, then LCS on a window
  let best = 0; const W = a.length + 12;
  const anchors = []; for (let i = 0; i + 4 <= a.length; i += Math.max(1, Math.floor(a.length / 6))) anchors.push([a.slice(i, i + 4), i]);
  for (const [g, off] of anchors) { let k = b.indexOf(g); let guard = 0; while (k >= 0 && guard++ < 6) { const s = Math.max(0, k - off - 6); const win = b.slice(s, s + W); best = Math.max(best, lcs(a, win) / a.length); k = b.indexOf(g, k + 1); } }
  return Math.round(best * 100) / 100;
}
const FIELDS = ['sutra', 'padaccheda', 'samasa', 'artha', 'anuvritti'];
// the sūtra list (ashtadhyayi.com data) decides the number: match the entry's sūtra text, near the number Gemini read
const SDATA = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani/data.txt'), 'utf8')).data;
const SLIST = SDATA.map(x => ({ n: `${+x.a}.${+x.p}.${+x.n}`, s: x.s }));
const SIDX = Object.fromEntries(SLIST.map((x, i) => [x.n, i]));
const simS = (a, b) => { a = norm(a); b = norm(b); if (!a || !b) return 0; return lcs(a, b) / Math.max(a.length, b.length); };
// placement score: whole-sūtra similarity, or — when this edition prints only part of our sūtra (it splits a few) — coverage of the part
const placeS = (a, b) => { a = norm(a).replace(/[A-Za-z]/g, ''); b = norm(b); if (!a || !b) return 0; const l = lcs(a, b); const whole = l / Math.max(a.length, b.length); const part = a.length >= 6 && a.length >= 0.4 * b.length ? 0.85 * l / a.length : 0; return Math.max(whole, part); };
const OUT = {}, issues = [], stats = { pages: 0, entries: 0, agree: 0, close: 0, disagree: 0, fields: 0, unparsed: [] };
for (let A = 1; A <= 8; A++) {
  const gdir = path.join(ROOT, `a${A}`, 'gem'), odir = path.join(ROOT, `a${A}`, 'ocr');
  if (!fs.existsSync(gdir)) continue;
  // 1. every printed entry in page order (a page's leading continuation joins the entry before it)
  const E = []; let last = null;
  for (const f of fs.readdirSync(gdir).filter(x => x.endsWith('.json')).sort()) {
    stats.pages++;
    const d = JSON.parse(fs.readFileSync(path.join(gdir, f), 'utf8'));
    if (!d.parsed) { stats.unparsed.push(`a${A}/${f}`); continue; }
    let vision = ''; try { vision = JSON.parse(fs.readFileSync(path.join(odir, f), 'utf8')).fullTextAnnotation.text; } catch (e) { }
    const lead = d.parsed.lead || {};
    if (last && Object.keys(lead).length) for (const k of FIELDS) if (lead[k]) { last[k] = ((last[k] || '') + ' ' + lead[k]).trim(); last.pages.push(`a${A}/${f}`); last._vision += '\n' + vision; }
    for (const e of d.parsed.entries || []) {
      const rec = { num: '', raw: (e.num || '').trim(), sutra: (e.sutra || '').replace(/^.*[A-Za-z?][^ऀ-ॿ]*:\s*/, '').replace(/\s*॥.*$/, '').trim(), padaccheda: e.padaccheda || '', samasa: e.samasa || '', type: e.type || '', artha: (e.artha || '').replace(/^[\s—:-]+/, '').trim(), anuvritti: e.anuvritti || '', pages: [`a${A}/${f}`], _vision: vision };
      E.push(rec); last = rec;
    }
  }
  // 2. align the printed entries with our sūtra list for this adhyāya, in order (monotone DP within a band around the printed number):
  //    an entry matches one sūtra, or two (this edition prints a few pairs as one sūtra); unmatched entries are pages scanned twice,
  //    halves of a sūtra this edition splits, or the pratyāhāra sūtras; unmatched sūtras are missing from the scan.
  const lo = SLIST.findIndex(x => x.n.startsWith(`${A}.`)); let hi = lo; while (hi < SLIST.length && SLIST[hi].n.startsWith(`${A}.`)) hi++;
  const D = SLIST.slice(lo, hi), m = E.length, n = D.length, W = 30;
  const exp = []; let prevE = -1;
  for (let i = 0; i < m; i++) { const k = SIDX[E[i].raw]; exp[i] = k != null && k >= lo && k < hi ? k - lo : prevE + 1; prevE = exp[i]; }
  const NS = E.map(e => norm(e.sutra)), ND = D.map(d => norm(d.s));
  const NEG = -1e9, dp = Array.from({ length: m + 1 }, () => new Float64Array(n + 1).fill(NEG)), bk = Array.from({ length: m + 1 }, () => new Int8Array(n + 1));
  const sc = (i, j) => {
    if (!E[i].sutra) return Math.abs(j - exp[i]) <= 3 ? 0.5 : NEG;   // sūtra text not read: trust a nearby number
    if (Math.abs(j - exp[i]) > W) {                                  // far from the printed number (misread number): only a near-exact text match
      const a = NS[i], b = ND[j]; if (a.length < 4 || a.length < 0.75 * b.length || a.length > 1.33 * b.length || a[0] !== b[0]) return NEG;
      const v = simS(E[i].sutra, D[j].s); return v >= 0.9 ? v : NEG;
    }
    const v = placeS(E[i].sutra, D[j].s); return v >= 0.5 ? v + (D[j].n === E[i].raw ? 0.02 : 0) : NEG;
  };
  const pairSc = (i, j) => { if (j + 1 >= n || Math.abs(j - exp[i]) > W || !E[i].sutra) return NEG; const v = simS(E[i].sutra, D[j].s + D[j + 1].s); return v >= 0.88 ? v + 0.6 : NEG; };
  for (let j = 0; j <= n; j++) dp[0][j] = 0;
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] - 0.05; bk[i][0] = 1;
    for (let j = 1; j <= n; j++) {
      let best = dp[i - 1][j] - 0.05, how = 1;                            // entry unmatched
      if (dp[i][j - 1] > best) { best = dp[i][j - 1]; how = 2; }          // sūtra unmatched
      const s1 = sc(i - 1, j - 1); if (s1 > NEG && dp[i - 1][j - 1] + s1 > best) { best = dp[i - 1][j - 1] + s1; how = 3; }
      if (j >= 2) { const s2 = pairSc(i - 1, j - 2); if (s2 > NEG && dp[i - 1][j - 2] + s2 > best) { best = dp[i - 1][j - 2] + s2; how = 4; } }
      dp[i][j] = best; bk[i][j] = how;
    }
  }
  const asg = new Array(m).fill(null); let i = m, j = n;
  while (i > 0) { const h = bk[i][j]; if (h === 1) i--; else if (h === 2) j--; else if (h === 3) { asg[i - 1] = [j - 1]; i--; j--; } else { asg[i - 1] = [j - 2, j - 1]; i--; j -= 2; } if (j < 0) break; }
  // pages bound out of order in the scan: an unplaced entry goes to a still-empty sūtra when the text matches
  const taken = new Set(asg.flat().filter(x => x != null));
  for (let k = 0; k < m; k++) {
    if (asg[k] || !E[k].sutra) continue;
    let bj = -1, bv = 0;
    for (let jj = Math.max(0, exp[k] - W); jj < Math.min(n, exp[k] + W + 1); jj++) { if (taken.has(jj)) continue; const v = placeS(E[k].sutra, D[jj].s) + (D[jj].n === E[k].raw ? 0.1 : 0); if (v > bv) { bv = v; bj = jj; } }
    if (bj >= 0 && bv >= 0.8) { asg[k] = [bj]; taken.add(bj); issues.push({ page: E[k].pages[0], what: 'page out of order in the scan (placed by sūtra text)', read: E[k].raw, now: D[bj].n }); }
  }
  for (let k = 0; k < m; k++) {
    const rec = E[k];
    if (!asg[k]) { issues.push({ page: rec.pages[0], what: 'entry not placed (page scanned twice, half of a split sūtra, or not a numbered sūtra)', read: rec.raw, sutra: rec.sutra }); continue; }
    rec.num = D[asg[k][0]].n;
    if (rec.num !== rec.raw) issues.push({ page: rec.pages[0], what: 'numbered differently in this edition (placed by sūtra text)', read: rec.raw, now: rec.num, sutra: rec.sutra });
    if (!rec.sutra) issues.push({ page: rec.pages[0], what: 'sūtra text not read (placed by its number)', read: rec.raw, now: rec.num });
    OUT[rec.num] = rec; stats.entries++;
    if (asg[k].length === 2) { const n2 = D[asg[k][1]].n; OUT[n2] = Object.assign({}, rec, { num: n2, combinedWith: rec.num, pages: rec.pages.slice() }); rec.combinedWith = n2; issues.push({ page: rec.pages[0], what: 'printed as one sūtra with the next', num: rec.num, with: n2 }); }
  }
}
// sūtras the page reading skipped, found by fill.js on the pages between their neighbours
const FILLF = path.join(__dirname, '..', 'prathama-fill.json');
const FILL = fs.existsSync(FILLF) ? JSON.parse(fs.readFileSync(FILLF, 'utf8')) : {};
const ABSENT = {};
// pages missing from the scan, transcribed by hand from photos of the printed book (prathama-manual.json)
const MANF = path.join(__dirname, '..', 'prathama-manual.json');
const MAN = fs.existsSync(MANF) ? JSON.parse(fs.readFileSync(MANF, 'utf8')) : {};
for (const [n, m] of Object.entries(MAN)) {
  if (n.startsWith('_') || OUT[n]) continue;
  OUT[n] = Object.assign({ num: n, raw: n, type: '', pages: ['photo of the printed book'], _vision: '', manual: true }, m);
}
for (const [n, t] of Object.entries(MAN._neighbours || {})) if (OUT[n] && !(OUT[n].anuvritti || '').includes(t.slice(0, 20))) OUT[n].anuvritti = ((OUT[n].anuvritti || '') + ' ' + t).trim();
for (const x of SLIST) {
  if (OUT[x.n]) continue;
  const f = FILL[x.n];
  if (f && f.found) {
    let vision = ''; const [a, pf] = f.pageFile.split('/'); try { vision = JSON.parse(fs.readFileSync(path.join(ROOT, a, 'ocr', pf), 'utf8')).fullTextAnnotation.text; } catch (e) { }
    OUT[x.n] = { num: x.n, raw: f.num || '', sutra: (f.sutra || '').replace(/\s*॥.*$/, '').trim(), padaccheda: f.padaccheda || '', samasa: f.samasa || '', type: f.type || '', artha: (f.artha || '').replace(/^[\s—:-]+/, '').trim(), anuvritti: f.anuvritti || '', pages: [f.pageFile], _vision: vision, filled: true };
    if (f.combined) OUT[x.n].combined = true;
    issues.push({ page: f.pageFile, what: 'skipped by the page reading, found by a focused reading', num: x.n });
  } else ABSENT[x.n] = 'pending';
}
// why absent: if this edition's own printed numbers around the gap run on without a break, the edition leaves the sūtra out;
// if the printed numbers jump too, the pages are missing from the scan
for (const k of Object.keys(ABSENT)) {
  const i = SIDX[k]; let p = i - 1; while (p >= 0 && !OUT[SLIST[p].n]) p--; let q = i + 1; while (q < SLIST.length && !OUT[SLIST[q].n]) q++;
  const rp = (OUT[SLIST[p]?.n] || {}).raw || '', rq = (OUT[SLIST[q]?.n] || {}).raw || '';
  const [a1, b1, c1] = rp.split('.').map(Number), [a2, b2, c2] = rq.split('.').map(Number);
  const gap = a1 === a2 && b1 === b2 ? c2 - c1 - 1 : null;
  ABSENT[k] = gap === 0 ? 'not in this edition' : gap > 0 ? 'pages missing from the scan' : 'not found';
}
// clean the अर्थः: leading labels the reading sometimes kept, stray Latin letters
const cleanArtha = t => (t || '').replace(/^.*?अर्थः\s*[—:-]+\s*/, m => /अर्थः/.test(m) ? '' : m).replace(/^अनु०.*?॥\s*/, '').trim();
const hasLatin = t => /[A-Za-z]/.test(t || '');
// arbitration between the first page reading and the focused second reading (reread.js)
const RRF = path.join(__dirname, '..', 'prathama-reread.json');
const RR = fs.existsSync(RRF) ? JSON.parse(fs.readFileSync(RRF, 'utf8')) : {};
const qn = t => norm(t).replace(/[‹›]/g, '');
for (const r of Object.values(OUT)) {
  r.artha = cleanArtha(r.artha);
  const x = RR[r.num]; if (!x) continue;
  const a = cleanArtha(x.first), b = cleanArtha(x.second);
  let pick, why;
  const c = x.third ? cleanArtha(x.third) : null;
  if (qn(a) === qn(b)) { pick = a; why = 'two readings agree'; }
  else if (c && qn(c) === qn(a)) { pick = a; why = 'third reading agrees with the first'; }
  else if (c && qn(c) === qn(b)) { pick = b; why = 'third reading agrees with the second'; }
  else if (hasLatin(a) && !hasLatin(b)) { pick = b; why = 'first reading had stray Latin letters'; }
  else if (hasLatin(b) && !hasLatin(a)) { pick = a; why = 'second reading had stray Latin letters'; }
  else if (b.length < 0.6 * a.length) { pick = a; why = 'second reading cut short'; }
  else if (a.length < 0.6 * b.length) { pick = b; why = 'first reading cut short'; }
  else {
    // word vote: for each word on which the readings differ, which form does the independent Vision OCR contain?
    const V = norm(r._vision), ta = a.split(/\s+/).map(qn).filter(Boolean), tb = b.split(/\s+/).map(qn).filter(Boolean);
    const onlyA = ta.filter(w => !tb.includes(w)), onlyB = tb.filter(w => !ta.includes(w));
    const va = onlyA.filter(w => w.length > 1 && V.includes(w)).length, vb = onlyB.filter(w => w.length > 1 && V.includes(w)).length;
    if (va !== vb) { pick = vb > va ? b : a; why = `word vote with the Vision OCR (${va}:${vb})`; }
    else { const sa = within(a, r._vision) || 0, sb = within(b, r._vision) || 0; pick = sb > sa ? b : a; why = `closer to the Vision OCR (${sa} vs ${sb})`; }
  }
  r.artha = pick; r.arthaAlt = pick === a ? b : a; r.arthaWhy = why;
  if (why.startsWith('closer')) issues.push({ page: r.pages.join(','), num: r.num, field: 'artha (two readings differ)', first: a, second: b, chose: pick === a ? 'first' : 'second', why });
}
// entries cut at a page break, read again from both pages (cont.js): take the fuller reading when it is closed and either
// starts like the first reading or agrees with the Vision OCR of those pages
const CONTF = path.join(__dirname, '..', 'prathama-cont.json');
const CONT = fs.existsSync(CONTF) ? JSON.parse(fs.readFileSync(CONTF, 'utf8')) : {};
for (const r of Object.values(OUT)) {
  const x = CONT[r.num]; if (!x || !x.artha) continue;
  const a = cleanArtha(x.artha).trim(), b = (r.artha || '').trim();
  if (!/[॥।|]\s*$/.test(a) || norm(a).length < norm((b.match(/^(.*?॥)/) || [, b])[1]).length) continue;
  let vis = r._vision || ''; for (const pg of r.pages) { const [aa, ff] = pg.split('/'); if (!ff) continue; const list = fs.readdirSync(path.join(ROOT, aa, 'ocr')).sort(); const j = list.indexOf(ff); if (list[j + 1]) try { vis += '\n' + JSON.parse(fs.readFileSync(path.join(ROOT, aa, 'ocr', list[j + 1]), 'utf8')).fullTextAnnotation.text; } catch (e) { } }
  const same = !b || norm(a).startsWith(norm(b).slice(0, 12));
  const sc = within(a, vis) || 0;
  if (same || sc >= 0.85) { r.arthaCut = b; r.artha = a; r.arthaWhy = (r.arthaWhy ? r.arthaWhy + '; ' : '') + `completed across the page break (${same ? 'continues the first reading' : 'agrees with the Vision OCR ' + sc})`; }
  else issues.push({ page: r.pages.join(','), num: r.num, field: 'artha (page-break reading differs)', first: b, second: a, vision: sc });
}
// the vṛtti proper = up to the first ॥ (the अर्थः field sometimes continues with explanation)
for (const r of Object.values(OUT)) { const m = (r.artha || '').match(/^(.*?॥)/); r.arthaCore = m ? m[1].trim() : r.artha; }
// consensus per field
for (const r of Object.values(OUT)) {
  r.check = {};
  if (r.manual) { const own = r.anuv || []; r.anuv = own; }
  for (const k of r.manual ? [] : FIELDS) {
    if (!r[k]) continue;
    const sc = within(r[k], r._vision); stats.fields++;
    r.check[k] = sc;
    if (sc >= 0.95) stats.agree++; else if (sc >= 0.85) stats.close++; else { stats.disagree++; issues.push({ page: r.pages.join(','), num: r.num, field: k, score: sc, gemini: r[k] }); }
  }
  // anuvṛtti ranges: “यहां से 'X' की अनुवृत्ति a।b।c तक/में जाती है”
  r.anuv = [...(r.manual ? (r.anuv || []) : []), ...[...(r.anuvritti || '').matchAll(/['‘’"]([^'‘’"]+)['‘’"][^।॥]*?अनुवृत्ति[^०-९\d]*([०-९\d]+)[।|.]([०-९\d]+)[।|.]([०-९\d]+)/g)].map(m => ({ word: m[1].trim(), to: `${toAsc(m[2])}.${toAsc(m[3])}.${toAsc(m[4])}` }))];
  // “इस (सारे) सूत्र की अनुवृत्ति a।b।c तक जाती है” — the whole sūtra carries over
  for (const m of (r.anuvritti || '').matchAll(/(?:सारे|सम्पूर्ण|समस्त|पूरे)?\s*सूत्र\s*की\s*अनुवृत्ति[^०-९\d]*([०-९\d]+)[।|.]([०-९\d]+)[।|.]([०-९\d]+)/g)) r.anuv.push({ word: '*', to: `${toAsc(m[1])}.${toAsc(m[2])}.${toAsc(m[3])}` });
  r.anuv = r.anuv.filter((x, i, a) => a.findIndex(y => y.word === x.word && y.to === x.to) === i);
  delete r._vision;
}
fs.writeFileSync(path.join(__dirname, '..', 'prathama.json'), JSON.stringify(OUT, null, 1));
fs.writeFileSync(path.join(__dirname, '..', 'prathama-issues.json'), JSON.stringify(issues, null, 1));
fs.writeFileSync(path.join(__dirname, '..', 'prathama-absent.json'), JSON.stringify(ABSENT, null, 1));
console.log('absent:', Object.entries(ABSENT).map(([k, v]) => `${k} (${v})`).join(', '));
console.log(`pages ${stats.pages} · entries ${stats.entries} · fields ${stats.fields}: agree ${stats.agree}, close ${stats.close}, disagree ${stats.disagree} · unparsed pages ${stats.unparsed.length}`);
console.log('anuvṛtti ranges extracted:', Object.values(OUT).reduce((a, r) => a + r.anuv.length, 0));
