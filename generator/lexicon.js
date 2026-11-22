#!/usr/bin/env node
// Automatic word analysis for every word of every sūtra: stem + kind, from the vendored ashtadhyayi.com data.
// kinds: pratyahara · sound · suffix · dhatu · term (a defined saṃjñā) · indecl · nominal (ordinary word) · op (operation word)
// Usage: node work/vrtti-gen/lexicon.js   → work/vrtti-gen/lexicon.json + a coverage report on stdout
'use strict';
const fs = require('fs'), path = require('path');
const AD = process.env.ASHTADHYAYI_DATA || path.join(process.env.HOME, 'Projects/ashtadhyayi-data');
const J = p => JSON.parse(fs.readFileSync(path.join(AD, p), 'utf8'));
const SUTRAS = J('sutraani/data.txt').data;
const KASH = J('sutraani/kashika.txt');

const VIR = '्', MATRAS = 'ािीुूृॄॢेैोौ';
const VOW = 'अआइईउऊऋॠऌएऐओऔ';

// ── sources ───────────────────────────────────────────────────────────────────────────────────────────
const PRATD = J('pratyahara/data.txt').data;
const PRAT = new Set(PRATD.map(p => p.name));
// sound pratyāhāras (lists of sounds) vs others such as कृञ् (कृ, भू, अस्) in 3.1.40
const PRAT_SOUND = new Set(PRATD.filter(p => (p.list || '').split(',').every(x => x.trim().length <= 2)).map(p => p.name));
const KRUT = new Set(J('krut/pratyay.txt').data.map(p => p.pratyay));
const DH = (() => { const d = J('dhatu/data.txt'); return d.data || d; })();
const ROOT = new Map();                 // stem → dhātu (incl. aupadeśika form, इक् citation, श्तिप् citation)
const KF = JSON.parse(fs.readFileSync(path.join(AD, 'dhatu/dhatuforms_vidyut_shuddha_kartari.txt'), 'utf8'));
for (const d of DH) {
  const r = d.dhatu, up = d.aupadeshik;
  const add = (k, why) => { if (k && !ROOT.has(k)) ROOT.set(k, { root: r, why }); };
  add(r, 'dhātu'); add(up, 'aupadeśika');
  const up2 = up.replace(/ँ/g, '').replace(/^(डु|टु|ञि)/, ''); add(up2, 'aupadeśika, markers trimmed');
  if (/[ेैो]$/.test(r)) add(r.slice(0, -1) + 'ा', 'ā-form (6.1.45)');
  if (/[ेैो]्?$/.test(up2.replace(/[ञङ्]+$/, '')) && /ञ्$|ङ्$/.test(up2)) add(up2.replace(/[ेैो]([ञङ]्)$/, 'ा$1'), 'ā-form with marker');
  add(r.endsWith(VIR) ? r.slice(0, -1) + 'ि' : r + 'इ'.replace('इ', ''), 'इक्');           // इक्: वद् → वदि
  if (r.endsWith(VIR)) add(r.slice(0, -1) + 'ि', 'इक्');
  const f = KF[d.baseindex]; if (f) { const lat = (f.plat || f.alat || '').split(';')[0].split(',')[0]; if (lat) add(lat.trim(), 'श्तिप्'); }
}
const SH = J('shabda/data2.txt').data;
const NOMSTEM = new Set(SH.map(d => d.word));
const NOMFORM = new Map();              // form → [{stem, case, num}]
for (const d of SH) (d.forms || '').split(';').forEach((cell, i) => cell.split(',').forEach(x => { x = x.trim(); if (!x) return; if (!NOMFORM.has(x)) NOMFORM.set(x, []); NOMFORM.get(x).push({ stem: d.word, case: Math.floor(i / 3) + 1, num: i % 3 + 1 }); }));
const KOSHA = new Set();   // dictionary headwords (Apte 1890, Wilson) — ordinary words
for (const f of ['kosha/ap90.json', 'kosha/wil.json']) { try { Object.keys(J(f).data.words).forEach(w => KOSHA.add(w)); } catch (e) { } }
const TERMS = new Set();
for (const s of SUTRAS) for (const t of s.type.split('##')) if (t.startsWith('S$')) TERMS.add(t.split('$')[1].replace(/संज्ञा$/, '').trim());
// suffixes attested as such in the Kāśikā ("X प्रत्ययो भवति", "Xप्रत्ययः", "X इत्ययं प्रत्ययः")
const KSUF = new Set(KRUT);
for (const t of Object.values(KASH)) for (const m of t.matchAll(/([^\s,।॥(<>\[\]—]+?)\s?प्रत्यय(?:ो|ाः|ः|ौ|ं|म्|स्य)/g)) { let x = m[1].replace(/[ऽ']/g, ''); x = x.replace(/द्$/, 'त्').replace(/ग्$/, 'क्').replace(/ड्$/, 'ट्').replace(/ब्$/, 'प्').replace(/ज्$/, 'च्'); x = x.replace(/ः$/, ''); if (x.length >= 1 && x.length <= 8) KSUF.add(x); }
// keep a Kāśikā-named "suffix" only if the sūtras themselves use it as a 1st-case word in the suffix sections (3.1–5.4)
{ const S1 = new Set();
  for (const sx of SUTRAS) { if (+sx.i < 31001 || +sx.i > 54160) continue;
    for (const w of sx.pc.split('##').filter(Boolean)) { const [f, , c] = w.split('$'); if (+c !== 1) continue;
      for (const g of f.split('-')) { S1.add(g); S1.add(g.replace(/(ः|ौ|ाः|म्)$/, '')); S1.add(g.replace(/ः$/, '्')); S1.add(g.replace(/ौ$/, '्')); } }
  }
  for (const x of [...KSUF]) if (!KRUT.has(x) && !S1.has(x) && !S1.has(x.replace(/्$/, ''))) KSUF.delete(x); }
// suffix lists the Kāśikā names together (“द्वयसच् दघ्नच् मात्रच् इत्येते प्रत्ययाः”): a 1st-case sūtra word in 3.1–5.4 that ends in a
// marker consonant and that the sūtra's own Kāśikā also writes
for (const sx of SUTRAS) { if (+sx.i < 31001 || +sx.i > 54160) continue; const k = (KASH[sx.i] || '').replace(/\s+/g, ' ');
  if (!/प्रत्यय/.test(k)) continue;
  for (const w of sx.pc.split('##').filter(Boolean)) { const [f, , c] = w.split('$'); if (+c !== 1) continue;
    for (const g0 of f.split('-')) { const g = g0.replace(/ः$/, '्').replace(/ौ$/, '्'); if (/[क-ह]्$/.test(g) && g.length <= 8 && !/^(प्रत्यय्|शब्द्|अर्थ्|समास्|विकार्|अवयव्|भाव्|संघ्)$/.test(g) && g.length >= 3 && new RegExp('(^|[\\s,(])' + g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=[\\s,।॥)]|प्रत्यय|$)').test(k)) KSUF.add(g); } } }
// a 1st-case compound of suffix names the Kāśikā writes as one sandhi-joined word before प्रत्ययौ / प्रत्ययाः (ईरन्नीरचौ प्रत्ययौ)
for (const sx of SUTRAS) { if (+sx.i < 31001 || +sx.i > 54160) continue; const k = (KASH[sx.i] || '').replace(/\s+/g, ' ');
  for (const w of sx.pc.split('##').filter(Boolean)) { const [f, , c] = w.split('$'); if (+c !== 1) continue; const segs = f.split('-'); if (segs.length < 2) continue;
    const lastCore = segs[segs.length - 1].replace(/(ौ|ाः)$/, '').replace(/^[अआइईउऊऋएऐओऔ]/, '');   // in the joined word its first vowel is a mātrā (ईरन्नीरचौ)
    if (lastCore.length >= 2 && new RegExp(lastCore.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(ौ|ाः|ः)? प्रत्यय(ौ|ाः)').test(k))
      segs.forEach((g, i) => { const m = i === segs.length - 1 ? g.replace(/(ौ|ाः)$/, '्') : g; if (/[क-ह]्$/.test(m) || i < segs.length - 1) KSUF.add(m); }); } }
// suffix names without their final marker (णिच् → णि, मतुप् → मतु, क्त्वा stays) — "marker dropped"
const SUFBASE = new Map();
for (const x of [...KSUF]) if (/[क-ह]्$/.test(x) && x.length > 2) { const b = x.slice(0, -2); if (b && !KSUF.has(b)) SUFBASE.set(b, x); }
const SUPTIN = new Set('हि मि सि ति न्ति णल् अतुस् उस् थल् अथुस् व म ए वहे महे से ध्वे सु औ जस् अम् औट् शस् टा भ्याम् भिस् ङे भ्यस् ङसि ङस् ओस् आम् ङि सुप् तिप् तस् झि सिप् थस् थ मिप् वस् मस् त आताम् झ थास् आथाम् ध्वम् इट् वहि महिङ् तिङ्'.split(' '));
const LAKARA = new Set('लट् लिट् लुट् लृट् लेट् लोट् लङ् लिङ् लुङ् लृङ् ल'.split(' '));
const AGAMA = new Set('नुट् नुम् आट् अट् षुक् इयङ् उवङ् इट् मुक् पुक् युक् तुक् कुक् ठुक् धुट् सुट् यासुट् सीयुट् सुक् नुक् रुक् रुट् आगम'.split(' '));
const VIKARANA = new Set('शप् श्यन् श्नु श श्नम् उ श्ना यक् चङ् सिच् च्लि क्स चिण् स्य तासि तास् सन् णिच् णिङ् यङ् क्यच् काम्यच् क्यङ् क्यष् णिच्'.split(' '));
const ACHARYA = new Set('शाकल्य शाकटायन गार्ग्य गालव काश्यप आपिशलि चाक्रवर्मण भारद्वाज सेनक स्फोटायन'.split(' '));
const INDECL = new Set('नञ् सुञ् च वा न विभाषा अन्यतरस्याम् बहुलम् इति उभयथा तत्र अपि एव सह विना प्राक् आ आङ् यथा तथा पूर्वम् नित्यम् सर्वत्र अत्र इतरथा ऊर्ध्वम् प्रभृति अन्यत्र क्वचित् अपवादः असिद्धवत् प्रतिषेधः अनन्तरम् पुनः असकृत् उदात्तवत् तद्वत् स्थानिवत् पुंवत् अधः स्वरितवत् अन्तः मध्ये सम् उत् परि प्र नि वि अव उप अनु अभि अधि प्रति सु दुर् निर्'.split(' '));
const PRON = new Map(); // pronoun forms → stem
[['तद्', 'तत् तस्मात् तस्य तस्मिन् तेन तस्मै तस्याः तस्याम् तेषाम् तेषु तैः तानि तत् ते तौ'], ['यद्', 'यत् यस्मात् यस्य यस्मिन् येन यस्मै यस्याः यस्याम् येषाम् येषु ये यौ'], ['इदम्', 'इदम् अस्मात् अस्य अस्मिन् अनेन'], ['एतद्', 'एतत् एतस्मात् एतस्य एतस्मिन्'], ['किम्', 'किम् कस्मात् कस्य कस्मिन्'], ['सर्व', 'सर्वस्य सर्वस्मिन्'], ['अन्य', 'अन्यस्मिन् अन्यस्य अन्यत्']].forEach(([st, fs]) => fs.split(' ').forEach(f => PRON.set(f, st)));
const CASENAMES = new Set(['प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी', 'विभक्ति', 'सम्बोधन']);
const UPASARGA = new Set(['प्र', 'परा', 'अप', 'सम्', 'अनु', 'अव', 'निस्', 'निर्', 'दुस्', 'दुर्', 'वि', 'आङ्', 'आ', 'नि', 'अधि', 'अपि', 'अति', 'सु', 'उत्', 'उद्', 'अभि', 'प्रति', 'परि', 'उप']);
const UPAS7 = { 'प्रे': 'प्र', 'समि': 'सम्', 'आङि': 'आङ्', 'उदि': 'उद्', 'परौ': 'परि', 'अनौ': 'अनु', 'अवे': 'अव', 'उपे': 'उप', 'नौ': 'नि', 'वौ': 'वि', 'अपे': 'अप', 'अधौ': 'अधि', 'अभौ': 'अभि', 'अतौ': 'अति', 'निसि': 'निस्', 'दुरि': 'दुर्' };
const OPS = new Set('लोपः लुक् श्लुः लुप् गुणः वृद्धिः दीर्घः ह्रस्वः प्लुतः सम्प्रसारणम् संप्रसारणम् द्वे णत्वम् षत्वम् आदेशः आगमः'.split(' '));

// ── sound names: अत् आत् इत् … (तपर), कु चु टु तु पु (उदित्), single vowels, X-कार ─────────────────────────
const SOUND = new Set();
for (const v of VOW) { SOUND.add(v); SOUND.add(v + 'त्'); }
for (const c of 'कचटतप') SOUND.add(c + 'ु');
for (const c of 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह') { SOUND.add(c + 'कार'); SOUND.add(c + VIR); }

// ── de-inflection: candidate stems for a form with a known case·number ──────────────────────────────────
function stemsFor(form, cs, nm) {
  const out = new Set([form]);
  const cut = (end, rep) => { if (form.endsWith(end)) out.add(form.slice(0, form.length - end.length) + rep); };
  // consonant stems (अच्, हल्, यत्, ठक्, वद् …)
  if (cs === 1 || cs === 2) cut('ौ', VIR);
  [['ः', VIR], ['ि', VIR], ['ोः', VIR], ['ा', VIR], ['े', VIR], ['ाम्', VIR], ['ां', VIR], ['सु', VIR], ['भ्यः', VIR], ['भ्याम्', VIR], ['सि', VIR]].forEach(([e, r]) => cut(e, r));
  // i / u stems (पोः ← पु, एः ← इ, कोः ← कु, मृजेः ← मृजि, ग्रहेः ← ग्रहि, अस्तेः ← अस्ति)
  cut('ोः', 'ु'); cut('ोः', 'ा'); cut('ेः', 'ि'); if (form === 'एः') out.add('इ'); if (form === 'ओः') out.add('उ');
  cut('ौ', 'ि'); cut('ौ', 'ु'); cut('यः', 'ि'); cut('वः', 'ु'); cut('ीनाम्', 'ि'); cut('ूनाम्', 'ु'); cut('िषु', 'ि'); cut('ुषु', 'ु');
  // a stems
  [['ात्', ''], ['स्य', ''], ['े', ''], ['ः', ''], ['म्', ''], ['ं', ''], ['ाभ्याम्', ''], ['ेभ्यः', ''], ['ाणाम्', ''], ['ानाम्', ''], ['ेषु', ''], ['योः', ''], ['ाः', ''], ['ौ', ''], ['ाय', ''], ['ेन', '']].forEach(([e, r]) => cut(e, r));
  // ā stems
  [['ायाः', 'ा'], ['ायाम्', 'ा'], ['ाभ्यः', 'ा'], ['ासु', 'ा'], ['ाः', 'ा'], ['े', 'ा']].forEach(([e, r]) => cut(e, r));
  // ṛ stems (कर्तरि ← कर्तृ), nouns in -न् (कर्मणि ← कर्मन्, राज्ञः), -अत् participles
  cut('ः', 'ा'); cut('ुवः', 'ु'); cut('ुवः', 'ू'); cut('ियः', 'ि'); cut('ियः', 'ी'); cut('ः', 'े'); cut('ात्', 'ा'); cut('ाः', 'ा'); cut('ङः', 'ङ्'); cut('ङि', 'ङ्'); cut('दः', 'द्'); cut('ेः', 'ि'); cut('ात्', ''); cut('ीनि', 'ि'); cut('ीन्', 'ि');
  cut('्याः', 'ी'); cut('्या', 'ी'); cut('्योः', 'ी'); cut('्याम्', 'ी'); cut('म्नः', 'मन्'); cut('म्ना', 'मन्'); if (form === 'अहः') out.add('अहन्');
  cut('रि', 'ृ'); cut('ुः', 'ृ'); cut('णि', 'न्'); cut('नि', 'न्'); cut('णः', 'न्'); cut('नः', 'न्'); cut('तः', 'त्'); cut('ति', 'त्');
  return [...out].filter(Boolean);
}

function classify(seg, cs, nm, ctx) {
  // ctx: { last: is this the inflected member?, inPratyaya, inDhatu, inAnga }
  if (INDECL.has(seg)) return { kind: 'indecl', stem: seg, src: 'indeclinable' };
  if (cs === 7 && UPAS7[seg]) return { kind: 'upasarga', stem: UPAS7[seg], src: 'upasarga in the 7th (= preceded by it)' };
  if (seg === 'अ' && ctx.compound && !ctx.last) return { kind: 'indecl', stem: 'नञ्', src: 'negative particle (नञ्) as a compound member' };
  if (cs === 0 && !ctx.compound && /(त्र|था|दा|र्हि|तस्|शस्|वत्|धा|कृत्वस्)$/.test(seg)) return { kind: 'indecl', stem: seg, src: 'indeclinable (adverbial ending)' };
  if (cs === 0 && !ctx.compound && !ctx.inList) return seg.length > 4 ? { kind: 'form', stem: seg, src: 'no case ending in the data — a form quoted as is' } : { kind: 'indecl', stem: seg, src: 'indeclinable (no case ending)' };
  if (OPS.has(seg)) return { kind: 'op', stem: seg.replace(/ः$/, ''), src: 'operation word' };
  const cands = ctx.last ? stemsFor(seg, cs, nm) : [seg, seg + VIR];
  const hits = [];
  for (const c of cands) {
    if (PRAT.has(c)) hits.push({ kind: 'pratyahara', stem: c, src: 'pratyāhāra list' + (PRAT_SOUND.has(c) ? '' : ' (not a sound group)'), nonSound: !PRAT_SOUND.has(c) });
    if (SOUND.has(c)) hits.push({ kind: 'sound', stem: c, src: 'sound name' });
    if (KSUF.has(c)) hits.push({ kind: 'suffix', stem: c, src: KRUT.has(c) ? 'kṛt list' : 'suffix named in the Kāśikā' });
    if (ROOT.has(c)) hits.push({ kind: 'dhatu', stem: c, root: ROOT.get(c).root, src: 'dhātupāṭha (' + ROOT.get(c).why + ')' });
    if (TERMS.has(c)) hits.push({ kind: 'term', stem: c, src: 'defined term' });
  }
  for (const c of cands) {
    if (PRON.has(seg)) { hits.push({ kind: 'pronoun', stem: PRON.get(seg), src: 'pronoun' }); break; }
    if (CASENAMES.has(c)) hits.push({ kind: 'term', stem: c, src: 'case name' });
    if (UPASARGA.has(c)) hits.push({ kind: 'upasarga', stem: c, src: 'upasarga' });
    if (SUPTIN.has(c)) hits.push({ kind: 'suffix', stem: c, src: 'sup/tiṅ ending' });
    if (AGAMA.has(c)) hits.push({ kind: 'agama', stem: c, src: 'augment name' });
    if (VIKARANA.has(c)) hits.push({ kind: 'suffix', stem: c, src: 'vikaraṇa / sanādi suffix' });
    if (LAKARA.has(c)) hits.push({ kind: 'term', stem: c, src: 'lakāra' });
    if (SUFBASE.has(c)) hits.push({ kind: 'suffix', stem: SUFBASE.get(c), src: 'suffix named without its final marker (' + c + ')' });
    if (ACHARYA.has(c)) hits.push({ kind: 'acharya', stem: c, src: 'a teacher named in the sūtra (= optionally)' });
    if (/(ि|इ)त्$/.test(c) && c.length <= 6 && c !== 'इत्') hits.push({ kind: 'term', stem: c.replace(/इत$/, 'इत्'), src: 'marker property (X-इत्)' });
    // compounds ending in a sound group / आदि / a defined term: एकाच्, द्व्यच्, हलादि, उपधा, उत्तरपद
    const isForm = ctx.last && cs > 0 && c === seg;      // an inflected form is not a compound stem
    const segKnown = KOSHA.has(seg) || NOMSTEM.has(seg) || (ctx.last && NOMFORM.has(seg));
    if (!isForm && !segKnown && !KOSHA.has(c) && !NOMSTEM.has(c)) for (const p of PRAT) if (/्$/.test(p) && p.length >= 3 && p !== 'अम्' && c.length > p.length && (c.endsWith(p.replace(/्$/, '')) || (p[0] === 'अ' && ['ा', 'य', 'व'].some(m => c.endsWith(m + p.slice(1)))))) { hits.push({ kind: 'compound', stem: c, head: p, src: 'compound ending in the sound group ' + p }); break; }
    if (/आदि$|ादि$/.test(c) && c.length > 3) hits.push({ kind: 'compound', stem: c, head: 'आदि', src: 'X-आदि compound' });
    for (const t of ['उपधा', 'पद', 'उत्तरपद', 'पूर्वपद', 'अङ्ग', 'धातु', 'प्रत्यय', 'अन्त्य', 'अभ्यास', 'पदान्त', 'अन्त']) if (c === t || (c.length > t.length + 1 && c.endsWith(t))) { hits.push({ kind: c === t ? 'term' : 'compound', stem: c, head: t, src: c === t ? 'term' : 'compound ending in ' + t }); break; }
  }
  const nf = ctx.last && NOMFORM.get(seg);
  if (nf) { const m = nf.find(x => x.case === cs && x.num === nm) || nf[0]; hits.push({ kind: 'nominal', stem: m.stem, src: 'declension tables' + (m.case === cs ? '' : ' (case differs)') }); }
  for (const c of cands) if (NOMSTEM.has(c)) hits.push({ kind: 'nominal', stem: c, src: 'declension tables (stem)' });
  if (!hits.some(h => h.kind === 'nominal')) for (const c of cands) if (KOSHA.has(c) && c.length > 1) { hits.push({ kind: 'nominal', stem: c, src: 'dictionary headword' }); break; }
  // negation: अ- / अन्- + a classifiable word
  if (!hits.length && /^अन?/.test(seg) && seg.length > 3 && !ctx.neg) {
    const rest = seg.startsWith('अन') && VOW.includes(seg[2]) ? seg.slice(2) : seg.slice(1);
    const r = classify(rest, cs, nm, Object.assign({}, ctx, { neg: true }));
    if (r) return Object.assign({}, r, { kind: r.kind, neg: true, stem: 'अ-' + r.stem, src: 'negated: ' + r.src });
  }

  if (!hits.length && ctx.last && (cs === 5 || cs === 6) && (ctx.inDhatu || ctx.inAnga)) {
    for (const c of cands) {
      const parts = splitRoots(c);
      if (parts) return { kind: 'dhatu', stem: c, root: parts.map(x => ROOT.get(x).root).join(','), parts, src: 'list of dhātus (split: ' + parts.join(' + ') + ')' };
    }
  }
  if (!hits.length) return null;
  // context preference
  const pref0 = cs === 1 && ctx.inPratyaya ? ['suffix', 'pratyahara', 'sound', 'term', 'op', 'dhatu', 'nominal']
    : (cs === 5 || cs === 6) && (ctx.inDhatu || ctx.inAnga) ? ['pratyahara', 'sound', 'term', 'dhatu', 'suffix', 'nominal']
      : cs === 7 ? ['pratyahara', 'sound', 'suffix', 'term', 'dhatu', 'nominal']
        : ['pratyahara', 'sound', 'term', 'suffix', 'dhatu', 'nominal'];
  const pref = ['pronoun', 'upasarga', 'acharya', 'agama', ...pref0.slice(0, -1), 'compound', 'nominal'];
  const dhatuSec = ctx.inDhatu || ctx.inAnga || ctx.inPada;
  const rank = h => {
    let r = pref.indexOf(h.kind);
    if (h.kind === 'dhatu' && !dhatuSec && hits.some(x => x.kind === 'nominal')) r += 20;   // असि (sword) ≠ अस्+इक्; काल ≠ कल्
    if (h.kind === 'suffix' && /without its final marker/.test(h.src) && (KOSHA.has(h.stem.slice(0, -2)) || NOMSTEM.has(h.stem.slice(0, -2)))) r += 20; // बहु ≠ बहुच्
    if (h.kind === 'upasarga' && cs === 7 && !/7th/.test(h.src)) r += 20;
    if (h.kind === 'pratyahara' && h.nonSound && hits.some(x => x.kind === 'dhatu')) r += 20;   // कृञः = the dhātu कृ
    if (h.kind === 'suffix' && /named in the Kāśikā/.test(h.src) && cs === 7 && hits.some(x => x.kind === 'nominal')) r += 20;   // भावे = meaning, not a suffix
    if (cs === 7 && /ौ$/.test(seg) && h.kind === 'suffix' && !/ु$/.test(h.stem) && hits.some(x => x.kind === 'suffix' && /ु$/.test(x.stem))) r += 5;   // सौ = सु                                                                 // सौ = सु ending
    if (h.kind === 'sound' && cs === 1 && ctx.inPratyaya && hits.some(x => x.kind === 'suffix')) r += 20;            // कः = क suffix
    if (h.kind === 'dhatu' && h.stem.length <= 2 && hits.some(x => x.kind === 'suffix')) r += 20;                   // हेः = हि ending
    return r;
  };
  hits.sort((a, b) => rank(a) - rank(b));
  // a short stem matching only as a dhātu or nominal by accident is weak: mark it
  const best = Object.assign({}, hits[0]);
  best.alts = [...new Set(hits.slice(1).map(h => h.kind + ':' + h.stem))].slice(0, 4);
  if ((best.kind === 'nominal' || best.kind === 'dhatu') && best.stem.length <= 2) best.weak = true;
  return best;
}

function splitRoots(str) {      // exact segmentation into ≥2 known root forms, shortest pieces first
  const memo = new Map();
  const go = i => { if (i === str.length) return []; if (memo.has(i)) return memo.get(i); let best = null;
    for (let j = i + 1; j <= str.length; j++) { const piece = str.slice(i, j); if (piece.length < 2 && !/[ािीुूृेैोौ]/.test(piece)) continue;
      if (ROOT.has(piece)) { const rest = go(j); if (rest) { best = [piece, ...rest]; break; } } }
    memo.set(i, best); return best; };
  const r = go(0); return r && r.length >= 2 && r.every(x => x.length >= 2) ? r : null;
}
const inRange = (id, a, b) => +id >= a && +id <= b;
const LEX = {}, PER = [];
let tok = 0, ok = 0;
const byKind = {}, miss = {};
for (const s of SUTRAS) {
  const ctx0 = { inPratyaya: inRange(s.i, 31001, 54160), inDhatu: inRange(s.i, 31091, 34117) || inRange(s.i, 31001, 31090) || inRange(s.i, 24035, 24057), inAnga: inRange(s.i, 64001, 74097), inPada: inRange(s.i, 13001, 13093) };
  LEX[s.i] = [];
  for (const w of s.pc.split('##').filter(Boolean)) {
    const wres = []; LEX[s.i].push(wres);
    const [form, , c, n] = w.split('$'); const cs = +c || 0, nm = +n || 0;
    const segs = form.split('-');
    segs.forEach((seg, i) => {
      const last = i === segs.length - 1;
      let r = classify(seg, last ? cs : 0, last ? nm : 0, Object.assign({ last, compound: segs.length > 1 }, ctx0));
      // a visarga lost to sandhi (सुप आत्मनः, दीर्घ इकः): retry with it restored
      if (!r && last && /[क-ह]$/.test(seg)) { const r2 = classify(seg + 'ः', cs, nm, Object.assign({ last, compound: segs.length > 1 }, ctx0)); if (r2) r = Object.assign({ sandhiVisarga: true }, r2); }
      tok++;
      wres.push(r ? Object.assign({ seg }, r) : { seg, kind: null });
      if (r) { ok++; byKind[r.kind] = (byKind[r.kind] || 0) + 1; }
      else { miss[seg] = (miss[seg] || 0) + 1; }
      PER.push({ id: s.i, seg, last, cs, nm, r: r ? r.kind : null });
    });
  }
}
fs.writeFileSync(path.join(__dirname, 'lexicon.json'), JSON.stringify(LEX));
const distinct = Object.keys(miss).length;
console.log(`word pieces: ${tok} · classified: ${ok} (${(ok * 100 / tok).toFixed(1)}%) · unclassified: ${tok - ok} (${distinct} distinct)`);
console.log('by kind:', byKind);
const top = Object.entries(miss).sort((a, b) => b[1] - a[1]);
console.log('top unclassified:', top.slice(0, 60).map(([k, v]) => k + '×' + v).join(' '));
// per-sūtra: how many sūtras have every word classified
const sut = {}; PER.forEach(p => { sut[p.id] = sut[p.id] || [0, 0]; sut[p.id][0]++; if (p.r) sut[p.id][1]++; });
const full = Object.values(sut).filter(([a, b]) => a === b).length;
console.log(`sūtras with every word classified: ${full} / ${Object.keys(sut).length}`);
