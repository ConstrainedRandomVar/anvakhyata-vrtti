#!/usr/bin/env node
// Paribhāṣā delta between the old (heuristic) build in data-old/ and the new (role-table) build in data/: for every sūtra, which of OUR
// paribhāṣā steps (layer ≠ 1; ✔ applied, ✖ considered-not-applicable) the new build lost or gained. → pbdelta.html + a summary
'use strict';
const fs = require('fs'), path = require('path'), load = require('./recs.js');
const N = load(path.join(__dirname, '..', 'data')), O = load(path.join(__dirname, '..', 'data-old'));
const set = (r, st) => new Set((r && r.P || []).filter(p => p.layer !== 1 && (st === '✔' ? p.status !== '✖' : p.status === '✖')).map(p => p.pid));
const rows = [], c = { same: 0, gained: 0, lost: 0, both: 0 }, lostBy = {}, gainBy = {};
for (const n of Object.keys(N)) { const a = set(O[n], '✔'), b = set(N[n], '✔'), lost = [...a].filter(x => !b.has(x)), gain = [...b].filter(x => !a.has(x));
  const xa = set(O[n], '✖'), xb = set(N[n], '✖'), xlost = [...xa].filter(x => !xb.has(x)), xgain = [...xb].filter(x => !xa.has(x));
  const k = lost.length && gain.length ? 'both' : lost.length ? 'lost' : gain.length ? 'gained' : 'same'; c[k]++;
  lost.forEach(p => lostBy[p] = (lostBy[p] || 0) + 1); gain.forEach(p => gainBy[p] = (gainBy[p] || 0) + 1);
  if (k !== 'same' || xlost.length || xgain.length) rows.push({ n, s: N[n].s, src: N[n].genSource || 'heuristic', lost, gain, xlost, xgain, oldG: O[n] && O[n].genC, newG: N[n].genC,
    lostWhy: lost.map(p => { const q = (O[n].P || []).find(x => x.pid === p && x.layer !== 1); return q ? `${p}: ${q.trigger} → ${q.effect}` : p; }) }); }
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
const sortKey = n => n.split('.').map(x => String(x).padStart(3, '0')).join('.');
rows.sort((a, b) => (b.lost.length - a.lost.length) || sortKey(a.n).localeCompare(sortKey(b.n)));
fs.writeFileSync(path.join(__dirname, '..', 'pbdelta.html'), `<!doctype html><meta charset="utf-8"><title>Paribhāṣā delta: old vs new</title>
<style>body{font-family:"Noto Serif Devanagari",serif;margin:16px;font-size:14px}table{border-collapse:collapse;width:100%}td,th{border-top:1px solid #ddd;padding:5px;vertical-align:top;text-align:left}th{background:#f4f4f4;position:sticky;top:0}
.l{color:#b91c1c;font-weight:600}.g{color:#15803d;font-weight:600}.x{color:#888}small{color:#666}input{font-size:14px;padding:3px}</style>
<h2>Paribhāṣā steps: old (heuristic) vs new (role table)</h2>
<p>${Object.keys(N).length} sūtras · same set ${c.same} · <span class="g">only gained</span> ${c.gained} · <span class="l">only lost</span> ${c.lost} · both ${c.both}</p>
<p><b class="l">Lost most often:</b> ${top(lostBy)}<br><b class="g">Gained most often:</b> ${top(gainBy)}</p>
<p><input id="q" placeholder="filter: a sūtra or a paribhāṣā (e.g. 1.1.72)" oninput="for(const tr of document.querySelectorAll('tbody tr'))tr.style.display=tr.textContent.includes(this.value)?'':'none'"></p>
<table><thead><tr><th>sūtra</th><th>lost (old had, new lacks)</th><th>gained</th><th>✖ considered (− lost / + new)</th><th>old vṛtti / new vṛtti</th></tr></thead><tbody>
${rows.map(r => `<tr><td><a href="vrtti.html#${r.n}" target="_blank">${r.n}</a> · <a href="vrtti-old.html#${r.n}" target="_blank">old</a><br>${esc(r.s)}<br><small>${r.src}</small></td>
<td class="l">${r.lostWhy.map(esc).join('<br>')}</td><td class="g">${r.gain.join(', ')}</td><td class="x">${r.xlost.length ? '− ' + r.xlost.join(', ') : ''} ${r.xgain.length ? '+ ' + r.xgain.join(', ') : ''}</td>
<td><small>old:</small> ${esc(r.oldG)}<br><small>new:</small> ${esc(r.newG)}</td></tr>`).join('\n')}</tbody></table>`);
console.log(JSON.stringify(c), '\nlost:', top(lostBy), '\ngained:', top(gainBy));
