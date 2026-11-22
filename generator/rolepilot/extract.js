#!/usr/bin/env node
// Role-table pilot (Harsha 2026-11-16: "Go for it"; Gemini 3.8-flash, Flex, high thinking, cap $5, NEW account).
// For each sūtra of the pilot set: the role every word plays (own + carried + supplied), the kind of rule, and a VERBATIM
// quote from a reference for each role. Output: rolepilot/roles.json (resumable; only missing sūtras are asked).
// Usage: GEMINI_PROJECT=<your-project> GEMINI_TOKEN_CMD="gcloud auth print-access-token" \
//        GEMINI_FLEX=1 node rolepilot/extract.js [--budget 5] [--conc 5] [--batch 6] [--only 3.1.97,3.1.98]
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 5), CONC = +arg('--conc', 5), BATCH = +arg('--batch', 6), ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
const R = require('../tools/recs.js')(), SET = process.argv.includes('--all') ? Object.keys(R) : require('./set.json'), OUTF = path.join(__dirname, 'roles.json');
const OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const CASE = ['indeclinable/none', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

const item = n => { const r = R[n]; return `### ${n}  ${r.s}
SŪTRA WORDS (padaccheda · case per the ashtadhyayi.com data, which can be wrong): ${r.words.map(w => `${w.form} [${CASE[w.wcase] || w.wcase}]`).join(' · ')}
CARRIED (anuvṛtti / adhikāra per the data, which can miss words): ${(r.carried || []).map(c => `${c.w} ←${c.from}${c.via === 'adhikāra' ? ' (adhikāra)' : ''}`).join(' · ') || '—'}
PV (prathamāvṛtti): ${(r.pv && (r.pv.arthaFull || r.pv.artha)) || '—'}
KV (Kāśikā): ${r.kv || '—'}
SA (नैलेश-वृत्तिः): ${r.sa || '—'}
SK (Siddhānta-kaumudī): ${r.sk || '—'}`; };

const prompt = ns => `You are an expert in Pāṇinian grammar building a ROLE TABLE for Aṣṭādhyāyī sūtras. For each sūtra below, decide — strictly from the reference vṛttis given (PV, KV, SA, SK) — what kind of rule it is and what role each word plays, so that a class-style vṛtti can be written from the table.

ROLE VOCABULARY (use exactly these):
 sthani (the thing replaced / operated on), adesha (the substitute), pratyaya (the suffix introduced), agama (the augment), prakriti (the base the suffix comes after, or the base operated on), nimitta (the condition that FOLLOWS, "X परे/परतः"), purva (what PRECEDES, "X उत्तरस्य/परस्य"), upapada (the co-occurring word in the dhātu section), artha (the meaning/sense of the suffix or the form, "X अर्थे / अभिधेये / वाच्ये"), vishaya (domain: छन्दसि, संज्ञायाम्, भाषायाम्, a region…), samjna (the name being defined), samjni (what receives the name), nipatana (a ready-made form the sūtra states), option (वा/विभाषा/अन्यतरस्याम्/बहुलम्), negation (न), acharya (a teacher whose view is cited), samartha (the case the base stands in, taddhita), accent (उदात्त/अनुदात्त/स्वरित/प्रकृत्या result), atidesha (X-वत् extension), adhikara (heading), qualifier (a word qualifying another role-bearer: e.g. अजन्त, उपसर्गात्), other.
KIND (one): vidhi-pratyaya (introduces a suffix), adesha (substitution incl. lopa/luk), agama, ekadesha, svara (accent), samjna, paribhasha, adhikara, atidesha, nipatana, nishedha (prohibition), niyama (restriction), samasa, vibhakti (case assignment), pada (pada assignment), other.

For EACH sūtra return:
- "kind";
- "roles": one entry per role-bearing item, covering EVERY sūtra word that carries meaning (skip only च/तु/एव/अपि-type particles, but list न, वा and teachers), every carried word the references actually use, and any item the references need that is in neither list (source "supplied", with the sūtra it comes from if the references or your knowledge of the anuvṛtti say so). Each entry:
   {"word": the sūtra/carried form, "source": "own" | "carried:<sūtra>" | "supplied:<sūtra or ?>", "role": one ROLE, "render": how a class-style vṛtti says it, in Devanāgarī (e.g. "धातोः", "अजन्तात् धातोः", "यत् प्रत्ययः", "इकः स्थाने", "अचि परे", "सम्शब्दे उपपदे", "मुष्टौ अर्थे", "संज्ञायाम् विषये", "विकल्पेन", "उदीचाम् आचार्याणाम् मतेन"),
    "why": "case" if the role follows from the word's case/form alone (6th→place, 7th→condition, 5th→what precedes…), "tadanta" if the word stands for "what ends in it", "tadadi" for "what begins with it", "carried" for anuvṛtti/adhikāra, "vyakhyana" if only the commentary settles it (region vs teacher, a word vs a pratyāhāra, 6th standing for 5th…),
    "ref": "PV"|"KV"|"SA"|"SK", "quote": a VERBATIM substring (5–60 characters) of that reference which shows this role — copy exactly, keep sandhi; "" only if no reference shows it }
- "yathasankhya": true if a reference pairs two lists in order;
- "note": one short line if the references disagree or something is unclear, else "".
Rules: copy quotes exactly (they are checked by a program); never invent a role no reference supports; prefer PV, then KV.
Return JSON: {"sutras": [{"n": "...", "kind": "...", "roles": [...], "yathasankhya": false, "note": ""}, …]} in the same order.
${G.JSON_PROMPT_RULES || ''}

${ns.map(item).join('\n\n')}`;

(async () => {
  const todo = SET.filter(n => (!ONLY.length || ONLY.includes(n)) && !OUT[n] && R[n]);
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0, ok = 0, bad = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) {
      const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 40000, thinkingLevel: 'high', json: true }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0;
      let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j || !Array.isArray(j.sutras)) { bad++; process.stderr.write(`batch failed (${b[0]}…): ${(r.error || 'unparsed').slice(0, 120)}\n`); continue; }
      for (const s of j.sutras) if (b.includes(String(s.n))) { OUT[String(s.n)] = s; ok++; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
      process.stderr.write(`${Object.keys(OUT).length}/${SET.length} · $${spent.toFixed(3)}\n`);
    }
  }));
  fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
  console.log(`asked ${todo.length} · got ${ok} · failed batches ${bad} · $${spent.toFixed(3)} · total in table ${Object.keys(OUT).length}/${SET.length}`);
})();
