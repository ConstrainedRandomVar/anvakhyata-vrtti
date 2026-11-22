#!/usr/bin/env node
// Rule-level teaching review input (Harsha 2026-11-20: "a review of what must be taught but isn't"): for every audited paribhāṣā,
// the conditions its audit established (quoted) vs. what a student sees — the PB gloss, the general explanation (EXP), and the distinct
// card / step texts that cite it. → audit/TEACHING-input.json
'use strict';
const fs = require('fs'), path = require('path');
const R = require('../tools/recs.js')();
const D = fs.readFileSync(path.join(__dirname, '..', 'vrtti.html'), 'utf8');
const pbJson = (() => { const m = D.match(/"PB":(\{.*?\}),"IDX"/s); try { return JSON.parse(m[1]); } catch (e) { return {}; } })();
const src = fs.readFileSync(path.join(__dirname, '..', 'build.js'), 'utf8');
const expOf = pid => { const m = src.match(new RegExp(`'${pid.replace(/\./g, '\\.')}': '([^']+)'`)); return m ? m[1] : ''; };
const out = {};
for (const f of fs.readdirSync(__dirname).filter(f => /-audit\.json$/.test(f))) {
  const pid = f.replace(/-audit\.json$/, ''), A = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  const cards = {}, steps = {};
  for (const r of Object.values(R)) {
    for (const c of (r.why && r.why.cards) || []) for (const x of c.why || []) if (x.pid === pid && x.txt) { const k = x.txt.replace(/[ऀ-ॿ]+/g, '…').slice(0, 140); cards[k] = cards[k] || { text: x.txt, n: r.n, count: 0 }; cards[k].count++; }
    for (const s of r.steps || []) if ((s.pids || []).includes(pid) && s.what) { const k = s.what.replace(/[ऀ-ॿ]+/g, '…').slice(0, 120); steps[k] = steps[k] || { text: s.what.slice(0, 300), n: r.n, count: 0 }; steps[k].count++; }
  }
  const top = o => Object.values(o).sort((a, b) => b.count - a.count).slice(0, 8);
  out[pid] = { gloss: (pbJson[pid] || {}).gloss || '', ruleText: (pbJson[pid] || {}).text || '', generalExplanation: expOf(pid),
    conditions: (A.conditions || []).map(c => ({ text: c.text, quotes: (c.quotes || []).slice(0, 2) })), cardTexts: top(cards), stepTexts: top(steps) };
}
fs.writeFileSync(path.join(__dirname, 'TEACHING-input.json'), JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, 'rules ·', Object.values(out).reduce((a, x) => a + x.conditions.length, 0), 'conditions ·', Object.values(out).filter(x => !x.gloss).map((x, i) => Object.keys(out)[Object.values(out).indexOf(x)]).join(' ') || 'all have a gloss');
