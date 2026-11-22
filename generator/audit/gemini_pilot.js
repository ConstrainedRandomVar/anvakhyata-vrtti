#!/usr/bin/env node
// Gemini 3.8 Flash pilot of the paribhāṣā applicability audit (Harsha 2026-11-20: "run a pilot batch on gemini 3.8 flash … apples-to-apples").
// Same credits as the blind Opus audit (audit/<pid>-firings.json); Gemini cannot explore, so it gets a FIXED pack: the commentaries on
// 1.1.66 + 1.1.67 (what the Opus auditor was pointed to first) + each sūtra's Kāśikā / prathamāvṛtti / SK. One verdict per credit, with a
// verbatim quote checked by program. Out: audit/<pid>-gemini.json. Compare: node audit/gemini_compare.js <pid>
// Run: GEMINI_FLEX=1 GEMINI_PROJECT=… GEMINI_TOKEN_CMD=… node audit/gemini_pilot.js 1.1.67 --budget 4
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PID = process.argv[2], BUDGET = +arg('--budget', 4), CONC = +arg('--conc', 4), BATCH = +arg('--batch', 40);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
const AD = path.join(process.env.HOME, 'Projects/ashtadhyayi-data/sutraani');
const C = f => { const d = JSON.parse(fs.readFileSync(path.join(AD, f + '.txt'), 'utf8')); return d.data && !Array.isArray(d.data) ? d.data : d; };
const SRC = {}; for (const f of ['kashika', 'nyaas', 'padamanjari', 'bhashya', 'kaumudi', 'balamanorama', 'tattvabodhini']) SRC[f] = C(f);
const txt = v => typeof v === 'string' ? v : JSON.stringify(v || '');
// approach A (Harsha 2026-11-20): --core <ids> = the commentaries that define the rule; --own = each item's OWN full commentaries (capped)
const CORE = arg('--core', '11066,11067').split(','), OWN = process.argv.includes('--own'), OWNCAP = +arg('--own-cap', 15000);
const RULE = { '1.1.66': 'तस्मिन्निति निर्दिष्टे पूर्वस्य', '1.1.67': 'तस्मादित्युत्तरस्य', '1.1.52': 'अलोऽन्त्यस्य', '1.1.72': 'येन विधिस्तदन्तस्य' };
const sid = n => { const [a, p, x] = n.split('.'); return a + p + x.padStart(3, '0'); };
const ownText = n => Object.entries(SRC).filter(([f]) => f !== 'kashika' && f !== 'kaumudi').map(([f, D]) => D[sid(n)] ? `[${f} on ${n}] ${txt(D[sid(n)]).slice(0, OWNCAP)}` : '').filter(Boolean).join('\n');
const PACK = CORE.flatMap(id => Object.entries(SRC).map(([f, D]) => D[id] ? `[${f} ${id}]\n${txt(D[id])}` : '')).filter(Boolean).join('\n\n');
const R = require('../tools/recs.js')(), F = JSON.parse(fs.readFileSync(path.join(__dirname, `${PID}-firings.json`), 'utf8'));
const TAG = arg('--tag', '') ? '-' + arg('--tag', '') : '';   // e.g. --tag hydrogen (GEMINI_MODEL=gemini-4-hydrogen) → audit/<pid>-gemini-hydrogen.json
const OUTF = path.join(__dirname, `${PID}-gemini${TAG}.json`), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : { pid: PID, items: {}, spent: 0 };
const PER = +arg('--per-group', 0);   // stratified sample: up to N evenly spaced members per group (0 = all)
const pick = a => !PER || a.length <= PER ? a : Array.from({ length: PER }, (_, i) => a[Math.floor(i * a.length / PER)]);
const items = F.groups.flatMap(g => pick(g.sutras).map(s => { const [n, ...w] = s.split(' '); return { key: `${g.id}|${n}|${w.join(' ').replace(/\s+⟨.*$/, '')}`, g: g.id, group: g.group, n, word: w.join(' ').replace(/\s+⟨.*$/, '') }; }));
const item = x => { const r = R[x.n] || {};
  return `### ${x.key}
sūtra ${x.n}: ${r.s}   — credited word: ${x.word}   — engine group: ${x.group}
our vṛtti: ${r.genC || '—'}
Kāśikā: ${String(r.kv || '—').slice(0, 600)}
prathamāvṛtti: ${String(r.pv ? r.pv.arthaFull || r.pv.artha || '' : '—').slice(0, 400)}
SK: ${String(r.sk || '—').slice(0, 300)}${OWN ? `\nits own commentaries:\n${ownText(x.n) || '—'}` : ''}`; };
const prompt = b => `You are an expert in Pāṇinian grammar auditing a vṛtti generator. For each item below the engine credits sūtra ${PID} (${RULE[PID] || ''}) for the credited word of that sūtra. Decide whether ${PID} really licenses that reading, judging ONLY from the source texts given (the core commentaries below, and each item's Kāśikā / prathamāvṛtti / SK${OWN ? ' / its own commentaries' : ''}). A commentator NAMING a sūtra is not the same as APPLYING it — check what the passage actually says. Do not rely on remembered grammar; if the texts do not settle it, answer "unsure" — a confident wrong verdict is the worst outcome.
For each item return {"key": copied exactly, "verdict": "licensed" | "not licensed" | "unsure", "reason": one sentence, "quote": a VERBATIM substring (≥ 8 characters) of one given text that supports the verdict, "source": which text, e.g. "nyaas 11067" or "Kāśikā of 3.1.5"}.
Return JSON {"items":[…]} with one entry per item, in order.
${G.JSON_PROMPT_RULES || ''}

=== CORE COMMENTARIES (on ${CORE.join(', ')}) ===
${PACK}

=== ITEMS ===
${b.map(item).join('\n\n')}`;
const norm = t => String(t || '').replace(/\s+/g, ' ').normalize('NFC').trim();
const quoteOk = (x, it) => { const q = norm(x.quote); if (q.length < 8) return false; const r = R[it.n] || {};
  return [PACK, r.kv, r.pv && (r.pv.arthaFull || r.pv.artha), r.sk, r.s, r.genC, OWN ? ownText(it.n) : ''].some(t => norm(t).includes(q)); };
(async () => {
  const todo = items.filter(x => !OUT.items[x.key]);
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let k = 0, calls = 0, inT = 0, outT = 0;
  console.log(`${todo.length} credits to judge in ${batches.length} calls (budget $${BUDGET}, spent so far $${OUT.spent.toFixed(3)})`);
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && OUT.spent < BUDGET) { const b = batches[k++];
      const res = await G.callAsync(prompt(b), { maxOutputTokens: 60000, thinkingLevel: 'high', json: true }).catch(e => ({ error: String(e) }));
      calls++; if (res.cost) OUT.spent += res.cost; if (res.usage) { inT += res.usage.promptTokenCount || 0; outT += (res.usage.candidatesTokenCount || 0) + (res.usage.thoughtsTokenCount || 0); }
      if (res.error || !res.text) { console.error('call failed:', String(res.error || res.finishReason).slice(0, 200)); continue; }
      let j; try { j = JSON.parse(res.text.replace(/^```json\s*|\s*```$/g, '')); } catch (e) { console.error('bad JSON'); continue; }
      const byKey = Object.fromEntries(b.map(x => [x.key, x]));
      for (const x of j.items || []) { const it = byKey[x.key]; if (!it) continue; OUT.items[x.key] = { ...x, quoteOk: quoteOk(x, it) }; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
      process.stdout.write(`\r${Object.keys(OUT.items).length}/${items.length} judged · $${OUT.spent.toFixed(3)}   `);
    }
  }));
  OUT.tokens = { in: (OUT.tokens ? OUT.tokens.in : 0) + inT, out: (OUT.tokens ? OUT.tokens.out : 0) + outT };
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`\ndone: ${Object.keys(OUT.items).length}/${items.length} · calls ${calls} · tokens in ${inT} out ${outT} · $${OUT.spent.toFixed(3)}`);
})();
