#!/usr/bin/env node
// Blind re-review of the fix-list repairs (same prompt as review_all.js / tools/gem_review.js). Input: /tmp/vg-repair-cand.json
// { n: candidate class-style vṛtti } — built with `VG_REPAIR_ALL=1 node build.js`. A repair is ACCEPTED only if the reviewer now says
// "ok"; everything else stays as it was. Output: rolepilot/repair-review.json (all verdicts) + rolepilot/repair-accepted.json.
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0), CONC = +arg('--conc', 4), BATCH = +arg('--batch', 10);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
if (!BUDGET) { console.error('give --budget'); process.exit(1); }
const src = fs.readFileSync(path.join(__dirname, '../tools/gem_review.js'), 'utf8');
const prompt = new Function('G', src.slice(src.indexOf('const prompt = batch =>'), src.indexOf('(async () => {')).replace('const prompt = batch =>', 'return batch =>'))(G);
const R = require('../tools/recs.js')(), CAND = JSON.parse(fs.readFileSync('/tmp/vg-repair-cand.json', 'utf8'));
const OUTF = path.join(__dirname, 'repair-review.json'), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const it = n => { const r = R[n]; return { n, s: r.s, gen: CAND[n], pv: (r.pv && r.pv.artha) || '', kv: r.kv || '', sa: r.sa || '' }; };
(async () => {
  const todo = Object.keys(CAND).filter(n => !(OUT[n] && OUT[n].gen === CAND[n]));
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b.map(it)), { maxOutputTokens: 32768, thinkingLevel: 'high', json: true }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      const res = j && Array.isArray(j.results) ? j.results : null;
      if (res) b.forEach(n => { const y = res.find(z => String(z.n) === n); if (y) OUT[n] = { ...y, gen: CAND[n] }; });
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1)); } }));
  // also gated (2026-11-17 spot check: the reviewer passed merge leftovers): no word / word-pair repeated that the references do not
  // repeat (विकल्पेन विकल्पेन, “प्रति … प्रति”), and the hand-rejected ones
  const HANDREJ = { '1.4.37': 'word order broken (यं कोपः … प्रति)', '2.2.20': 'garbled (सोऽमन्तेनैव अव्ययेन … अव्ययेन सह)', '7.3.11': 'स्थाने twice (अचः स्थाने अङ्गस्य स्थाने)' };
  const STOP = new Set(['च', 'परे', 'भवति', 'भवतः', 'भवन्ति', 'प्रत्ययः', 'परः', 'आदेशः', 'स्थाने', 'इति', 'विषये', 'अर्थे', 'न', 'वा', 'तु', 'अपि', 'एव', 'सति', 'परतः', 'इत्यर्थे', 'इत्येतस्मिन्', 'अर्थेषु', 'उपपदे']);   // list markers repeat legitimately (5.1.52 सम्भवति इत्यर्थे अवहरति इत्यर्थे …)
  const toks = t => String(t).replace(/[,।]/g, ' ').split(/\s+/).filter(Boolean);
  const dup = (g, ref) => { const T = toks(g), K = toks(ref).join(' '); for (let i = 1; i < T.length; i++) if (T[i] === T[i - 1]) return 'repeated word ' + T[i];
    const bg = {}; for (let i = 1; i < T.length; i++) { if (STOP.has(T[i - 1]) && STOP.has(T[i])) continue; const b2 = T[i - 1] + ' ' + T[i]; bg[b2] = (bg[b2] || 0) + 1; if (bg[b2] > 1) return 'repeated pair ' + b2; }
    const c = {}; for (const w of T) { if (STOP.has(w) || w.length < 3) continue; c[w] = (c[w] || 0) + 1; if (c[w] > 1 && (K.split(w).length - 1) < 2) return 'word twice: ' + w; } return ''; };
  const acc = {}, gated = {};
  for (const n of Object.keys(CAND)) { if (!(OUT[n] && OUT[n].gen === CAND[n] && OUT[n].verdict === 'ok')) continue;
    const why = HANDREJ[n] || dup(CAND[n], (R[n].kv || '') + ' ' + ((R[n].pv && R[n].pv.artha) || '')); if (why) { gated[n] = why; continue; } acc[n] = { gen: CAND[n] }; }
  fs.writeFileSync(path.join(__dirname, 'repair-gated.json'), JSON.stringify(gated, null, 1));
  fs.writeFileSync(path.join(__dirname, 'repair-accepted.json'), JSON.stringify(acc, null, 1));
  const v = Object.keys(CAND).map(n => OUT[n]).filter(Boolean);
  console.log(JSON.stringify({ candidates: Object.keys(CAND).length, reviewed: v.length, accepted: Object.keys(acc).length, gatedOut: Object.keys(gated).length, stillDefect: v.filter(x => x.verdict === 'defect').length, spent: +spent.toFixed(3) }));
})();
