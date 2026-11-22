#!/usr/bin/env node
// Gemini pilot review of generated vṛttis (Harsha 2026-11-16: "run it - with thinking high. approving USD 10", Flex).
//   Sample A: sūtras the Claude agents already reviewed (calibration) — the gloss they saw, from review/2026-11-16-suspects.json
//   Sample B: a random sample of sūtras the free check does NOT flag (hidden error rate) — current gloss
// Usage (new Google account — see memory reference_gemini_new_account):
//   GEMINI_PROJECT=<your-project> GEMINI_TOKEN_CMD="gcloud auth print-access-token" \
//   GEMINI_FLEX=1 node tools/gem_review.js [--budget 10] [--conc 5] [--batch 10]
// → review/2026-11-16-gemini-pilot.json
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 10), CONC = +arg('--conc', 5), BATCH = +arg('--batch', 10);
if (!G.FLEX) { console.error('GEMINI_FLEX=1 required (Harsha: use Flex)'); process.exit(1); }
if (!process.env.GEMINI_PROJECT) { console.error('set GEMINI_PROJECT to the new account (<your-project>)'); process.exit(1); }
const ROOT = path.join(__dirname, '..'), OUTF = path.join(ROOT, 'review', '2026-11-16-gemini-pilot.json');
// deterministic pseudo-random pick (so a rerun picks the same sūtras)
let seed = 20261116; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const rev = JSON.parse(fs.readFileSync(path.join(ROOT, 'review', '2026-11-16-output-review.json'), 'utf8'));
const sus = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'review', '2026-11-16-suspects.json'), 'utf8')).map(x => [x.n, x]));
const okA = rev.filter(x => x.verdict === 'ok').map(x => x.n), defA = shuffle(rev.filter(x => x.verdict !== 'ok').map(x => x.n)).slice(0, 50);
const A = [...defA, ...okA].filter(n => sus[n]).map(n => ({ set: 'A', n, s: sus[n].s, kind: sus[n].kind, gen: sus[n].gen, pv: sus[n].pv, kv: sus[n].kv, sa: sus[n].sa }));
const R = require('./recs.js')(), nowSus = new Set(JSON.parse(fs.readFileSync('/tmp/vg-suspects.json', 'utf8')).map(x => x.n));
const poolB = Object.values(R).filter(r => r.genC && !nowSus.has(r.n) && !/^(adhikāra|paribhāṣā)$/.test(r.kind) && (r.pv || r.kv));
const B = shuffle(poolB).slice(0, 100).map(r => ({ set: 'B', n: r.n, s: r.s, kind: r.kind, gen: r.genC, pv: (r.pv && r.pv.artha) || '', kv: r.kv || '', sa: r.sa || '' }));
const items = [...A, ...B];

const prompt = batch => `You are an expert in Pāṇinian grammar. Below are Aṣṭādhyāyī sūtras. For each, OUR GLOSS is a machine-generated "class-style" vṛtti; REFERENCES are the published vṛttis (prathamāvṛtti PV, Kāśikā KV, and a modern simple vṛtti SA).
Decide for each whether OUR GLOSS is BLATANTLY WRONG or MISSING something essential compared with the references. Judge meaning and structure, not wording: our class style legitimately spells things out ("X प्रत्यये परे", "X स्थाने Y आदेशः भवति", "X-अन्तात्", "प्रत्ययः परः च भवति", "X अर्थे") and may omit finer points, examples and explanations — that is fine.
Flag only real defects:
- kind: the wrong kind of rule (e.g. a suffix rule where the references describe a substitute आदेश, an augment आगम, an accent, a nipātana, a saṃjñā, or the reverse);
- slot: the wrong word as the substitute / place / suffix / augment / base, or a "?" where the references name the item;
- dropped: a sūtra word, a carried condition or a meaning the references have and our gloss lacks;
- role: a word in the wrong role (a meaning read as a condition, a suffix read as a meaning, a place read as the substitute, a teacher's name read as a stem, न read as a negation where it is the sound न्, …);
- other: anything else blatant (e.g. the rule says the opposite).
Base the verdict only on the given texts. Use "low" confidence if the references are unclear or disagree.
Return JSON: {"results": [{"n": "<sūtra number>", "verdict": "ok" | "defect", "type": "kind"|"slot"|"dropped"|"role"|"other" (defects only), "problem": "<one short English sentence quoting the Sanskrit words>", "should": "<one line, Devanāgarī: the correct content in our class style, from the references>", "confidence": "high"|"medium"|"low"}]} — one object per sūtra, same order.
${G.JSON_PROMPT_RULES || ''}

${batch.map(x => `### ${x.n}  ${x.s}
OUR GLOSS: ${x.gen}
PV: ${x.pv || '—'}
KV: ${x.kv || '—'}
SA: ${x.sa || '—'}`).join('\n\n')}`;

(async () => {
  const batches = []; for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  let spent = 0, k = 0, done = 0, failed = 0; const out = [];
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) {
      const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 32768, thinkingLevel: 'high' }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0;
      let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      const res = j && Array.isArray(j.results) ? j.results : null;
      if (!res) { failed++; b.forEach(x => out.push({ set: x.set, n: x.n, verdict: 'error', problem: r.error || 'unparsed' })); continue; }
      b.forEach(x => { const y = res.find(z => String(z.n) === x.n) || {}; out.push({ set: x.set, n: x.n, kind: x.kind, gen: x.gen, ...y, n2: undefined }); });
      done++; process.stderr.write(`batch ${done}/${batches.length} · $${spent.toFixed(3)}\n`);
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify({ meta: { model: G.MODEL, flex: G.FLEX, thinking: 'high', spent: +spent.toFixed(4), items: items.length, A: A.length, B: B.length, failedBatches: failed }, results: out }, null, 1));
  console.log(`items ${items.length} (A ${A.length}, B ${B.length}) · batches ${done} ok, ${failed} failed · $${spent.toFixed(3)} → ${path.relative(process.cwd(), OUTF)}`);
})();
