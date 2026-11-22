#!/usr/bin/env node
// Role-table pilot, step 2: verify the role table and render a class-style vṛtti from it, with the paribhāṣā behind each role.
// → rolepilot/rendered.json  (per sūtra: verification, new vṛtti, steps) and a summary on stdout.
'use strict';
const fs = require('fs'), path = require('path');
const CLI = require.main === module;
const R = CLI ? require('../tools/recs.js')() : null, T = CLI ? require('./roles.json') : null, SET = CLI ? (process.argv.includes('--all') ? Object.keys(T) : require('./set.json')) : [];
const norm = t => (t || '').replace(/[-‹›'"‘’“”]/g, '').replace(/\s+/g, ' ').normalize('NFC').trim();
const PART = /^(च|तु|एव|अपि|इति|ह|वै)$/;
const refsOf = r => ({ PV: (r.pv && (r.pv.arthaFull || r.pv.artha)) || '', KV: r.kv || '', SA: r.sa || '', SK: r.sk || '' });

// which paribhāṣā turns the word into its role (the explanation the user sees)
const pbOf = (x, w) => {
  const p = [];
  const SFX = /^(सुप्|तिङ्|अतिङ्|कृत्|तद्धित|क्त|क्त्व|यङ्|ण्य|णि|सन्|ल्यप्|शतृ|शानच्|घञ्|अण्|इञ्|यञ्|फक्|ढक्|मतुप्|तृच्)/;
  const ownAnta = /न्त/.test(String(x.word || ''));   // the sūtra word already says -अन्त (स्थानान्तात्): no tadanta step needed
  if (x.why === 'tadanta' && !ownAnta) p.push(/प्रत्ययान्त/.test(x.render) || SFX.test(String(x.word).replace(/^अ/, '')) ? 'PIS 23' : '1.1.72');
  if (x.why === 'tadadi' && /ादौ|ादि(\s|$|ः)/.test(String(x.render || ''))) p.push('PIS 33');
  if (x.role === 'sthani' && w && w.wcase === 6) p.push('1.1.49');
  if (x.role === 'nimitta' && w && w.wcase === 7 && !/व्यवाय|सति$/.test(String(x.render || '') + String(x.word || ''))) p.push('1.1.66');   // “X-व्यवाये सति” is intervention, not what follows
  if (x.role === 'purva' && (!w || w.wcase === 5)) p.push('1.1.67');
  if (x.role === 'upapada') p.push('3.1.92');
  if (x.role === 'samartha') p.push('4.1.82');
  if (x.role === 'option' && /विभाषा/.test(x.word)) p.push('1.1.44');
  if (/^अङ्गस्य$/.test(x.word) && /carried/.test(x.source)) p.push('1.4.13');
  // and from what the phrase itself says (the same reading the references give)
  const t = String(x.render || '');
  if (/(न्तात्|न्तस्य|न्तानाम्|न्तेभ्यः|न्ताभ्याम्|न्तायाः|न्तम्|न्तः)(\s|$)/.test(t) && !ownAnta && !p.some(q => /1\.1\.72|PIS 23/.test(q))) p.push(/प्रत्ययान्त/.test(t) || SFX.test(String(x.word).replace(/^अ/, '')) ? 'PIS 23' : '1.1.72');
  if (/ादौ(\s|$)|ादिः(\s|$)/.test(t) && !p.includes('PIS 33')) p.push('PIS 33');
  if (/(^|\s)परे$|(^|\s)परतः$/.test(t) && x.role === 'nimitta' && !/व्यवाय/.test(t) && !p.includes('1.1.66')) p.push('1.1.66');
  if (/(^|\s)(उत्तरस्य|परस्य)$/.test(t) && !p.includes('1.1.67')) p.push('1.1.67');
  if (/(^|\s)स्थाने$/.test(t) && !p.includes('1.1.49')) p.push('1.1.49');
  if (/उपपद/.test(t) && !p.includes('3.1.92')) p.push('3.1.92');
  if (/समर्थ/.test(t) && !p.includes('4.1.82')) p.push('4.1.82');
  if (/(^|\s)(अङ्गस्य|अङ्गात्)(\s|$)/.test(t) && !p.includes('1.4.13')) p.push('1.4.13');
  if (x.role === 'prakriti' && w && w.wcase === 5 && !p.includes('1.1.67')) p.push('1.1.67');   // a base in the 5th: the suffix comes after it
  return p;
};
const ORDER = { other: 9, adhikara: 9, vishaya: 1, nimitta: 2, upapada: 3, purva: 4, qualifier: 5, prakriti: 6, sthani: 6, samjni: 6, samartha: 7, artha: 8, acharya: 9, option: 10, pratyaya: 11, adesha: 11, agama: 11, accent: 11, atidesha: 11, samjna: 11, negation: 12 };
function render(s) {
  // every role with something to say is said (नित्यम्, “परस्मैपदं च”, an upasarga condition were being dropped as 'other'); only an
  // anuvṛtti heading the references do not voice stays silent
  const roles = (s.roles || []).filter(x => x.render && !(x.role === 'adhikara' && /carried/.test(x.source)) || ['negation', 'option'].includes(x.role));
  if (s.kind === 'adhikara') { const own = roles.filter(x => x.source === 'own' || x.role === 'adhikara'); return (own.map(x => String(x.render).replace(/\s*\([^)]*\)/g, '').replace(/\s*इति\s*अधिकारः.*$/, '')).join(' ') + ' इति अधिकारः').replace(/\s+/g, ' ').trim(); }
  // a list the sūtra itself spells out stays spelt out (not “भ्राशादिभ्यः” for भ्राश-भ्लाश-भ्रमु-…)
  for (const x of roles) if (!x.opened && /आदिभ्य[ःो]|ादिभ्य[ःो]/.test(x.render || '') && x.source === 'own' && (x.segs || x.word.split('-')).length >= 3 && !/आदि/.test(x.word)) {
    const segs = (x.segs || x.word.split('-')).slice(); segs[segs.length - 1] = segs[segs.length - 1].replace(/(भ्यः|ः|ात्|स्य)$/, ''); x.render = segs.join(' ') + ' इत्येतेभ्यः' + (/धातु/.test(x.render) ? ' धातुभ्यः' : ''); }
  // a suffix rule that also prescribes a substitute / augment / lopa (3.1.12 क्यङ् + हलः लोपः, 3.1.74 श्नु + शृ): the second operation is its own clause
  if (/^(vidhi-pratyaya|adesha)$/.test(s.kind) && roles.some(x => x.role === 'pratyaya') && roles.some(x => /^(adesha|agama)$/.test(x.role) || x.role === 'other' && /लोप|आदेश/.test(x.render))) {
    const sec = roles.filter(x => /^(adesha|agama|sthani)$/.test(x.role) || x.role === 'other' && /लोप|आदेश/.test(x.render));
    const main = render({ ...s, kind: 'vidhi-pratyaya', roles: roles.filter(x => !sec.includes(x)) });
    const second = sec.slice().sort((a, b) => (a.role === 'sthani' ? 0 : 1) - (b.role === 'sthani' ? 0 : 1)).map(x => { let t = String(x.render).replace(/\s*\([^)]*\)/g, '').trim();
      if (x.role === 'sthani' && !/स्थाने/.test(t)) t += ' स्थाने'; if (x.role === 'adesha' && !/आदेश|ादेश|लोप/.test(t)) t += ' आदेशः'; if (x.role === 'agama' && !/आगम|ागम/.test(t)) t += ' आगमः'; return t; }).join(' ');
    return `${main}, ${second} च भवति`.replace(/\s+/g, ' ').trim();
  }
  const by = role => roles.filter(x => x.role === role);
  const has = role => by(role).length > 0, neg = has('negation');
  // a 7th-case qualifier describes the condition (धातुलोपे आर्धधातुके): it goes right before the nimitta, not after it
  const has67 = roles.some(x => x.added67);
  const ordOf = x => x.added67 ? 4 : has67 && x.role === 'qualifier' && /(ात्|ाद्|भ्यः|भ्याम्|भ्यश्च|ाच्च)$/.test(String(x.render || '').replace(/\s+च$/, '').split(/\s+/).pop()) ? 3.9 : x.role === 'qualifier' && x.wcase === 7 ? 1.5 : (ORDER[x.role] || 9);   // “X परस्य” goes where a purva goes, before the sthāni
  let sorted = roles.filter(x => !['negation', 'nipatana'].includes(x.role)).slice().sort((a, b) => ordOf(a) - ordOf(b));
  const ph = x => x.role === 'option' && !x.render ? 'विकल्पेन' : String(x.render || '').replace(/\s*\(?(भवति|भवतः|भवन्ति|स्यात्|स्याताम्|स्युः)\)?\s*$/, '').trim();
  let toks = sorted.map(ph);
  const verb = n => n > 2 ? 'भवन्ति' : n === 2 ? 'भवतः' : 'भवति';
  const k = s.kind;
  if (k === 'nipatana') {
    const forms = by('nipatana'); const fr = forms.map(x => ph(x).replace(/\s*(इति\s*)?निपात्य(ते|न्ते|ेते)$/, '').replace(/\s*इति$/, '')).join(' '); const frO = fr.replace(/\s*\([^)]*\)/g, '');   // ignore the bracketed derivations when reading number / इति
    const pl = forms.length > 1 || /इत्येते|इत्येतौ|इत्येतानि|शब्दाः|शब्दौ|श्च(\s|$)/.test(frO);   // a word-final श्च (…शब्दश्च), not पश्चात्
    const pre = sorted.filter(x => x.pre); sorted = sorted.filter(x => !x.pre);
    toks = [...pre.map(ph), fr, ...(/इत्येत|शब्द/.test(frO) ? [] : ['इति']), pl ? (forms.length === 2 || /इत्येतौ|शब्दौ|श्च(\s|$)/.test(frO) ? 'निपात्येते' : 'निपात्यन्ते') : 'निपात्यते', ...sorted.map(ph)];
    return toks.join(' ').replace(/\s+/g, ' ').trim();
  }
  const prs = sorted.filter(x => x.role === 'pratyaya');
  if (prs.length > 1) { const names = prs.map(x => ph(x).replace(/\s*प्रत्यय(ः|ौ|ाः)$/, '').replace(/ः$/, '')); const lab = { ...prs[0], render: names.join(' ') + ' ' + (names.length === 2 ? 'प्रत्ययौ' : 'प्रत्ययाः') }; sorted.splice(sorted.indexOf(prs[0]), 1, lab); prs.slice(1).forEach(x => sorted.splice(sorted.indexOf(x), 1)); }
  let tail = [];
  if (k === 'vidhi-pratyaya') { const pr = sorted.filter(x => x.role === 'pratyaya').map(x => x.render).join(' '); const n = /प्रत्ययाः|इत्येते/.test(pr) ? 3 : /प्रत्ययौ|ौ\s/.test(pr + ' ') ? 2 : 1; toks = toks.map(t => t); tail = [n === 3 ? 'पराः च' : n === 2 ? 'परौ च' : 'परः च', ...(s.yathasankhya ? ['यथासङ्ख्यम्'] : []), ...(neg ? ['न'] : []), verb(n)]; }
  else if (k === 'samjna') tail = [...(s.yathasankhya ? ['यथासङ्ख्यम्'] : []), ...(neg ? ['न'] : []), 'भवति'];
  else { const vH = roles.filter(x => x.hand).map(x => (String(x.render || '').match(/(भवन्ति|भवतः)\s*$/) || [])[1]).find(Boolean);   // a hand phrase that states its own number (साधूनि भवन्ति)
    tail = [...(s.yathasankhya ? ['यथासङ्ख्यम्'] : []), ...(neg ? ['न'] : []), vH || (by('accent').some(x => /ौ(\s|$)/.test(x.render)) || by('adesha').some(x => /ौ$/.test(ph(x))) ? 'भवतः' : 'भवति')]; }
  // a substitute/augment/suffix word that the render leaves bare gets its label
  toks = sorted.map(x => { let t = ph(x);
    if (x.role === 'adesha' && !/आदेश|ादेश|लोप|लुक्|लुप्|श्लु/.test(t)) t += ' आदेशः';
    if (x.role === 'sthani' && /^(adesha|ekadesha)$/.test(k) && !/स्थाने/.test(t) && x === sorted.filter(y => y.role === 'sthani').pop()) t += ' स्थाने';
    t = t.replace(/(^|\s)परतः$/, '$1परे').replace(/(^|\s)परतः(?=\s)/g, '$1परे');
    if (x.role === 'agama' && !/आगम|ागम/.test(t)) t += ' आगमः';
    if (x.role === 'pratyaya' && !/प्रत्यय/.test(t)) t += ' प्रत्ययः';
    if (x.role === 'samjna' && !/संज्ञा/.test(t)) t = `'${t}' इति संज्ञा`;
    else if (x.role === 'samjna' && /^(\S+?)संज्ञा$/.test(t)) t = `'${x.word}' इति संज्ञा`;   // वृद्धिसंज्ञा → 'वृद्धिः' इति संज्ञा (class style)
    return t; });
  // tidy: no parenthetical notes from the renders; a bare base word (धातोः, धातुभ्यः, प्रातिपदिकात्) said once even if another phrase repeats it
  toks = toks.map((t, i) => (sorted[i] && sorted[i].hand) ? t : t.replace(/\s*\([^)]*\)/g, '').trim()).filter(Boolean);   // a hand-written phrase keeps its brackets
  const words = toks.join(' ').split(/\s+/), seen = new Set(), outW = [];
  for (const w of words) { if (/^(धातोः|धातुभ्यः|धात्वोः|प्रातिपदिकात्|प्रातिपदिकेभ्यः|अङ्गस्य|पदस्य)$/.test(w) && seen.has(w)) continue; seen.add(w); outW.push(w); }
  // never the same word twice in a row (6.3.10 “हलादौ उत्तरपदे उत्तरपदे”: a qualifier and a condition ending in the same word)
  return [...outW, ...tail].join(' ').replace(/\s+/g, ' ').replace(/ च च /g, ' च ').replace(/(^|\s)(\S+)(\s+\2)+(?=\s|$)/g, '$1$2').trim();
}

// one sūtra: verify the quotes, attach the paribhāṣās, render — r is a record with words/pv/kv/sa/sk (recs.js or build.js)
// compounds the references open but our phrase kept closed, opened by open_compounds.js (Gemini; every member checked against a reference)
const GAPR = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'gap-roles.json'), 'utf8')); } catch (e) { return {}; } })();
// HAND one-offs (Harsha 2026-11-17: "treat such cases as one-offs and hand craft these"): roles written by hand from the references (full
// Kāśikā / SK / PV), each with the reference wording it rests on; same merge as gap-roles; an optional teaching note for the student view
const HANDR = (() => { try { const h = JSON.parse(fs.readFileSync(path.join(__dirname, 'hand-roles.json'), 'utf8')); delete h._about; return h; } catch (e) { return {}; } })();
// fix-list repairs (repair_roles.js): applied only once a blind re-review passed them (repair-accepted.json), or all of them when
// VG_REPAIR_ALL=1 (to build the candidates for that review)
const REPR = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'repair-roles.json'), 'utf8')); } catch (e) { return {}; } })();
const REPACC = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'repair-accepted.json'), 'utf8')); } catch (e) { return {}; } })();
const repairOn = n => !!(REPR[n] && (process.env.VG_REPAIR_ALL || REPACC[n]));
const OPENED = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'opened.json'), 'utf8')); } catch (e) { return {}; } })();
function prep(n, s, r) {
  const refs = Object.fromEntries(Object.entries(refsOf(r)).map(([k, v]) => [k, norm(v)]));
  const opK = w => String(w || '').replace(/[-\s]/g, ''), op = OPENED[n] ? Object.fromEntries(Object.entries(OPENED[n]).map(([k, v]) => [opK(k), v])) : {};
  const roles = (s.roles || []).map(x => op[opK(x.word)] ? { ...x, render: op[opK(x.word)], opened: true } : x).map(x => { const q = norm(x.quote); const ok = !!q && !!refs[x.ref] && refs[x.ref].includes(q);
    const w = (r.words || []).find(w => norm(w.form) === norm(x.word));
    return { ...x, verified: ok, pb: pbOf(x, w), wcase: w ? w.wcase : null, segs: w && /-/.test(w.form || '') ? w.form.split('-') : (w && w.segs && w.segs.length > 1 ? w.segs : null) }; });
  // roles the references need that the table missed (gap_roles.js, Gemini; every one carries a verified reference quote)
  for (const y of [].concat(((GAPR[n] || {}).roles || []), repairOn(n) ? (REPR[n].roles || []) : [], ((HANDR[n] || {}).roles || []).map(y => ({ ...y, hand: true })))) {
    const old = y.replaces && roles.find(x => opK(x.word) === opK(y.replaces));
    if (old) { old.render = y.render; if (y.role) old.role = y.role; if (y.pb && !old.pb.includes(y.pb)) old.pb.push(y.pb); old.gapFix = { ref: y.ref, quote: y.quote }; if (y.hand) { old.ref = y.ref; old.quote = y.quote; old.verified = true; old.why = 'vyakhyana'; old.hand = true; } continue; }
    if (roles.some(x => opK(x.render) === opK(y.render))) continue;
    roles.push({ word: y.word, source: y.source || 'supplied:references', role: y.role, render: y.render, why: y.why || 'vyakhyana', ref: y.ref, quote: y.quote, verified: true, pb: y.pb ? [y.pb] : [], gapAdded: !y.hand, hand: !!y.hand,
      pre: s.kind === 'nipatana' && /^(prakriti|pratyaya|sthani|adesha|agama|purva|upapada|other)$/.test(y.role) }); }
  // 1.1.67 (gap work 2026-11-17): a 5th-case base that a reference follows with “परस्य / उत्तरस्य” (KV 3.1.66 “धातोः परस्य च्लेः”) — the
  // vṛtti says it too; and a phrase that already says “X-5th उत्तरस्य” (8.3.57 इण्-कवर्गाभ्याम् उत्तरस्य) credits 1.1.67
  { const rawRefs = Object.values(refsOf(r)).join(' ¦ '), esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const said67 = roles.some(x => /(उत्तरस्य|परस्य)(\s|$)/.test(x.render || '')); let added = 0;
    for (const x of roles) { if (!x.render || /^(nipatana|negation|option|samjna|samjni)$/.test(x.role)) continue;
      if (/(ात्|ाद्|भ्याम्|भ्यः|ोः|ेः|तः)\s+(उत्तरस्य|परस्य)(\s|$)/.test(x.render)) { if (!x.pb.includes('1.1.67')) x.pb.push('1.1.67'); continue; }
      if (said67 || added || !/^(prakriti|purva)$/.test(x.role) || /पर|उत्तर/.test(x.render)) continue;   // once, on the head base only
      const toks = String(x.render).split(/\s+/), tk = toks[toks.length - 1]; if (!/(ात्|ाद्|भ्याम्|भ्यः|ोः|ेः)$/.test(tk) || tk.length < 3) continue;
      const m = rawRefs.match(new RegExp('(?:^|[\\s,(])' + esc(tk) + '\\s+(उत्तरस्य|परस्य)(?![ऀ-ॿ])'));
      if (m) { x.render += ' ' + m[1]; if (!x.pb.includes('1.1.67')) x.pb.push('1.1.67'); x.added67 = true; added++; } } }
  const own = (r.words || []).filter(w => !PART.test(w.form));
  const cov = own.filter(w => roles.some(x => norm(x.word).replace(/\s/g, '') === norm(w.form).replace(/\s/g, '') || norm(x.word).includes(norm(w.form)) || norm(w.form).includes(norm(x.word)) && norm(x.word).length > 1));
  // adhikāra-implied items the references always voice but the table may leave implicit: the samartha in 4.1.83–5.2.140 (4.1.82
  // समर्थानां प्रथमाद्वा: “X-समर्थात्”), the aṅga in 6.4.1–7.4.97 (अङ्गस्य, 1.4.13)
  const id5 = +n.split('.').map((x, i) => i ? String(x).padStart(i === 2 ? 3 : 1, '0') : x).join('');
  const allR = roles.map(x => x.render || '').join(' ');
  if (s.kind === 'vidhi-pratyaya' && id5 >= 41083 && id5 <= 52140 && !/समर्थ/.test(allR) && !roles.some(x => x.role === 'samartha')) {
    const pr = (r.carried || []).map(c => c.w).concat((r.words || []).map(w => w.form)), C = { 'तस्य': 'षष्ठी', 'तेन': 'तृतीया', 'तत्र': 'सप्तमी', 'तस्मै': 'चतुर्थी', 'तस्मात्': 'पञ्चमी', 'ततः': 'पञ्चमी', 'तत्': 'प्रथमा', 'तम्': 'द्वितीया' };
    const c = pr.map(w => C[w]).filter(Boolean).pop();
    roles.push({ word: c ? pr.find(w => C[w] === c) : 'समर्थानाम्', source: 'carried:4.1.82', role: 'samartha', render: (c ? c : '') + 'समर्थात्', why: 'carried', ref: '', quote: '', verified: false, pb: ['4.1.82'] }); }
  if (/^(adesha|agama)$/.test(s.kind) && id5 >= 64001 && id5 <= 74097 && !/(अङ्गस्य|अङ्गात्)/.test(allR))
    roles.push({ word: 'अङ्गस्य', source: 'carried:6.4.1', role: 'sthani', render: 'अङ्गस्य', why: 'carried', ref: '', quote: '', verified: false, pb: ['1.4.13'] });
  const kindH = (HANDR[n] || {}).kind || s.kind;   // a hand entry may correct the rule kind (6.3.75 is prakṛtibhāva, not a nipātana)
  return { n, s: r.s, kind: kindH, oldKind: r.kind, old: r.genC, neu: render({ ...s, kind: kindH, roles }), roles, note: s.note || '', handNote: (HANDR[n] || {}).note || '', yathasankhya: !!s.yathasankhya,
    uncovered: own.filter(w => !cov.includes(w)).map(w => w.form), ownCount: own.length, refs: refsOf(r) };
}
module.exports = { prep, render, pbOf, repairOn };
if (!CLI) return;
const out = {}; const stat = { sutras: 0, roles: 0, quoted: 0, verified: 0, ownWords: 0, covered: 0, why: {} };
for (const n of SET) { const s = T[n], r = R[n]; if (!s || !r) continue; stat.sutras++; const d = out[n] = prep(n, s, r);
  for (const x of d.roles) { stat.roles++; if (x.quote) stat.quoted++; if (x.verified) stat.verified++; stat.why[x.why] = (stat.why[x.why] || 0) + 1; }
  stat.ownWords += d.ownCount; stat.covered += d.ownCount - d.uncovered.length; }
fs.writeFileSync(path.join(__dirname, 'rendered.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify({ ...stat, verifiedPct: +(100 * stat.verified / stat.roles).toFixed(1), coveredPct: +(100 * stat.covered / stat.ownWords).toFixed(1) }));
for (const n of process.argv.slice(2)) if (out[n]) console.log(`\n${n} ${out[n].s} [${out[n].kind}]\n OLD: ${out[n].old}\n NEW: ${out[n].neu}\n ${out[n].roles.map(x => `${x.word}→${x.role}${x.pb.length ? '(' + x.pb.join(',') + ')' : ''}${x.verified ? '' : '✗q'}`).join(' · ')}`);
