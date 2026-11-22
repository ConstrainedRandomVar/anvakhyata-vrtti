// Re-bless named baseline entries after a verified improvement: node tools/bless.js <sūtra> "<reason>" [<sūtra> "<reason>" …]
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, 'baseline100.json'), B = JSON.parse(fs.readFileSync(F, 'utf8')), R = require('./recs.js')();
const a = process.argv.slice(2); B._blessed = B._blessed || [];
for (let i = 0; i < a.length; i += 2) { const n = a[i], r = R[n]; if (!B[n]) { console.log('not in baseline', n); continue; }
  B._blessed.push({ n, date: new Date().toISOString().slice(0, 10), was: B[n].genC, now: r.genC, why: a[i + 1] });
  B[n] = { gen: r.gen, genK: r.genK, genC: r.genC }; console.log('blessed', n); }
fs.writeFileSync(F, JSON.stringify(B, null, 1));
