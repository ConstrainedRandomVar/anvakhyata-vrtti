#!/usr/bin/env node
// ashtadhyayi-errata.json → ASHTADHYAYI-COM-ERRATA.md (the readable list for the ashtadhyayi.com maintainers)
'use strict';
const fs = require('fs'), path = require('path');
const D = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'ashtadhyayi-errata.json'), 'utf8')); delete D._about;
const S = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani/data.txt'), 'utf8')).data;
const BY = Object.fromEntries(S.map(s => [s.i, s]));
const num = i => `${+i.slice(0, 1)}.${+i.slice(1, 2)}.${+i.slice(2)}`;
const nm = x => { const [w, n] = x.split('$'); return `${w} (${num(n)})`; };
const FIELD = { an: 'अनुवृत्तिः (field `an`)', pc: 'पदच्छेदः (field `pc`)' };
let out = `# Suggested corrections to the ashtadhyayi.com sūtra data\n\nFile: \`sutraani/data.txt\` (github.com/ashtadhyayi-com/data). Found while generating vṛttis for every sūtra and checking them against the prathamāvṛtti and the Kāśikā. Each item quotes the evidence.\n\n`;
const ids = Object.keys(D).sort();
const sidOf = i => i.replace(/-pc$/, '');
for (const f of ['an', 'pc']) {
  const xs = ids.filter(i => D[i].field === f); if (!xs.length) continue;
  out += `## ${FIELD[f]}\n\n`;
  for (const i of xs) { const e = D[i], s = BY[sidOf(i)];
    out += `### ${num(sidOf(i))} ${s ? s.s : ''}\n\n`;
    if (f === 'an') { out += `- Now: ${(s.an || '').split('##').filter(Boolean).map(nm).join(', ')}\n`; if (e.drop) out += `- Remove: ${e.drop.map(nm).join(', ')}\n`; if (e.add) out += `- Add: ${e.add.map(nm).join(', ')}\n`; }
    else for (const x of (e.pc || [e])) out += `- Now: \`${x.from}\` → suggested: \`${x.to}\` — ${x.why}\n`;
    if (e.why && f === 'an') out += `- Why: ${e.why}\n`;
    for (const [k, v] of Object.entries(e.evidence || {})) out += `- ${k}: “${v}”\n`;
    out += '\n'; }
}
fs.writeFileSync(path.join(__dirname, '..', 'ASHTADHYAYI-COM-ERRATA.md'), out);
console.log(`${ids.length} items → ASHTADHYAYI-COM-ERRATA.md`);
