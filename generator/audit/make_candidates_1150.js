#!/usr/bin/env node
// Candidates for 1.1.50 स्थानेऽन्तरतमः (choose the nearest substitute) where the engine gives no credit: substitution rules whose
// substitute is a CLASS of sounds (a pratyāhāra like यण्/जश्/चर्, or गुण/वृद्धि/दीर्घ/ह्रस्व/सवर्ण/कु/चु/टु/श्चु/ष्टु/अनुनासिक …).
// → audit/ENGINEFIX-candidates-1.1.50.json; a blind verifier decides (audit/ENGINEFIX-verdicts-1.1.50.json) before anything is credited.
'use strict';
const fs = require('fs'), path = require('path');
const R = require('../tools/recs.js')(), AD = path.join(process.env.HOME, 'Projects/ashtadhyayi-data');
const PRAT = new Set(JSON.parse(fs.readFileSync(path.join(AD, 'pratyahara/data.txt'), 'utf8')).data.map(p => p.name));
const CLASS = /^(गुण|वृद्धि|दीर्घ|ह्रस्व|सवर्ण|पूर्वसवर्ण|कु|चु|टु|तु|पु|श्चु|ष्टु|अनुनासिक|प्लुत|सम्प्रसारण|अनुस्वार|विसर्जनीय)/;
const stemOf = w => w.replace(/(ः|म्|ौ|ाः|ान्|े|ात्|स्य|ाय)$/, '');
const out = [];
for (const r of Object.values(R)) {
  if ((r.P || []).some(p => p.pid === '1.1.50' && p.status === '✔')) continue;
  if (!/ādeśa|ekādeśa|operation|ṣatva|ṇatva|svara/.test(r.kind || '')) continue;
  const ws = (r.words || []).filter(w => w.wcase === 1 || w.wcase === 0).map(w => w.form).concat((r.carried || []).map(c => c.w || '').filter(w => /ः$|म्$|ौ$/.test(w)));
  const hits = [...new Set(ws.flatMap(w => w.split('-')).filter(w => { const s = stemOf(w); return CLASS.test(s) || PRAT.has(s + '्') || PRAT.has(s); }))];
  if (hits.length) out.push({ n: r.n, sutra: r.s, word: hits.join(', '), ourVrtti: r.genC, kashika: String(r.kv || '').slice(0, 300), prathamavrtti: r.pv ? String(r.pv.artha || '').slice(0, 250) : '' });
}
fs.writeFileSync(path.join(__dirname, 'ENGINEFIX-candidates-1.1.50.json'), JSON.stringify({ '1.1.50': out }, null, 1));
console.log(`1.1.50: ${out.length} candidates`);
