#!/usr/bin/env node
// Open the compounds our role phrase keeps closed where the references open them (Harsha 2026-11-17: "whenever there is a samāsa in PV,
// we should expand that … use gemini for the rest, where the actual vṛttis have it expanded"). Input /tmp/vg-closed.json
// (n, word, role, render); output rolepilot/opened.json { n: { word: render } } — applied by render.js prep(). Gemini 3.8-flash, Flex, high.
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0.6), CONC = +arg('--conc', 4), BATCH = +arg('--batch', 12);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
const R = require('../tools/recs.js')(), IN = JSON.parse(fs.readFileSync(arg('--in', '/tmp/vg-closed.json'), 'utf8'));
const OUTF = path.join(__dirname, 'opened.json'), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const nz = t => String(t || '').replace(/[-\s‹›'"]/g, '');
const item = (x, i) => { const r = R[x.n]; return `### item ${i + 1} — sūtra ${x.n}  ${r.s}
COMPOUND (as in the sūtra): ${x.word}   ROLE: ${x.role}
OUR PHRASE (compound closed): ${x.render}
PV samāsa: ${(r.pv && r.pv.samasa) || '—'}
PV अर्थः: ${(r.pv && r.pv.artha) || '—'}
KV: ${r.kv || '—'}
SA: ${r.sa || '—'}`; };
const prompt = b => `For each item, a compound word of an Aṣṭādhyāyī sūtra is kept CLOSED in our class-style vṛtti phrase, but the reference vṛttis (PV = prathamāvṛtti with its samāsa line, KV = Kāśikā, SA = a simple vṛtti) OPEN it. Rewrite OUR PHRASE so the compound is opened the way the references open it, keeping our class style and the same role/case:
- a dvandva list → its members listed, e.g. "मृड मृद गुध कुष क्लिश वद वस् इत्येतेभ्यः धातुभ्यः" (members in citation form + इत्येतेभ्यः/इत्येतेषाम्/इत्येतेषु … by case), or the members each in the case;
- a negative or other tatpuruṣa / bahuvrīhi → the references' own wording of it (e.g. "जातिवर्जितानाम्", "धातोः अवयवस्य लोपः यस्मिन् आर्धधातुके");
- do not add anything the references do not say; keep it one phrase.
Return JSON {"results":[{"i": <item number>, "render": "<the rewritten phrase, Devanāgarī>", "members": ["<each member word you used, as it appears in a reference>"]}]}
${G.JSON_PROMPT_RULES || ''}

${b.map(item).join('\n\n')}`;
(async () => {
  const todo = IN.filter(x => !(OUT[x.n] && OUT[x.n][x.word]));
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0, ok = 0, rej = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 16000, thinkingLevel: 'high' }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j || !Array.isArray(j.results)) process.stderr.write(`batch ${b[0].n}… failed: ${String(r.error || (r.text || '').slice(0, 200) || 'empty').slice(0, 300)}\n`);
      for (const y of (j && j.results) || []) { const x = b[(+y.i) - 1]; if (!x || !y.render) continue; const rr = R[x.n];
        const refs = nz((rr.pv && (rr.pv.samasa + ' ' + rr.pv.artha)) || '') + nz(rr.kv) + nz(rr.sa) + nz(rr.s);
        // every member must occur in a reference (or the sūtra); otherwise the rewrite is rejected
        const good = (y.members || []).length && (y.members || []).every(m => refs.includes(nz(m).replace(/[ःम्]$/, '').slice(0, Math.max(2, nz(m).length - 2))));
        if (!good) { rej++; continue; } (OUT[x.n] = OUT[x.n] || {})[x.word] = y.render; ok++; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1)); } }));
  console.log(JSON.stringify({ items: todo.length, opened: ok, rejected: rej, spent: +spent.toFixed(3) }));
})();
