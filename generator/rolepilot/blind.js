#!/usr/bin/env node
// Role-table pilot, step 3: BLIND review of old vs new vṛtti for every pilot sūtra, with the same prompt as the 11-16 Gemini pilot
// (taken from tools/gem_review.js). Each version is a separate anonymous item "<n>#a" / "<n>#b" (assignment random); key in blind-key.json.
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 2), CONC = +arg('--conc', 5), BATCH = +arg('--batch', 10);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
// reuse the exact review prompt of the pilot
const src = fs.readFileSync(path.join(__dirname, '../tools/gem_review.js'), 'utf8');
const body = src.slice(src.indexOf('const prompt = batch =>'), src.indexOf('(async () => {')).replace('const prompt = batch =>', 'return batch =>');
const prompt = new Function('G', body)(G);

const D = require('./rendered.json'); let seed = 99; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const key = {}, items = [];
for (const d of Object.values(D)) { const flip = rnd() < 0.5; key[d.n] = flip ? { a: 'new', b: 'old' } : { a: 'old', b: 'new' };
  for (const lab of ['a', 'b']) items.push({ n: d.n + '#' + lab, s: d.s, gen: key[d.n][lab] === 'new' ? d.neu : d.old, pv: d.refs.PV, kv: d.refs.KV, sa: d.refs.SA }); }
for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
fs.writeFileSync(path.join(__dirname, 'blind-key.json'), JSON.stringify(key, null, 1));

(async () => {
  const batches = []; for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  let spent = 0, k = 0; const out = [];
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 32768, thinkingLevel: 'high' }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      const res = j && Array.isArray(j.results) ? j.results : null;
      b.forEach(x => { const y = (res && res.find(z => String(z.n) === x.n)) || { verdict: 'error' }; out.push({ ...y, n: x.n }); });
      process.stderr.write(`${out.length}/${items.length} · $${spent.toFixed(3)}\n`); } }));
  fs.writeFileSync(path.join(__dirname, 'blind.json'), JSON.stringify(out, null, 1));
  const tally = { old: {}, new: {} }; for (const x of out) { const [n, lab] = String(x.n).split('#'); const v = key[n] && key[n][lab]; if (v) tally[v][x.verdict] = (tally[v][x.verdict] || 0) + 1; }
  console.log(JSON.stringify({ spent: +spent.toFixed(3), tally }));
})();
