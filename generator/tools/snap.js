// node tools/snap.js save|diff [file] — snapshot every sūtra's class-style vṛtti + fired paribhāṣās, or list what moved since the snapshot
const fs = require('fs'), path = require('path');
const [cmd = 'diff', f = path.join(__dirname, 'snap.json')] = process.argv.slice(2);
const R = require('./recs.js')();
const cur = {}; for (const r of Object.values(R)) cur[r.n] = { c: r.genC || '', k: r.genK || '', gap: (r.pbGap || []).map(x => x.pid).sort().join(',') };
if (cmd === 'save') { fs.writeFileSync(f, JSON.stringify(cur)); console.log('saved', Object.keys(cur).length); process.exit(0); }
const old = JSON.parse(fs.readFileSync(f, 'utf8')); let n = 0, closed = 0, opened = 0;
for (const [k, v] of Object.entries(cur)) { const o = old[k]; if (!o || o.c !== v.c || o.gap !== v.gap) { n++; const og = new Set((o && o.gap || '').split(',').filter(Boolean)), ng = new Set(v.gap.split(',').filter(Boolean)); closed += [...og].filter(x => !ng.has(x)).length; opened += [...ng].filter(x => !og.has(x)).length; console.log(k, '|', o && o.c, '\n     →', v.c, og.size !== ng.size || [...og].some(x => !ng.has(x)) ? `  [gaps ${o && o.gap || '-'} → ${v.gap || '-'}]` : ''); } }
console.log(`${n} changed · gaps closed ${closed} · opened ${opened}`);
