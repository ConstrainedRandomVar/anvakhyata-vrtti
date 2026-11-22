#!/usr/bin/env node
// Candidates for engine "missed credit" fixes (after the paribhāṣā audit): 1.1.71 (a pratyāhāra the sūtra itself names),
// 1.1.60 (लोप as the sūtra's own or carried word), 2.1.1 (a samāsa-teaching sūtra in 2.1.3–2.2.38). → audit/ENGINEFIX-candidates.json
// Each candidate is only a candidate: a blind verifier decides (audit/ENGINEFIX-verdicts.json) before anything is credited.
'use strict';
const fs = require('fs'), path = require('path');
const R = require('../tools/recs.js')(), AD = path.join(process.env.HOME, 'Projects/ashtadhyayi-data');
const PRAT = JSON.parse(fs.readFileSync(path.join(AD, 'pratyahara/data.txt'), 'utf8')).data.map(p => p.name);
const has = (r, pid) => (r.P || []).some(p => p.pid === pid && p.status === '✔');
const id = n => { const [a, p, s] = n.split('.'); return +(a + p + s.padStart(3, '0')); };
const ENDS = ['', 'ः', 'म्', 'ा', 'े', 'ात्', 'स्य', 'ि', 'ौ', 'ोः', 'ाम्', 'ाभ्याम्', 'ेभ्यः', 'ाः', 'ान्', 'ैः', 'ेषु', 'ाणाम्', 'ानाम्'];
const out = { '1.1.71': [], '1.1.60': [], '2.1.1': [] };
for (const r of Object.values(R)) {
  const words = (r.words || []).map(w => w.form || '').filter(Boolean);
  const item = extra => ({ n: r.n, sutra: r.s, ourVrtti: r.genC, kashika: String(r.kv || '').slice(0, 300), prathamavrtti: r.pv ? String(r.pv.artha || '').slice(0, 250) : '', ...extra });
  if (!has(r, '1.1.71')) {   // a word of the sūtra that is a declined pratyāhāra (stem = pratyāhāra name minus its final halant + an ending)
    const hits = [];
    for (const w of words) for (const seg of w.split('-')) for (const p of PRAT) { const stem = p.replace(/्$/, ''); if (ENDS.some(e => seg === stem + e || seg === p + e) && seg.length >= 2) hits.push(`${seg} (= ${p})`); }
    if (hits.length) out['1.1.71'].push(item({ word: [...new Set(hits)].join(', ') }));
  }
  if (!has(r, '1.1.60')) {
    const own = words.find(w => /^लोप/.test(w)), car = (r.carried || []).find(c => /^लोप/.test(c.w || ''));
    if ((own || car) && /लोप/.test(r.genC || '')) out['1.1.60'].push(item({ word: own || `${car.w} (carried from ${car.from})` }));
  }
  if (!has(r, '2.1.1') && id(r.n) >= 21003 && id(r.n) <= 22038 && /समास/.test((r.genC || '') + ' ' + (r.kind || ''))) out['2.1.1'].push(item({ word: '(samāsa rule)' }));
}
fs.writeFileSync(path.join(__dirname, 'ENGINEFIX-candidates.json'), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(`${k}: ${v.length} candidates`);
