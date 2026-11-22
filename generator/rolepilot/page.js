#!/usr/bin/env node
// Role-table pilot, step 4: a side-by-side page — sūtra · old vṛtti · new vṛtti (from the role table) · the steps with their paribhāṣās
// and step class · blind-review verdicts · the references. → rolepilot/pilot.html
'use strict';
const fs = require('fs'), path = require('path');
const D = require('./rendered.json');
const B = fs.existsSync(path.join(__dirname, 'blind.json')) ? require('./blind.json') : [], K = fs.existsSync(path.join(__dirname, 'blind-key.json')) ? require('./blind-key.json') : {};
const verdict = {}; for (const x of B) { const [n, lab] = String(x.n).split('#'); const v = K[n] && K[n][lab]; if (v) (verdict[n] = verdict[n] || {})[v] = x; }
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CLASS = { case: 'derived (case)', tadanta: 'derived (tadanta)', tadadi: 'derived (tadādi)', carried: 'carried (anuvṛtti / adhikāra)', vyakhyana: 'settled by the commentary' };
const tally = { old: {}, new: {} }; for (const n in verdict) for (const v of ['old', 'new']) { const x = verdict[n][v]; if (x) tally[v][x.verdict] = (tally[v][x.verdict] || 0) + 1; }
const rows = Object.values(D).map(d => { const v = verdict[d.n] || {};
  const vb = x => !x ? '' : x.verdict === 'ok' ? '<span class="ok">✓ ok</span>' : x.verdict === 'defect' ? `<span class="bad">✗ ${esc(x.type)}</span> <small>${esc(x.problem)}</small>` : '<small>—</small>';
  const steps = d.roles.map(x => `<li><b>${esc(x.word)}</b> <small>(${esc(x.source)})</small> → <i>${esc(x.role)}</i> “${esc(x.render)}”${x.pb.length ? ` <span class="pb">${x.pb.join(', ')}</span>` : ''} <small class="cl">${esc(CLASS[x.why] || x.why)}</small> <small class="${x.verified ? 'qv' : 'qx'}">${esc(x.ref)}: “${esc(x.quote)}” ${x.verified ? '✓' : '✗ not found'}</small></li>`).join('');
  return `<tr id="s-${d.n}"><td><b>${d.n}</b><br>${esc(d.s)}<br><small>${esc(d.oldKind)} → ${esc(d.kind)}</small></td>
<td>${esc(d.old)}<div>${vb(v.old)}</div></td><td><b>${esc(d.neu)}</b><div>${vb(v.new)}</div>${d.note ? `<div class="note">${esc(d.note)}</div>` : ''}${d.uncovered.length ? `<div class="note">no role for: ${esc(d.uncovered.join(', '))}</div>` : ''}</td>
<td><ol>${steps}</ol><details><summary>references</summary><div><b>PV</b> ${esc(d.refs.PV)}</div><div><b>KV</b> ${esc(d.refs.KV)}</div><div><b>SA</b> ${esc(d.refs.SA)}</div><div><b>SK</b> ${esc(d.refs.SK)}</div></details></td></tr>`; }).join('\n');
const fmt = t => Object.entries(t).map(([k, n]) => `${k} ${n}`).join(' · ');
fs.writeFileSync(path.join(__dirname, 'pilot.html'), `<!doctype html><meta charset="utf-8"><title>Role-table pilot</title>
<style>body{font-family:"Noto Serif Devanagari",serif;margin:16px;font-size:15px}table{border-collapse:collapse;width:100%}td{border-top:1px solid #ddd;vertical-align:top;padding:6px}
th{text-align:left;background:#f5f5f5;padding:6px;position:sticky;top:0}.ok{color:#15803d}.bad{color:#b91c1c}.pb{color:#7c3aed;font-weight:600}.cl{color:#0e7490}.qv{color:#666}.qx{color:#b91c1c}.note{color:#a16207;font-size:13px}
ol{margin:0;padding-left:18px}li{margin:2px 0}small{font-size:12px}</style>
<h2>Role-table pilot — ${Object.keys(D).length} sūtras (pāda 3.1 + 50 from other sections)</h2>
<p>Blind Gemini review (same prompt for both versions, not told which is which): <b>old</b> ${fmt(tally.old)} · <b>new</b> ${fmt(tally.new)}</p>
<table><tr><th>sūtra</th><th>old vṛtti (heuristic generator)</th><th>new vṛtti (from the role table)</th><th>steps · paribhāṣā · step class · evidence</th></tr>
${rows}</table>`);
console.log('pilot.html', Object.keys(D).length, 'rows', JSON.stringify(tally));
