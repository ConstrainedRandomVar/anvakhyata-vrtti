#!/usr/bin/env node
// Repair pass for the fix list (Harsha 2026-11-17: "yes to all" → group the fix list and bring a plan). For each sūtra the blind review
// marked wrong (fallback.json fix + fallback), Gemini gets our vṛtti, its roles, the reviewer's problem + "should" line and the references,
// and returns corrected role entries (same schema/merge as gap-roles.json: "replaces" an existing role, or a new role). Every role needs a
// VERBATIM reference quote (checked here). Output: rolepilot/repair-roles.json — NOT applied by render.js until a blind re-review passes it
// (rolepilot/repair_review.js writes repair-accepted.json, which render.js reads).
// Usage: GEMINI_PROJECT=… GEMINI_TOKEN_CMD=… GEMINI_FLEX=1 node rolepilot/repair_roles.js --budget X [--conc 3] [--batch 3]
'use strict';
const fs = require('fs'), path = require('path');
const G = require(path.join(__dirname, '../../../searchtool/khan/vc-karaka/gemini.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BUDGET = +arg('--budget', 0), CONC = +arg('--conc', 3), BATCH = +arg('--batch', 3);
if (!G.FLEX || !process.env.GEMINI_PROJECT) { console.error('need GEMINI_FLEX=1 and the new GEMINI_PROJECT'); process.exit(1); }
if (!BUDGET) { console.error('give --budget (approved cap)'); process.exit(1); }
const R = require('../tools/recs.js')(), F = require('./fallback.json'), RV = require('./review-all.json');
const T = require('./roles.json'), HANDR = fs.existsSync(path.join(__dirname, 'hand-roles.json')) ? require('./hand-roles.json') : {};
const OUTF = path.join(__dirname, 'repair-roles.json'), OUT = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const EXCL = new Set(arg('--exclude', '') ? fs.readFileSync(arg('--exclude', ''), 'utf8').split(',').map(x => x.trim()) : []);
// --retry (2026-11-17, final round): also redo a sūtra whose earlier repair was rejected by the re-review or the duplicate gate, giving the
// model that attempt and the reason it failed; a sūtra already accepted is never touched
const RETRY = process.argv.includes('--retry');
const RREV = fs.existsSync(path.join(__dirname, 'repair-review.json')) ? require('./repair-review.json') : {}, RACC = fs.existsSync(path.join(__dirname, 'repair-accepted.json')) ? require('./repair-accepted.json') : {};
const RGATE = fs.existsSync(path.join(__dirname, 'repair-gated.json')) ? require('./repair-gated.json') : {};
const ALL = [...new Set(Object.keys(F.fix).concat(Object.keys(F.fallback)))].filter(n => R[n] && T[n] && !HANDR[n] && !EXCL.has(n) && !RACC[n]);
const prev = n => { if (!RETRY || !OUT[n]) return ''; const why = RGATE[n] ? `the repaired vṛtti repeated words (${RGATE[n]})` : (RREV[n] && RREV[n].verdict === 'defect') ? `the re-reviewer still found: ${RREV[n].problem}${RREV[n].should ? ' — should: ' + RREV[n].should : ''}` : '';   // no roles returned = the model judged the reviewer wrong (its note says why) — not retried
  return why ? `\nYOUR EARLIER REPAIR: ${(OUT[n].roles || []).map(x => `${x.word} [${x.role}] repl=${x.replaces || '-'} “${x.render}”`).join(' · ') || '(none)'}\nWHY IT FAILED: ${why}` : ''; };
const item = n => { const r = R[n], y = RV.new[n] || {}, rs = (T[n].roles || []);
  return `### ${n}  ${r.s}   (kind: ${T[n].kind})
OUR VṚTTI (from the roles): ${r.genSource === 'roles' ? r.genC : '(shown: the older gloss) ' + r.genC}
OUR ROLES: ${rs.map(x => `${x.word} [${x.role}] “${x.render}”`).join(' · ')}
REVIEWER'S PROBLEM: ${y.problem || '—'}
REVIEWER'S SHOULD: ${y.should || '—'}
PV: ${(r.pv && (r.pv.arthaFull || r.pv.artha)) || '—'}
KV: ${r.kv || '—'}
SA: ${r.sa || '—'}
SK: ${r.sk || '—'}${prev(n)}`; };
const prompt = b => `You are an expert in Pāṇinian grammar. Each sūtra below has a class-style vṛtti built from a ROLE TABLE; a blind reviewer found it wrong and said what it should say. Return the role entries that fix it — corrected renders of existing roles ("replaces": the existing role's word) and/or roles that are missing (a carried word the references voice, a meaningful particle such as एव / अपि, a condition, a meaning) — so that the vṛtti built from the table says what the references say.
Role vocabulary: sthani, adesha, pratyaya, agama, prakriti, nimitta, purva, upapada, artha, vishaya, samjna, samjni, qualifier, option, negation, acharya, accent, atidesha, other.
Each role: {"word": the sūtra/carried word, "replaces": existing role word or "", "role", "render": Devanāgarī class-style phrase, "source": "own" | "carried:<sūtra>", "ref": "PV"|"KV"|"SA"|"SK", "quote": a VERBATIM 5–60 character substring of that reference showing it (copied exactly; checked by a program)}.
Each render is the phrase for ONE role (e.g. "उत्तरपदस्य अचः स्थाने", "विकल्पेन"), never a whole clause ending in भवति; the vṛtti is assembled from the roles. If an existing role already says something (an option, a substitute, a condition), correct THAT role via "replaces" — never add a second role that repeats it.
Only fix what the reviewer found and the references support; do not rewrite correct roles. If the reviewer is wrong (the references support our vṛtti), return no roles and say why in "note".
Return JSON {"sutras":[{"n":"…","roles":[…],"note":""}]}
${G.JSON_PROMPT_RULES || ''}

${b.map(item).join('\n\n')}`;
const norm = t => String(t || '').replace(/[-‹›'"‘’“”]/g, '').replace(/\s+/g, ' ').normalize('NFC').trim();
(async () => {
  // VG_SET=new → only sūtras never attempted; VG_SET=retry → only rejected attempts (so each set can get its own thinking level)
  const SET = process.env.VG_SET || '';
  const todo = ALL.filter(n => SET === 'new' ? !OUT[n] : SET === 'retry' ? (OUT[n] && RETRY && prev(n)) : (!OUT[n] || (RETRY && prev(n))));
  const batches = []; for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH));
  let spent = 0, k = 0, kept = 0, rej = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (k < batches.length && spent < BUDGET) { const b = batches[k++];
      const r = await G.callAsync(prompt(b), { maxOutputTokens: +(process.env.VG_MAXOUT || 48000), thinkingLevel: (process.env.VG_THINK || 'high'), json: true }).catch(e => ({ error: String(e) }));
      spent += r.cost || 0; let j = null; try { j = G.parseJSON(r.text); } catch (e) { }
      if (!j || !Array.isArray(j.sutras)) { process.stderr.write(`batch ${b[0]}… failed: ${String(r.error || (r.text || '').slice(0, 160) || 'empty')}\n`); continue; }
      for (const s of j.sutras) { const n = String(s.n); if (!b.includes(n)) continue; const rr = R[n];
        const refs = { PV: norm(rr.pv && (rr.pv.arthaFull || rr.pv.artha)), KV: norm(rr.kv), SA: norm(rr.sa), SK: norm(rr.sk) };
        const ok = (s.roles || []).filter(y => y.render && y.quote && refs[y.ref] && refs[y.ref].includes(norm(y.quote)));
        rej += (s.roles || []).length - ok.length; kept += ok.length; OUT[n] = { roles: ok, note: s.note || '' }; }
      fs.writeFileSync(OUTF, JSON.stringify(OUT, null, 1));
      process.stderr.write(`${Object.keys(OUT).length}/${ALL.length} · $${spent.toFixed(3)}\n`); } }));
  console.log(JSON.stringify({ sutras: ALL.length, done: Object.keys(OUT).length, rolesKept: kept, rejectedNoQuote: rej, spent: +spent.toFixed(3) }));
})();
