#!/usr/bin/env node
// Check that every quote in audit/<pid>-audit.json is a verbatim substring of the vendored source it names. Usage: node audit/verify_quotes.js "1.1.44" …
// prathamāvṛtti quotes (our own data, not vendored) are checked against tools/recs.js pv text; anything else that fails is listed.
'use strict';
const fs = require('fs'), path = require('path');
const AD = path.join(process.env.HOME, 'Projects/ashtadhyayi-data'), cache = {};
const load = f => { f = String(f).replace(/^.*ashtadhyayi-data\//, '').replace(/^sutraani\//, '').replace(/\.txt$/, '');
  if (/paribhash/i.test(f)) return cache.pis = cache.pis || JSON.parse(fs.readFileSync(path.join(AD, 'paribhashendushekhar/data.txt'), 'utf8')).data;
  if (!cache[f]) { const d = JSON.parse(fs.readFileSync(path.join(AD, 'sutraani', f + '.txt'), 'utf8')); cache[f] = d.data && !Array.isArray(d.data) ? d.data : d; } return cache[f]; };
let R = null;
for (const pid of process.argv.slice(2)) {
  const A = JSON.parse(fs.readFileSync(path.join(__dirname, `${pid}-audit.json`), 'utf8')), qs = [];
  const walk = o => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o.quote && o.file) qs.push(o); Object.values(o).forEach(walk); } }; walk(A);
  let ok = 0; const bad = [];
  for (const q of qs) {
    let t = '';
    try {
      if (/prathama/i.test(q.file)) { R = R || require('../tools/recs.js')(); const n = /^\d{5}$/.test(q.id) ? `${+q.id[0]}.${+q.id[1]}.${+q.id.slice(2)}` : q.id; const r = R[n] || {}; t = r.pv ? (r.pv.arthaFull || '') + (r.pv.artha || '') : ''; }
      else { const d = load(q.file); t = Array.isArray(d) ? JSON.stringify(d.find(x => x.num == q.id) || '') : d[q.id]; t = typeof t === 'string' ? t : JSON.stringify(t || ''); }
    } catch (e) { bad.push(`${q.file} ${q.id}: cannot load`); continue; }
    if (t.includes(q.quote) || t.includes(JSON.stringify(q.quote).slice(1, -1))) ok++; else bad.push(`${q.file} ${q.id}: ${String(q.quote).slice(0, 70)}`);
  }
  console.log(`${pid}: quotes ${qs.length} · verbatim ${ok} · failed ${bad.length}`); bad.slice(0, 8).forEach(b => console.log('   ' + b));
}
