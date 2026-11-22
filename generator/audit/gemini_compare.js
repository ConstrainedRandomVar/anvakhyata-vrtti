#!/usr/bin/env node
// Compare the Gemini pilot (audit/<pid>-gemini.json) with the verified Opus audit (audit/<pid>-audit.json), credit by credit.
// Opus verdict per credit: not licensed (its list, matched by group + sūtra) / unsure / otherwise licensed. Prints the agreement table,
// the disagreements by Opus reason, and samples; writes audit/<pid>-compare.json.
'use strict';
const fs = require('fs'), path = require('path');
const PID = process.argv[2] || '1.1.67', D = __dirname, J = f => JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
const TAG = process.argv[3] ? '-' + process.argv[3] : '';   // node audit/gemini_compare.js 1.1.67 hydrogen
const A = J(`${PID}-audit.json`), Gm = J(`${PID}-gemini${TAG}.json`);
const op = {};
for (const g of A.groups) {
  for (const x of g.not_licensed || []) op[`${g.id}|${x.n}`] = { v: 'not licensed', why: x.why };
  for (const u of g.unsure || []) { const n = typeof u === 'string' ? u : u.n; op[`${g.id}|${n}`] = op[`${g.id}|${n}`] || { v: 'unsure', why: u.why || '' }; }
}
const T = {}, dis = [];
for (const [key, x] of Object.entries(Gm.items)) {
  const [g, n] = key.split('|'), o = op[`${g}|${n}`] || { v: 'licensed', why: '' };
  const k = `Opus ${o.v} · Gemini ${x.verdict}`; T[k] = (T[k] || 0) + 1;
  if (o.v !== x.verdict) dis.push({ key, opus: o.v, opusWhy: String(o.why).slice(0, 120), gemini: x.verdict, geminiWhy: x.reason, quoteOk: x.quoteOk, source: x.source });
}
const all = Object.keys(Gm.items).length, agree = all - dis.length;
console.log(`${PID}: ${all} credits judged by Gemini · agree with Opus ${agree} (${(100 * agree / all).toFixed(1)}%) · quotes verbatim ${Object.values(Gm.items).filter(x => x.quoteOk).length}/${all} · Gemini cost $${(Gm.spent || 0).toFixed(3)}`);
for (const [k, v] of Object.entries(T).sort((a, b) => b[1] - a[1])) console.log(`  ${v}\t${k}`);
const byWhy = {}; for (const d of dis) { const k = `${d.opus}→${d.gemini} :: ${d.opusWhy.replace(/[ऀ-ॿ]+/g, '…').slice(0, 70)}`; byWhy[k] = (byWhy[k] || 0) + 1; }
console.log('disagreements by Opus reason:'); for (const [k, v] of Object.entries(byWhy).sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ${v}\t${k}`);
fs.writeFileSync(path.join(D, `${PID}-compare${TAG}.json`), JSON.stringify({ table: T, agree, all, disagreements: dis }, null, 1));
