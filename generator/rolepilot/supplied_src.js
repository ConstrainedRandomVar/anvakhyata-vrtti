#!/usr/bin/env node
// Where does a SUPPLIED word come from? (Harsha 2026-11-18: "go ahead with the gemini pass", estimate < $1.) For each student-view card
// that says only "the references supply it", Gemini names the source — an earlier sūtra the word runs on from, an adhikāra, a
// paribhāṣā/definition, or a convention of the commentary — with a VERBATIM quote (KV/SK/BM/PV) that shows it. Checked here: the quote is
// a substring of the full text, and a cited sūtra exists (for carried/adhikāra its text must contain the word's stem). Output:
// rolepilot/supplied-src.json — proposals only; nothing is shown until read and accepted (rolepilot/supplied-accepted.json).
// Usage: GEMINI_PROJECT=… GEMINI_TOKEN_CMD=… GEMINI_FLEX=1 node rolepilot/supplied_src.js --budget X
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0), CONC = +arg('--conc', 4), BATCH = +arg('--batch', 8);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
if (!BUDGET) { console.error('give --budget'); process.exit(1); }
const R = require('../tools/recs.js')();
const L = f => { const d = JSON.parse(fs.readFileSync(path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani', f + '.txt'), 'utf8')); return d.data && !Array.isArray(d.data) ? d.data : d; };
const K = L('kashika'), S = L('kaumudi'), BM = L('balamanorama'), DATA = L('data');
const SUT = Object.fromEntries((Array.isArray(DATA) ? DATA : Object.values(DATA)).map(s => [`${String(s.i)[0]}.${String(s.i)[1]}.${+String(s.i).slice(2)}`, s.s]));
const OUTF = path.join(__dirname, 'supplied-src.json'), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const items = []; for (const r of Object.values(R)) for (const c of (r.why && r.why.cards) || []) if (c.why.some(w => w.t === 'sup')) items.push({ key: r.n + '|' + c.word, n: r.n, r, c });
const cut = (t, n) => String(t || '').replace(/\s+/g, ' ').slice(0, n);
const item = it => { const r = it.r; return `### ${it.key}
SŪTRA ${it.n}: ${r.s}
OUR VṚTTI: ${r.genC}
WORD (not in the sūtra, not in the anuvṛtti list): ${it.c.word}   — as the vṛtti says it: "${it.c.ans}"
PV: ${cut(r.pv && (r.pv.arthaFull || r.pv.artha), 700)}
KV: ${cut(K[r.id], 1400)}
SK: ${cut(S[r.id], 700)}
BM: ${cut(BM[r.id], 900)}`; };
const prompt = b => `You are an expert in Pāṇinian grammar. For each item, a word in our class-style vṛtti is not in the sūtra and not in our anuvṛtti list; the commentaries supply it. Say where it comes from.
kind: "carried" (it runs on from an earlier sūtra by anuvṛtti — give that sūtra), "adhikara" (a heading sūtra governs this section — give it), "paribhasha" (a paribhāṣā or definition supplies it, e.g. 1.1.3, 1.1.61, 1.2.28 — give it), "convention" (no sūtra: the commentary's reading, e.g. a suffix with no meaning named is स्वार्थे), or "unclear" (the texts do not show it — say so; do not guess).
Fields: {"key", "kind", "sutra": "a.p.n" or "", "explain": ONE short English sentence for a student, "ref": "KV"|"SK"|"BM"|"PV", "quote": a VERBATIM 5–80 character substring of that text that shows it (copied exactly; checked by a program)}.
Use "carried"/"adhikara" only if that sūtra's text really contains the word (or its stem). Prefer "unclear" over a guess.
Return JSON {"items":[…]}
${G.JSON_PROMPT_RULES || ''}

${b.map(item).join('\n\n')}`;
const norm = t => String(t || '').replace(/[<>\[\]{}`'"‘’“”]/g, '').replace(/\s+/g, ' ').normalize('NFC').trim();
const stem = w => String(w).replace(/-/g, '').replace(/(ः|म्|स्य|ात्|े|ौ|ाः|ानाम्|भ्यः|ेषु|ायाम्|ाम्|स्)$/, '').slice(0, 4);
(async () => {
  const todo = items.filter(it => !OUT[it.key]); const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0, ok = 0, bad = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const res = await G.callAsync(prompt(b), { maxOutputTokens: 24000, thinkingLevel: 'medium', json: true }).catch(e => ({ error: String(e) }));
      spent += res.cost || 0; let j = null; try { j = G.parseJSON(res.text); } catch (e) { }
      if (!j || !Array.isArray(j.items)) { process.stderr.write(`batch ${b[0].key} failed: ${String(res.error || (res.text || '').slice(0, 120))}\n`); continue; }
      for (const y of j.items) { const it = b.find(x => x.key === y.key); if (!it) continue; const r = it.r;
        const T = { KV: norm(K[r.id]), SK: norm(S[r.id]), BM: norm(BM[r.id]), PV: norm(r.pv && ((r.pv.arthaFull || '') + ' ' + (r.pv.artha || ''))) };
        const checks = [];
        if (y.kind !== 'unclear' && !(y.quote && T[y.ref] && T[y.ref].includes(norm(y.quote)))) checks.push('quote not found');
        if (y.sutra && !SUT[y.sutra]) checks.push('no such sūtra');
        if (/^(carried|adhikara)$/.test(y.kind) && y.sutra && SUT[y.sutra] && !norm(SUT[y.sutra]).replace(/\s/g, '').includes(stem(it.c.word))) checks.push('cited sūtra lacks the word');
        OUT[it.key] = { ...y, checks, sutraText: SUT[y.sutra] || '' }; checks.length ? bad++ : ok++; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1)); process.stderr.write(`${Object.keys(OUT).length}/${items.length} · $${spent.toFixed(3)}\n`); } }));
  console.log(JSON.stringify({ items: items.length, done: Object.keys(OUT).length, passedChecks: ok, failedChecks: bad, spent: +spent.toFixed(3) }));
})();
