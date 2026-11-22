#!/usr/bin/env node
// Input for a paribhāṣā applicability audit: every ✔ credit of <pid> grouped by (case of the triggering word | rule kind | start of the
// engine trigger), each member "<sūtra> <word>  ⟨engine effect⟩", 3 samples per group. → audit/<pid>-firings.json
// Usage: node audit/make_firings.js "1.1.49" "PIS 23" …   (run after a build; audit before the verdicts for that pid exist)
'use strict';
const fs = require('fs'), path = require('path');
const R = require('../tools/recs.js')();
for (const PID of process.argv.slice(2)) {
  const tpl = (t, w) => String(t || '').split(w).join('X').replace(/[ऀ-ॿ]+/g, '…').replace(/\s+/g, ' ').replace(/\(carried[^)]*\)/, '(carried)').slice(0, 40);
  const g = {}; let no = 0;
  for (const r of Object.values(R)) for (const p of (r.P || [])) if (p.pid === PID) {
    if (p.status !== '✔') { no++; continue; }
    const w = String(p.trigger || '').split(':')[0].replace(/\s*\(.*$/, '').trim(), ww = (r.words || []).find(x => x.form === w);
    const cs = ww ? 'own word, data case ' + ww.wcase : (p.layer === 1 ? 'named by a commentator' : 'carried / not a sūtra word');
    const key = [cs, String(r.kind).replace('*', ''), tpl(p.trigger, w)].join(' | ');
    (g[key] = g[key] || { group: key, items: [] }).items.push({ n: r.n, word: w, trigger: String(p.trigger).slice(0, 160), effect: String(p.effect).slice(0, 160) });
  }
  const groups = Object.values(g).sort((a, b) => b.items.length - a.items.length).map((x, i) => ({ id: 'G' + (i + 1), group: x.group, count: x.items.length,
    sutras: x.items.map(it => `${it.n} ${it.word}  ⟨${it.effect.slice(0, 70)}⟩`),
    samples: x.items.filter((_, j) => j % Math.max(1, Math.floor(x.items.length / 3)) === 0).slice(0, 3).map(it => { const r = R[it.n];
      return { ...it, sutra: r.s, ourVrtti: r.genC, kashika: String(r.kv || '').slice(0, 250), prathamavrtti: r.pv ? String(r.pv.artha || '').slice(0, 250) : '' }; }) }));
  fs.writeFileSync(path.join(__dirname, `${PID}-firings.json`), JSON.stringify({ pid: PID, howGrouped: 'case of the triggering word (own sūtra words only) | rule kind | start of the engine trigger text; member = "<sūtra> <word>  ⟨engine effect⟩"', applies: groups.reduce((a, x) => a + x.count, 0), consideredNotApplicable: no, groups }, null, 1));
  console.log(`${PID}: ${groups.reduce((a, x) => a + x.count, 0)} ✔ in ${groups.length} groups · ${no} ✖`);
}
