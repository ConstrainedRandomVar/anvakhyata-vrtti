#!/usr/bin/env node
// Full blind review after the role-table rebuild (Harsha 2026-11-16: "use gemini for the optimized run falling back to the older
// approach only for failures"; Gemini 3.8-flash, Flex, high thinking, cap $10, NEW account).
//   step a: every sūtra generated from roles → review its NEW vṛtti
//   step b: only where (a) says defect → review the OLD heuristic vṛtti (r.genHeur)
//   decision: new defect + old ok → fallback (build.js uses the old gloss for it; listed for fixing);
//             both defect → fix list (with the reviewer's "should" line)
// → rolepilot/review-all.json, rolepilot/fallback.json
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 10), CONC = +arg('--conc', 6), BATCH = +arg('--batch', 10);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
const src = fs.readFileSync(path.join(__dirname, '../tools/gem_review.js'), 'utf8');
const prompt = new Function('G', src.slice(src.indexOf('const prompt = batch =>'), src.indexOf('(async () => {')).replace('const prompt = batch =>', 'return batch =>'))(G);
const R = require('../tools/recs.js')(), OUTF = path.join(__dirname, 'review-all.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : { new: {}, old: {} };
let spent = 0;
async function run(items, tag) {
  const batches = []; for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  let k = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 32768, thinkingLevel: 'high' }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      const res = j && Array.isArray(j.results) ? j.results : null;
      if (res) b.forEach(x => { const y = res.find(z => String(z.n) === x.n); if (y) OUT[tag][x.n] = y; });
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
      process.stderr.write(`${tag} ${Object.keys(OUT[tag]).length} · $${spent.toFixed(3)}\n`); } }));
}
const it = (r, gen) => ({ n: r.n, s: r.s, gen, pv: (r.pv && r.pv.artha) || '', kv: r.kv || '', sa: r.sa || '' });
(async () => {
  const roleRecs = Object.values(R).filter(r => r.genSource === 'roles' && r.genC);
  await run(roleRecs.filter(r => !OUT.new[r.n]).map(r => it(r, r.genC)), 'new');
  const failed = roleRecs.filter(r => OUT.new[r.n] && OUT.new[r.n].verdict === 'defect' && r.genHeur);
  await run(failed.filter(r => !OUT.old[r.n]).map(r => it(r, r.genHeur)), 'old');
  // decide over EVERY sūtra ever reviewed, not only those generated from roles in this build: a sūtra already on the fallback list
  // is built from the old gloss (genSource ≠ 'roles'), and must not drop off the list on the next run (bug found 2026-11-17)
  const fallback = {}, fix = {};
  for (const n of Object.keys(OUT.new)) { const y = OUT.new[n], o = OUT.old[n]; if (y.verdict !== 'defect' || !o || !R[n]) continue;
    if (o.verdict === 'ok') fallback[n] = { why: y.problem, should: y.should };
    else fix[n] = { newProblem: y.problem, oldProblem: o.problem, should: y.should }; }
  fs.writeFileSync(path.join(__dirname, 'fallback.json'), JSON.stringify({ fallback, fix }, null, 1));
  const nv = Object.values(OUT.new), def = nv.filter(x => x.verdict === 'defect').length;
  console.log(JSON.stringify({ spent: +spent.toFixed(3), reviewedNew: nv.length, newDefects: def, newDefectPct: +(100 * def / Math.max(1, nv.length)).toFixed(1), fallbackToOld: Object.keys(fallback).length, bothDefect: Object.keys(fix).length }));
})();
