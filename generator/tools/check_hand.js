#!/usr/bin/env node
// Every quote in rolepilot/hand-roles.json must be an exact substring of the FULL reference text it names (KV = full Kāśikā, SK = full
// Siddhānta-kaumudī, PV = the prathamāvṛtti's artha). Fails (exit 1) on any quote not found. Run: node tools/check_hand.js
'use strict';
const fs = require('fs'), path = require('path');
const R = require('./recs.js')(), H = require('../rolepilot/hand-roles.json');
const L = f => { const d = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani', f), 'utf8')); return d.data && !Array.isArray(d.data) ? d.data : d; };
const K = L('kashika.txt'), S = L('kaumudi.txt');
const norm = t => String(t || '').replace(/\s+/g, ' ').normalize('NFC').trim();
let bad = 0, n = 0;
for (const [sn, e] of Object.entries(H)) { if (sn[0] === '_') continue; const r = R[sn]; if (!r) { console.log('no such sūtra', sn); bad++; continue; }
  const T = { KV: norm(K[r.id]), SK: norm(S[r.id]), PV: norm(r.pv && ((r.pv.arthaFull || '') + ' ' + (r.pv.artha || ''))) };
  for (const x of e.roles || []) { n++; if (!x.quote || !T[x.ref] || !T[x.ref].includes(norm(x.quote))) { bad++; console.log(`✗ ${sn} ${x.ref}: “${x.quote}” not found`); } }
  for (const q of e.noteQuotes || []) { n++; if (!T[q.ref] || !T[q.ref].includes(norm(q.quote))) { bad++; console.log(`✗ ${sn} note ${q.ref}: “${q.quote}” not found`); } } }
// hand-written vṛttis (handwritten.json) carry the reference wording they rest on: quotes [{ref, quote}] — same check
const HW = JSON.parse(fs.readFileSync(path.join(__dirname, '../handwritten.json'), 'utf8'));
for (const [sn, e] of Object.entries(HW)) { if (sn[0] === '_' || !e.quotes) continue; const r = R[sn];
  const T = { KV: norm(K[r.id]), SK: norm(S[r.id]), PV: norm(r.pv && ((r.pv.arthaFull || '') + ' ' + (r.pv.artha || ''))) };
  for (const q of e.quotes) { n++; if (!T[q.ref] || !T[q.ref].includes(norm(q.quote))) { bad++; console.log(`✗ handwritten ${sn} ${q.ref}: “${q.quote}” not found`); } } }
console.log(`hand quotes: ${n - bad}/${n} found`); process.exit(bad ? 1 : 0);
