#!/usr/bin/env node
// merge a batch of hand-fixed final vṛttis (tools/handfix/bN.json) into handwritten.json as "keep" entries. Usage: node tools/handfix/merge.js tools/handfix/b1.json
'use strict';
const fs = require('fs'), path = require('path'), F = path.join(__dirname, '../../handwritten.json');
const H = JSON.parse(fs.readFileSync(F, 'utf8')), B = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [n, e] of Object.entries(B)) { if (H[n] && !H[n].keep) { console.error('full hand entry exists, skipped', n); continue; } H[n] = { keep: true, ...e }; }
fs.writeFileSync(F, JSON.stringify(H, null, 1) + '\n'); console.log('merged', Object.keys(B).length);
