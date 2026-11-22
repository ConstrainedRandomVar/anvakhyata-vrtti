// load every full record from data/r-*.js → { n: record }
const fs = require('fs'), path = require('path');
module.exports = (dir = path.join(__dirname, '..', 'data')) => { if (dir === path.join(__dirname, '..', 'data')) require('./build-stamp.js').check('recs.js'); const recs = {}; for (const f of fs.readdirSync(dir).filter(f => f.startsWith('r-'))) { const w = {}; new Function('window', fs.readFileSync(path.join(dir, f), 'utf8'))(w); for (const v of Object.values(w.VR)) for (const r of v) recs[r.n] = r; } return recs; };
