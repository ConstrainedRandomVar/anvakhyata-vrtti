#!/usr/bin/env node
// Gap pass (Harsha 2026-11-17: "do 3"): for each sūtra whose steps miss a paribhāṣā the references use, ask Gemini (3.8-flash, Flex,
// high, NEW account) for the role(s) the vṛtti is missing, given the exact reference wording that needs that paribhāṣā. Each added role
// needs a VERBATIM reference quote (checked by program, as in extract.js); a role without a found quote is rejected.
// In: /tmp/vg-gaps.json (written by build.js). Out: rolepilot/gap-roles.json { n: [role, …] } — merged by render.js prep().
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0.4), CONC = +arg('--conc', 3), BATCH = +arg('--batch', 4);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
const R = require('../tools/recs.js')(), GAPS = JSON.parse(fs.readFileSync('/tmp/vg-gaps.json', 'utf8'));
const OUTF = path.join(__dirname, 'gap-roles.json'), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const PBT = { '1.1.72': 'येन विधिस्तदन्तस्य — a property/word stands for what ENDS in it (X-अन्त)', 'PIS 23': 'प्रत्ययग्रहणे तदन्तग्रहणम् — a suffix named stands for what ends in that suffix', '1.1.66': 'तस्मिन्निति निर्दिष्टे पूर्वस्य — a 7th-case word names what FOLLOWS (X परे)', '1.1.67': 'तस्मादित्युत्तरस्य — a 5th-case word: the operation is on what follows it (X उत्तरस्य / परस्य)', '1.1.49': 'षष्ठी स्थानेयोगा — a 6th-case word names what is replaced (X स्थाने)', 'PIS 33': 'यस्मिन्विधिस्तदादावल्ग्रहणे — a sound named stands for what BEGINS with it (X-आदौ)', '3.1.92': 'तत्रोपपदं सप्तमीस्थम् — a 7th-case word in the dhātu section is the upapada', '1.4.13': 'यस्मात्प्रत्ययविधिस्तदादि प्रत्ययेऽङ्गम् — the aṅga', '4.1.82': 'समर्थानां प्रथमाद्वा — the base in the case named (X-समर्थात्)', '1.1.56': 'स्थानिवदादेशोऽनल्विधौ', '1.3.10': 'यथासङ्ख्यमनुदेशः समानाम् — lists paired in order', '1.1.52': 'अलोऽन्त्यस्य', '1.1.53': 'ङिच्च', '1.1.54': 'आदेः परस्य', '1.1.62': 'प्रत्ययलोपे प्रत्ययलक्षणम्' };
const item = x => { const r = R[x.n];
  return `### ${x.n}  ${r.s}   (kind: ${r.roleKind || r.kind})
OUR VṚTTI: ${r.genC}
OUR ROLES: ${(r.roles || []).map(y => `${y.word} [${y.role}] “${y.render}”`).join(' · ')}
MISSING PARIBHĀṢĀ(S): ${x.g.map(g => `${g.pid} (${PBT[g.pid] || g.why.join('; ')}) — the reference wording that uses it: ${[...(g.hit || [])].join(' | ') || g.from.join(', ')}`).join('\n   ')}
PV: ${(r.pv && (r.pv.arthaFull || r.pv.artha)) || '—'}
KV: ${r.kv || '—'}
SA: ${r.sa || '—'}
SK: ${r.sk || '—'}`; };
const prompt = b => `You are an expert in Pāṇinian grammar. Each Aṣṭādhyāyī sūtra below has a class-style vṛtti built from a role table. The reference vṛttis use a paribhāṣā that our vṛtti does not voice. For each sūtra, decide whether the references really apply that paribhāṣā TO THIS SŪTRA'S RULE (not inside an unrelated example, a cited other sūtra, or a passing phrase).
If yes, give the role entries our table is MISSING (or a corrected render of an existing role) so that our vṛtti says what the references say — e.g. "अजन्तस्य प्रातिपदिकस्य" (1.1.72), "धातोः उत्तरस्य" (1.1.67), "अणि परे" (1.1.66), "हियङ्गु-आदेशः ह्योगोदोहशब्दस्य स्थाने" (1.1.49). For a NIPĀTANA, the missing roles are the derivation the references give (the base, the suffix, the operation), e.g. "उप-पूर्वात् सृ-धातोः", "यत्-प्रत्ययान्तः".
Role vocabulary: sthani, adesha, pratyaya, agama, prakriti, nimitta, purva, upapada, artha, vishaya, qualifier, other.
Each role: {"word": the word it is about (sūtra form, or the reference's word), "replaces": the existing role word it corrects, or "", "role", "render": Devanāgarī phrase in class style, "pb": the paribhāṣā id it voices, "ref": "PV"|"KV"|"SA"|"SK", "quote": a VERBATIM 5–60 character substring of that reference showing it (copy exactly; it is checked by a program)}.
If the references do NOT really apply it to this rule, return no roles and say why in "note".
Return JSON {"sutras":[{"n":"…","roles":[…],"note":""}]}
${G.JSON_PROMPT_RULES || ''}

${b.map(item).join('\n\n')}`;
const norm = t => String(t || '').replace(/[-‹›'"‘’“”]/g, '').replace(/\s+/g, ' ').normalize('NFC').trim();
(async () => {
  const todo = GAPS.filter(x => !OUT[x.n] && R[x.n] && R[x.n].genSource === 'roles');
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0, added = 0, rej = 0, none = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: 24000, thinkingLevel: 'high' }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j || !Array.isArray(j.sutras)) { process.stderr.write(`batch ${b[0].n}… failed: ${String(r.error || (r.text || '').slice(0, 160) || 'empty')}\n`); continue; }
      for (const s of j.sutras) { const x = b.find(y => y.n === String(s.n)); if (!x) continue; const rr = R[x.n];
        const refs = { PV: norm(rr.pv && (rr.pv.arthaFull || rr.pv.artha)), KV: norm(rr.kv), SA: norm(rr.sa), SK: norm(rr.sk) };
        const ok = (s.roles || []).filter(y => y.render && y.quote && refs[y.ref] && refs[y.ref].includes(norm(y.quote)));
        rej += (s.roles || []).length - ok.length; if (!ok.length) none++;
        OUT[x.n] = { roles: ok, note: s.note || '' }; added += ok.length; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
      process.stderr.write(`${Object.keys(OUT).length}/${todo.length} · $${spent.toFixed(3)}\n`); } }));
  console.log(JSON.stringify({ items: todo.length, done: Object.keys(OUT).length, rolesAdded: added, rejectedNoQuote: rej, noRole: none, spent: +spent.toFixed(3) }));
})();
