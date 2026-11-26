#!/usr/bin/env node
// vṛtti generator pilot — reconstruct a sūtra's vṛtti from its words + anuvṛtti/adhikāra + paribhāṣās,
// and show which paribhāṣā-sūtras apply (layer 2 = fired by the sūtra's own wording; layer 1 = a commentator
// names it at that sūtra, with the quote). Reads the vendored ashtadhyayi.com data read-only.
// Usage: node work/vrtti-gen/build.js [--from 31091 --to 31132]   → work/vrtti-gen/vrtti.html
'use strict';
const fs = require('fs'), path = require('path');
const AD = process.env.ASHTADHYAYI_DATA || path.join(process.env.HOME, 'Projects/ashtadhyayi-data');
try { fs.unlinkSync(path.join(__dirname, 'data', '.build-ok')); } catch (e) {}   // a crash leaves no stamp
const J = p => JSON.parse(fs.readFileSync(path.join(AD, p), 'utf8'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const FROM = +arg('--from', '31091'), TO = +arg('--to', '31132');
// class-notes test set (classes 51–61): sūtras glossed or explained in the notes, plus the paribhāṣā/saṃjñā cards they rely on
const EXTRA_IDS = new Set(('33056 41095 41006 34077 34078 34080 31067 31068 11005 73084 14013 11003 64118 73101 11052 11053 11054 11055 ' +
  '24052 72035 34113 34114 34115 34116 31032 31033 12004 14010 14011 14012 73086 11065 72082 34079 11068 11069 11070 11071 ' +
  '72114 72115 72116 72117 72118 64051 11056 11060 11061 11062 11063 11046 11047 11049 11050 11051 11064 11066 11067 11072').split(' '));
const SAMJNA_GEN = new Set(['14013', '34113', '34114', '34115', '34116', '31032', '14010', '14011', '14012']);

const SUTRAS = J('sutraani/data.txt').data;
// Gemini पद splits of the reference texts (tools/padsplit.js), only those that rejoin to the printed word
const PADSPLIT = (() => { const f = path.join(__dirname, 'padsplit.json'); if (!fs.existsSync(f)) return {}; const d = JSON.parse(fs.readFileSync(f, 'utf8')); for (const o of Object.values(d)) for (const k of Object.keys(o)) o[k] = Object.fromEntries(o[k].filter(r => r.length === 2 && r[0] !== r[1])); return d; })();
// the prathamāvṛtti's printed number with OCR digit misreads fixed by sequence (tools/pvnum.js)
const PVNUM = (() => { const f = path.join(__dirname, 'prathama-printed.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; })();
const ARB = (() => { const f = path.join(__dirname, 'prathama-arb.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; })();
const HANDALL = (() => { const h = JSON.parse(fs.readFileSync(path.join(__dirname, 'handwritten.json'), 'utf8')); delete h._about; return h; })();
// two kinds of hand entry: a FULL one (definitional sūtras: vṛtti + every step by hand) and a FIX ("keep": true — 2026-11-18, the fix-list
// sūtras that say two things, e.g. “X does not happen, but Y does”: the role table builds one clause, so only the final vṛtti is written by
// hand; the engine's paribhāṣā steps and the student cards stay, minus any the review showed wrong ("drop"), plus any "steps" given)
const HAND = Object.fromEntries(Object.entries(HANDALL).filter(([, v]) => !v.keep)), HANDFIX = Object.fromEntries(Object.entries(HANDALL).filter(([, v]) => v.keep));
// dhātupāṭha + present-tense forms (for the श्तिप् name of a dhātu)
const ESC1 = x => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PV0 = fs.existsSync(path.join(__dirname, 'prathama.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'prathama.json'), 'utf8')) : {};   // for the dhātu tie-break (loaded early)
const DHATU = (() => { const d = J('dhatu/data.txt'); return d.data || d; })();
const DFORM = J('dhatu/dhatuforms_vidyut_shuddha_kartari.txt');
const PLIST = Object.fromEntries(J('pratyahara/data.txt').data.map(p => [p.name, p.list.split(',').length]));
// corrections to the ashtadhyayi.com anuvṛtti lists, with evidence (ashtadhyayi-errata.json → ASHTADHYAYI-COM-ERRATA.md for the maintainers)
const ERRATA = (() => { const f = path.join(__dirname, 'ashtadhyayi-errata.json'); if (!fs.existsSync(f)) return {}; const d = JSON.parse(fs.readFileSync(f, 'utf8')); delete d._about; return d; })();
const anFix = (id, an) => { const e = ERRATA[id]; if (!e || e.field !== 'an') return an; let xs = an.split('##').filter(Boolean).filter(x => !(e.drop || []).includes(x));
  for (const a of e.add || []) if (!xs.includes(a)) xs.push(a);
  const n = x => +x.split('$')[1] || 0; xs = xs.map((x, i) => [x, i]).sort((a, b) => n(a[0]) - n(b[0]) || a[1] - b[1]).map(x => x[0]); return xs.join('##'); };
// does the prathamāvṛtti state this taddhita rule as a suffix (“… प्रत्ययो भवति”) rather than a nipātana? (its own wording decides the class style)
const pvSuffixStyle = id => { const n = `${+String(id).slice(0, 1)}.${+String(id).slice(1, 2)}.${+String(id).slice(2)}`; const e = PV0[n]; const t = e ? (e.arthaCore || e.artha || '') : ''; return /प्रत्यय(ो|ः|ौ|ा|ाः) भव/.test(t) && !/निपात्य/.test(t); };
// the reference vṛttis other than the Kāśikā, for “a reference reads it so” (Harsha 2026-11-16: any of the vṛttis agreeing is enough)
const OTHER = (rec, id) => { const sk = (COMM.kaumudi[id] || '').split(/[।॥]/).map(x => x.trim()).filter(Boolean);
  return [['नैलेश-वृत्तिः', (SUTRARTHA[rec.id] || {}).sa], ['prathamāvṛtti', (PV0[rec.n] || {}).arthaCore || (PV0[rec.n] || {}).artha], ['Siddhānta-kaumudī', sk.find(x => /स्या[त्च्द्ज्]|स्युः|स्तः/.test(x)) || sk[0]], ['Laghu-kaumudī', (COMM.laghukaumudi[id] || '').split(/[।॥]/)[0]]].map(([l, t]) => [l, (t || '').replace(/-/g, '')]); };
const otherBy = (rec, id, re) => OTHER(rec, id).filter(([, t]) => re.test(t)).map(([l]) => l).join(', ');
const SBYN = Object.fromEntries(SUTRAS.map(x => [`${+x.a}.${+x.p}.${+x.n}`, x.s]));
const BYID = Object.fromEntries(SUTRAS.map(s => [s.i, s]));
const COMM = {};
for (const f of ['kashika', 'nyaas', 'padamanjari', 'bhashya', 'kaumudi', 'laghukaumudi', 'balamanorama', 'tattvabodhini', 'prakriyasarvasvam', 'vasu_english']) {
  const d = J('sutraani/' + f + '.txt'); COMM[f] = d.data && !Array.isArray(d.data) ? d.data : d;
}
// ashtadhyayi-data laghukaumudi.txt carries 8 LSK texts a SECOND time under a neighbouring sūtra's id (checked by hand 2026-11-17 against
// SK + the sūtra: e.g. 13047 has 1.2.47's “अजन्तस्येत्येव”, 33046 has 3.3.56 एरच्'s “इवर्णान्तादच्”) — drop the stray copies
for (const id of ['13047', '12062', '22026', '33046', '61133', '62184', '64070', '74057']) delete COMM.laghukaumudi[id];
const CNAME = { kashika: 'काशिका', nyaas: 'न्यासः', padamanjari: 'पदमञ्जरी', bhashya: 'महाभाष्यम्', kaumudi: 'सिद्धान्तकौमुदी', laghukaumudi: 'लघुकौमुदी', balamanorama: 'बालमनोरमा', tattvabodhini: 'तत्त्वबोधिनी', prakriyasarvasvam: 'प्रक्रियासर्वस्वम्', vasu_english: 'Vasu (English)' };
const SUTRARTHA = (() => { const d = J('sutraani/sutrartha.txt'); return d.data || d; })();   // ashtadhyayi.com simple vṛtti: sa = Sanskrit gloss, sd = explanation
const KRUT = Object.fromEntries(J('krut/pratyay.txt').data.map(p => [p.pratyay, p.drushyaroopam]));
const PRATYAHARA = new Set(J('pratyahara/data.txt').data.map(p => p.name));
const PIS = Object.fromEntries(J('paribhashendushekhar/data.txt').data.map(p => [p.num, p.paribhasha]));
const taparaLen = v => /^[आईऊॠ]$/.test(v) ? `only the long ${v}` : /^[एओऐऔ]$/.test(v) ? `only ${v} itself (two morae, not its pluta)` : `only the short ${v}`;   // 1.1.70: a tapara names THAT length (teaching review 2026-11-20: आत् was explained as “only the short आ”)
// teaching review (Harsha approved 2026-11-20): each audited rule's gloss = the reviewed wording (audit/TEACHING-review.json)
const TEACH = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', 'TEACHING-review.json'), 'utf8')); } catch (e) { return {}; } })();
const TEACH_IN = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', 'TEACHING-input.json'), 'utf8')); } catch (e) { return {}; } })();
const num = id => `${+id[0]}.${+id[1]}.${+id.slice(2)}`;
const sid = n => { const [a, p, s] = n.split('.'); return a + p + String(s).padStart(3, '0'); };
const stext = n => BYID[sid(n)].s;

// ───────────────────────── paribhāṣā catalogue (texts read from the data, not typed from memory) ─────────
const PB = {};
const addS = (n, kind, gloss) => PB[n] = { id: n, kind, text: stext(n), src: 'sūtra ' + n, link: 'https://ashtadhyayi.com/sutraani/' + n.replace(/\./g, '/'), gloss };
addS('1.1.44', 'saṃjñā', 'विभाषा = option');
addS('1.1.49', 'paribhāṣā', '6th case = the thing replaced');
addS('1.1.52', 'paribhāṣā', 'a replacement replaces the LAST sound');
addS('1.1.55', 'paribhāṣā', 'a multi-sound / śit replacement replaces the whole');
addS('1.1.65', 'saṃjñā', 'उपधा = the sound before the last');
addS('1.1.66', 'paribhāṣā', '7th-case trigger → operation on what precedes');
addS('1.1.67', 'paribhāṣā', '5th case → the operation falls on what FOLLOWS it, an element already there (not the placing of a new suffix — that is 3.1.2 परश्च)');
addS('3.1.2', 'paribhāṣā', 'a suffix is placed AFTER its base (परश्च, under the प्रत्ययः heading 3.1.1–5.4.160)');
addS('1.1.69', 'paribhāṣā', 'aṇ / an udit sound denotes its savarṇas (उदित् = the whole varga)');
addS('1.1.70', 'paribhāṣā', 'a sound with त् after it denotes only its own length');
addS('1.1.72', 'paribhāṣā', 'a qualifier (viśeṣaṇa), agreeing with the word it qualifies (viśeṣya), stands for whatever ENDS in it (tadanta) — only the qualifier, never the qualified word');
addS('1.3.10', 'paribhāṣā', 'equal lists pair up in order (yathāsaṅkhya)');
addS('1.3.11', 'adhikāra', 'adhikāra / anuvṛtti');   // Harsha 2026-11-17: shown as the anuvṛtti/adhikāra rule, not a paribhāṣā
addS('3.1.85', 'vidhi', 'case endings may stand for one another (vyatyaya)');
addS('1.4.13', 'saṃjñā', 'the aṅga = what a suffix is introduced after (with whatever begins it), when that suffix follows');
addS('4.1.82', 'paribhāṣā', 'a taddhita suffix comes after the first of the semantically connected words, in the case the sūtra names (samartha)');
addS('3.1.92', 'paribhāṣā', 'in the dhātu section a 7th-case word is an upapada');
addS('3.1.94', 'paribhāṣā', 'a dissimilar apavāda blocks the utsarga only optionally (not in the strī section)');
addS('1.1.3', 'paribhāṣā', 'guṇa/vṛddhi named without a sound to replace → supply इकः');
addS('1.1.5', 'niṣedha', 'no इक्-guṇa/vṛddhi before a कित्/ङित् (and गित्) suffix');
addS('1.1.46', 'paribhāṣā', 'a ṭit augment goes at the BEGINNING, a kit augment at the END');
addS('1.1.47', 'paribhāṣā', 'a mit augment goes after the last vowel');
addS('1.1.50', 'paribhāṣā', 'the replacement is the NEAREST in kind');
addS('1.1.51', 'paribhāṣā', 'an aṇ replacing ऋ/ऌ comes with र्/ल् (अर्, आर्, अल्)');
addS('1.1.53', 'paribhāṣā', 'a ङित् replacement replaces only the last sound, even if it has several sounds');
addS('1.1.54', 'paribhāṣā', 'after a 5th-case condition the replacement replaces the FIRST sound');
addS('1.1.56', 'atideśa', 'the replacement is treated like the replaced (sthānivat), except in single-sound rules');
addS('1.1.60', 'saṃjñā', 'लोप = non-appearance (and it counts as a replacement)');
addS('1.1.64', 'saṃjñā', 'टि = from the last vowel to the end');
addS('1.1.68', 'paribhāṣā', 'a word stands for its own form, unless it is a technical term');
addS('1.1.71', 'saṃjñā', 'a sound group: first sound + final marker = all in between');
const addV = (id, text, gloss, src) => PB[id] = { id, kind: 'vārttika', text, src, on: id.split(' ')[0], link: 'https://ashtadhyayi.com/sutraani/1/1/72', gloss };   // the page links it to OUR vṛtti of the sūtra it is on, with the vārttika marked in the Kāśikā
addV('1.1.72 vt.1', 'समासप्रत्ययविधौ प्रतिषेधः', 'no tadanta in compound / suffix rules', 'Kāśikā on 1.1.72 (म०भा० वा० १)');
addV('1.1.72 vt.2', 'उगिद्वर्णग्रहणवर्जम्', '…except an ugit or a SOUND as qualifier', 'Kāśikā on 1.1.72 (म०भा० वा० २)');
const addP = (n, gloss) => PB['PIS ' + n] = { id: 'PIS ' + n, kind: 'परिभाषेन्दुशेखरः', text: PIS[n], src: 'Paribhāṣenduśekhara ' + n, link: null, gloss };
addP('23', 'a suffix named = the word from its base up to the suffix');
addP('33', 'an exception (apavāda) to tadanta-vidhi (1.1.72): when the qualifier is a SOUND (al-grahaṇa) — a single letter, a pratyāhāra, or the augment इट्, which the commentaries treat as one (Tattvabodhinī on 6.4.51); not a suffix or a word — in the 7th case, naming the condition (yasmin vidhiḥ), and the word it qualifies is in the 7th too, it stands for what BEGINS with that sound (tad-ādi), not what ends in it; e.g. 7.2.8 नेड् वशि कृति → वशादौ कृति');
addP('122', 'a suffix with no stated meaning has the base’s own meaning');
PB['kṛtrima (Tattvabodhinī on 3.2.4)'] = { id: 'kṛtrima (Tattvabodhinī on 3.2.4)', kind: 'nyāya', text: 'कृत्रिमाकृत्रिमयोः कृत्रिमस्यैव ग्रहणम्', src: 'as quoted by the Tattvabodhinī on 3.2.4', on: '3.2.4', link: null, gloss: 'a technical term beats the ordinary word' };
PB['3.3.108 vt.2'] = { id: '3.3.108 vt.2', kind: 'vārttika', text: 'इक्श्तिपौ धातुनिर्देशे', src: 'vārttika 2 on 3.3.108 (Mahābhāṣya; quoted in the Kāśikā)', on: '3.3.108', link: 'https://ashtadhyayi.com/sutraani/3/3/108', gloss: 'a dhātu is cited with इक् or श्तिप् (मृजि, अस्ति, जहाति…)' };
PB['PIS 8'] = { id: 'PIS 8', kind: 'परिभाषेन्दुशेखरः', text: 'नानुबन्धकृतमसारूप्यम्', src: 'Paribhāṣenduśekhara 8; quoted by the Kāśikā on 3.1.94', link: 'https://ashtadhyayi.com/sutraani/3/1/94', gloss: 'marker letters do not make suffixes dissimilar' };

// layer-1 probes: how each catalogue item is recognised in a commentary
const strip = s => (s || '').replace(/[\s‌‍ऽ'"‘’`]/g, '');
const DEV = '०१२३४५६७८९';
const devnum = n => n.replace(/\d/g, d => DEV[d]);
const PROBES = {};
for (const [id, p] of Object.entries(PB)) {
  const pr = [strip(p.text)];
  if (/^\d/.test(id) && !/vt/.test(id)) pr.push('[[' + id + ']]', '[[' + devnum(id) + ']]', '(' + devnum(id) + ')', '(' + id + ')');
  PROBES[id] = pr;
}
PROBES['3.1.94'].push('वासरूप', 'वाऽसरूप');
PROBES['PIS 122'] = ['अनिर्दिष्टार्थाःप्रत्ययाःस्वार्थे', 'अनिर्दिष्टार्थाश्चप्रत्ययाःस्वार्थे'];
PROBES['kṛtrima (Tattvabodhinī on 3.2.4)'] = ['कृत्रिमाकृत्रिम'];
PROBES['PIS 8'] = ['नानुबन्धकृत'];
PROBES['1.1.72 vt.1'] = ['समासप्रत्ययविधौ'];
PROBES['1.1.72 vt.2'] = ['उगिद्वर्णग्रहण'];
PROBES['1.1.66'].push('निमित्तसप्तम');
PROBES['3.3.108 vt.2'] = ['इक्श्तिपौ'];

// ───────────────────────── word lexicon (pilot; auto where the data allows) ─────────────────────────
// kind: dhatu (root, final), varna (sound; 1.1.69), pratyahara, upadha (sound), meaning, domain, cond, form, upasarga
const LEX = {
  'अचः': { kind: 'pratyahara', stem: 'अच्' }, 'पोः': { kind: 'varna', stem: 'पु', udit: true }, 'अदुपधात्': { kind: 'upadha', stem: 'अत्' },
  'उतः': { kind: 'varna', stem: 'उ', tapara: true },
  'ॠदोः': { kind: 'varna', stem: 'ॠ', parts: ['ॠ', 'उ'] }, 'ऋदोः': { kind: 'varna', stem: 'ऋ', parts: ['ऋ', 'उ'] },
  'वसोः': { kind: 'suffix', stem: 'वसु' }, 'सा': { kind: 'pronoun', stem: 'तद्' },
  'सुपः': { kind: 'suffix', stem: 'सुप्' }, 'सुप': { kind: 'suffix', stem: 'सुप्' }, 'तिङः': { kind: 'suffix', stem: 'तिङ्' },
  'र्वोः': { kind: 'varna', stem: 'र्', parts: ['र्', 'व्'], cons: true }, 'य्वोः': { kind: 'varna', stem: 'य्', parts: ['य्', 'व्'], cons: true }, 'व्योः': { kind: 'varna', stem: 'व्', parts: ['व्', 'य्'], cons: true },
  'च्वोः': { kind: 'varna', stem: 'च्', parts: ['च्', 'व्'], cons: true }, 'कुप्वोः': { kind: 'varna', stem: 'कु', parts: ['कु', 'पु'], udit: true }, 'चजोः': { kind: 'varna', stem: 'च्', parts: ['च्', 'ज्'], cons: true },
  'ह्रस्वस्य': { kind: 'varna', stem: 'ह्रस्व' }, 'पिति': { kind: 'nimitta', sfx: true }, 'उम्': { kind: 'agama', stem: 'उम्' }, 'जसि': { kind: 'nimitta', sfx: true }, 'नः': { kind: 'varna', stem: 'न्', cons: true }, 'ये': { kind: 'nimitta', sfx: true, tadadi: 'यकार' }, 'क्विझलोः': { kind: 'nimitta', sfx: true, say: ['क्वौ', 'झलादौ', 'च'], pis33: 'झल्' }, 'क्वि-झलोः': { kind: 'nimitta', sfx: true, say: ['क्वौ', 'झलादौ', 'च'], pis33: 'झल्' }, 'एः': { kind: 'varna', stem: 'इ' }, 'म्वोः': { kind: 'nimitta', parts: ['मकारे', 'वकारे'] }, 'रः': { kind: 'varna', stem: 'र्', cons: true }, 'खर्-अवसानयोः': { kind: 'nimitta', parts: ['खरि', 'अवसाने'] }, 'ओः': { kind: 'varna', stem: 'उ' }, 'ऋ': { kind: 'varna', stem: 'ऋ' }, 'हलोः': { kind: 'pratyahara', stem: 'हल्' }, 'ऋदुपधात्': { kind: 'upadha', stem: 'ऋत्' },
  'शकि': { kind: 'dhatu', root: 'शक्' }, 'सहोः': { kind: 'dhatu', root: 'सह', cite: 'सह' }, 'गद': { kind: 'dhatu', root: 'गद्' }, 'मद': { kind: 'dhatu', root: 'मद्' },
  'चर': { kind: 'dhatu', root: 'चर्' }, 'यमः': { kind: 'dhatu', root: 'यम' }, 'वदः': { kind: 'dhatu', root: 'वद्' }, 'भुवः': { kind: 'dhatu', root: 'भू' },
  'हनः': { kind: 'dhatu', root: 'हन्' }, 'एति': { kind: 'dhatu', root: 'इ' }, 'स्तु': { kind: 'dhatu', root: 'स्तु' }, 'शास्': { kind: 'dhatu', root: 'शास्' },
  'वृ': { kind: 'dhatu', root: 'वृ' }, 'दृ': { kind: 'dhatu', root: 'दृ' }, 'जुषः': { kind: 'dhatu', root: 'जुष्' }, 'अकॢपिचृतेः': { kind: 'dhatu', root: ['कॢप्', 'चृत्'], neg: true, cite: 'कॢपिचृती' },
  'खनः': { kind: 'dhatu', root: 'खन्' }, 'भृञः': { kind: 'dhatu', root: 'भृ' }, 'मृजेः': { kind: 'dhatu', root: 'मृज्' }, 'ग्रहेः': { kind: 'dhatu', root: 'ग्रह्' },
  'कृवृषोः': { kind: 'dhatu', root: ['कृ', 'वृष्'] }, 'आसु': { kind: 'dhatu', root: 'सु', pre: 'आङ्', cite: 'आङ्पूर्वः_सु' }, 'यु': { kind: 'dhatu', root: 'यु' }, 'वपि': { kind: 'dhatu', root: 'वप्' },
  'रपि': { kind: 'dhatu', root: 'रप्' }, 'लपि': { kind: 'dhatu', root: 'लप्' }, 'त्रपि': { kind: 'dhatu', root: 'त्रप्' }, 'चमः': { kind: 'dhatu', root: 'चम्' },
  'प्रति': { kind: 'upasarga' }, 'अपिभ्याम्': { kind: 'upasarga' },
  'सुपि': { kind: 'sup' }, 'अनुपसर्गे': { kind: 'cond' }, 'असंज्ञायाम्': { kind: 'domain' }, 'छन्दसि': { kind: 'domain' },
  'ई': { kind: 'adesha', stem: 'ई' }, 'त': { kind: 'adesha', stem: 'त्' },
  // class-notes test set
  'एः': { kind: 'varna', stem: 'इ' }, 'अतः': { kind: 'varna', stem: 'अ', tapara: true }, 'उगितः': { kind: 'ugit', stem: 'उगित्' }, 'तासी': { kind: 'suffix', stem: 'तासि' },
  'सार्वधातुके': { kind: 'nimitta', sfx: true }, 'आर्धधातुके': { kind: 'nimitta', sfx: true }, 'क्ङिति': { kind: 'nimitta', sfx: true, fam: 'marker' },
  'ञ्णिति': { kind: 'nimitta', sfx: true, fam: 'marker', parts: ['ञिति', 'णिति'] }, 'किति': { kind: 'nimitta', sfx: true, fam: 'marker' }, 'तद्धितेषु': { kind: 'nimitta', sfx: true },
  'सार्वधातुक-आर्धधातुकयोः': { kind: 'nimitta', sfx: true, parts: ['सार्वधातुके', 'आर्धधातुके'] }, 'आने': { kind: 'nimitta', sfx: true },
  'यि': { kind: 'nimitta', sfx: true, tadadi: 'यकार' }, 'यञि': { kind: 'nimitta', sfx: true, tadadi: 'यञ्' }, 'अनिटि': { kind: 'nimitta', sfx: true, tadadi: 'इट्', neg: true, cite: 'Tattvabodhinī on 6.4.51: “‘यस्मिन्विधिः’ इति तदादिविधिः”; Bālamanoramā: “‘अनिटि’ इत्यस्य आर्धधातुकविशेषणत्वात्तदादिविधिः” (spelling normalised; the digitised texts read यस्मिन्विदि॑रिति, अनिटी॑त्यस्य)' },
  'लृलुटोः': { kind: 'nimitta', sfx: true, lists: 2 }, 'संयोगे': { kind: 'nimitta' }, 'प्रत्यये': { kind: 'nimitta', sfx: true, self: true },
  'भावकर्मणोः': { kind: 'meaning' }, 'कर्तरि': { kind: 'meaning' }, 'आशिषि': { kind: 'domain' }, 'स्त्रियाम्': { kind: 'cond' },
  'थासः': { kind: 'sthana' }, 'टेः': { kind: 'sthana', term: '1.1.64' }, 'णेः': { kind: 'sthana' }, 'आर्धधातुकस्य': { kind: 'sthana' }, 'लस्य': { kind: 'sthana' },
  'आत्मनेपदानाम्': { kind: 'qual6' }, 'टितः': { kind: 'qual6', qualLa: true }, 'वलादेः': { kind: 'qual6' }, 'पुगन्तलघूपधस्य': { kind: 'qual6', parts: ['पुगन्तस्य', 'लघूपधस्य'], upadha: true },
  'उपधायाः': { kind: 'pos' }, 'आदेः': { kind: 'pos' }, 'अचाम्': { kind: 'pos' }, 'इकः': { kind: 'pratyahara', stem: 'इक्' },
  'अस्तेः': { kind: 'dhatu', root: 'अस्', shtip: 'अस्ति' }, 'जहातेः': { kind: 'dhatu', root: 'हा', shtip: 'जहाति' },
  'गुणः': { kind: 'op' }, 'वृद्धिः': { kind: 'op' }, 'दीर्घः': { kind: 'op' }, 'लोपः': { kind: 'op' }, 'नलोपः': { kind: 'op' }, 'गुण-वृद्धी': { kind: 'op' },
  'से': { kind: 'adesha', stem: 'से' }, 'ए': { kind: 'adesha', stem: 'ए' }, 'भूः': { kind: 'adesha', stem: 'भू' },
  'इट्': { kind: 'agama', marker: 'ट' }, 'मुक्': { kind: 'agama', marker: 'क' }, 'न': { kind: 'neg' }, 'ङित्': { kind: 'atidesha' },
  'वर्याः': { kind: 'form', stem: 'वर्या', src: 'Kāśikā on 3.1.101: “अवद्य पण्य वर्या इत्येते शब्दा निपात्यन्ते” — the plural ending -ाः hides whether the stem is वर्य or वर्या' },
  'विभाषा': { kind: 'option' }, 'अन्यतरस्याम्': { kind: 'option' }, 'च': { kind: 'ca' }, 'वा': { kind: 'option' }, 'तत्र': { kind: 'ind' },
};
// commentator statements that a word's WORKING case differs from its written case (layer-1, quoted)
const CASE_OVERRIDE = { '54152': { word: 'इनः', from: 1, to: 5, by: 'data-fix', note: 'the data records इनः as 1st; it is the 5th of इन् (PV/Kāśikā: “इन्नन्ताद् बहुव्रीहेः कप्”)' }, '31124': { from: 6, to: 5, by: 'kashika' }, '31118': { word: 'ग्रहेः', from: 7, to: 5, by: 'data-fix', note: 'the data records ग्रहेः as 7th; it is the 5th of ग्रहि (Kāśikā: “ग्रहेः क्यप्”)' } };
// section headings: default suffix of the section (class notes 88–103: a meaning-sūtra that names no suffix takes it)
const DEFSUF = { 'प्राग्दीव्यतोऽण्': 'अण्', 'प्राग्वतेष्ठञ्': 'ठञ्', 'प्राग्वहतेष्ठक्': 'ठक्', 'प्राग्घिताद्यत्': 'यत्', 'आर्हादगोपुच्छसंख्यापरिमाणाट्ठक्': 'ठक्', 'प्रागिवात्कः': 'क', 'प्राक्क्रीताच्छः': 'छ' };
// which word classes the 1st-case "head" of a non-suffix rule belongs to
const CASEN = '(प्रथमा|द्वितीया|तृतीया|चतुर्थी|पञ्चमी|षष्ठी|सप्तमी)';
const HEADK = f => HEADK0(f) || (/[अ-ह]$/.test(f) ? HEADK0(f + 'ः') : null);   // a carried word may have lost its visarga to sandhi (दीर्घ इकः)
const HEADK0 = f => (new RegExp('^' + CASEN + '$').test(f) || /^विभक्तिः$/.test(f) || /^(षष्ठी|सप्तमी|पञ्चमी|तृतीया|द्वितीया|चतुर्थी)-.*(ौ|यः)$/.test(f)) ? 'vibhakti'
  : /^(उदात्त|अनुदात्त|स्वरित|प्रकृत्या|आद्युदात्त|अन्तोदात्त|एकश्रुति)/.test(f) ? 'accent'
  : /^(आत्मनेपद|परस्मैपद)/.test(f) ? 'pada'
  : /^(एकवचनम्|एकवत्)$/.test(f) ? 'ekavat'
  : /^(अव्ययीभावः|तत्पुरुषः|द्विगुः|बहुव्रीहिः|द्वन्द्वः|कर्मधारयः|समासः)$/.test(f) ? 'samasa'
  : (/^(लोपः|लुक्|श्लुः|लुप्|गुणः|वृद्धिः|दीर्घः|ह्रस्वः|प्लुतः|द्वे|सम्प्रसारणम्|संप्रसारणम्|अलुक्|अलुग्)$/.test(f) || /^[^\s]{1,6}लोपः$/.test(f)) ? 'op' : null;
const SILENT = { 'कृत्': 'class name (3.1.93)', 'कृत्याः': 'class name (3.1.95)', 'प्रत्ययः': '', 'परश्च': 'implied by the 5th case', 'आद्युदात्तश्च': 'accent only', 'तत्र': 'scope only',
  'तद्धिताः': 'class name (4.1.76)', 'समर्थानां प्रथमाद्वा': 'scope: which word takes the suffix', 'प्राग्दीव्यतोऽण्': 'scope + the general suffix अण्',
  'तस्य': 'meaning, stated once at 4.1.92 (glosses leave it out)', 'अपत्यम्': 'meaning, stated once at 4.1.92 (glosses leave it out)',
  'आकडारात् एका संज्ञा': 'scope of one-name-only (1.4.1)', 'असिद्धवदत्राभात्': 'asiddhatva scope — derivation-level, not the reading', 'अनुपसर्जनात्': 'scope',
  'स्थाने': 'paribhāṣā context', 'अलः': 'paribhāṣā context', 'अन्त्यस्य': 'paribhāṣā context', 'स्वम्': 'context', 'रूपम्': 'context',
  'पूर्वत्रासिद्धम्': 'asiddhatva scope (8.2.1) — derivation-level', 'प्राक्कडारात्समासः': 'samāsa section heading', 'प्राग्रीश्वरान्निपाताः': 'section heading', 'समासान्ताः': 'section heading', 'कर्मप्रवचनीयाः': 'section heading', 'आ च त्वात्': 'scope', 'शेषे': 'section: the remaining senses', 'प्राग्दिशो विभक्तिः': 'section heading',
  'प्राग्दीव्यतोऽण्': 'section heading — default suffix अण्', 'प्राग्वतेष्ठञ्': 'section heading — default suffix ठञ्', 'प्राग्वहतेष्ठक्': 'section heading — default suffix ठक्', 'प्राग्घिताद्यत्': 'section heading — default suffix यत्', 'आर्हादगोपुच्छसंख्यापरिमाणाट्ठक्': 'section heading — default suffix ठक्', 'प्रागिवात्कः': 'section heading — default suffix क', 'प्राक्क्रीताच्छः': 'section heading — default suffix छ',
  'प्रत्ययलोपे': 'context', 'प्रत्ययलक्षणम्': 'context', 'स्थानिवत्': 'context', 'आदेशः': 'context', 'अदर्शनं': 'context' };
const CASE = ['', 'प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी'];
const NUMB = ['', 'एक', 'द्वि', 'बहु'];
const VOW = 'अआइईउऊऋॠऌएऐओऔ';
const MATRA = { 'ा': 'आ', 'ि': 'इ', 'ी': 'ई', 'ु': 'उ', 'ू': 'ऊ', 'ृ': 'ऋ', 'ॄ': 'ॠ', 'ॢ': 'ऌ', 'े': 'ए', 'ै': 'ऐ', 'ो': 'ओ', 'ौ': 'औ' };
const finalSound = r => { const c = r.slice(-1); if (c === '्') return 'hal'; if (MATRA[c]) return MATRA[c]; if (VOW.includes(c)) return c; return 'अ'; };

const EXTRA_SUF = { 'ङीप्': 'ई', 'यक्': 'य', 'शप्': 'अ', 'स्य': 'स्य', 'तासि': 'तास्',
  // strī, vikaraṇa, sanādi and samāsānta suffixes the kṛt list doesn't have
  'ङीष्': 'ई', 'ङीन्': 'ई', 'टाप्': 'आ', 'डाप्': 'आ', 'चाप्': 'आ', 'ऊङ्': 'ऊ', 'ति': 'ति', 'आम्': 'आम्', 'श्यन्': 'य', 'श्नु': 'नु', 'श्ना': 'ना', 'श्नम्': 'न', 'श': 'अ', 'उ': 'उ',
  'सिच्': 'स्', 'क्स': 'स', 'चङ्': 'अ', 'अङ्': 'अ', 'चिण्': 'इ', 'यङ्': 'य', 'सन्': 'स', 'णिच्': 'इ', 'णिङ्': 'इ', 'क्यच्': 'य', 'काम्यच्': 'काम्य', 'क्यङ्': 'य', 'क्यष्': 'य', 'ईयङ्': 'ईय', 'आय': 'आय',
  'टच्': 'अ', 'उरच्': 'उर', 'आलच्': 'आल', 'आटच्': 'आट', 'इलच्': 'इल', 'अच्': 'अ', 'षच्': 'अ', 'ष': 'अ', 'कप्': 'क', 'अप्': 'अ', 'अनिच्': 'अन्', 'असिच्': 'अस्', 'इच्': 'इ', 'समासान्तः': '' };
function suffixOf(seg) {
  // a compound of suffix names (क्त्वा-णमुलौ, शतृ-शानचौ): every member a suffix
  if (seg.includes('-')) { const parts = seg.split('-').map((g, i, a) => i === a.length - 1 ? g.replace(/(ौ|ाः)$/, '्').replace(/््$/, '्') : g); const ok = parts.map(g => suffixOf(g) || suffixOf(g.replace(/्$/, '')) || (/^(यञ्|अण्|अच्|अञ्)$/.test(g) && parts.length > 1)); return ok.every(Boolean) ? seg : null; }   // अण्-अञौ: names that are also pratyāhāras
  for (const c of [seg, seg + '्', seg.replace(/ः$/, '्'), seg.replace(/ौ$/, '्'), seg.replace(/ाः$/, ''), seg.replace(/ः$/, '')]) if ((KRUT[c] !== undefined || EXTRA_SUF[c] !== undefined) && (!LEX[seg] || LEX[seg].kind === 'suffix')) return c;
  if (LEX[seg] && LEX[seg].kind === 'suffix' && LEX[seg].auto) return LEX[seg].stem;
  return null;
}

// ───────────────────────── output sandhi (enough for vṛtti prose) ─────────────────────────
const VOICED = new Set('गघजझडढदधबभङञणनमयरलवह'.split('').concat(VOW.split('')));
const MAT_OF = v => v === 'अ' ? '' : Object.keys(MATRA).find(k => MATRA[k] === v);
const glue = (cons, b) => VOW.includes(b[0]) ? cons.slice(0, -1) + MAT_OF(b[0]) + b.slice(1) : cons + b; // 'र्' + 'अ…' → 'र…'
// sandhi via the shared library (searchtool/lib/sanskrit-search.js — the site's sandhi-tolerant search uses the same rules);
// this wrapper only decides the Kāśikā-style SPACING and restores the avagraha the library leaves out
const SS = require(path.join(__dirname, 'lib/sanskrit-search.js'));
// quoted forms that are pragṛhya (1.1.13 शे, 1.1.18 ऊँ): no sandhi with them (6.1.125 प्लुतप्रगृह्या अचि नित्यम्) — Kāśikā «शे इत्येतत्», «ऊँ इत्ययमादेशो»
// (reader report 2026-11-23: our Kāśikā style had «श इत्यस्य», and 1.1.18 «मतेनोँ इत्यादेशो»)
const PRAGRHYA_Q = new Set(['शे', 'ऊँ']);
const pragQ = (a, b) => (PRAGRHYA_Q.has(a) && /^इत/.test(b)) || b.replace(/^['‘]/, '') === 'ऊँ';   // only the quoted form (X इति…); शे = locative of the suffix श (6.3.55 ऋचः शे) is not pragṛhya
function join(words) {
  if (process.env.OLDJOIN) return joinOld(words);
  const ws = words.filter(Boolean);
  let out = ws.length ? ws[0] : '';
  for (let i = 1; i < ws.length; i++) {
    const b = ws[i];
    const sp = out.lastIndexOf(' '), head = out.slice(0, sp + 1), a = out.slice(sp + 1);
    if (a.endsWith('_') || b.startsWith('_') || b.startsWith("'") || pragQ(a, b)) { out = out + ' ' + b; continue; }      // protected (lists, quoted forms, a quoted name, a pragṛhya form)
    if (a.includes('_') && /^इत्येत|^इति/.test(b) && /[ािीुूृेैोौ]$|[क-ह]$/.test(a)) { out = out + ' ' + b; continue; }   // a list's last item keeps its hiatus before इत्येते… (Kāśikā: “वर्या इत्येते”)
    let j;
    if (/^[इईउऊऋॠएऐओऔ]ः$/.test(a) && VOW.includes(b[0])) j = glue(a.slice(0, -1) + 'र्', b);   // a sound named in the 6th/5th: एः + अनेकाचः → एरनेकाचः
    else if (/[ेो]$/.test(a) && b[0] === 'अ') j = a + 'ऽ' + b.slice(1);                    // pūrvarūpa with avagraha (उपपदेऽनुपसर्गे)
    else if (/[^ािीुूृेैोौ्इईउऊऋॠएऐओऔ]ः$/.test(a) && b[0] === 'अ') j = a.slice(0, -1) + 'ोऽ' + b.slice(1); // अः + अ → ओऽ (प्रत्ययोऽपवादः)
    else j = SS.sandhiJoin(a, b);
    if (j === a + 'च्' + b && b[0] === 'छ') j = a + b;                                // the तुक् before छ (6.1.73 छे च) is a saṃhitā rule inside a word; the Kāśikā's prose keeps a vowel-final word apart from a following छ with no च् («इत्येतानि छन्दसि», «विकल्पेन छः» — 267 such spaces, never «…नच्छः») — keep the space (round 12)
    if (j === a + b) { out = head + a + ' ' + b; continue; }                         // no sandhi (incl. plain abutment): keep the space
    if (j.endsWith(b)) { const a2 = j.slice(0, j.length - b.length); out = head + (a2 !== a && /(र्|श्|ष्|स्|च्|ज्|ल्|न्|ं)$/.test(a2) && !/ं$/.test(a2) ? a2 + b : a2 + ' ' + b); continue; }
    out = head + j;                                                                    // vowels fused / avagraha
  }
  return out.replace(/_\s/g, ' ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}
function joinFull(words) {    // the Siddhānta-kaumudī writes with full sandhi: आदैच्च, अजन्ताद्धातोर्यत्स्यात्
  const ws = words.filter(Boolean).map(w => w.includes('_') ? w.replace(/_+$/, '').split('_').filter(Boolean).reduce((a, b) => SS.sandhiJoin(a, b)) : w);
  let out = ws.length ? ws[0] : '';
  for (let i = 1; i < ws.length; i++) {
    const b = ws[i], sp = out.lastIndexOf(' '), head = out.slice(0, sp + 1), a = out.slice(sp + 1);
    if (b.startsWith("'") || a.endsWith("'") || pragQ(a, b)) { out = out + ' ' + b; continue; }
    let j;
    if (/^[इईउऊऋॠएऐओऔ]ः$/.test(a) && VOW.includes(b[0])) j = glue(a.slice(0, -1) + 'र्', b);
    else if (/[ेो]$/.test(a) && b[0] === 'अ') j = a + 'ऽ' + b.slice(1);
    else if (/[^ािीुूृेैोौ्इईउऊऋॠएऐओऔ]ः$/.test(a) && b[0] === 'अ') j = a.slice(0, -1) + 'ोऽ' + b.slice(1);
    else j = SS.sandhiJoin(a, b);
    if (j === a + 'च्' + b && b[0] === 'छ') j = a + b;                                // the Kaumudī's prose too keeps «इति छः», «एतानि छन्दसि» apart, no तुक् च् (6.1.73 is applied inside a word) (round 12)
    if (j === a + b) { out = head + (/्$/.test(a) ? a + b : a + ' ' + b); continue; }
    if (j.endsWith(b)) { const a2 = j.slice(0, j.length - b.length); out = head + (/्$/.test(a2) ? a2 + b : a2 + ' ' + b); continue; }
    out = head + j;
  }
  return out.replace(/\s+/g, ' ').trim();
}
const cjoin = f => f.includes('-') ? f.split('-').reduce((a, b) => SS.sandhiJoin(a, b)) : f;
function joinOld(words) {
  let out = words.filter(Boolean).slice();
  for (let i = 0; i < out.length - 1; i++) {
    let a = out[i], b = out[i + 1], f = b[0];
    const fuse = (na, nb) => { out[i] = na + nb; out.splice(i + 1, 1); i--; };
    if (a.endsWith('ः')) {
      const pre = a.slice(-2, -1), isA = !MATRA[pre] && pre !== '्';
      if ('चछ'.includes(f)) { fuse(a.slice(0, -1) + 'श्', b); continue; }
      if ('तथ'.includes(f)) { fuse(a.slice(0, -1) + 'स्', b); continue; }
      if (!VOICED.has(f)) continue;
      if (isA) { if (f === 'अ') fuse(a.slice(0, -1) + 'ोऽ', b.slice(1)); else if (VOW.includes(f)) out[i] = a.slice(0, -1); else out[i] = a.slice(0, -1) + 'ो'; continue; }
      if (pre === 'ा') { out[i] = a.slice(0, -1); continue; }
      if (f !== 'र') { out[i] = glue(a.slice(0, -1) + 'र्', b); out.splice(i + 1, 1); i--; continue; }
    } else if (a.endsWith('त्')) {
      if ('चछ'.includes(f)) { fuse(a.slice(0, -2) + 'च्', b); continue; }
      if (VOW.includes(f)) { fuse(a.slice(0, -2) + 'द' + (f === 'अ' ? '' : Object.keys(MATRA).find(k => MATRA[k] === f)), b.slice(1)); continue; }
      if ('ङञणनम'.includes(f)) { out[i] = a.slice(0, -2) + 'न्'; continue; }
      if (VOICED.has(f)) { out[i] = a.slice(0, -2) + 'द्'; continue; }
    } else if (a.endsWith('म्')) {
      if (VOW.includes(f)) { fuse(a.slice(0, -1) + (f === 'अ' ? '' : Object.keys(MATRA).find(k => MATRA[k] === f)), b.slice(1)); continue; }
      out[i] = a.slice(0, -2) + 'ं';
    } else if (/[ेो]$/.test(a) && f === 'अ') { fuse(a + 'ऽ', b.slice(1)); continue; }
    else if (/े$/.test(a) && VOW.includes(f) && !b.startsWith('इति')) { out[i] = a.slice(0, -1); continue; }
    else if (/[िु]$/.test(a) && VOW.includes(f) && f !== 'इ' && f !== 'उ' && !/^इति/.test(b) && a.length > 2) { out[i] = glue(a.slice(0, -1) + (a.endsWith('ि') ? '्य्' : '्व्'), b); out.splice(i + 1, 1); i--; continue; }
    else if (/ौ$/.test(a) && VOW.includes(f)) { out[i] = glue(a.slice(0, -1) + 'ाव्', b); out.splice(i + 1, 1); i--; continue; }
    else if (/ा$/.test(a) && b.startsWith('इति')) { fuse(a.slice(0, -1) + 'े', b.slice(1)); continue; }
    else if (/च$/.test(a) && (f === 'अ' || f === 'आ')) { fuse(a + 'ा', b.slice(1)); continue; }
    else if (/स्य$/.test(a) && (f === 'अ' || f === 'आ')) { fuse(a + 'ा', b.slice(1)); continue; }
    else if (/स्य$/.test(a) && (f === 'इ' || f === 'ई')) { fuse(a + 'े', b.slice(1)); continue; }
    else if (f === 'इ' && b.startsWith('इति') && !/[्ािीुूृेैोौः]$/.test(a)) { fuse(a + 'े', b.slice(1)); continue; }
  }
  return out.join(' ').replace(/_\s/g, ' ').replace(/_/g, ' ');
}

const lastStem = (g, kind) => {
  if (kind === 'loc') return g.replace(/ेषु$/, '').replace(/िषु$/, 'ि').replace(/ीषु$/, 'ी').replace(/ुषु$/, 'ु').replace(/ासु$/, 'ा');
  return g.replace(/ाः$/, '').replace(/ौ$/, '').replace(/ानि$/, '').replace(/े$/, 'ा').replace(/ः$/, '').replace(/म्$/, '');
};
const listOf = (segs, kind) => segs.map((g, i) => i === segs.length - 1 ? ((LEX[g] && LEX[g].stem) || lastStem(g, kind)) : g).join('_');
// ───────────────────────── per-sūtra analysis ─────────────────────────
function parseWords(s) {
  // a pada written without its ending (166 in the data) carries its case in the 5th slot — न$S$$$6 (6.4.7, PV “न अविभक्त्यन्तं पदम्”),
  // आदिनी$S$$$7 (8.4.48, PV “आदिनि लुप्तसप्तम्यन्तनिर्देशः”), शे$S$$$1 (1.1.13). Read since 2026-11-22 (before, these words had no case).
  return s.pc.split('##').filter(Boolean).map(w => { const [form, , c, n, lc] = w.split('$'); return Object.assign({ form, segs: form.split('-'), wcase: +c || +lc || 0, num: +n || 0 }, !+c && +lc ? { lupta: true } : {}); });
}
const tadantaStem = st => {
  if (st === 'अन्') return 'अन्नन्त';   // अनः (6.4.134 अल्लोपोऽनः) → अन्नन्तस्य
  if (/[^ािीुूृेैोौ्ं]न्$|[िुृ]न्$/.test(st) && st.length >= 3) return st + 'नन्त';   // सन् → सन्नन्त, इन् → इन्नन्त (8.3.32 ङमुट् after a short vowel)
  if (/^(ह्रस्व|दीर्घ|प्लुत)$/.test(st)) return st + 'ान्त';   // vowel-length classes: ह्रस्वान्त
  // name of a sound/pratyāhāra + अन्त, with jaśtva on a final stop
  if (st.endsWith('्')) { const base = st.slice(0, -2), c = st.slice(-2, -1); const jas = { 'च': 'ज', 'क': 'ग', 'ट': 'ड', 'त': 'द', 'प': 'ब' }[c] || c; return base + jas + 'न्त'; }
  return st;
};
// stem + अन्त with the right sandhi: घञ् → घञन्त, वसु → वस्वन्त, णि → ण्यन्त, क्त → क्तान्त, दा → दान्त, कृ → क्रन्त
const antaOf = st => {
  if (/[सषशर]्$/.test(st) && st.length > 2) return st + 'शब्दान्त';      // ऊधस् → ऊधस्शब्दान्त (as the commentaries write it)
  if (/्$/.test(st)) return tadantaStem(st);
  const last = st.slice(-1), Y = { 'ि': 'य', 'ी': 'य', 'ु': 'व', 'ू': 'व', 'ृ': 'र', 'ॄ': 'र' }, VI = { 'इ': 'य', 'ई': 'य', 'उ': 'व', 'ऊ': 'व', 'ऋ': 'र' };
  if (Y[last]) return st.slice(0, -1) + '्' + Y[last] + 'न्त';
  if (VI[last]) return st.slice(0, -1) + VI[last] + 'न्त';
  if (last === 'ा' || last === 'आ') return st + 'न्त';
  if (/[क-ह]$/.test(st)) return st + 'ान्त';
  return st + 'न्त';
};
const SNAME = st => st === 'र्' ? 'रेफ' : /^[कचटतप]ु$/.test(st) ? st[0] + 'वर्ग' : /^[क-ह]्$/.test(st) ? st[0] + 'कार' : /^[अइउऋऌ]$/.test(st) ? st + 'वर्ण' : /^[आईऊॠएऐओऔ]$/.test(st) ? st + 'कार' : st;
const sTad = L => {
  if (!L) return '';
  if (L.parts) return L.parts.map(SNAME).join('') + 'ान्त';
  if (L.kind === 'pratyahara' || L.kind === 'ugit') return tadantaStem(L.stem);
  if (L.tapara) return tadantaStem(L.stem + 'त्');
  return SNAME(L.stem) + 'ान्त';
};
const JAS = { 'च': 'ज', 'क': 'ग', 'ट': 'ड', 'त': 'द', 'प': 'ब' };
const jas = st => st.endsWith('्') ? st.slice(0, -2) + (JAS[st.slice(-2, -1)] || st.slice(-2, -1)) + '्' : st;
const withAdi = st => st.endsWith('्') ? glue(jas(st), 'आदौ') : st + 'ादौ';           // यञ् → यञादौ, इट् → इडादौ, यकार → यकारादौ
const alCount = w => { let n = 0; const t = w.replace(/[ःं]/g, ''); for (let i = 0; i < t.length; i++) { const c = t[i]; if (VOW.includes(c) || MATRA[c]) n++; else if (/[क-ह]/.test(c)) { n++; const nx = t[i + 1]; if (nx !== '्' && !MATRA[nx]) n++; } } return n; };
// a pratyāhāra whose members are all single sounds (यण् = य् व् र् ल्) names single sounds, not a multi-sound substitute (2026-11-17: 6.1.77
// was credited 1.1.55 because the NAME यण् has two letters); सुप्/तिङ् list suffixes and stay out
const SOUNDPR = new Set(J('pratyahara/data.txt').data.filter(p => String(p.list || '').split(/,\s*/).every(x => alCount(x.trim()) === 1)).map(p => p.name));
const plain = arr => arr.filter(Boolean).join(' ').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
// The Kāśikā gloss sentence. The automatic pick sometimes lands on a vārttika / gaṇasūtra line / discussion sentence (1.1.23, 1.1.37, 8.2.30 …);
// a general rewrite (tried 2026-11-17) fixed some and broke others, so the picker is unchanged and hand-checked corrections live in
// tools/kv-gloss-overrides.json (each entry read against the full Kāśikā).
const KVOVR = (() => { try { const h = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools', 'kv-gloss-overrides.json'), 'utf8')); delete h._about; return h; } catch (e) { return {}; } })();
function kashikaVrttiX(id) {
  if (KVOVR[id]) return KVOVR[id];
  const k = COMM.kashika[id] || '';
  const sents = (k.match(/[^।॥]+[।॥]?/g) || []).map(x => x.trim()).filter(x => x.replace(/[।॥]/g, '').trim());   // keep each sentence's own daṇḍa, as printed
  // a gloss is a sentence, not a one-word example (1.1.3's “भवति।” is an example form; its gloss is “… इकः एव स्थाने वेदितव्यौ”)
  const ok = x => !/(इति वर्तते|इत्यनुवर्तते|निवृत्तम्|इत्येव|अधिकारोऽयम्)[।॥]?$/.test(x) && x.replace(/[।॥]$/, '').split(/\s+/).length >= 3;
  return sents.find(x => ok(x) && /प्रत्ययो भवत|प्रत्ययौ भवतः|प्रत्यया भवन्त|आदेशो भवत|आदेशा भवन्त|आगमो भवत|संज्ञ[ंःो]* भवत|संज्ञका भवन्त|वद् भवत|न भवतः|निपात्य/.test(x)) || sents.find(x => ok(x) && /भवत|भवन्त|वेदितव्य|द्रष्टव्य/.test(x)) || sents.find(ok) || sents[0] || '';
}
function kashikaVrtti(id) {
  if (KVOVR[id]) return KVOVR[id];
  const k = COMM.kashika[id] || '';
  const sents = (k.match(/[^।॥]+[।॥]?/g) || []).map(x => x.trim()).filter(x => x.replace(/[।॥]/g, '').trim());   // keep each sentence's own daṇḍa, as printed
  const ok = x => !/(इति वर्तते|इत्यनुवर्तते|निवृत्तम्)[।॥]?$/.test(x);
  return sents.find(x => ok(x) && /प्रत्ययो भवत|प्रत्यया भवन्त|निपात्य|वेदितव्याः/.test(x)) || sents.find(x => ok(x) && /भवत|भवन्त/.test(x)) || sents[0] || '';
}
// ───────────────────────── class-notes set: replacement / operation / augment / blocking / definition / atideśa ─────────
const NIMK = f => LEX[f] && LEX[f].kind === 'nimitta' ? LEX[f] : null;
function nimittaPhrase(words, an, ad, fire, st) {
  // own 7th nimittas supersede carried ones of the same family (किति replaces carried ञ्णिति)
  const own = words.filter(w => w.wcase === 7 && NIMK(w.form)).map(w => ({ form: w.form, lex: NIMK(w.form), own: true }));
  let car = an.concat(ad).filter(c => NIMK(c.w)).map(c => ({ form: c.w, lex: NIMK(c.w), own: false, from: c.from }));
  const dropped = car.filter(c => c.lex.fam && own.some(o => o.lex.fam === c.lex.fam)).map(c => ({ w: c.form, by: own.find(o => o.lex.fam === c.lex.fam).form }));
  car = car.filter(c => !(c.lex.fam && own.some(o => o.lex.fam === c.lex.fam)));
  dropped.forEach(d => st.drop(d.w, [], `${d.w} (carried) is replaced by the sūtra’s own ${d.by}`));
  const all = [...own, ...car.filter(c => !own.some(o => o.form === c.form))];
  const K = [], C = [];
  for (const n of all) {
    let forms;
    if (n.lex.tadadi) {
      const f = ((n.lex.neg ? 'अन' : '') + withAdi(n.lex.tadadi)).replace(/^अनइ/, 'अनि');
      forms = [f];
      fire('PIS 33', n.lex.doubt ? '?' : '✔', 2, `${n.form}: ${n.lex.tadadi.endsWith('्') && n.lex.tadadi.length > 2 ? 'a sound group' : 'a single sound'} in the 7th`, `→ ${f} (what BEGINS with it)` + (n.lex.doubt ? ' — Kāśikā glosses अनिडादौ; इट् names an augment, and the reasoning for tadādi here is not in the commentaries I have' : '') + (n.lex.cite ? ` — the augment इट् counts as the sound here: ${n.lex.cite}` : ''));
    } else if (n.lex.say) { forms = n.lex.say.slice(); if (n.lex.pis33) fire('PIS 33', '✔', 2, `${n.form}: ${n.lex.pis33} (a sound group) in the 7th`, `→ ${forms.join(' ')} (what BEGINS with it)`); }
    else if (n.lex.parts) forms = [...n.lex.parts, 'च', ...(n.lex.sfx ? ['प्रत्यये'] : [])];
    else forms = [n.form.replace(/-/g, '')];
    K.push(...forms); C.push(...forms);
    st.set(n.form, forms.filter(x => x !== 'प्रत्यये').join(' ') + (n.lex.sfx && !n.lex.self ? ' प्रत्यये परे' : ' परे'), [n.lex.tadadi ? 'PIS 33' : '', '1.1.66'],
      (n.lex.tadadi ? `${n.form}: ${n.lex.tadadi} in the 7th → “beginning with ${n.lex.tadadi}” (tadādi, PIS 33)${n.lex.doubt ? ' — reasoning not in the commentaries I have' : ''}${n.lex.cite ? ` (${n.lex.cite})` : ''}; ` : n.lex.parts ? `${n.form} = ${n.lex.parts.join(' + ')}; ` : '') + `7th case → names what FOLLOWS (1.1.66)` + (n.own ? '' : ' — carried over'));
    fire('1.1.66', '✔', 2, `${n.form}: 7th case${n.own ? '' : ' (carried over)'}`, 'names what FOLLOWS — the operation is on what precedes it');
  }
  if (all.length) { K.push('परतः'); C.push(...(all.some(n => n.lex.sfx && !n.lex.self) && C[C.length - 1] !== 'प्रत्यये' ? ['प्रत्यये', 'परे'] : ['परे'])); }
  return { K, C, list: all, dropped };
}
const opName = (words, an) => {
  const own = words.find(w => w.wcase !== 7 && ((LEX[w.form] && LEX[w.form].kind === 'op') || HEADK(w.form) === 'op'));
  if (own) return own.form;
  const c = an.filter(x => (LEX[x.w] && LEX[x.w].kind === 'op') || HEADK(x.w) === 'op').map(x => x.w);
  return c.includes('लोपः') ? 'लोपः' : c[c.length - 1];
};
// 5th-case words carried over (युष्मदस्मद्भ्याम् into 7.1.30): “X उत्तरस्य” (1.1.67) when the sūtra has no 5th of its own
const car5Of = (carried, words) => words.some(w => w.work === 5) ? [] : carried.filter(c => SILENT[c.w] === undefined && !(c.w === 'तिङः' && c.from === '5.3.56') && !['धातोः', 'ङ्याप्प्रातिपदिकात्', 'प्रत्ययः', 'परश्च', 'पदात्', 'अङ्गात्'].includes(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 5 && !/^(न|च|वा)$/.test(c.w) && !(carried.some(x => x.w === 'अङ्गस्य') && ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind)));
function buildExtra(rec, words, an, ad, fire, notes, typ, BN) {
  const k = rec.kind, carried = an.concat(ad), has = w => carried.some(c => c.w === w);
  const st = rec._st;
  const K = [], S = [], C = [];
  const fin = (k1, s1, c1) => { rec.gen = join(k1); rec.genK = joinFull(s1); rec.genC = plain(c1); rec._tG = k1; rec._tK = s1; };
  // doubling (6.1.8–6.1.11) under एकाचो द्वे प्रथमस्य / अजादेर्द्वितीयस्य: PV “[X परतः] [सन्नन्तस्य …] अनभ्यासस्य धातोरवयवस्य प्रथमस्यैकाचोऽजादेर्द्वितीयस्य वा द्वे भवतः”
  if (+rec.id >= 61008 && +rec.id <= 61011 && has('एकाचो द्वे प्रथमस्य')) {
    const pre = [], preC = [], tad = [];
    words.forEach(w => {
      if (w.wcase === 7) { pre.push(w.form, 'परतः'); preC.push(w.form, 'परे'); fire('1.1.66', '✔', 2, `${w.form}: 7th case`, 'the doubling takes place when it FOLLOWS'); st.set(w.form, w.form + ' परतः', '1.1.66', `${w.form}: 7th case → “when it follows”`); }
      else if (w.work === 6 && w.lex.length && w.lex.every(l => l && l.kind === 'suffix')) {
        const ts = w.segs.map((g, i) => antaOf((w.lex[i] || {}).stem || g.replace(/(ोः|स्य|ः)$/, '')) + 'स्य'); tad.push(...ts, ...(ts.length > 1 ? ['च'] : []));
        fire('PIS 23', '✔', 2, `${w.form}: suffixes named in the 6th qualify the dhātu`, `${ts.join(' ')} — a dhātu ENDING in it`); st.set(w.form, ts.join(' ') + (ts.length > 1 ? ' च' : ''), 'PIS 23', `${w.form}: suffixes → “a dhātu ending in them” (PIS 23)`); }
    });
    const body = [...tad, 'अनभ्यासस्य', 'धातोः', 'अवयवस्य', 'प्रथमस्य', 'एकाचः', 'अजादेः', 'द्वितीयस्य', 'वा', 'द्वे'];
    st.snap([], 'एकाचो द्वे प्रथमस्य (6.1.1), अजादेर्द्वितीयस्य (6.1.2), अनभ्यासस्य (6.1.8) carried over: the first single-vowel part of the dhātu (the second, if it begins with a vowel) is doubled');
    fin([...pre, ...body, 'भवतः'], [...body, 'स्तः', ...preC], [...preC, ...body, 'भवतः']);
    return;
  }
  if (k === 'operation' || k === 'āgama') {
    const nim = nimittaPhrase(words, an, ad, fire, st);
    const anga = has('अङ्गस्य');
    const own6 = words.filter(w => w.work === 6);
    const kindOf = w => (LEX[w.form] || {}).kind;
    const STRUCT = new Set(['अङ्गस्य', 'लस्य', 'धातोः', 'प्रत्ययः', 'परश्च', 'पदस्य']);
    const dh6 = own6.filter(w => kindOf(w) === 'dhatu').concat(carried.filter(c => (LEX[c.w] || {}).kind === 'dhatu' && !STRUCT.has(c.w)).map(c => ({ form: c.w, carried: true })));
    const quals = own6.filter(w => kindOf(w) === 'qual6');
    const sth = own6.filter(w => kindOf(w) === 'sthana');
    const POS_ORD = ['अचाम्', 'उपधायाः', 'आदेः'];
    const pos = own6.filter(w => kindOf(w) === 'pos').map(w => w.form).concat(carried.filter(c => (LEX[c.w] || {}).kind === 'pos' && !own6.some(o => o.form === c.w)).map(c => c.w)).sort((a, b) => POS_ORD.indexOf(a) - POS_ORD.indexOf(b));
    let sound = own6.find(w => ['pratyahara', 'varna'].includes(kindOf(w)));
    let soundCarried = false;
    // a carried sound qualifies the aṅga only when the sūtra does not name the dhātu itself (क्रमश्च क्त्वि: क्रम् is the aṅga; the carried नः of 6.4.7 does not apply)
    // a sound carried over in the 5th (हलः ← 6.4.49) is not a description of the aṅga but what the place FOLLOWS: “हल उत्तरस्य” (PV 6.4.50, 6.4.151; 1.1.67)
    const car5S = !sound && !own6.some(w => ['pratyahara', 'varna'].includes(kindOf(w))) ? carried.find(c => c.w === 'हलः' && (autoOf(sid(c.from), c.w) || {}).cs === 5 && +rec.id >= 64001 && +rec.id <= 64175) : null;   // आत् and उतः carried here are not ablatives (the replacement आत्; the place उतः)
    if (!sound && !dh6.some(d => !d.carried)) { const c = carried.find(c => c !== car5S && ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind)); if (c) { sound = { form: c.w, from: c.from }; soundCarried = true; } }
    if (car5S) rec._car5S = car5S;
    // the base the sounds may qualify (tadanta, 1.1.72): अङ्गस्य, धातोः, पदस्य, भस्य, प्रातिपदिकस्य
    const BASES = ['अङ्गस्य', 'धातोः', 'पदस्य', 'भस्य', 'प्रातिपदिकस्य'];
    const baseW = [...own6.map(w => w.form), ...carried.filter(c => !SILENT[c.w]).map(c => c.w)].find(x => BASES.includes(x)) || null;
    const ownS = own6.filter(w => ['pratyahara', 'varna'].includes(kindOf(w))).map(w => ({ form: w.form, own: true }));
    const allS = ownS.length ? ownS.concat(carried.filter(c => ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind) && (LEX[c.w].parts || !ownS.some(o => (LEX[o.form] || {}).kind === (LEX[c.w] || {}).kind))).map(c => ({ form: c.w, from: c.from })).filter(c => !ownS.some(o => o.form === c.form)))
      : carried.filter(c => ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind)).map(c => ({ form: c.w, from: c.from }));
    const vowelish = x => { const L = LEX[x.form] || {}; return /^(इक्|अच्|अक्|इच्|एच्|एङ्|अण्)$/.test(L.stem || '') || /^[अआइईउऊऋॠऌएऐओऔ]/.test(L.stem || ''); };
    const op = k === 'operation' ? opName(words, carried) : null;
    // a suffix name (वसोः, तिङः) or a sound-class term (अनुनासिकस्य) in the 6th qualifying the base → “what ends in it” (PIS 23 / 1.1.72)
    const isSfxW = w => (w.lex.length && w.lex.every(l => l && l.kind === 'suffix')) || (LEX[w.form] || {}).kind === 'suffix';
    const sfxQ = (baseW || anga) ? own6.filter(w => (isSfxW(w) && !/^(अस्य|तस्य)$/.test(w.form)) || /^(अनुनासिकस्य)$/.test(w.form)) : [];
    const used6 = new Set([...sfxQ.map(w => w.form), ...dh6.map(d => d.form), ...quals.map(q => q.form), ...sth.map(w => w.form), ...(sound ? [sound.form] : []), ...pos, ...(baseW && baseW !== 'अङ्गस्य' ? allS.map(x => x.form) : [])]);
    const other6 = own6.filter(w => !used6.has(w.form) && !['pronoun'].includes(kindOf(w) || '') || (kindOf(w) === 'pronoun'));
    const wStem = w => { const L = LEX[w.form]; return L && L.stem ? L.stem : w.form; };
    const own5 = words.filter(w => w.work === 5);
    const car6 = !own6.length ? carried.filter(c => (/स्य$|ः$/.test(c.w) || /^(षष्ठ्या|तृतीयाया|सप्तम्या|पञ्चम्या|चतुर्थ्या|द्वितीयाया)$/.test(c.w)) && !SILENT[c.w] && !['अङ्गस्य', 'लस्य', 'धातोः', 'पदस्य'].includes(c.w) && (LEX[c.w] || {}).kind !== 'suffix' && (LEX[c.w] || {}).kind !== 'op' && (LEX[c.w] || {}).kind !== 'nimitta' && !['dhatu', 'pratyahara', 'varna', 'pos', 'sthana', 'qual6'].includes((LEX[c.w] || {}).kind) && !used6.has(c.w) && !dh6.some(d => d.form === c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 6) : [];
    rec.superseded = (nim.dropped || []).slice();
    if (sound && !soundCarried) carried.filter(c => ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind) && c.w !== sound.form).forEach(c => rec.superseded.push({ w: c.w, by: sound.form }));
    const isGV = op === 'गुणः' || op === 'वृद्धिः';
    const chain = [], chainC = [];
    let last = false; // 1.1.52 → अन्त्यस्य अलः
    dh6.forEach(d => { chain.push(d.form); const L = LEX[d.form]; if (L && (L.shtip || /ेः$/.test(d.form))) fire('3.3.108 vt.2', '✔', 2, `${d.form}: dhātu named in its ${L.shtip ? 'श्तिप्' : 'इक्'} form`, `= the dhātu ${[].concat(L.root).join(', ')}`); });
    quals.forEach(q => { const L = LEX[q.form]; if (L.parts) st.set(q.form, L.parts.join(' ') + ' च', L.upadha ? '1.1.65' : [], `${q.form} = ${L.parts.join(' + ')}` + (L.upadha ? ' (उपधा = the sound before the last)' : '')); chain.push(...(L.parts ? [...L.parts.slice(0, -1), L.parts[L.parts.length - 1], 'च'] : [q.form])); if (L.upadha) fire('1.1.65', '✔', 2, `${q.form}: उपधा named`, 'the sound before the last'); });
    if (sth.length) chain.push(...sth.map(w => w.form));
    // the sūtra's own 6th-case nouns (चितेः → “चितिशब्दस्य”; तुजादीनाम्) and 5th-case words (… उत्तरस्य, 1.1.67)
    other6.forEach(w => { const L = LEX[w.form] || {}; const t = L.kind === 'word' && !/आदि/.test(w.form) ? wStem(w).replace(/[्ःं]$/, '') + 'शब्दस्य' : w.form.replace(/-/g, ' '); chain.push(t); st.set(w.form, t, '1.1.49', `${w.form}: 6th case → the thing operated on`); });
    car6.forEach(c => { chain.push(c.w); st.snap('1.1.49', `${c.w} (carried over): 6th case → the thing operated on`); });
    const c5o = car5Of(carried, words);
    if (c5o.length) { chain.unshift(...c5o.map(c => c.w), 'उत्तरस्य'); fire('1.1.67', '✔', 2, `${c5o.map(c => c.w).join(', ')} (carried over): 5th case`, 'the operation is on what FOLLOWS it'); st.snap('1.1.67', `${c5o.map(c => c.w).join(', ')} (carried over): 5th case → on what follows (“… उत्तरस्य”)`); }
    // a sound (or suffix) named in the 5th next to a noun in the 5th describes it → “what ends in it” (ऋतो विद्यायोनिसम्बन्धेभ्यः → ऋकारान्तेभ्यः …, 1.1.72 / PIS 23)
    const tad5 = (w, pl) => {
      const end = pl ? 'ेभ्यः' : 'ात्'; let any = false; const pids = new Set();
      const out = w.segs.map((g, i) => { const g2 = g.replace(/ब्भ्यः$|ब्भ्याम्$/, 'प्'); const L = (g2 !== g && (LEX[g2] || (/^[चटड]?आप्$/.test(g2) && { kind: 'suffix', stem: g2 }) || (suffixOf(g2) && { kind: 'suffix', stem: suffixOf(g2) }))) || w.lex[i] || LEX[g] || {};
        if (['pratyahara', 'varna'].includes(L.kind) || /^ह्रस्व/.test(g)) { any = true; pids.add('1.1.72'); return (/^ह्रस्व/.test(g) ? 'ह्रस्वान्त' : sTad(L)) + end; }
        if (L.kind === 'suffix' && L.stem) { any = true; pids.add('PIS 23'); return antaOf(L.stem) + end; }
        return g; });
      if (w.segs.length > 1 && out.some((x, i) => x === w.segs[i])) return null;   // a compound of plain words (वर्षक्षरशरवरात्): no tadanta
      return any ? { ph: out.length > 1 ? [...out, 'च'] : out, pids: [...pids] } : null;
    };
    const nounW5 = own5.some(w => w.lex.every(l => l) && !/^(रहाभ्याम्|रषाभ्याम्)$/.test(w.form) && !w.lex.some(l => ['pratyahara', 'varna', 'suffix'].includes(l.kind))) || carried.some(c => (autoOf(sid(c.from), c.w) || {}).cs === 5 && !['pratyahara', 'varna', 'suffix'].includes((LEX[c.w] || {}).kind) && !SILENT[c.w] && !/^(धातोः|ङ्याप्प्रातिपदिकात्|पदात्|अङ्गात्)$/.test(c.w));
    if (own5.length && nounW5 && !anga) own5.forEach(w => { if (w.lex.some(l => l && !['pratyahara', 'varna', 'suffix'].includes(l.kind)) && w.segs.length === 1) return; const pl = own5.some(x => x !== w && x.num === 3) || w.num === 3; const r = tad5(w, pl); if (!r) return; w._t5 = r.ph.join(' '); r.pids.forEach(pid => fire(pid, '✔', 2, `${w.form}: ${pid === '1.1.72' ? 'a sound' : 'a suffix'} in the 5th describing the word it goes with`, `${w._t5} (what ends in it)`)); st.set(w.form, w._t5, r.pids, `${w.form}: describes the 5th-case word with it → “what ends in it”`); });
    // with अङ्गस्य / पदस्य: a sound or suffix in the 5th describes the aṅga/pada the operation follows (आत् → अवर्णान्तात् अङ्गात्, डः → डकारान्तात् पदात्)
    if (own5.length && (anga || baseW === 'पदस्य')) own5.forEach(w => { if (w._t5) return; if (!w.lex.length || !w.lex.every(l => l && ['pratyahara', 'varna', 'suffix'].includes(l.kind)) && !/^(आत्|नात्|अनः|डः|नः|ह्रस्व-नदी-आपः|नद्याः)$/.test(w.form)) return;
      const r = w.form === 'आत्' ? { ph: ['अवर्णान्तात्'], pids: ['1.1.72'] } : w.form === 'नात्' ? { ph: ['नकारान्तात्'], pids: ['1.1.72'] } : w.form === 'अनः' ? { ph: ['अन्नन्तात्'], pids: ['1.1.72'] } : w.form === 'डः' ? { ph: ['डकारान्तात्'], pids: ['1.1.72'] } : w.form === 'नः' ? { ph: ['नकारान्तात्'], pids: ['1.1.72'] } : w.form === 'ह्रस्व-नदी-आपः' ? { ph: ['ह्रस्वान्तात्', 'नद्यन्तात्', 'आबन्तात्', 'च'], pids: ['1.1.72', 'PIS 23'] } : w.form === 'नद्याः' ? { ph: ['नद्यन्तात्'], pids: ['1.1.72'] } : tad5(w, false);
      if (!r) return; w._t5 = [...r.ph, anga ? 'अङ्गात्' : 'पदात्'].join(' '); rec._angaAbl = anga;
      r.pids.forEach(pid => fire(pid, '✔', 2, `${w.form}: ${pid === '1.1.72' ? 'a sound' : 'a suffix'} in the 5th describing the ${anga ? 'aṅga' : 'pada'}`, `${w._t5} — ${anga ? 'an aṅga' : 'a pada'} ENDING in it`));
      st.set(w.form, w._t5, r.pids, `${w.form}: describes the ${anga ? 'aṅga' : 'pada'} → “after ${anga ? 'an aṅga' : 'a pada'} ending in it”`); });
    if (own5.length) { const ph = own5.map(w => w._t5 || w.form.replace(/-/g, ' ')); chain.unshift(...ph, 'उत्तरस्य'); fire('1.1.67', '✔', 2, `${own5.map(w => w.form).join(', ')}: 5th case`, 'the operation is on what FOLLOWS it'); st.snap('1.1.67', `${own5.map(w => w.form).join(', ')}: 5th case → on what follows (“… उत्तरस्य”)`); }
    sfxQ.forEach(w => {
      const isSfx = isSfxW(w);
      const stm = isSfx ? ((LEX[w.form] && LEX[w.form].stem) || (w.lex[0] && w.lex[0].stem) || w.form) : w.form.replace(/स्य$/, '');
      const t = (isSfx ? antaOf(stm) : stm + 'ान्त') + 'स्य';
      chain.push(t); st.set(w.form, t, isSfx ? ['PIS 23'] : ['1.1.72'], `${w.form}: ${isSfx ? 'a suffix' : 'a sound class'} named in the 6th qualifies the ${baseW || 'अङ्गस्य'} → “what ends in it”`);
      fire(isSfx ? 'PIS 23' : '1.1.72', '✔', 2, `${w.form} qualifies ${baseW || 'अङ्गस्य'}`, `${t} (what ends in it)`);
    });
    const posNow = own6.filter(w => kindOf(w) === 'pos').map(w => w.form).concat(carried.filter(c => (LEX[c.w] || {}).kind === 'pos').map(c => c.w));
    if (baseW && baseW !== 'अङ्गस्य' && !sth.length && allS.length) {
      // generalised tadanta: sounds qualifying धातोः/पदस्य/भस्य/प्रातिपदिकस्य; with a position word the vowel-sound is the place itself
      // लोपः of a single consonant in a pada: the consonant itself is dropped (रो रि → पदस्य रेफस्य लोपः), not “a pada ending in it”
      const lopaC = !posNow.length && op === 'लोपः' && baseW === 'पदस्य' && allS.length === 1 && (LEX[allS[0].form] || {}).cons && !(LEX[allS[0].form] || {}).parts;
      const place = posNow.length ? (allS.find(vowelish) || allS[0]) : lopaC ? allS[0] : null;
      const quals = allS.filter(x => x !== place);
      const tq = quals.map(q => sTad(LEX[q.form]) + 'स्य');
      quals.forEach((q, i) => {
        st.set(q.form, tq[i], '1.1.72', `${q.form}${q.own ? '' : ' (carried over)'} describes ${baseW} → “a ${baseW.replace(/स्य$|ोः$/, '')} ending in it” (tadanta)`);
        fire('1.1.72', '✔', 2, `${q.form}${q.own ? '' : ' (carried over' + (q.from ? ' from ' + q.from : '') + ')'} qualifies ${baseW}`, `${tq[i]} ${baseW} (what ends in it)`);
        const L = LEX[q.form] || {}; if (L.kind === 'pratyahara') fire('1.1.71', '✔', 2, `${L.stem}: a sound group`, 'first sound + final marker = everything in between');
        if (L.tapara) fire('1.1.70', '✔', 2, `${q.form}: तपर`, taparaLen(L.stem));
      });
      chain.push(...(tq.length > 1 ? [...tq, 'च'] : tq), baseW);
      if (place && lopaC) { const t = SNAME(LEX[place.form].stem) + 'स्य'; chain.push(t); st.set(place.form, t, [], `${place.form}: the consonant itself is what is dropped`); }
      else if (place) { chain.push(...posNow, place.form); if (posNow.includes('उपधायाः')) fire('1.1.65', '✔', 2, 'उपधायाः', 'the sound before the last'); st.snap(posNow.includes('उपधायाः') ? '1.1.65' : [], `${posNow.join(' ')} names the position — ${place.form} itself is the place (no tadanta)`); }
      else if (op && op !== 'लोपः') last = true;
    } else if (anga && !sth.length) {
      // the sūtra's own 6th already names the aṅga as “… -अन्तस्य” (वदव्रजहलन्तस्याचः): the sound is the PLACE in it, not what the aṅga ends in (Kāśikā “… अङ्गानाम् अचः स्थाने वृद्धिः”)
      if (sound && !pos.length && !soundCarried && own6.some(w => w !== sound && /न्तस्य$/.test(w.form))) { chain.push('अङ्गस्य', sound.form); st.snap([], `${sound.form}: the sound of that aṅga which is replaced (not what the aṅga ends in)`); }
      else if (sound && !pos.length) {
        const L = LEX[sound.form];
        const t = L.tapara ? tadantaStem(L.stem + 'त्') : tadantaStem(L.stem);
        chain.push(t + 'स्य', 'अङ्गस्य'); last = true;
        st.set(sound.form, t + 'स्य', ['1.1.72'].concat(L.tapara ? ['1.1.70'] : []), `${sound.form}${soundCarried ? ' (carried over)' : ''} describes अङ्गस्य → “an aṅga ending in it” (tadanta)` + (L.tapara ? '; तपर → only the short ' + L.stem : ''));
        if (L.tapara) fire('1.1.70', '✔', 2, `${sound.form}: तपर`, taparaLen(L.stem));
        if (L.kind === 'pratyahara') fire('1.1.71', '✔', 2, `${L.stem}: a sound group`, 'first sound + final marker = everything in between');
        fire('1.1.72', '✔', 2, `${sound.form}${soundCarried ? ' (carried over' + (sound.from ? ' from ' + sound.from : '') + ')' : ''} qualifies अङ्गस्य`, `${t}स्य अङ्गस्य (an aṅga ending in it)` + (k === 'āgama' && soundCarried ? ' — the Kāśikā instead reads अतः as the place itself (अङ्गस्यातः); same result, since a kit augment goes at the end' : ''));
        if (soundCarried && sound.from === '7.2.80') notes.push('अतः is 5th case in 7.2.80 (अतो येयः) and is read as 6th here — a carried word taking the case its new slot needs.');
      } else if (sound && pos.length && (LEX[sound.form] || {}).cons && pos.includes('उपधायाः')) {
        // a consonant with उपधायाः (नोपधायाः): the consonant ends the aṅga (tadanta); the place is its penultimate
        const t = sTad(LEX[sound.form]) + 'स्य';
        chain.push(t, 'अङ्गस्य', ...pos); fire('1.1.72', '✔', 2, `${sound.form} qualifies अङ्गस्य`, `${t} अङ्गस्य (an aṅga ending in it)`); fire('1.1.65', '✔', 2, 'उपधायाः', 'the sound before the last');
        st.set(sound.form, t + ' अङ्गस्य', ['1.1.72', '1.1.65'], `${sound.form}: a consonant ending the aṅga (tadanta); उपधायाः = its penultimate is the place`);
      } else if (sound && pos.length) {
        chain.push('अङ्गस्य', ...pos, sound.form);
        st.snap(pos.includes('उपधायाः') ? '1.1.65' : [], `${pos.join(' ')} names the position — ${sound.form} itself is the place (no tadanta)`);
        const L = LEX[sound.form]; if (L && L.tapara) fire('1.1.70', '✔', 2, `${sound.form}: तपर`, taparaLen(L.stem));
        if (pos.includes('उपधायाः')) fire('1.1.65', '✔', 2, 'उपधायाः', 'the sound before the last');
      } else if (isGV) {
        st.ins('अङ्गस्य', 'इकः', '1.1.3', `${op} is named with no sound to replace → इकः is supplied (1.1.3)`);
        if (dh6.length || quals.length) chain.push('अङ्गस्य', 'इकः');
        else { chain.push('इगन्तस्य', 'अङ्गस्य'); last = true; st.set('+इकः', '', [], ''); rec.steps.pop(); st.set('अङ्गस्य', 'इगन्तस्य अङ्गस्य', '1.1.72', 'इकः describes अङ्गस्य → “an aṅga ending in इक्” (tadanta)'); fire('1.1.72', '✔', 2, 'इकः (supplied by 1.1.3) qualifies अङ्गस्य', 'इगन्तस्य अङ्गस्य (an aṅga ending in इक्)'); }
        fire('1.1.3', '✔', 2, `${op.replace('ः', '')} is named with no sound to replace`, 'इकः is supplied');
        fire('1.1.71', '✔', 2, 'इक्: a sound group', 'इ उ ऋ ऌ');
      } else if (pos.length) { chain.push('अङ्गस्य', ...pos); if (pos.includes('उपधायाः')) fire('1.1.65', '✔', 2, 'उपधायाः', 'the sound before the last'); }   // क्रमश्च क्त्वि ← उपधायाः: the place is named, no “last sound”
      else { chain.push('अङ्गस्य'); if (op && op !== 'लोपः') last = true; }
    }
    if (op === 'लोपः' && dh6.length && !sth.length) last = true;
    // a sound of the sūtra's own in the 6th with no base to qualify is itself the place (ह्रस्वस्य … तुक्)
    // …except in the uttarapada section (6.3.1 ff.), where a sound or suffix in the 6th describes the pūrvapada: “a pūrvapada ending
    // in it” (इकः → इगन्तस्य, ङ्यः → ङ्यन्तस्य, ङ्यापोः → ङ्यन्तस्य आबन्तस्य च) — 1.1.72 / PIS 23
    const UPSEC = has('उत्तरपदे') && +rec.id >= 63001 && +rec.id <= 63139;
    // with अङ्गस्य: a compound of sounds / suffixes in the 6th describes the aṅga (झल्-अचः → झलन्तस्य अजन्तस्य च अङ्गस्य; शतुः → शत्रन्तस्य) — 1.1.72 / PIS 23
    const SPLIT6 = { 'झलचः': ['झल्', 'अच्'], 'श्र्युकः': ['श्रि', 'उक्'] };   // श्र्युकः = श्रि + उक् (PV/Kāśikā 7.2.11 “श्रि इत्येतस्य उगन्तानां च”)
    const SPLITW = { 'श्रि': 1 };
    const ag6 = own6.concat(carried.filter(c => /^(शतुः|वसोः)$/.test(c.w) && !own6.some(w => w.form === c.w)).map(c => ({ form: c.w, segs: [c.w], lex: [], carried: true })));
    if (anga && !sth.length && k === 'āgama') ag6.forEach(w => {
      const segs = SPLIT6[w.form] || w.segs;
      if (segs.length < 2 && !/^(शतुः|वसोः)$/.test(w.form)) return;
      const parts = segs.map((g, i) => { if (SPLIT6[w.form] && SPLITW[g]) return { t: g + '_ इत्येतस्य', pid: null }; const L = SPLIT6[w.form] ? (LEX[g] || { kind: 'pratyahara', stem: g }) : (w.lex[i] || LEX[g] || {}); if (['pratyahara', 'varna'].includes(L.kind)) return { t: sTad(L) + 'स्य', pid: '1.1.72' }; if (L.kind === 'suffix' || /^(शतुः|वसोः)$/.test(w.form)) return { t: antaOf(L.stem || (w.form === 'शतुः' ? 'शतृ' : 'वसु')) + 'स्य', pid: 'PIS 23' }; return null; });
      if (parts.some(x => !x)) return;
      const ph = parts.length > 1 ? [...parts.map(x => x.t), 'च'] : [parts[0].t];
      const at = chain.findIndex(x => x === w.form || x === w.form.replace(/-/g, ' ') || x === w.form.replace(/-/g, ''));
      if (at >= 0) chain.splice(at, 1, ...ph); else chain.push(...ph);
      parts.filter(x => x.pid).forEach(x => fire(x.pid, '✔', 2, `${w.form}: describes the aṅga`, `${x.t} अङ्गस्य — an aṅga ENDING in it`));
      st.set(w.form, ph.join(' ').replace(/_/g, ''), [...new Set(parts.map(x => x.pid).filter(Boolean))], `${w.form}: sounds/suffixes in the 6th describe the aṅga → “ending in them”`); w._done = true;
    });
    if (UPSEC && !baseW && !anga && !sth.length) {
      own6.forEach(w => { const at = chain.findIndex(x => x === w.form || x === w.form.replace(/-/g, ' ') || x === w.form.replace(/-/g, ''));
        const negA = w.segs[0] === 'अ' && w.segs.length > 1; const segs0 = negA ? w.segs.slice(1) : w.segs;
        const parts = segs0.map((g, i0) => { const i = negA ? i0 + 1 : i0; const L = w.lex[i] || LEX[g] || {}; const g2 = g.replace(/(ः|ोः|योः)$/, '');
          if (['pratyahara', 'varna'].includes(L.kind)) return { t: sTad(L) + 'स्य', pid: '1.1.72' };
          if (g2 === 'अङ्य') return { t: 'अङ्यन्तस्य', pid: 'PIS 23' };   // अङ्यः = not ending in ङी (6.3.61)
          const sf = L.kind === 'suffix' ? (L.stem || g2) : /^(ङ्य|ङि|ङी)$/.test(g2) ? 'ङी' : /^(आप|आब्)$/.test(g2) ? 'आप्' : null;
          return sf ? { t: antaOf(sf) + 'स्य', pid: 'PIS 23' } : null; });
        if (!parts.length || parts.some(x => !x)) return;
        if (negA) parts.forEach(x => { x.t = 'अ' + x.t; });   // अङ्यः → अङ्यन्तस्य
        const ph = parts.length > 1 ? [...parts.map(x => x.t), 'च'] : [parts[0].t];
        if (at >= 0) chain.splice(at, 1, ...ph); else chain.push(...ph); parts.forEach(x => fire(x.pid, '✔', 2, `${w.form}: describes the pūrvapada (uttarapada section)`, `${x.t} — a pūrvapada ENDING in it`));
        st.set(w.form, ph.join(' '), [...new Set(parts.map(x => x.pid))], `${w.form}: in the uttarapada section a sound/suffix in the 6th describes the pūrvapada → “ending in it”`); w._done = true; });
    }
    if (!baseW && !anga && sound && !soundCarried && !sth.length && !chain.includes(sound.form) && !(own6.find(w => w.form === sound.form) || {})._done) chain.push(sound.form);
    if (isGV) {
      if (rec.P.some(p => p.pid === '1.1.3')) fire('1.1.5', '?', 2, 'this guṇa/vṛddhi comes through 1.1.3 (इग्लक्षण)', 'so it is blocked before a कित्/ङित्/गित् suffix (class 57; SK on 1.1.5: “इग्लक्षणे”)');
      else if (sound) fire('1.1.5', '✖', 2, `the sound replaced is named here (${sound.form}), not supplied by 1.1.3`, '1.1.5 does not block it (class 57; SK on 1.1.5: “इग्लक्षणे”)');
      fire('1.1.50', '✔', 2, `${op.replace('ः', '')} replaces a vowel`, 'the nearest guṇa/vṛddhi sound is chosen');
      fire('1.1.51', '✔', 2, 'when the vowel replaced is ऋ/ऌ', 'it comes with र्/ल् (अर्, आर्, अल्)');
    }
    if (isGV) st.snap(rec.P.some(p => p.pid === '1.1.3') ? '1.1.5' : (sound ? '1.1.5' : []), rec.P.some(p => p.pid === '1.1.3') ? 'this guṇa/vṛddhi comes through 1.1.3 → 1.1.5 would block it before a कित्/ङित्/गित् suffix' : `the sound replaced (${sound ? sound.form : ''}) is named in the sūtra → 1.1.5 does not block it`);
    if (op === 'लोपः') st.snap('1.1.60', 'लोप = non-appearance; it counts as a replacement');
    if (op === 'लोपः') fire('1.1.60', '✔', 2, 'लोपः', 'non-appearance; it counts as a replacement (class 61)');
    if (last) st.ins(st.has('अङ्गस्य') ? 'अङ्गस्य' : (dh6[0] || {}).form, 'अन्त्यस्य अलः', '1.1.52', 'a one-sound replacement of a whole aṅga/dhātu → only its LAST sound');
    if (k === 'operation' && op) st.set(op, op + ' आदेशः', isGV ? ['1.1.50', '1.1.51'] : [], isGV ? 'the operation is a replacement; the nearest guṇa/vṛddhi sound is chosen (1.1.50), ऋ/ऌ with र्/ल् (1.1.51)' : 'the operation is a replacement (आदेशः)');
    if (last) fire('1.1.52', '✔', 2, pos.length ? '' : 'the place is a whole aṅga/dhātu and the replacement is one sound', 'it replaces the LAST sound → अन्त्यस्य अलः');
    if (pos.includes('आदेः')) fire('1.1.52', '✖', 2, 'आदेः names the position', 'the FIRST vowel is replaced, not the last');
    if (has('असिद्धवदत्राभात्')) fire('1.3.11', '?', 2, 'असिद्धवदत्राभात् (6.4.22) is in scope', 'it governs ORDER in a derivation, not the reading of this sūtra — out of scope');
    const negC = carried.some(c => c.w === 'न') || words.some(w => w.form === 'न' && w.wcase === 0);
    if (negC) st.snap([], 'न → the operation does NOT apply here');
    // the sūtra's own 7th-case words that are not “what follows”: a domain (संज्ञायाम् → संज्ञायां विषये) or, under उत्तरपदे, the uttarapada itself
    const DOMW = /^(संज्ञायाम्|छन्दसि|भाषायाम्|यजुषि|गोत्रे|आमन्त्रिते|संहितायाम्)$/;
    const upHead = has('उत्तरपदे');
    const rest7 = words.filter(w => w.wcase === 7 && !NIMK(w.form) && !(LEX[w.form] && ['option', 'nimitta'].includes(LEX[w.form].kind)) && !nim.list.some(n => n.form === w.form));
    const tail7 = [];
    rest7.forEach(w => {
      if (DOMW.test(w.form)) { tail7.push(w.form, 'विषये'); return; }
      if (upHead) { const stm = (LEX[w.form] && LEX[w.form].stem) || w.form.replace(/(े|ि|ौ|ायाम्)$/, m => m === 'ायाम्' ? 'ा' : m === 'ौ' ? 'ि' : m === 'े' ? '' : 'ि'); tail7.push(stm + 'शब्दे', 'उत्तरपदे'); fire('1.1.66', '✔', 2, `${w.form}: 7th case under उत्तरपदे`, 'names the uttarapada — the operation is on the member before it'); st.set(w.form, stm + 'शब्दे उत्तरपदे', '1.1.66', `${w.form}: 7th case → the uttarapada (the operation is on what precedes it)`); return; }
      // in the operation chapters a 7th-case word of the sūtra's own (नामि, सम्प्रसारणे) names what follows unless it states a meaning
      if (+rec.id >= 61001 && !MEANING7.test(w.form) && (w.lex.some(l => l && ['suffix', 'term', 'pratyahara', 'varna', 'sound', 'agama', 'dhatu'].includes(l.kind)) || /^(नामि|सम्प्रसारणे|असवर्णे|करोतौ|किरतौ)$/.test(w.form)) && !/^(तत्पुरुषे|बहुव्रीहौ|द्वन्द्वे|अव्ययीभावे|कर्मधारये|द्विगौ|समासे|असमासे|उत्तरपदे|पदान्ते|अवसाने|उपदेशे|अन्ते)$/.test(w.form) && !/(व्यवाये|अर्थे)$/.test(w.form)) { nim.C.unshift(w.form.replace(/-/g, ' '), 'परे'); nim.K.unshift(w.form.replace(/-/g, ' '), 'परतः'); fire('1.1.66', '✔', 2, `${w.form}: 7th case`, 'names what FOLLOWS — the operation is on what precedes it'); st.set(w.form, w.form + ' परे', '1.1.66', `${w.form}: 7th case → names what follows`); return; }
      tail7.push(w.form.replace(/-/g, ' '));
    });
    // उत्तरपदे carried (6.3.1 ff.) with no uttarapada word of the sūtra's own: “उत्तरपदे परे” (1.1.66)
    if (upHead && !rest7.filter(w => !DOMW.test(w.form)).length && !nim.list.length) { nim.C.push('उत्तरपदे', 'परे'); nim.K.push('उत्तरपदे', 'परतः'); fire('1.1.66', '✔', 2, 'उत्तरपदे (carried over): 7th case', 'names what FOLLOWS — the uttarapada; the operation is on the member before it'); }
    if (rec._car5S) { const c = rec._car5S; chain.unshift(c.w, 'उत्तरस्य'); fire('1.1.67', '✔', 2, `${c.w} (carried over from ${c.from}): 5th case`, 'the operation falls on what FOLLOWS it (“… उत्तरस्य”)'); st.snap('1.1.67', `${c.w} (carried over, 5th) → on what follows it (“${c.w} उत्तरस्य”)`); }
    if (k === 'operation') {
      const opC = op === 'अलुक्' || op === 'अलुग्' ? ['अलुक्'] : [op, op === 'गुण-वृद्धी' ? 'आदेशौ' : 'आदेशः'];
      chain.push(...tail7);
      if (negC) { fin([...nim.K, ...chain, op, 'न', 'भवति'], [...nim.K.map(x => x === 'परतः' ? 'परे' : x), ...chain, op, 'न', 'स्यात्'], [...nim.C, ...chain, ...opC, 'न', 'भवति']); return; }
      // class style: the place in the 6th takes “स्थाने” (1.1.49) — “… इकः स्थाने गुणः आदेशः भवति”
      const has6 = chain.some(x => /(स्य|ः|योः|ाम्|ानाम्|णाम्)$/.test(x) && !/^(उत्तरस्य|परस्य)$/.test(x)) && op !== 'अलुक्' && op !== 'अलुग्' && !/लोपः$/.test(op || '');   // लोप: “X-स्य लोपः” (class 53; PV)
      // the step is always recorded; the class-style text keeps the class glosses' own wording (class 55/56 leave स्थाने unsaid, 7.2.115/116 say it)
      if (has6 && !rec.P.some(p => p.pid === '1.1.49')) { fire('1.1.49', '✔', 2, 'the place is named in the 6th', 'the operation replaces it (“स्थाने”, often left unsaid in the gloss)'); st.snap('1.1.49', 'the 6th-case place is what the operation replaces (1.1.49 — “स्थाने”, often left unsaid)'); }
      fin([...nim.K, ...chain, op, 'भवति'], [...nim.K.map(x => x === 'परतः' ? 'परे' : x), ...chain, op, 'स्यात्'], [...nim.C, ...chain, ...(last ? ['अन्त्यस्य', 'अलः'] : []), ...opC, 'भवति']);
    } else {
      let ag = words.find(w => (LEX[w.form] && LEX[w.form].kind === 'agama') || w.lex.some(l => l && l.kind === 'agama')) || words.find(w => w.wcase === 1 && /^(मट्|तमट्|थुक्|तिथुक्|इथुक्|थट्)$/.test(w.form));
      // the augment carried over from an earlier sūtra (सनि ग्रहगुहोश्च ← इट्)
      if (!ag) { const c = carried.find(c => !SILENT[c.w] && ((LEX[c.w] || {}).kind === 'agama' || ((autoOf(sid(c.from), c.w) || {}).pieces || [])[0]?.kind === 'agama')); if (c) ag = { form: c.w, lex: [], carriedFrom: c.from }; }
      // an augment carried inside a compound: सुट्कात्पूर्वः (6.1.135) = सुट् placed before क्
      let agTail = [];
      if (!ag) { const AGM = /^(सुट्|तुक्|नुक्|मुक्|दुक्|युक्|आट्|अट्|इट्|नुट्|नुम्|यिट्|पुक्)(.*)$/; const c = carried.find(c => AGM.test(c.w)); if (c) { const m = c.w.match(AGM); ag = { form: m[1], lex: [], carriedFrom: c.from }; if (/कात्पूर्वः/.test(m[2])) agTail = ['कात्', 'पूर्वः']; } }
      if (!ag) { const c = carried.find(c => /^(मट्|तमट्|थुक्|तिथुक्|इथुक्|थट्)$/.test(c.w)); if (c) ag = { form: c.w, lex: [], carriedFrom: c.from }; }   // a डट् augment carried (5.2.57 ← तमट्)
      // an own word that is an augment's name though the lexicon does not say so (ईट्, याट्, रुक्-रिक् …)
      if (!ag) { const AUG2 = /^(इट्|ईट्|अट्|आट्|याट्|स्याट्|सुट्|यासुट्|सीयुट्|तुक्|नुक्|मुक्|दुक्|युक्|थुक्|पुक्|वुक्|कुक्|रुक्|रिक्|रीक्|नीक्|मुम्|नुम्|सुम्|ङमुट्|उम्|यिट्|यक्|रुट्|पुम्|आदुक्)$/; const w = words.find(w => w.wcase === 1 && w.segs.some(g => AUG2.test(g.replace(/(ौ|ाः|ः)$/, '्').replace(/््$/, '्')))); if (w) ag = w; else { const c = carried.find(c => AUG2.test(c.w)); if (c) ag = { form: c.w, lex: [], carriedFrom: c.from }; } }
      if (!ag) throw new Error('augment word not found');
      const L = LEX[ag.form] || ag.lex.find(l => l && l.kind === 'agama') || {};
      const mk = L.marker && L.marker !== '?' ? L.marker : ((ag.form.replace(/[ःम्]?$/, m => m === 'म्' ? 'म्' : '').match(/([टकम])्$/) || [])[1] || (/म्$/.test(ag.form) ? 'म' : 'ट'));
      if (+rec.id >= 52049 && +rec.id <= 52058 && !chain.includes('डटः')) { const own6b = words.some(w => w.wcase === 6); if (own6b) { chain.push('पूरणे', 'डटि', 'परे'); fire('1.1.66', '✔', 2, 'डटि (5.2.48, carried in sense): 7th', 'the augment is added to the base when डट् FOLLOWS (prathamāvṛtti: “डटि परतः”)'); notes.push('डट् is supplied from 5.2.48 (तस्य पूरणे डट्); with a base named in the 6th the augment goes on that base before डट् (prathamāvṛtti: “… पूरणार्थे डटि परतः … आगमो भवति”).'); } else { const ui = chain.indexOf('उत्तरस्य'); if (ui > 0) { chain.splice(ui, 0, 'षष्ठीसमर्थात्'); fire('4.1.82', '✔', 2, 'तस्य (5.2.48, carried in sense): the base of डट् is in the 6th', 'षष्ठीसमर्थात् — the first of the connected words, in the 6th (samartha)'); } chain.push('पूरणे', 'विहितस्य', 'डटः'); notes.push('डटः is supplied from 5.2.48 (तस्य पूरणे डट्): the data’s anuvṛtti list does not carry it, but the Kāśikā and the prathamāvṛtti both read “… डटो … आगमो भवति”'); } }
      const agK = glue(jas(ag.form), 'आगमः');
      if (mk === 'म') {
        st.set(ag.form, ag.form + ' आगमः', '1.1.47', `${ag.form}: an augment with a म् marker → it goes after the LAST VOWEL of the place`);
        fire('1.1.47', '✔', 2, `${ag.form}: mit augment`, 'it goes right after the last vowel (मिदचोऽन्त्यात्परः)');
      } else {
        st.set(ag.form, ag.form + ' आगमः', '1.1.46', `${ag.form}: an augment with a ${mk === 'ट' ? 'ट्' : 'क्'} marker → it goes at the ${mk === 'ट' ? 'BEGINNING' : 'END'} of the place`);
        fire('1.1.46', '✔', 2, `${ag.form}: ${mk === 'ट' ? 'ṭit' : 'kit'} augment`, mk === 'ट' ? `it goes at the BEGINNING of ${sth.length ? sth.map(w => w.form).join(' ') : 'the place'}` : 'it goes at the END of the place (after the last sound of the aṅga)');
      }
      if (rec._angaAbl) { const ix = chain.lastIndexOf('अङ्गस्य'); if (ix >= 0 && chain.some(x => /अङ्गात्/.test(x))) chain.splice(ix, 1); }   // “… अङ्गात् उत्तरस्य” already names the aṅga
      // a carried न (नेड्वशि कृति 7.2.8 …) makes it a prohibition: “… इडागमो न भवति” (PV/Kāśikā 7.2.9 ff.); 7.1.79 वा नपुंसकस्य is the optional positive (Kāśikā “वा नुम्”)
      const ngA = (carried.some(c => c.w === 'न') || words.some(w => w.form === 'न' && w.wcase === 0)) && rec.id !== '71079' ? ['न'] : [];
      if (ngA.length) st.snap([], 'न (carried over) → the augment does NOT come');
      fin([...nim.K, ...chain, agK, ...agTail, ...ngA, 'भवति'], [...chain, agK, ...agTail, ...ngA, 'स्यात्', ...nim.K.map(x => x === 'परतः' ? 'परे' : x)], [...nim.C, ...chain, ag.form, 'आगमः', ...agTail, ...ngA, 'भवति']);
    }
    return;
  }
  if (k === 'ādeśa') {
    const nim = nimittaPhrase(words, an, ad, fire, st);
    // 5.3.3–5.3.6 (इदम इश् …): the replacement is made before the प्राग्दिशीय suffixes (carried प्राग्दिशो विभक्तिः)
    if (+rec.id >= 53003 && +rec.id <= 53006 && has('प्राग्दिशो विभक्तिः')) { nim.C.unshift('प्राग्दिशीयेषु', 'प्रत्ययेषु', 'परे'); nim.K.unshift('प्राग्दिशीयेषु', 'प्रत्ययेषु', 'परतः'); fire('1.1.66', '✔', 2, 'प्राग्दिशो विभक्तिः (carried over): the suffixes of this section', 'the replacement is made when one of them FOLLOWS'); st.snap('1.1.66', 'प्राग्दिशो विभक्तिः (carried): the replacement is made before the section’s suffixes (“प्राग्दिशीयेषु प्रत्ययेषु परे”)'); }
    // 6.4.120–6.4.126: एत् (6.4.119) replaces the अ of the aṅga, and the abhyāsa is dropped (PV/Kāśikā “… अतः स्थाने एकारादेशो भवति, अभ्यासलोपश्च”)
    if (+rec.id >= 64120 && +rec.id <= 64126 && has('एत्') && has('अभ्यासलोपः')) {
      const strip = a => a.filter(x => x !== 'एकहल्मध्ये');
      const dh = words.filter(w => w.work === 6 && !/^(अतः|अनादेशादेः)$/.test(w.form));
      const multi = dh.length === 1 && dh[0].segs.length > 1 && /(ः|[^ान]ाम्)$/.test(dh[0].form) && !/गुणानाम्$/.test(dh[0].form);
      const head = !dh.length ? ['अनादेशादेः', 'अङ्गस्य', 'एकहल्मध्ये']
        : multi ? [...dh[0].segs.map((g, i) => (i === dh[0].segs.length - 1 ? g.replace(/(ः|ाम्)$/, '') : g) + '_'), 'इत्येतेषाम्', 'अङ्गानाम्']
        : [...dh.map(w => w.form.replace(/-/g, '')), dh.some(w => /ानाम्$/.test(w.form)) ? 'अङ्गानाम्' : 'अङ्गस्य'];
      const mean7 = words.filter(w => w.wcase === 7 && w.form !== 'एकहल्मध्ये' && !nim.list.some(n => n.form === w.form)).flatMap(w => [w.form, 'अर्थे']);   // राधो हिंसायाम् → “हिंसायामर्थे”
      head.unshift(...mean7);
      const opt = words.some(w => w.form === 'वा') ? ['वा'] : [], neg = words.some(w => w.form === 'न') ? ['न'] : [];
      fire('1.1.49', '✔', 2, 'अतः (6th; carried over from 6.4.120 or the sūtra’s own)', 'names the place — the अ is replaced (“अतः स्थाने”)');
      st.set(words.some(w => w.form === 'अतः') ? 'अतः' : (dh[0] || {}).form || 'अतः', [...head, 'अतः', 'स्थाने'].join(' '), '1.1.49', 'अतः (6th) → the place: the अ of the aṅga is what is replaced');
      st.snap([], 'एत् and अभ्यासलोपः are carried over from 6.4.119: the एकार replaces the अ, and the abhyāsa is dropped as well');
      const body = [...head, 'अतः', 'स्थाने', 'एकारः', 'आदेशः', ...opt, ...neg, 'भवति', 'अभ्यासलोपः', 'च'];
      fin([...strip(nim.K), ...body], [...head, 'अतः', 'एत्', ...opt, ...neg, 'स्यात्', 'अभ्यासलोपः', 'च', ...strip(nim.K).map(x => x === 'परतः' ? 'परे' : x)], [...strip(nim.C), ...body]);
      return;
    }
    const chain = [];
    carried.filter(c => (LEX[c.w] || {}).kind === 'qual6').forEach(c => chain.push(c.w));
    const own6 = words.filter(w => w.work === 6);
    own6.filter(w => (LEX[w.form] || {}).kind === 'qual6' && LEX[w.form].qualLa).forEach(w => { if (!chain.includes(w.form)) chain.push(w.form); });
    if (has('लस्य')) chain.push('लस्य');
    own6.filter(w => (LEX[w.form] || {}).kind === 'qual6' && !LEX[w.form].qualLa).forEach(w => { if (!chain.includes(w.form)) chain.push(w.form); });
    own6.filter(w => (LEX[w.form] || {}).kind !== 'qual6').forEach(w => { if (chain.includes(w.form)) return; chain.push(w.form); if ((LEX[w.form] || {}).kind === 'dhatu') { chain.push('धातोः'); const L = LEX[w.form]; if (L.shtip) fire('3.3.108 vt.2', '✔', 2, `${w.form}: dhātu named in its श्तिप् form`, `= the dhātu ${L.root}`); } });
    const own5a = words.filter(w => w.work === 5);
    // a sound in the 5th describes the base → “ending in it” (शलः → शलन्तात् धातोः), 1.1.72
    const ph5 = own5a.map(w => { const L = LEX[w.form] || {};
      // a compound in the 5th with a suffix among its members (णि-श्रि-द्रु-स्रुभ्यः): “ण्यन्तेभ्यः, श्रि द्रु स्रु इत्येतेभ्यः च” (PIS 23)
      if (w.segs.length > 1) { const sx = w.segs.map((g, i) => { const g2 = i === w.segs.length - 1 ? g.replace(/(भ्यः|भ्याम्|ात्|ः)$/, '') : g; return g2 === 'णि' || (LEX[g2] || {}).kind === 'suffix' ? (g2 === 'णि' ? 'णि' : LEX[g2].stem || g2) : null; });
        if (sx.some(Boolean) && !sx.every(Boolean)) { const pl = w.num === 3 || w.segs.length > 2; const sf = sx.filter(Boolean).map(x => antaOf(x) + (pl ? 'ेभ्यः' : 'ात्')); const rest = w.segs.map((g, i) => sx[i] ? null : (i === w.segs.length - 1 ? g.replace(/(भ्यः|भ्याम्|ात्|ः)$/, '') : g)).filter(Boolean);
          fire('PIS 23', '✔', 2, `${w.form}: a suffix (${sx.filter(Boolean).join(', ')}) among the members in the 5th`, `${sf.join(' ')} — what ENDS in it`); st.set(w.form, [...sf, rest.join(' '), rest.length > 1 ? 'इत्येतेभ्यः' : 'इत्येतस्मात्', 'च'].join(' '), 'PIS 23', `${w.form}: the suffix member stands for what ends in it`);
          return [...sf, rest.join(' '), rest.length > 1 ? 'इत्येतेभ्यः' : 'इत्येतस्मात्', 'च'].join(' '); } }
      if (L.kind === 'suffix') { const t = antaOf(L.stem || w.form) + 'ात्'; st.set(w.form, t, 'PIS 23', `${w.form}: a suffix named in the 5th → “what ends in it”`); fire('PIS 23', '✔', 2, `${w.form}: a suffix named as what precedes`, `${t} (what ends in it)`); return has('अङ्गस्य') ? t + ' अङ्गात्' : t; }
      if (['pratyahara', 'varna'].includes(L.kind)) { const t = sTad(L) + 'ात्'; st.set(w.form, t, '1.1.72', `${w.form}: a sound in the 5th describes the base → “what ends in it” (tadanta)`); fire('1.1.72', '✔', 2, `${w.form}: a sound qualifying the base`, `${t} (what ends in it)`); if (L.kind === 'pratyahara') fire('1.1.71', '✔', 2, `${L.stem}: a sound group`, 'first sound + final marker = everything in between'); return t; } if (L.kind === 'dhatu') return w.form.replace(/-/g, ' ') + ' धातोः'; return w.form.replace(/-/g, ' '); });
    if (own5a.length && (has('धातोः') || has('ङ्याप्प्रातिपदिकात्') || has('अङ्गस्य')) && own5a.some(w => ['pratyahara', 'varna'].includes((LEX[w.form] || {}).kind))) ph5.push(has('अङ्गस्य') ? 'अङ्गात्' : has('धातोः') ? 'धातोः' : 'प्रातिपदिकात्');
    // a sound carried over in the 5th, with अङ्गस्य: the replacement is of what follows an aṅga ending in it (अतः → अकारान्तात् अङ्गात् उत्तरस्य)
    if (!own5a.length && has('अङ्गस्य')) carried.filter(c => ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind) && (autoOf(sid(c.from), c.w) || {}).cs === 5).slice(0, 1).forEach(c => {
      const t = sTad(LEX[c.w]) + 'ात्'; chain.unshift(t, 'अङ्गात्', 'उत्तरस्य');
      fire('1.1.72', '✔', 2, `${c.w} (carried over from ${c.from}) qualifies the aṅga`, `${t} अङ्गात् (an aṅga ending in it)`); fire('1.1.67', '✔', 2, `${c.w}: 5th case`, 'the replacement is of what FOLLOWS it');
      st.snap(['1.1.72', '1.1.67'], `${c.w} (carried over, 5th) describes the aṅga → “after an aṅga ending in it” (${t} अङ्गात् उत्तरस्य)`);
    });
    // a suffix carried over in the 6th is the place even when the sūtra has its own 6th-case qualifiers (शल इगुपधादनिटः क्सः ← च्लेः)
    carried.filter(c => !SILENT[c.w] && (LEX[c.w] || {}).kind === 'suffix' && (autoOf(sid(c.from), c.w) || {}).cs === 6 && !chain.includes(c.w)).forEach(c => chain.push(c.w));
    const c5a = car5Of(carried, words);
    const ai = chain.indexOf('अङ्गात्');
    if (c5a.length && ai >= 0 && chain[ai + 1] === 'उत्तरस्य') { chain.splice(ai, 0, ...c5a.map(c => c.w)); fire('1.1.67', '✔', 2, `${c5a.map(c => c.w).join(', ')} (carried over): 5th case`, 'qualifies the aṅga the replacement follows'); }
    else if (c5a.length) { chain.unshift(...c5a.map(c => c.w), 'उत्तरस्य'); fire('1.1.67', '✔', 2, `${c5a.map(c => c.w).join(', ')} (carried over): 5th case`, 'the replacement is of what FOLLOWS it'); st.snap('1.1.67', `${c5a.map(c => c.w).join(', ')} (carried over): 5th case → of what follows (“… उत्तरस्य”)`); }
    // a sound carried over in the 5th with an own 5th-case word (अतः ← 7.1.9, सर्वनाम्नः): “अकारान्तात् सर्वनाम्नः उत्तरस्य” (PV/Kāśikā 7.1.14; 1.1.72)
    if (own5a.length === 1 && !['pratyahara', 'varna', 'suffix'].includes((LEX[own5a[0].form] || {}).kind) && own5a[0].segs.length === 1 && has('अङ्गस्य')) carried.filter(c => ['pratyahara', 'varna'].includes((LEX[c.w] || {}).kind) && (autoOf(sid(c.from), c.w) || {}).cs === 5).slice(0, 1).forEach(c => {
      const t = sTad(LEX[c.w]) + 'ात्'; ph5.unshift(t);
      fire('1.1.72', '✔', 2, `${c.w} (carried over from ${c.from}) qualifies ${own5a[0].form}`, `${t} ${own5a[0].form} (what ends in it)`); st.set(own5a[0].form, t + ' ' + own5a[0].form, '1.1.72', `${c.w} (carried over, 5th) describes ${own5a[0].form} → “ending in it” (tadanta)`); });
    if (own5a.length) { chain.unshift(...ph5, 'उत्तरस्य'); fire('1.1.67', '✔', 2, `${own5a.map(w => w.form).join(', ')}: 5th case`, 'the replacement is of what FOLLOWS it'); st.snap('1.1.67', `${own5a.map(w => w.form).join(', ')}: 5th case → of what follows (“… उत्तरस्य”)`); }
    // a sound carried over in the 6th is the place (दः ← 8.2.72, रः ← 8.3.14); with पदस्य/धातोः/अङ्गस्य it describes them (tadanta, below)
    const isSnd = w => ['pratyahara', 'varna'].includes((LEX[w] || {}).kind);
    const car6Snd = (!own6.some(w => (LEX[w.form] || {}).kind !== 'qual6') && !has('लस्य')) ? carried.filter(c => !SILENT[c.w] && isSnd(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 6 && !chain.includes(c.w)).slice(-1) : [];
    car6Snd.forEach(c => chain.push(c.w));
    if (!own6.length && !has('लस्य')) carried.filter(c => (/स्य$|ोः$/.test(c.w) || /^(लटः|लिटः|लोटः|लेटः|लिङः)$/.test(c.w)) && !SILENT[c.w] && !['अङ्गस्य', 'धातोः'].includes(c.w) && !(car6Snd.length && (c.w === 'पदस्य' || car6Snd.some(x => x.w === c.w))) && (autoOf(sid(c.from), c.w) || {}).cs === 6).forEach(c => { chain.push(c.w); });
    // a lakāra carried in is the place when the sūtra's own 6th-case word only qualifies (लक्षणहेत्वोः क्रियायाः ← लटः)
    const lakC = carried.find(c => /^(लटः|लिटः|लोटः|लेटः|लिङः)$/.test(c.w));
    if (lakC && own6.length && own6.every(w => w.lex.every(l => !l || ['word', 'nominal'].includes(l.kind))) && !chain.includes(lakC.w)) { chain.push(lakC.w); own6.forEach(w => { w._qual = true; }); }
    const ownAdh = own6.filter(w => /^(धातोः|पदस्य)$/.test(w.form)).map(w => w.form), hasA = x => has(x) || ownAdh.includes(x);
    const snd6 = ownAdh.length && (!has('अङ्गस्य') || ownAdh.includes('धातोः')) ? own6.filter(w => isSnd(w.form)).map(w => w.form).pop() : null;   // मो नो धातोः: the sound is the place, धातोः what it ends
    // a sound among the 6th-case words, with अङ्गस्य carried and the other 6ths describing it (एरनेकाचोऽसंयोगपूर्वस्य): the sound is the place (PV 6.4.82 “… इवर्णः तदन्तस्याङ्गस्य”)
    const sndA = !snd6 && has('अङ्गस्य') && own6.length > 1 && own6.filter(w => isSnd(w.form)).length === 1 && own6.every(w => isSnd(w.form) || (w.lex.length && w.lex.every(l => !l || ['word', '?'].includes(l.kind)) && /स्य$|चः$/.test(w.form))) ? own6.find(w => isSnd(w.form)).form : null;
    // a dhātu carried in the 6th is the place when the sūtra names none of its own (अदः ← 2.4.36 in 2.4.38–40, हनः, इङः, चक्षिङः, अजेः)
    const carDh6 = +rec.id >= 24036 && +rec.id <= 24057 && !own6.some(w => (LEX[w.form] || {}).kind !== 'qual6') ? (carried.filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 6 && ((LEX[c.w] || {}).kind === 'dhatu' || ((autoOf(sid(c.from), c.w) || {}).pieces || []).some(p => p && p.kind === 'dhatu'))).pop() || {}).w : null;
    const placeW = snd6 || sndA || (carDh6 && !has('लस्य') ? carDh6 : null) || (lakC && own6.length && own6.every(w => w._qual) ? lakC.w : null) || own6.filter(w => (LEX[w.form] || {}).kind !== 'qual6').map(w => w.form).pop() || (has('लस्य') ? 'लस्य' : car6Snd.length ? car6Snd[0].w : chain.filter(x => /स्य$|ोः$|^(लटः|लिटः|लोटः|लेटः|लिङः)$/.test(x)).pop() || '?');
    // a sound as the place with पदस्य / धातोः carried: “a pada (dhātu) ending in it” (दः → दकारान्तस्य धातोः पदस्य, 1.1.72)
    if ((!has('अङ्गस्य') || ownAdh.includes('धातोः')) && (hasA('पदस्य') || hasA('धातोः')) && isSnd(placeW) && chain.includes(placeW)) {
      const t = sTad(LEX[placeW]) + 'स्य', adh = [hasA('धातोः') ? 'धातोः' : '', hasA('पदस्य') ? 'पदस्य' : '', has('अङ्गस्य') && !chain.includes('अङ्गस्य') ? 'अङ्गस्य' : ''].filter(Boolean);
      ownAdh.forEach(x => { const i = chain.indexOf(x); if (i >= 0) chain.splice(i, 1); });
      chain.splice(chain.indexOf(placeW), 1, t, ...adh);
      fire('1.1.72', '✔', 2, `${placeW}${car6Snd.length ? ' (carried over)' : ''} qualifies ${adh.join(' ')}`, `${t} ${adh.join(' ')} (what ends in it)`);
      st.set(placeW, t + ' ' + adh.join(' '), '1.1.72', `${placeW}: a sound describing ${adh.join(' ')} → “ending in it” (tadanta)`);
    }
    // the uttarapada section (6.3.x, उत्तरपदे carried): a sound in the 6th describes the pūrvapada — “ऋकारान्तानाम्” (PV 6.3.25; 1.1.72)
    if (has('उत्तरपदे') && +rec.id >= 63001 && +rec.id <= 63139 && isSnd(placeW) && /^[अआइईउऊऋॠऌएऐओऔ]/.test((LEX[placeW] || {}).stem || '') && chain.includes(placeW) && own6.some(w => w.form === placeW) && !has('अङ्गस्य')) {
      const t = sTad(LEX[placeW]) + (own6.find(w => w.form === placeW).num === 3 ? 'ानाम्' : 'स्य'); chain.splice(chain.indexOf(placeW), 1, t);
      fire('1.1.72', '✔', 2, `${placeW}: a sound in the 6th (uttarapada section)`, `${t} — the pūrvapada ENDING in it`); st.set(placeW, t, '1.1.72', `${placeW}: a sound describing the pūrvapada → “ending in it” (tadanta)`);
    }
    // the पदस्य section's 6th-case lists that mix a sound or a suffix with words (ससजुषोः, वसुस्रंसुध्वंस्वनडुहाम्, मतुवसोः):
    // the sound/suffix describes the pada (सकारान्तस्य, वस्वन्तस्य पदस्य, 1.1.72 / PIS 23), the words are named as they are (PV, Kāśikā)
    const P8 = { 'ससजुषोः': [['स्', 's'], ['सजुष्', 'w']], 'वसुस्रंसुध्वंस्वनडुहाम्': [['वसु', 'x'], ['स्रंसु', 'w'], ['ध्वंसु', 'w'], ['अनडुह्', 'w']], 'मतुवसोः': [['मतु', 'x'], ['वसु', 'x']] };
    P8['स-सजुषोः'] = P8['ससजुषोः']; P8['वसु-स्रंसु-ध्वंसु-अनडुहाम्'] = P8['वसुस्रंसुध्वंस्वनडुहाम्']; P8['मतु-वसोः'] = P8['मतुवसोः'];   // as split by the pc errata
    if (has('पदस्य') && P8[placeW] && chain.includes(placeW)) {
      const tad = [], ws = [];
      if (has('सः') && placeW !== 'ससजुषोः') { tad.push('सकारान्तस्य'); fire('1.1.72', '✔', 2, 'सः (carried over from 8.2.66) qualifies पदस्य', 'सकारान्तस्य पदस्य (a pada ending in स्)'); }
      P8[placeW].forEach(([g, t]) => { if (t === 's') { tad.push(SNAME(g) + 'ान्तस्य'); fire('1.1.72', '✔', 2, `${g}: a sound qualifying पदस्य`, `${SNAME(g)}ान्तस्य पदस्य (a pada ending in it)`); } else if (t === 'x') { tad.push(antaOf(g) + 'स्य'); fire('PIS 23', '✔', 2, `${g}: a suffix qualifying पदस्य`, `${antaOf(g)}स्य पदस्य (a pada ending in it)`); } else ws.push(g); });
      const ph = [...tad, ...(tad.length > 1 && !ws.length ? ['च'] : []), 'पदस्य', ...(ws.length ? [...ws, ws.length > 1 ? 'इत्येतेषाम्' : 'इत्येतस्य', 'च'] : [])];
      const pi0 = chain.indexOf('पदस्य'); if (pi0 >= 0) chain.splice(pi0, 1);
      chain.splice(chain.indexOf(placeW), 1, ...ph);
      st.set(placeW, ph.join(' '), tad.length ? ['1.1.72'] : [], `${placeW}: the sound/suffix members describe the pada (“what ends in it”); the other members are named as they are`);
    } else if (has('पदस्य') && has('सः') && !has('अङ्गस्य') && own6.length === 1 && placeW === own6[0].form && !isSnd(placeW) && +rec.id >= 82073 && +rec.id <= 82074) {
      // तिप्यनस्तेः / सिपि धातो रुर्वा: the स् carried from 8.2.66 still describes the pada (“अनस्तेः सकारान्तस्य पदस्य”)
      const pi0 = chain.indexOf('पदस्य'); if (pi0 >= 0) chain.splice(pi0, 1);
      chain.splice(chain.indexOf(placeW) + 1, 0, 'सकारान्तस्य', 'पदस्य');
      fire('1.1.72', '✔', 2, 'सः (carried over from 8.2.66) qualifies पदस्य', 'सकारान्तस्य पदस्य (a pada ending in स्)');
    }
    // अङ्गस्य carried: a word as the place is that aṅga (त्रेः अङ्गस्य); a sound describes it (अस्य → अवर्णान्तस्य अङ्गस्य, 1.1.72);
    // a suffix as the place is itself what is replaced (ठस्य, औङः) — left as is
    if (has('अङ्गस्य') && !chain.includes('अङ्गस्य') && !chain.includes('अङ्गात्') && placeW !== '?') {
      const pi = chain.lastIndexOf(placeW), PL = LEX[placeW] || {};
      if (pi >= 0 && ['pratyahara', 'varna'].includes(PL.kind)) { const t = sTad(PL) + 'स्य'; chain.splice(pi, 1, t, 'अङ्गस्य'); fire('1.1.72', '✔', 2, `${placeW} qualifies अङ्गस्य`, `${t} अङ्गस्य (an aṅga ending in it)`); st.set(placeW, t + ' अङ्गस्य', '1.1.72', `${placeW}: a sound describing the aṅga → “an aṅga ending in it”`); }
      else if (pi >= 0 && PL.kind !== 'suffix' && !own6.some(w => w.form === placeW && w.lex.length && w.lex.every(l => l && l.kind === 'suffix'))) { chain.splice(pi + 1, 0, 'अङ्गस्य'); }
    }
    // a suffix replaced under the अङ्गस्य heading (ठस्येकः): “अङ्गात् उत्तरस्य ठस्य” (prathamāvṛtti) — 1.4.13, 1.1.67
    if (has('अङ्गस्य') && (LEX[placeW] || {}).kind === 'suffix' && !chain.some(x => /अङ्ग/.test(x)) && !chain.some(x => /उत्तरस्य/.test(x)) && +rec.id >= 73001 && +rec.id <= 73120) {
      const pi = chain.indexOf(placeW); chain.splice(pi >= 0 ? pi : 0, 0, 'अङ्गात्', 'उत्तरस्य');
      fire('1.1.67', '✔', 2, 'अङ्गस्य (carried over), read as अङ्गात्', 'the suffix that FOLLOWS the aṅga is replaced'); st.snap('1.1.67', 'the suffix after the aṅga (“अङ्गात् उत्तरस्य”)');
    }
    fire('1.1.49', '✔', 2, `${placeW}: 6th case`, 'names the place — the thing replaced (“स्थाने”)');
    st.ins(placeW, 'स्थाने', '1.1.49', `${placeW}: 6th case → the place, i.e. what is replaced (“स्थाने”)`);
    own6.filter(w => (LEX[w.form] || {}).shtip).forEach(w => st.snap('3.3.108 vt.2', `${w.form}: the dhātu ${LEX[w.form].root} cited in its श्तिप् form`));
    let adW = words.find(w => (w.wcase === 1 && !/^(विभाषा|बहुलम्|नित्यम्)$/.test(w.form)) || (LEX[w.form] && LEX[w.form].kind === 'adesha')) || words.find(w => w.wcase === 0 && !/^(न|च|वा|अपि|तु|एव)$/.test(w.form) && !w.lex.some(l => l && ['option', 'ca', 'neg'].includes(l.kind)) && !/(था|पादम्|त्र|यन्ते|न्ते|न्ति)$/.test(w.form) && !(/न्$/.test(w.form) && +rec.id >= 82001) && !(/(म्|न्)$/.test(w.form) && carried.some(c => SILENT[c.w] === undefined && (autoOf(sid(c.from), c.w) || {}).cs === 1 && !/^(विभाषा|वा|अन्यतरस्याम्|बहुलम्|नित्यम्)$/.test(c.w))));   // a case-0 word is the substitute only if it is a sound or a short form (गा, शी, समि), not a quoted word, a verb or an adverb (स्वतवान्, दृश्यन्ते, उभयथा)
    // the replacement carried over from an earlier sūtra (आङि चापः ← एत्)
    if (!adW) { const c1 = carried.filter(c => SILENT[c.w] === undefined && !/^(विभाषा|वा|अन्यतरस्याम्|बहुलम्|नित्यम्|अजादी)$/.test(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 1); const c = c1.filter(c => (LEX[c.w] || {}).kind === 'suffix').pop() || c1.pop(); if (c) adW = { form: c.w, segs: c.w.split('-'), wcase: 1, work: 1, lex: [], carriedFrom: c.from }; }
    // last resort: any carried 1st-case word (the replacement named in an earlier sūtra of the run)
    if (!adW) { const c = carried.filter(c => { const a = autoOf(sid(c.from), c.w); return (a ? [0, 1].includes(a.cs) : /ः$/.test(c.w)) && SILENT[c.w] === undefined && !/^(प्रत्ययः|परश्च|न|च|वा|अङ्गस्य|धातोः|पदस्य)$/.test(c.w) && !/\s/.test(c.w) && !(LEX[c.w] && ['nimitta', 'option', 'neg', 'pos', 'sthana', 'qual6', 'dhatu'].includes(LEX[c.w].kind)); }).pop(); if (c) adW = { form: c.w, segs: c.w.split('-'), wcase: 1, work: 1, lex: [], carriedFrom: c.from }; }
    // the replacement is named in a sūtra the data's anuvṛtti list doesn't carry: say so instead of failing
    if (!adW) { adW = { form: '?', segs: ['?'], wcase: 1, work: 1, lex: [], missing: true }; notes.push('? the replacement is not among the carried words in the data (it comes from an earlier sūtra the anuvṛtti list leaves out)'); }
    let adK, adS, many = false;
    if (adW.segs.length > 3) { many = true; adK = glue(jas(adW.segs[0]), 'आदयः'); adS = adK; }
    else { const L0 = LEX[adW.form] || {}; const st = (L0.stem && !['word', 'nominal'].includes(L0.kind) && !(L0.src === 'nominal')) ? L0.stem : (L0.kind === 'word' || !L0.kind ? adW.form.replace(/ः$/, '') : (L0.stem || adW.form)); adK = alCount(st) === 1 ? st.replace(/्$/, '') + 'कारः' : st + '_'; adS = adW.form + (alCount(st) === 1 ? '' : '_'); }
    const st0 = many ? adW.segs[0] : (() => { const L0 = LEX[adW.form] || {}; return (L0.kind === 'word' || !L0.kind) ? adW.form.replace(/ः$/, '') : (L0.stem || adW.form); })();
    // only when the PLACE is a sound class too (इको यण्, झलां जश्): अम्/अश्/इक are also pratyāhāra names but there they are suffixes / substitutes
    const placePr = own6.concat(carried.filter(c => (autoOf(sid(c.from), c.w) || {}).cs === 6).map(c => ({ form: c.w }))).some(w => { const L = LEX[w.form] || {}; return L.kind === 'pratyahara' && SOUNDPR.has(String(L.stem || '').replace(/ः$/, '')) || L.kind === 'varna'; });
    const soundPr = !many && placePr && SOUNDPR.has(String(st0).replace(/ः$/, '')) && !['suffix', 'agama'].includes((LEX[adW.form] || {}).kind);
    const nAl = many ? Math.min(...adW.segs.map(alCount)) : soundPr ? 1 : alCount(st0);
    if (own6.some(w => (LEX[w.form] || {}).term === '1.1.64')) { fire('1.1.64', '✔', 2, 'टेः', 'टि = from the last vowel to the end — the place is named exactly'); fire('1.1.52', '✖', 2, 'the place is named (टि)', 'no “last sound” rule needed'); }
    else if (nAl > 1) fire('1.1.55', '✔', 2, `${many ? 'तिप् etc.' : st0}: more than one sound`, 'it replaces the WHOLE of the place');
    else if (soundPr && placePr) fire('1.1.50', '✔', 2, `${st0} for each sound of the place`, 'each sound is replaced by the NEAREST sound of the group (sound for sound)');
    else fire('1.1.52', '✔', 2, `${st0}: a single sound`, 'it replaces the LAST sound');
    if (many) st.set(adW.form, adK, [], 'the 18 replacements, listed from तिप् → “तिबादयः”');
    st.snap(own6.some(w => (LEX[w.form] || {}).term === '1.1.64') ? '1.1.64' : nAl > 1 ? '1.1.55' : '1.1.52', own6.some(w => (LEX[w.form] || {}).term === '1.1.64') ? 'टि names the exact part replaced (from the last vowel on)' : nAl > 1 ? 'more than one sound → it replaces the WHOLE place' : 'one sound → it replaces the LAST sound');
    st.snap('1.1.56', 'the replacement is treated like what it replaced (sthānivat)');
    fire('1.1.56', '✔', 2, `${many ? 'तिप् etc.' : st0} replaces ${placeW}`, 'the replacement is treated like what it replaced (e.g. a तिङ् replacing a तिङ् is still तिङ् — class 55/61)');
    {
      const DOMW = /^(संज्ञायाम्|छन्दसि|भाषायाम्|यजुषि|गोत्रे|आमन्त्रिते|संहितायाम्)$/;
      const upHead = has('उत्तरपदे');
      // only a sound, a suffix / ending or a term naming one is “what follows” (सुपि, कुप्वोः, अनुनासिके, सम्बुद्धौ, आम्रेडिते); a place or meaning
      // word (उपदेशे, अवसाने “अवसाने वर्तमानानाम्”, अन्ते, अभ्यासे, भूते, कर्मणि, बहुव्रीहौ) is not
      const SK7 = ['pratyahara', 'varna', 'suffix', 'sup'];
      const sndSfx7 = (f, lex) => { if (/^(एकवचने|द्विवचने|बहुवचने)$/.test(f) && +rec.id >= 71001 && +rec.id <= 74097) return true;   // the endings of that number follow the aṅga (PV 7.1.77 “द्विवचने परतः”)
        if (/^(उपदेशे|अवसाने|अन्ते|अभ्यासे|गतौ|स्थाने|समानपदे|भूते|भविष्यति|भावे|कर्मणि|कर्तरि|करणे|बहुव्रीहौ|द्वयोः|एकस्मिन्|समासे|सम्बोधने|बहुवचने|एकवचने|द्विवचने)$/.test(f)) return false;
        if (/^[क-ह][क-ह]ोः$/.test(f)) return true;   // वमोः = व् and म् (PV 8.4.23 “वकारमकारयोः परतः”)
        if (/^(एति|अयतौ|करोतौ|आङि)$/.test(f)) return true;   // a dhātu named by its श्तिप् form, or the upasarga आङ्, as what follows (PV 8.3.99 “एति परतः”, 8.2.19 “अयतौ परतः”, 6.4.141 “आङि परतः”)
        const ks = (lex && lex.length ? lex : [LEX[f]]).map(l => l && l.kind); const a = autoOf ? null : null;
        return ks.length && ks.every(k => SK7.includes(k) || k === 'term') || !!sfxSt7(f) || f === 'आपि'; };   // आपि = the strī ending आप् (lexed as the dhātu)
      const sfxSt7 = f => suffixOf(f.replace(/(ि|ौ|े)$/, '')) || suffixOf(f.replace(/(ि|ौ|े)$/, '्'));
      const addNim = (f, own, from) => { const x = f.replace(/-/g, ' '); const pk = nim.K.indexOf('परतः'), pc = nim.C.lastIndexOf('परे');
        if (pk >= 0) { nim.K.splice(pk, 0, x); nim.C.splice(nim.C[pc - 1] === 'प्रत्यये' ? pc - 1 : pc, 0, x); } else { nim.K.push(x, 'परतः'); nim.C.push(x, 'परे'); }
        fire('1.1.66', '✔', 2, `${f}: 7th case${own ? '' : ' (carried over from ' + from + ')'}`, 'names what FOLLOWS — the replacement is of what precedes it');
        st.set(f, x + ' परतः', '1.1.66', `${f}${own ? '' : ' (carried over)'}: 7th case → names what follows (“… परतः”)`); };
      words.filter(w => w.wcase === 7 && !NIMK(w.form) && !(LEX[w.form] && ['option', 'nimitta'].includes(LEX[w.form].kind)) && !nim.list.some(n => n.form === w.form)).forEach(w => {
        if (DOMW.test(w.form)) { chain.push(w.form, 'विषये'); return; }
        if (upHead) { const many = w.segs.length > 1; const ph = many ? [listOf(w.segs, 'loc'), 'इत्येतेषु', 'उत्तरपदेषु'] : [w.form, 'उत्तरपदे']; chain.unshift(...ph); fire('1.1.66', '✔', 2, `${w.form}: 7th case under उत्तरपदे`, 'names the uttarapada — the replacement is in the member before it'); st.set(w.form, ph.join(' ').replace(/_/g, ' '), '1.1.66', `${w.form}: 7th case → the uttarapada (the replacement is in the member before it)`); }
        // any other 7th-case word names what FOLLOWS (1.1.66): “सुपि परतः”, “अनुनासिके परतः” (PV/Kāśikā); a meaning word stays as it is
        else if (sndSfx7(w.form, w.lex)) addNim(w.form, true);
      });
      // a carried 7th-case word the nimitta lexicon doesn't know (सुपि ← 8.3.16 …): also “… परतः”
      // खर् is carried bare (no case) from खरवसानयोः (8.3.15): it is the 7th “खरि परतः” (PV/Kāśikā 8.3.34)
      if (carried.some(c => c.w === 'खर्') && !nim.K.includes('खरि') && !chain.includes('खरि') && +rec.id >= 83015 && +rec.id <= 83054) addNim('खरि', false, '8.3.15');
      carried.filter(c => !SILENT[c.w] && !NIMK(c.w) && !DOMW.test(c.w) && sndSfx7(c.w, null) && !/^(उत्तरपदे|संहितायाम्|अनभिहिते)$/.test(c.w) && !(LEX[c.w] && ['option', 'nimitta', 'meaning', 'domain'].includes(LEX[c.w].kind)) && (autoOf(sid(c.from), c.w) || {}).cs === 7 && /(ि|े|ौ|ोः|ेषु|सु)$/.test(c.w) && !/(अर्थे|समासे|सामर्थ्ये|आक्रोशे|उपमाने|विषये|काले)$/.test(c.w) && !chain.includes(c.w) && !nim.K.includes(c.w) && !nim.list.some(n => n.form === c.w)).forEach(c => addNim(c.w, false, c.from));
      // a domain word carried over (छन्दसि ← 3.2.105): “छन्दसि विषये”
      carried.filter(c => DOMW.test(c.w) && c.w !== 'संहितायाम्' && !chain.includes(c.w) && !words.some(w => w.form === c.w)).forEach(c => chain.unshift(c.w, 'विषये'));
    }
    const negA = carried.some(c => c.w === 'न') || words.some(w => w.form === 'न' && w.wcase === 0);
    if (negA) st.snap([], 'न → the replacement does NOT take place here');
    const verb = [...(many ? ['आदेशाः'] : ['आदेशः']), ...(negA ? ['न'] : []), ...(many ? ['भवन्ति'] : ['भवति'])];
    fin([...nim.K, ...chain, adK, ...verb], [...chain, adS, many ? 'स्युः' : 'स्यात्', ...nim.K.map(x => x === 'परतः' ? 'परे' : x)], [...nim.C, ...chain, 'स्थाने', many ? adK : st0, ...verb]);
    return;
  }
  if (['vibhakti', 'svara', 'pada', 'samāsa', 'ekavat'].includes(k)) {
    const own = words.filter(w => !['च', 'वा'].includes(w.form));
    const isHead = w => HEADK(w.form) && HEADK(w.form) !== 'op';
    const head = own.filter(isHead), rest = own.filter(w => !isHead(w));
    const car = carried.filter(c => !SILENT[c.w] && !['प्रत्ययः', 'परश्च', 'धातोः', 'ङ्याप्प्रातिपदिकात्', 'संहितायाम्', 'सुप्सुपा', 'पदस्य', 'पदात्', 'अनुदात्तं सर्वमापादादौ', 'उत्तरपदे'].includes(c.w) && !(LEX[c.w] && LEX[c.w].kind === 'suffix'));
    const carHead = car.filter(c => c.w.split(' ').some(x => HEADK(x) && HEADK(x) !== 'op'));
    const carRest = car.filter(c => !carHead.includes(c));
    const opt = own.some(w => ['विभाषा', 'अन्यतरस्याम्', 'वा'].includes(w.form)) || words.some(w => w.form === 'वा');
    const DOM7 = /^(छन्दसि|संज्ञायाम्|यजुषि|भाषायाम्|गोत्रे|आमन्त्रिते)$/;
    const upMode = k === 'svara' && (carried.some(c => c.w === 'उत्तरपदे') || (+rec.id >= 62001 && +rec.id <= 62199));
    const SAM7 = /^(द्विगौ|बहुव्रीहौ|तत्पुरुषे|अव्ययीभावे|द्वन्द्वे|कर्मधारये|समासे)$/;
    // a sound in the 7th = what BEGINS with it (PIS 33): PV/Kāśikā 6.4.168 “यकारादौ … परतः” — not a suffix name like अण् (अणि = the suffix अण्)
    // झलि in the accent rules 6.1.158–199 = the झल्-initial case endings (PV/Kāśikā 6.1.180 ff. “झलादौ विभक्तौ”)
    const tad7 = f => { const L = f === 'झलि' && +rec.id >= 61158 && +rec.id <= 61199 ? { tadadi: 'झल्' } : NIMK(f); if (!L || !L.tadadi || L.neg || suffixOf(L.tadadi) || suffixOf(L.tadadi.replace(/्$/, '')) || (/कार$/.test(L.tadadi) && !/^(ये|यि)$/.test(f))) return null; const t = withAdi(L.tadadi); fire('PIS 33', '✔', 2, `${f}: a sound in the 7th`, `→ ${t} (what BEGINS with it)`); st.set(f, t + ' परतः', ['PIS 33', '1.1.66'], `${f}: ${L.tadadi} in the 7th → “beginning with ${L.tadadi}” (PIS 33), what follows (1.1.66)`); return [t, 'परतः']; };
    // a 7th-case participle (प्रतीयमाने, गम्यमाने) is a locative absolute — no “परतः” — and a 3rd-case word with it is its agent, not “योगे” (Kāśikā 1.3.77 “उपपदेन प्रतीयमाने”)
    const LOCABS = /(मान|माण)े$/, hasLA = words.some(w => w.wcase === 7 && LOCABS.test(w.form));
    const ph = w => w.wcase === 7 && LOCABS.test(w.form) ? [w.form] : w.wcase === 3 && hasLA ? [w.form] : w.wcase === 7 && k === 'svara' && tad7(w.form) ? tad7(w.form) : w.wcase === 7 ? (SAM7.test(w.form) ? [w.form, ...(w.form === 'समासे' ? [] : ['समासे'])] : DOM7.test(w.form) ? [w.form, 'विषये'] : k === 'svara' ? [w.form.replace(/-/g, ' ')] : [w.form.replace(/-/g, ' '), 'परतः'])
      : w.wcase === 5 ? [w.form.replace(/-/g, ' ')] : w.wcase === 3 ? [w.form.replace(/-/g, ' '), 'योगे'] : w.wcase === 6 ? [w.form.replace(/-/g, ' ')] : [w.form.replace(/-/g, ' ')];
    // case rules (2.3): a 7th-case word is the kāraka or the meaning, not what follows (“करणे कारके”, “आसेवायाम्”) — no “परतः”;
    // a suffix in the 6th is “what ends in it”, used with the word (PV 2.3.67 “क्तप्रत्ययान्तस्य प्रयोगे”, PIS 23); a 6th-case list → “… इत्येतेषां योगे” (PV 2.3.69)
    const sfxSt = g => { const L = LEX[g] || {}; return L.kind === 'suffix' ? (L.stem || g) : suffixOf(g) || suffixOf(g.replace(/(स्य|ोः|ानाम्|ाम्|ः)$/, '')) || null; };
    const vph = w => {
      if (w.wcase === 7) return SAM7.test(w.form) || (w.lex.length && w.lex.every(l => l && l.kind === 'suffix')) ? ph(w) : DOM7.test(w.form) ? [w.form, 'विषये'] : [w.form.replace(/-/g, ' ')];
      if (w.wcase !== 6 || (LEX[w.form] || {}).kind === 'pronoun' || /^(यस्य|तस्य|अस्य|एषाम्|येषाम्)$/.test(w.form)) return ph(w);
      const pl = w.num === 3, segs = w.segs.map((g, i) => i === w.segs.length - 1 ? g.replace(/(स्य|ोः|ानाम्|णाम्|ाम्|ः)$/, '') : g);
      let sf = w.segs.map((g, i) => (w.lex[i] && w.lex[i].kind === 'suffix' && (w.lex[i].stem || segs[i])) || sfxSt(g) || sfxSt(segs[i]));
      if (sf.some(Boolean)) sf = sf.map((x, i) => x || (w.lex[i] && w.lex[i].kind === 'pratyahara' ? segs[i] : null));   // अक-इनोः: अक beside the suffix इन् is the suffix अक, not the pratyāhāra
      const segsL = segs.map((x, i) => i === segs.length - 1 && !/्$/.test(x) && suffixOf(x + '्') ? x + '्' : x);   // तृनाम् → तृन्
      if (sf.every(Boolean)) { const ts = sf.map(x => (/्$/.test(x) || !suffixOf(x + '्') ? x : x + '्').replace(/्$/, m => '्') + 'प्रत्ययान्त' + (pl ? 'ानाम्' : 'स्य')); fire('PIS 23', '✔', 2, `${w.form}: a suffix named in the 6th`, `${ts.join(' ')} — a word ENDING in it, used with the word`); st.set(w.form, ts.join(' ') + (ts.length > 1 ? ' च' : '') + ' प्रयोगे', 'PIS 23', `${w.form}: a suffix → “what ends in it” (PIS 23), in its use (प्रयोगे)`); return [...ts, ...(ts.length > 1 ? ['च'] : []), 'प्रयोगे']; }
      if (w.segs.length > 2 && w.num >= 2) return [segsL.join('_') + '_', 'इत्येतेषाम्', 'योगे'];   // a dvandva list only (क्रियार्थोपपदस्य is one bahuvrīhi)
      return ph(w); };
    // accent rules: a suffix named in the 6th/5th is “what ends in it” (PV 6.1.213 “यत्प्रत्ययान्तस्य”, 6.1.159 “घञन्तस्य”; PIS 23)
    // a case named in the 5th: “a word ending in that case ending” (PV/Kāśikā 6.2.152 “सप्तम्यन्तात्”, 8.1.26 “प्रथमान्तात्”; PIS 23)
    const CASE5 = { 'प्रथमायाः': 'प्रथमान्तात्', 'द्वितीयायाः': 'द्वितीयान्तात्', 'तृतीयायाः': 'तृतीयान्तात्', 'चतुर्थ्याः': 'चतुर्थ्यन्तात्', 'पञ्चम्याः': 'पञ्चम्यन्तात्', 'षष्ठ्याः': 'षष्ठ्यन्तात्', 'सप्तम्याः': 'सप्तम्यन्तात्' };
    const caseAnta = f => { const m = f.match(/^(.*?-)?(प्रथमायाः|द्वितीयायाः|तृतीयायाः|चतुर्थ्याः|पञ्चम्याः|षष्ठ्याः|सप्तम्याः)$/); return m ? (m[1] ? m[1].replace(/-/g, '') : '') + CASE5[m[2]] : null; };
    const svCase = (f, from) => { const t = caseAnta(f); if (!t) return null; fire('PIS 23', '✔', 2, `${f}${from ? ' (carried over from ' + from + ')' : ''}: a case named in the 5th`, `${t} — a word ENDING in that case ending`); st.set(f, t, 'PIS 23', `${f}: a case ending named → “a word ending in it” (PIS 23)`); return [t]; };
    const svSfx = w => { if (w.wcase === 5 && caseAnta(w.form)) return svCase(w.form); if ((LEX[w.form] || {}).kind === 'pronoun' || /^(यस्य|तस्य|अस्य)$/.test(w.form)) return null;
      const segs = w.segs.map((g, i) => i === w.segs.length - 1 ? g.replace(/(स्य|ोः|ानाम्|णाम्|ाम्|ात्|भ्यः|ः)$/, '') : g);
      // only a word the lexicon knows as a suffix (not नञ्, अप, हि, पर …); in the 6th only in the word-accent rules 6.1.197–221 (यतोऽनावः → यदन्तस्य),
      // since elsewhere a 6th-case suffix is the accented place itself (तिसृभ्यो जसः)
      if (!w.lex.length || !w.lex.every(l => l && l.kind === 'suffix')) return null;
      if (w.wcase === 6 && !(+rec.id >= 61197 && +rec.id <= 61221)) return null;
      const sf = w.segs.map((g, i) => { const L = w.lex[i] || LEX[g] || {}; return L.stem || null; });
      if (!sf.every(Boolean) || sf.some(x => /^(मतुप्|मतु|नञ्)$/.test(x))) return null;
      const end = w.wcase === 5 ? (w.num === 3 ? 'ेभ्यः' : 'ात्') : (w.num === 3 ? 'ानाम्' : 'स्य');
      const ts = sf.map(x => (/^ङी[पनष्]्?$|^ङीन्$/.test(x) || w.form === 'ङ्याः' ? 'ङ्यन्त' : antaOf(x)) + end);
      fire('PIS 23', '✔', 2, `${w.form}: a suffix named in the ${w.wcase === 5 ? '5th' : '6th'}`, `${ts.join(' ')} — a word ENDING in it`);
      st.set(w.form, ts.join(' ') + (ts.length > 1 ? ' च' : ''), 'PIS 23', `${w.form}: a suffix → “a word ending in it” (PIS 23)`);
      return [...ts, ...(ts.length > 1 ? ['च'] : [])]; };
    let body;
    if (k === 'pada') {
      // pada rules: 5th-case dhātu → “X धातोः”; 5th-case upasargas → “X इत्येवंपूर्वात्” (Kāśikā 1.3.22 “सम् अव प्र वि इत्येवंपूर्वात् तिष्ठतेः”)
      const isUpL = w => w.wcase === 5 && w.segs.every((g, i) => /^(प्र|परा|अप|सम्|अनु|अव|निस्|निर्|दुस्|दुर्|वि|आङ्|आ|नि|अधि|अपि|अति|सु|उत्|उद्|अभि|प्रति|परि|उप)$/.test(i === w.segs.length - 1 ? g.replace(/(भ्यः|भ्याम्|ः|ात्)$/, '').replace(/^(.*)ि$/, '$1ि') : g) || /^(परिभ्यः|विभ्यः|उपाभ्याम्|अभिभ्यः|प्रतिभ्यः)$/.test(g));
      // a suffix named in the 5th (णेः, सनः): the dhātu ending in it — “ण्यन्तात् धातोः” (PIS 23)
      const sfx5 = rest.filter(w => (w.wcase === 5 && ((LEX[w.form] || {}).kind === 'suffix' || (w.lex.length && w.lex.every(l => l && l.kind === 'suffix')))) || ([5, 6].includes(w.wcase) && w.form === 'णेः'));
      sfx5.forEach(w => { const stm = w.form === 'णेः' ? 'णि' : (LEX[w.form] && LEX[w.form].stem) || (w.lex[0] && w.lex[0].stem) || w.form; const t = antaOf(stm) + 'ात्'; w._pada = [t, 'धातोः']; fire('PIS 23', '✔', 2, `${w.form}: a suffix named in the 5th`, `${t} धातोः (a dhātu ending in it)`); st.set(w.form, t + ' धातोः', 'PIS 23', `${w.form}: a suffix in the 5th → “a dhātu ending in it”`); });
      const ups = rest.filter(isUpL), dh = rest.filter(w => w.wcase === 5 && !isUpL(w) && (LEX[w.form] || {}).kind === 'dhatu');
      const carDh = carried.filter(c => (LEX[c.w] || {}).kind === 'dhatu');
      body = [...ups.flatMap(w => [w.segs.map((g, i) => i === w.segs.length - 1 ? g.replace(/(भ्यः|भ्याम्)$/, '').replace(/^(उपा)$/, 'उप') : g).join('_') + '_', 'इत्येवंपूर्वात्']),
        ...(dh.length ? [dh[0].form, 'धातोः'] : carDh.length ? [carDh[0].w, 'धातोः'] : []),
        ...sfx5.flatMap(w => w._pada),
        ...rest.filter(w => !ups.includes(w) && !dh.includes(w) && !sfx5.includes(w) && !isHead(w)).flatMap(ph)];
      // a suffix carried over in the 5th (णेः ← 1.3.67): “ण्यन्तात् धातोः” (PIS 23)
      const carSfx = sfx5.length ? [] : carried.filter(c => !SILENT[c.w]).filter(c => c.w === 'णेः' || c.w === 'सनः' || ((LEX[c.w] || {}).kind === 'suffix' && (autoOf(sid(c.from), c.w) || {}).cs === 5));
      carSfx.forEach(c => { const stm = c.w === 'णेः' ? 'णि' : c.w === 'सनः' ? 'सन्' : LEX[c.w].stem || c.w; const t = antaOf(stm) + 'ात्'; body.splice(dh.length || carDh.length ? 2 : 0, 0, t, ...(dh.length || carDh.length ? [] : ['धातोः'])); fire('PIS 23', '✔', 2, `${c.w} (carried over from ${c.from}): a suffix in the 5th`, `${t} धातोः (a dhātu ending in it)`); st.set(c.w, t + ' धातोः', 'PIS 23', `${c.w} (carried over): a suffix in the 5th → “a dhātu ending in it”`); });
      carRest.splice(0, carRest.length, ...carRest.filter(c => !carDh.includes(c) && !carSfx.includes(c)));
    } else body = rest.flatMap(w => isHead(w) ? [] : k === 'svara' && [5, 6].includes(w.wcase) && svSfx(w) ? svSfx(w) : (k === 'vibhakti' && w.wcase === 5 && !/आदि/.test(w.form) ? [w.form.replace(/-/g, ' ').replace(/भ्यः$/, 'भ्यः'), 'शब्देभ्यः'].slice(0, w.num === 3 ? 2 : 1) : k === 'vibhakti' ? vph(w) : ph(w)));
    // a suffix carried over in the 6th into a case rule (क्तस्य ← 2.3.67): “क्तप्रत्ययान्तस्य प्रयोगे”
    if (k === 'vibhakti') carried.filter(c => !SILENT[c.w] && /स्य$/.test(c.w) && !/^(अस्य|तस्य|यस्य)$/.test(c.w) && sfxSt(c.w) && !words.some(w => w.wcase === 6 && w.lex.some(l => l && l.kind === 'suffix'))).forEach(c => { const sf = sfxSt(c.w); const t = sf.replace(/्$/, '') + 'प्रत्ययान्तस्य'; const ci = carRest.indexOf(c); if (ci >= 0) carRest.splice(ci, 1); body.push(t, 'प्रयोगे'); fire('PIS 23', '✔', 2, `${c.w} (carried over from ${c.from}): a suffix in the 6th`, `${t} प्रयोगे — a word ENDING in it`); st.set(c.w, t + ' प्रयोगे', 'PIS 23', `${c.w} (carried over): a suffix → “what ends in it” (PIS 23)`); });
    if (k === 'vibhakti') { const i = carRest.findIndex(c => c.w === 'अनभिहिते'); if (i >= 0 && ad.some(c => c.w === 'अनभिहिते')) carRest.splice(i, 1); }
    if (upMode) { const isUp = w => w.wcase === 7 && !DOM7.test(w.form) && !/^(द्विगौ|बहुव्रीहौ|तत्पुरुषे|अव्ययीभावे|द्वन्द्वे|कर्मधारये|समासे)$/.test(w.form); const last7 = body.length && rest.filter(isUp).length; if (last7) { const i = body.map((x, j) => [x, j]).filter(([x]) => rest.some(w => isUp(w) && w.form.replace(/-/g, ' ') === x)).pop()[1]; body.splice(i + 1, 0, 'उत्तरपदे'); } }
    body = body.concat(carRest.flatMap(c => k === 'svara' && c.w === 'झलि' && tad7(c.w) ? tad7(c.w) : [c]).map(c => typeof c === 'string' ? c : k === 'svara' && caseAnta(c.w) && (autoOf(sid(c.from), c.w) || { cs: 5 }).cs !== 6 ? svCase(c.w, c.from)[0] : c.w));
    // accent / pada rules: a 7th-case word names what follows (1.1.66) — “X परतः”, or in the uttarapada rules “X उत्तरपदे”
    if (k === 'svara' || k === 'pada' || k === 'vibhakti') {
      const f7own = rest.filter(w => w.wcase === 7 && !isHead(w) && !DOM7.test(w.form) && !SAM7.test(w.form) && !/^(संहितायाम्|छन्दसि|भाषायाम्|संज्ञायाम्)$/.test(w.form) && ((LEX[w.form] || {}).kind !== 'meaning') && (k !== 'vibhakti' || body.includes('परतः')));
      // a carried 7th that names the endings that follow (परस्मैपदेषु, आत्मनेपदेषु) → “… परतः”
      carried.filter(c => /^(परस्मैपदेषु|आत्मनेपदेषु)$/.test(c.w) && body.includes(c.w) && body[body.indexOf(c.w) + 1] !== 'परतः').forEach(c => body.splice(body.indexOf(c.w) + 1, 0, 'परतः'));
      const f7car = carried.filter(c => ((LEX[c.w] || {}).kind === 'nimitta' || /^(परस्मैपदेषु|आत्मनेपदेषु)$/.test(c.w)) && body.includes(c.w));
      if (k === 'svara' && !upMode) f7own.forEach(w => { const x = w.form.replace(/-/g, ' '); const i = body.indexOf(x); if (i >= 0 && body[i + 1] !== 'परतः') body.splice(i + 1, 0, 'परतः'); });
      [...f7own.map(w => w.form), ...f7car.map(c => c.w + ' (carried over)')].forEach(f => fire('1.1.66', '✔', 2, `${f}: 7th case`, upMode && k === 'svara' ? 'names the uttarapada — the accent rule is on the member before it' : 'names what FOLLOWS — the rule is on what precedes it'));
    }
    let H = head.map(w => w.form).concat(head.length ? [] : carHead.map(c => c.w));
    // accent pairs as the Kāśikā writes them: आदिः उदात्तः → आद्युदात्तः; अन्तः उदात्तः → अन्तोदात्तः
    const all0 = [...body, ...H];
    const pair = (a, b, c) => { const ia = all0.indexOf(a), ib = all0.indexOf(b); if (ia >= 0 && ib >= 0) { all0.splice(Math.max(ia, ib), 1); all0.splice(Math.min(ia, ib), 1, c); } };
    pair('आदिः', 'उदात्तः', 'आद्युदात्तः'); pair('अन्तः', 'उदात्तः', 'अन्तोदात्तः'); pair('उत्तरपदादिः', 'उदात्तः', 'उत्तरपदाद्युदात्तः');
    const seen0 = new Set(); const dedup = all0.filter(x => (x === 'च' || x === 'विषये') ? true : !seen0.has(x) && seen0.add(x));
    const nH = H.filter(x => dedup.includes(x)).length; body = dedup.slice(0, dedup.length - nH); H = dedup.slice(dedup.length - nH);
    if (!H.length && dedup.some(x => /उदात्त|अनुदात्त|स्वरित|प्रकृत्या/.test(x))) { H = dedup.filter(x => /उदात्त|अनुदात्त|स्वरित|प्रकृत्या/.test(x)); body = dedup.filter(x => !H.includes(x)); }
    let K, S2, C2;
    if (k === 'vibhakti') { const ng = body.includes('न'); if (ng) body = body.filter(x => x !== 'न'); K = [...body, ...H, 'विभक्तिः', ...(ng ? ['न'] : []), 'भवति']; fire('1.3.11', '✔', 2, H.join(' ') || '—', 'the case ending prescribed'); }
    else if (k === 'svara') { K = [...body, ...(opt ? ['विभाषा'] : []), ...H, 'भवति']; }
    else if (k === 'pada') { K = [...body, ...(opt ? ['विभाषा'] : []), ...H, 'भवति']; }
    else if (k === 'ekavat') { K = [...body, 'द्वन्द्वः', 'एकवत्', 'भवति']; }
    else {
      // class notes (Samāsa intro): “X-विभक्त्यन्तं सुबन्तं … शब्दैः समस्यते”; Kāśikā adds “… समासो भवति”
      const CNAMES = /^(प्रथमा|द्वितीया|तृतीया|चतुर्थी|पञ्चमी|षष्ठी|सप्तमी)/;
      const caseStem = f => f.replace(/(या|याः|ी)$/, 'ी').replace(/या$/, 'ी');
      const cn = own.find(w => w.wcase === 1 && CNAMES.test(w.form)) || carried.map(c => ({ form: c.w })).find(c => /^(प्रथमा|द्वितीया|तृतीया|चतुर्थी|पञ्चमी|षष्ठी|सप्तमी)$/.test(c.form));
      const cn3 = own.find(w => w.wcase === 3 && CNAMES.test(w.form)) || carried.map(c => ({ form: c.w })).find(c => /^(द्वितीयया|तृतीयया|चतुर्थ्या|पञ्चम्या|षष्ठ्या|सप्तम्या)$/.test(c.form));
      const subj = own.filter(w => (w.wcase === 1 || (w.wcase === 0 && !['च', 'वा', 'नित्यम्'].includes(w.form))) && !isHead(w) && w !== cn);
      const partners = own.filter(w => w.wcase === 3 && w !== cn3);
      const means7 = own.filter(w => w.wcase === 7);
      const plural = subj.some(w => w.num === 3 || w.segs.length > 2);
      const ANTA = { 'प्रथमा': 'प्रथमान्त', 'द्वितीया': 'द्वितीयान्त', 'तृतीया': 'तृतीयान्त', 'चतुर्थी': 'चतुर्थ्यन्त', 'पञ्चमी': 'पञ्चम्यन्त', 'षष्ठी': 'षष्ठ्यन्त', 'सप्तमी': 'सप्तम्यन्त' };
      const ANTA3 = { 'द्वितीयया': 'द्वितीयान्तेन', 'तृतीयया': 'तृतीयान्तेन', 'चतुर्थ्या': 'चतुर्थ्यन्तेन', 'पञ्चम्या': 'पञ्चम्यन्तेन', 'षष्ठ्या': 'षष्ठ्यन्तेन', 'सप्तम्या': 'सप्तम्यन्तेन' };
      const antaOf = f => ANTA[f] || ANTA[f.replace(/[ःम्]$/, '')] || null;
      const subjPh = [...subj.map(w => w.form.replace(/-/g, ' ')), ...(cn && antaOf(cn.form) ? [antaOf(cn.form) + (plural ? 'ाः' : 'म्')] : []), plural ? 'सुबन्ताः' : 'सुबन्तम्'];
      const partPh = partners.length ? [...partners.map(w => w.form.replace(/-/g, ' ')), 'सुबन्तैः'] : cn3 && ANTA3[cn3.form] ? [ANTA3[cn3.form]] : ['समर्थेन', 'सुबन्तेन'];
      const mods = [...(carried.some(c => c.w === 'समानाधिकरणेन') ? ['समानाधिकरणेन'] : []), ...(carried.some(c => /^नित्यम्?$/.test(c.w)) || own.some(w => w.form === 'नित्यम्') ? ['नित्यम्'] : []), ...(opt || carried.some(c => c.w === 'विभाषा') ? ['विभाषा'] : [])];
      const m7 = means7.length ? [means7.map(w => w.form.replace(/-/g, ' ')).join(' '), 'इत्येतेष्वर्थेषु', 'वर्तमानम्'] : [];
      const rid = +rec.id, rangeName = rid >= 21005 && rid <= 21021 ? 'अव्ययीभावः' : rid >= 21022 && rid <= 22022 ? 'तत्पुरुषः' : rid >= 22023 && rid <= 22028 ? 'बहुव्रीहिः' : rid >= 22029 && rid <= 22038 ? 'द्वन्द्वः' : null;
      const name0 = carried.map(c => c.w).filter(x => /^(अव्ययीभावः|तत्पुरुषः|बहुव्रीहिः|द्वन्द्वः|द्विगुः|कर्मधारयः)$/.test(x)).pop() || H.find(x => /^(अव्ययीभावः|तत्पुरुषः|बहुव्रीहिः|द्वन्द्वः|द्विगुः|कर्मधारयः)$/.test(x));
      const name = name0 || rangeName;
      K = [...m7, ...subjPh, ...partPh.filter(Boolean), 'सह', ...mods, plural ? 'समस्यन्ते' : 'समस्यते', ...(name ? [name, 'च', 'समासः', 'भवति'] : [])];
      fire('1.3.11', '✔', 2, 'सुप्सुपा (2.1.4) and the samāsa heading carry over', 'class notes (Samāsa intro): “X-विभक्त्यन्तं सुबन्तं … शब्दैः समस्यते”; Kāśikā: “… सह समस्यते, तत्पुरुषश्च समासो भवति”');
    }
    S2 = K.map(x => x === 'भवति' ? 'स्यात्' : x); C2 = K.slice();
    st.snap([], `${{ vibhakti: 'a vibhakti rule', svara: 'an accent rule', pada: 'a pada (ātmanepada/parasmaipada) rule', 'samāsa': 'a samāsa rule', ekavat: 'an ekavat (singular dvandva) rule' }[k]}: ${H.join(' ') || '—'} is what the rule prescribes`);
    fin(K, S2, C2);
    return;
  }
  if (k === 'ekādeśa' || k === 'ṣatva' || k === 'ṇatva') {
    const nim = nimittaPhrase(words, an, ad, fire, st);
    const own5 = words.filter(w => w.work === 5), own6 = words.filter(w => w.work === 6), own1 = words.filter(w => w.wcase === 1);
    const neg = carried.some(c => c.w === 'न') || words.some(w => w.form === 'न');
    const c5e = car5Of(carried, words);
    // ṣatva/ṇatva: an own 7th-case sound, suffix or śtip-named dhātu is what follows (PV 8.3.99 “एति परतः”, 8.4.23 “वकारमकारयोः परतः”; 1.1.66)
    if (k !== 'ekādeśa') words.filter(w => w.wcase === 7 && !NIMK(w.form) && !nim.list.some(n => n.form === w.form) && (/^(एति|अयतौ)$/.test(w.form) || /^[क-ह][क-ह]ोः$/.test(w.form) || (w.lex.length && w.lex.every(l => l && ['pratyahara', 'varna', 'suffix', 'sup'].includes(l.kind))))).forEach(w => {
      const pk = nim.K.indexOf('परतः'); if (pk >= 0) { nim.K.splice(pk, 0, w.form); nim.C.splice(nim.C.lastIndexOf('परे'), 0, w.form); } else { nim.K.push(w.form, 'परतः'); nim.C.push(w.form, 'परे'); }
      fire('1.1.66', '✔', 2, `${w.form}: 7th case`, 'names what FOLLOWS'); st.set(w.form, w.form + ' परतः', '1.1.66', `${w.form}: 7th case → what follows (“… परतः”)`); });
    // in the ekādeśa section a 5th-case sound describes the word before (ओतः → ओकारान्तात्, ऋतः → ऋकारान्तात्); a carried आत् (6.1.87) with
    // उपसर्गात् makes “अवर्णान्तात् उपसर्गात्” — 1.1.72
    const snd5 = w => ['varna', 'pratyahara'].includes((LEX[w.form] || w.lex[0] || {}).kind);
    const t5 = w => { if (k === 'ekādeśa' && snd5(w)) { const t = sTad(LEX[w.form] || w.lex[0]) + 'ात्'; fire('1.1.72', '✔', 2, `${w.form}: a sound in the 5th`, `${t} — what ENDS in it`); return t; } return w.form.replace(/-/g, ' '); };
    const upas5 = words.some(w => w.form === 'उपसर्गात्') || has('उपसर्गात्');
    const aAt = k === 'ekādeśa' && upas5 && has('आत्');
    if (aAt) fire('1.1.72', '✔', 2, 'आत् (carried over from 6.1.87) with उपसर्गात्', 'अवर्णान्तात् उपसर्गात् — an upasarga ENDING in अ/आ');
    const pre = own5.length ? [...(aAt && words.some(w => w.form === 'उपसर्गात्') ? ['अवर्णान्तात्'] : []), ...own5.map(t5), 'उत्तरस्य'] : aAt ? ['अवर्णान्तात्', 'उपसर्गात्', 'उत्तरस्य'] : c5e.length && k !== 'ekādeśa' ? [...c5e.map(c => c.w), 'उत्तरस्य'] : [];
    if (!own5.length && c5e.length && k !== 'ekādeśa') { fire('1.1.67', '✔', 2, `${c5e.map(c => c.w).join(', ')} (carried over): 5th case`, 'on what FOLLOWS it'); st.snap('1.1.67', `${c5e.map(c => c.w).join(', ')} (carried over): 5th case → on what follows`); }
    if (own5.length) { fire('1.1.67', '✔', 2, `${own5.map(w => w.form).join(', ')}: 5th case`, 'on what FOLLOWS it'); st.snap('1.1.67', `${own5.map(w => w.form).join(', ')}: 5th case → on what follows`); }
    let K;
    if (k === 'ekādeśa') {
      // class 63: एकः पूर्वपरयोः (6.1.84) is a heading up to 6.1.112; fill in [परे] [स्थाने] [आदेशः] भवति
      const op = own1.map(w => w.form).join(' ') || carried.filter(c => (autoOf(sid(c.from), c.w) || {}).cs === 1 && !/एकः पूर्वपरयोः/.test(c.w) && !SILENT[c.w]).map(c => c.w).pop() || '?';
      K = [...nim.K, ...pre, ...own6.map(w => w.form), 'पूर्वपरयोः', 'स्थाने', op, 'एकादेशः', ...(neg ? ['न'] : []), 'भवति'];
      fire('1.1.49', '✔', 2, 'पूर्वपरयोः: 6th case', 'names the place — both sounds are replaced (“स्थाने”)');
      fire('1.3.11', '✔', 2, 'एकः पूर्वपरयोः (6.1.84) carries over', 'one replacement for the preceding and the following sound together (class 63: “[परे] [स्थाने] [आदेशः] भवति”)');
      st.snap([], 'एकः पूर्वपरयोः (6.1.84, a heading up to 6.1.112): one replacement for both sounds — the sūtra names it');
    } else if (k === 'ṣatva') {
      const q = [...own1, ...own6].map(w => w.form.replace(/-/g, ' '));
      K = [...nim.K, ...pre, ...q, 'सकारस्य', 'मूर्धन्यादेशः', ...(neg ? ['न'] : []), 'भवति'];
      fire('1.3.11', '✔', 2, 'अपदान्तस्य मूर्धन्यः (8.3.55) and सः (8.3.56) carry over', 'the s (not at the end of a pada) becomes retroflex ष्');
      st.snap([], 'अपदान्तस्य मूर्धन्यः (8.3.55) + सः: the स् becomes the retroflex ष्');
    } else {
      const q = [...own1, ...own6].map(w => w.form.replace(/-/g, ' '));
      K = [...nim.K, ...pre, ...q, 'नकारस्य', 'णकारादेशः', ...(neg ? ['न'] : []), 'भवति'];
      fire('1.3.11', '✔', 2, 'रषाभ्यां नो णः समानपदे (8.4.1) carries over', 'न् becomes ण् after र्/ष् in the same word');
      st.snap([], 'रषाभ्यां नो णः (8.4.1): न् becomes ण्');
    }
    fin(K, K.map(x => x === 'भवति' ? 'स्यात्' : x === 'परतः' ? 'परे' : x), K.map(x => x === 'परतः' ? 'परे' : x));
    return;
  }
  if (k === 'ekaśeṣa') {
    const keep = words.filter(w => w.wcase === 1 && !/^(नित्यम्|विशेषः|तत्-लक्षणः)$/.test(w.form) && !/^अ-/.test(w.form));
    const drop = words.filter(w => w.wcase === 3);
    const opt = words.some(w => w.form === 'अन्यतरस्याम्') || has('अन्यतरस्याम्'), nitya = words.some(w => w.form === 'नित्यम्');
    const kp = keep.map(w => w.form.replace(/-/g, ' ')), dp = drop.map(w => w.form.replace(/-/g, ' '));
    const seven = words.filter(w => w.wcase === 7 && w.form !== 'अन्यतरस्याम्').map(w => w.form.replace(/-/g, ' '));
    const nK = keep.length ? Math.max(...keep.map(w => w.num === 3 ? 3 : w.segs.length > 1 ? w.segs.length : w.num || 1)) : 1;
    const stemOf = w => w.segs.map((g, i) => { const a = AUTO[rec.id] && AUTO[rec.id][words.indexOf(w)] && AUTO[rec.id][words.indexOf(w)][i]; return (a && a.stem) || g; });
    const nD = drop.length ? Math.max(...drop.map(w => w.segs.length)) : 1;
    const dropNom = drop.map(w => /^सर्व/.test(w.form) ? 'अन्यानि' : stemOf(w).join('') + (nD === 2 ? 'शब्दौ' : nD > 2 ? 'शब्दाः' : 'शब्दः'));
    const vK = nK === 2 ? 'शिष्येते' : nK > 2 ? 'शिष्यन्ते' : 'शिष्यते', vD = drop.some(w => /^सर्व/.test(w.form)) || nD > 2 ? 'निवर्तन्ते' : nD === 2 ? 'निवर्तेते' : 'निवर्तते';
    const C = [...seven, ...dp, 'सहवचने', ...keep.map(w => w.segs.length > 1 ? joinFull(w.segs).replace(/\s+/g, '') : w.form), ...(nitya ? ['नित्यम्'] : opt ? ['विकल्पेन'] : []), vK, ...(dp.length ? [...dropNom, vD] : [])];
    fire('1.3.11', '✔', 2, 'सरूपाणामेकशेष एकविभक्तौ (1.2.64) carries over', 'of the words said together only one remains (एकशेषः)');
    st.snap([], `${kp.join(' ')} remains (शिष्यते); ${dp.join(' ') || 'the others'} drop (निवर्तते) — ekaśeṣa (1.2.64)`);
    fin([...seven, ...dp, 'सह', 'वचने', ...kp, 'शिष्यते'], [...kp, 'शिष्यते', ...dp], C);
    return;
  }
  if (k === 'niṣedha') {
    const nim = nimittaPhrase(words, an, ad, fire, st);
    st.snap('1.1.3', 'इकः and गुण-वृद्धी come from 1.1.3 → this blocks only the guṇa/vṛddhi that 1.1.3 supplies');
    fire('1.1.3', '✔', 2, 'इकः and गुण-वृद्धी are carried from 1.1.3', 'so this blocks only the guṇa/vṛddhi that 1.1.3 supplies (class 57; SK: “इग्लक्षणे”)');
    if (words.some(w => w.form === 'क्ङिति')) notes.push('क्ङिति also covers गित्: the Kāśikā says “गकारोप्यत्र चर्त्वभूतो निर्दिश्यते” (the ग् is written here as क्).');
    const own7x = words.filter(w => w.wcase === 7 && !nim.list.some(n => n.form === w.form)).map(w => w.form); if (own7x.length) { nim.K.unshift(...own7x); nim.C.unshift(...own7x); }   // धातुलोपे (1.1.4)
    fire('1.1.49', '✔', 2, 'इकः (6th, from 1.1.3)', 'names the place — the guṇa/vṛddhi that would stand IN PLACE of इक् (PV “इकः स्थाने ये गुणवृद्धी”)'); st.snap('1.1.49', 'इकः (6th) → the place: “इकः स्थाने”');
    fin([...nim.K, 'इकः', 'गुणवृद्धी', 'न', 'भवतः'], [...nim.K.map(x => x === 'परतः' ? 'परे' : x), 'इकः', 'गुणवृद्धी', 'न', 'स्तः'], [...nim.C, 'इकः', 'स्थाने', 'गुणवृद्धी', 'न', 'भवतः']);
    return;
  }
  // adhikāra: “'X' इति अधिकारः — आ <last sūtra of its scope>” (scope from the data's type field AD$name$<end>)
  if (k === 'adhikāra') {
    const m = (rec.type || '').match(/AD\$[^$]*\$(\d)(\d)(\d{3})/);
    const endN = m ? `${m[1]}.${m[2]}.${+m[3]}` : null;
    const endS = endN && SBYN[endN] ? SBYN[endN] : null;
    const C = [`'${rec.s}'`, 'इति', 'अधिकारः', ...(endS ? ['आ', `«${endS}»`, `(${endN})`] : [])];
    st.snap([], endS ? `adhikāra: the words run on to the sūtras that follow, up to ${endN}` : 'adhikāra: the words run on to the sūtras that follow');
    fin([...C.slice(0, 2), 'अयम्', 'अधिकारः', ...C.slice(3)], C, C);
    return;
  }
  if (k === 'saṃjñā*' || (k === 'saṃjñā' && rec._sjAuto)) {
    const SFX7 = f => !!NIMK(f) || /िति$|^(जसि|यचि|मत्वर्थे|असर्वनामस्थाने|सर्वनामस्थाने|स्वादिषु|सुँ-आदिषु|आमि|ङिति|इतौ)$/.test(f);
    const names = [...rec.type.matchAll(/S\$([^$]+?)संज्ञा/g)].map(m => m[1]);
    const name = names.length ? names[names.length - 1] : '?';
    // several names defined at once, all of them words of the sūtra (लुक्-श्लु-लुपः, 1.1.61): “'लुक्' 'श्लु' 'लुप्' इति संज्ञाः भवन्ति”
    const multi = names.length > 1 && words.some(w => w.wcase === 1 && w.segs.length === names.length && w.segs.every((g, i) => strip(g).slice(0, 2) === strip(names[i]).slice(0, 2))) ? words.find(w => w.wcase === 1 && w.segs.length === names.length) : null;
    const outer = names.length > 1 && !multi ? names[0] : null;     // e.g. कारक in 1.4.23–55: “… कारकं करणसंज्ञं भवति”
    const plural = words.some(w => w.wcase === 1 && w.num === 3);
    const out = [], outC = [];
    const isNameW = f => strip(f).slice(0, 3) === strip(name).slice(0, 3);
    if (['सार्वधातुक', 'आर्धधातुक'].includes(name) && has('धातोः')) outC.push('धातोः', 'परः');
    // sounds named as the members of a term for whole words (ईदूदेत्, यू, तसौ): words ENDING in them (1.1.72)
    const quotedNa = words.some(w => w.form === 'न') && words.some(w => w.form === 'इति');
    const TADS = { 'ईत्-ऊत्-एत्': ['ई', 'ऊ', 'ए'], 'ईदूतौ': ['ई', 'ऊ'], 'यू': ['ई', 'ऊ'], 'त-सौ': ['त्', 'स्'] };
    const tadPh = (parts, dual) => {
      const nm = parts.map(p => (/्$/.test(p) ? p.slice(0, -1) : p) + 'कार' + 'ान्त');
      if (!dual) return [...nm.map(x => x + 'म्'), 'च'];
      const VS = { 'ई': 'े', 'ऊ': 'ो', 'ए': 'ै', 'इ': 'े', 'उ': 'ो' };
      return [nm.reduce((a, b) => VS[b[0]] ? a + VS[b[0]] + b.slice(1) : a + b) + 'ौ'];
    };
    const tadW = (f, num, carriedFrom) => { const ph = tadPh(TADS[f], num === 2 && /^(नदी|प्रगृह्य)$/.test(name)); fire('1.1.72', '✔', 2, `${f}${carriedFrom ? ' (carried over from ' + carriedFrom + ')' : ''}: sounds naming words`, `${ph.join(' ')} — words ending in them (tadanta)`); st.set(f, ph.join(' '), '1.1.72', `${f}: the sounds stand for words ENDING in them (tadanta)`); return ph; };
    for (const w of words) {
      if (quotedNa && w.form === 'न') { out.push('न', 'वा'); outC.push('न', 'वा'); continue; }   // 1.1.44 नवेति: “न वा” is what is named
      if ((isNameW(w.form) && w.wcase === 1) || w === multi || w.form === 'न') continue;   // न is said once, before भवति
      if (w.wcase === 6 && has('अदर्शनं')) { out.push(w.form, 'अदर्शनस्य'); outC.push(w.form, 'अदर्शनस्य'); continue; }   // 1.1.61: अदर्शनम् (1.1.60) agrees with प्रत्ययस्य
      if (w.form === 'विभक्तौ' && !NIMK('विभक्तौ#')) { out.push('विभक्तौ', 'वर्तमानाः'); outC.push('विभक्तौ', 'वर्तमानाः'); continue; }   // 1.3.4: the sounds IN a case ending, not before one
      if (TADS[w.form]) { const ph = tadW(w.form, w.form === 'ईत्-ऊत्-एत्' ? 3 : 2); out.push(...ph); outC.push(...ph); continue; }
      if (w.form === 'च') { out.push('च'); outC.push('च'); continue; }
      if (w.form === 'यचि') { out.push('यकारादौ', 'अजादौ', 'च', 'परतः'); outC.push('यकारादौ', 'अजादौ', 'च', 'प्रत्यये', 'परे'); fire('PIS 33', '✔', 2, 'यचि: य् and the अच् group in the 7th', 'यकारादौ अजादौ च — what BEGINS with them (tadādi)'); fire('1.1.66', '✔', 2, 'यचि: 7th case', 'names what FOLLOWS'); st.set(w.form, 'यकारादौ अजादौ च प्रत्यये परे', ['PIS 33', '1.1.66'], 'यचि = य् + अच्: sounds in the 7th → a suffix BEGINNING with them (PIS 33) that follows (1.1.66)'); continue; }
      if (w.wcase === 7) { const L = NIMK(w.form) || (SFX7(w.form) ? { sfx: !/^(यचि|असर्वनामस्थाने|इतौ)$/.test(w.form) } : null); const f7 = w.form === 'सुँ-आदिषु' ? 'स्वादिषु' : w.form.replace(/-/g, ''); const ph = L ? [f7, 'परतः'] : [w.form, 'विषये']; out.push(...ph); outC.push(...(L ? [f7, ...(L.sfx && !L.self ? ['प्रत्यये'] : []), 'परे'] : [w.form, 'विषये'])); if (L) fire('1.1.66', '✔', 2, `${w.form}: 7th case`, 'names what FOLLOWS'); continue; }
      const ph = w.segs.length > 1 ? [w.segs.join('_'), ...(words.some(x => x.form === 'च') ? [] : ['च'])] : [w.form];
      out.push(...ph); outC.push(...ph);
      if (w.segs.some(g => PRATYAHARA.has(g.replace(/ः$/, '')))) fire('1.1.71', '✔', 2, `${w.segs.find(g => PRATYAHARA.has(g.replace(/ः$/, '')))}: a sound/suffix group`, 'first item + final marker = everything in between');
    }
    // a suffix carried over in the 7th (जसि ← 1.1.32, स्वादिषु ← 1.4.17): names what follows (1.1.66)
    carried.filter(c => !SILENT[c.w] && SFX7(c.w) && ((autoOf(sid(c.from), c.w) || {}).cs === 7 || /^(स्वादिषु|असर्वनामस्थाने|जसि)$/.test(c.w))).forEach(c => { out.push(c.w.replace(/-/g, ''), 'परतः'); outC.push(c.w.replace(/-/g, ''), ...(/^(असर्वनामस्थाने|इतौ)$/.test(c.w) ? [] : ['प्रत्यये']), 'परे'); fire('1.1.66', '✔', 2, `${c.w}: 7th case (carried over from ${c.from})`, 'names what FOLLOWS'); c._done = true; });
    carried.filter(c => TADS[c.w] && !words.some(w => TADS[w.form])).forEach(c => { const ph = tadW(c.w, 2, c.from); out.push(...ph); outC.push(...ph); });
    carried.filter(c => !c._done && !SILENT[c.w] && c.w !== 'प्रत्ययः' && c.w !== 'धातोः' && !isNameW(c.w) && !(outer && c.w === outer + 'े') && (!(LEX[c.w] && LEX[c.w].kind) || ['word', 'term'].includes(LEX[c.w].kind))).forEach(c => { out.push(c.w); outC.push(c.w); });
    const neg = carried.some(c => c.w === 'न') || (words.some(w => w.form === 'न') && !quotedNa);
    const nmW0 = words.find(w => isNameW(w.form) && w.wcase === 1) || carried.map(c => ({ form: c.w })).find(c => isNameW(c.form));
    const nmForm = nmW0 ? nmW0.form : name;
    const nm = multi ? [...names.map(n => `'${n}'`), 'इति', 'संज्ञाः', ...(neg ? ['न'] : []), 'भवन्ति'] : [...(outer ? [outer + 'म्'] : []), "'" + nmForm + "'_", 'इति', 'संज्ञा', ...(neg ? ['न'] : []), 'भवति'];
    words.filter(w => w.wcase === 7 && NIMK(w.form)).forEach(w => st.set(w.form, w.form + ' परे', '1.1.66', `${w.form}: 7th case → names what follows`));
    const nmW = words.find(w => isNameW(w.form) && w.wcase === 1) || carried.find(c => isNameW(c.w));
    if (nmW) st.set(nmW.form || nmW.w, `'${nmForm}' इति संज्ञा`, [], `${nmW.form || nmW.w} is the term being defined → “'${nmForm}' इति संज्ञा”`);
    // spell sound-groups out in the class style: तपर आत् → आ (1.1.70); ऐच् → ऐ, औ (1.1.71)
    const PL = Object.fromEntries(J('pratyahara/data.txt').data.map(p => [p.name, p.list]));
    const soundW = words.filter(w => w.wcase === 1 && !isNameW(w.form) && w.segs.every(g => PL[g] || /^[अआइईउऊऋॠऌएऐओऔ]त्$/.test(g)));
    let outC2 = outC;
    if (soundW.length && soundW.length === words.filter(w => w.wcase === 1 && !isNameW(w.form)).length) {
      const items = soundW.flatMap(w => w.segs.flatMap(g => PL[g] ? PL[g].split(',').map(x => x.trim()) : [g.replace('त्', '')]));
      // prathamāvṛtti + class notes: “आ ऐ औ इति एतेषां वर्णानाम् …” (the numeral त्रयाणाम् is the sūtrārtha's own addition)
      const isV = items.every(x => /^[अआइईउऊऋॠऌएऐओऔ]$|^[क-ह]्?$/.test(x));   // sounds; सुट् lists suffixes → प्रत्ययानाम्
      const NUMW = isV ? { 1: 'अस्य वर्णस्य', 2: 'एतयोः वर्णयोः', 9: 'एतेषाम् वर्णानाम्' } : { 1: 'अस्य प्रत्ययस्य', 2: 'एतयोः प्रत्यययोः', 9: 'एतेषाम् प्रत्ययानाम्' };
      outC2 = [items.join(' '), 'इति', NUMW[items.length] || NUMW[9], ...outC.filter(x => !soundW.some(w => w.segs.join('_') === x || w.form === x) && x !== 'च')];
      st.snap(['1.1.70', '1.1.71'], `the sounds named: ${items.join(', ')} (तपर → that length only; a pratyāhāra → all its sounds)`);
    }
    // the members named are suffixes (क्त्वा तोसुन् कसुनः): the term covers what ENDS in them — “… इत्येवमन्ताः शब्दाः” (PIS 23)
    const sfxW = words.filter(w => w.wcase === 1 && !isNameW(w.form) && w.segs.length && w.segs.every((g, i) => { const x = i === w.segs.length - 1 ? g.replace(/(ः|ौ|ाः)$/, '्').replace(/््$/, '्') : g; return !!(suffixOf(g) || suffixOf(x) || ((LEX[g] || {}).kind === 'suffix')); }));
    if (/^(अव्यय|पद|भ)$/.test(name) && sfxW.length && sfxW.length === words.filter(w => w.wcase === 1 && !isNameW(w.form)).length) {   // terms for whole words only (आर्धधातुक names the suffix itself)
      const mem = sfxW.flatMap(w => w.segs.map((g, i) => i === w.segs.length - 1 ? g.replace(/(ः|ौ|ाः)$/, m => m === 'ः' ? '्' : '्').replace(/््$/, '्').replace(/^(.*[ािीुूृेैोौ])्$/, '$1') : g));
      outC2 = [mem.join(' '), 'इत्येवमन्ताः', 'शब्दाः', ...outC.filter(x => !sfxW.some(w => w.segs.join('_') === x || w.form === x) && x !== 'च')];
      fire('PIS 23', '✔', 2, `${sfxW.map(w => w.form).join(', ')}: suffixes named`, 'the term covers words ENDING in them (“इत्येवमन्ताः”)');
      st.snap('PIS 23', `${sfxW.map(w => w.form).join(', ')} are suffixes → words ending in them (“… इत्येवमन्ताः शब्दाः”)`);
    }
    fin([...out, ...nm], [...out.map(x => x === 'परतः' ? 'परे' : x), ...nm.slice(0, -1), 'स्यात्'], [...outC2, ...nm]);
    return;
  }
  if (k === 'atideśa' && rec.id !== '12004') {
    const idn = +rec.id;
    const lk = (w, ...ks) => w.lex.some(l => l && ks.includes(l.kind));
    const neg = words.some(w => w.form === 'न') || has('न') || (idn >= 12018 && idn <= 12026);   // न runs on from 1.2.18 to 1.2.26
    const opt = words.some(w => lk(w, 'option') || /^(वा|विभाषा|अन्यतरस्याम्)$/.test(w.form)) || has('वा') || has('विभाषा');
    const cs = c => (autoOf(sid(c.from), c.w) || {}).cs;
    if (idn >= 12001 && idn <= 12026) {
      // कित्/ङित् atideśa (1.2.1–26): “[dhātu] परः [suffix] प्रत्ययः किद्वत्/ङिद्वत् भवति”
      const T0 = [...words.map(w => w.form), ...carried.map(c => c.w)].find(x => /^(कित्|ङित्)$/.test(x)) || 'कित्';
      const vat = T0 === 'ङित्' ? 'ङिद्वत्' : 'किद्वत्';
      const mean7 = words.filter(w => w.wcase === 7 && !lk(w, 'option', 'nimitta') && w.form !== 'आत्मनेपदेषु');
      const atm = words.some(w => w.form === 'आत्मनेपदेषु') || has('आत्मनेपदेषु');
      const POSF = { 'उद्-उपधात्': 'उदुपधात्', 'न-उपधात्': 'नकारोपधात्', 'वि-उपधात्': 'उकारोपधात् इकारोपधात् च', 'हल-आदेः': 'हलादेः', 'थ-फ-अन्तात्': 'थकारान्तात् फकारान्तात् च', 'असंयोगात्': 'असंयोगान्तात्' };
      const baseOf = (form, lex, segs) => {
        if (POSF[form]) { if (form === 'असंयोगात्') fire('1.1.72', '✔', 2, 'असंयोगात्: a description in the 5th qualifying the dhātu', 'असंयोगान्तात् धातोः — a dhātu ENDING in a non-conjunct (tadanta)'); return [POSF[form]]; }
        if (form === 'हलन्तात्' && has('इकः')) return ['इक्समीपात्', 'हलः'];
        if (form === 'उः') { fire('1.1.72', '✔', 2, 'उः (= ऋ, 5th) qualifies the dhātu', 'ऋवर्णान्तात् धातोः (a dhātu ending in it)'); return ['ऋवर्णान्तात्']; }
        if (segs.length === 1 && lex[0] && ['pratyahara', 'varna'].includes(lex[0].kind)) { const t = sTad(lex[0]) + 'ात्'; fire('1.1.72', '✔', 2, `${form}: a sound qualifying the dhātu`, `${t} धातोः (a dhātu ending in it)`); if (lex[0].kind === 'pratyahara') fire('1.1.71', '✔', 2, `${lex[0].stem}: a sound group`, 'first sound + final marker = everything in between'); return [t]; }
        if (segs.length > 1 && lex.some(l => l && ['dhatu', 'word'].includes(l.kind)) && !lex.some(l => l && ['pos', 'upasarga', 'neg'].includes(l.kind)) && !/अन्तात्$/.test(form)) return [segs.map((g, i) => i === segs.length - 1 ? g.replace(/(भ्याम्|भ्यां|भ्यः|ः|ात्|ेः)$/, m => m === 'ेः' ? 'ि' : '') : g).join(' '), segs.length === 2 ? 'इत्येताभ्याम्' : 'इत्येतेभ्यः'];
        return [form.replace(/-/g, '')];
      };
      let b5 = words.filter(w => w.wcase === 5).map(w => ({ form: w.form, lex: w.lex, segs: w.segs }));
      if (!b5.length) b5 = carried.filter(c => cs(c) === 5 && !SILENT[c.w] && c.w !== 'धातोः' && !(c.w === 'इकः' && has('हलन्तात्'))).map(c => ({ form: c.w, lex: c.w.split('-').map(g => LEX[g] || null), segs: c.w.split('-'), car: c.from }));
      const base = b5.flatMap(b => baseOf(b.form, b.lex, b.segs));
      const many = base.includes('इत्येतेभ्यः') ? 'धातुभ्यः' : base.includes('इत्येताभ्याम्') ? 'धातुभ्याम्' : null;
      const dual0 = words.some(w => w.form === 'लिङ्-सिचौ') || carried.some(c => c.w === 'लिङ्-सिचौ');
      if (base.length) { if (!base.includes('हलः')) base.push(many || 'धातोः'); base.push(dual0 ? 'परौ' : 'परः'); fire('1.1.67', '✔', 2, `${b5.map(b => b.form).join(', ')}: 5th case`, 'the suffix that FOLLOWS it is meant'); }
      const SFX1 = /^(लिट्|क्त्वा|सन्|सिच्|निष्ठा|लिङ्-सिचौ|सेट्|अपित्|झल्|इट्)$/;
      let sf = words.filter(w => w.wcase === 1 && SFX1.test(w.form)).map(w => w.form);
      const carSf = carried.filter(c => SFX1.test(c.w)).map(c => c.w);
      if (!sf.some(x => !/^(झल्|इट्|सेट्|अपित्)$/.test(x))) sf = [...new Set([...carSf, ...sf])];
      else sf = [...new Set([...carSf.filter(x => /^(झल्|इट्|सेट्|अपित्)$/.test(x) && x !== 'इट्'), ...sf])];
      if ((words.some(w => w.form === 'क्त्वा') || (idn === 12026)) && !sf.includes('क्त्वा')) sf.push('क्त्वा');   // 1.2.26 सन् and the carried क्त्वा
      const ORD = ['सेट्', 'अपित्', 'झल्', 'इट्'];
      sf.sort((a, b) => (ORD.indexOf(a) + 1 || 9) - (ORD.indexOf(b) + 1 || 9));
      const sfP = sf.map(x => x === 'झल्' ? (dual0 ? 'झलादी' : 'झलादिः') : x === 'इट्' ? 'इडादिः' : x.replace(/-/g, ''));
      if (sf.includes('झल्')) fire('PIS 33', '✔', 2, 'झल् (a sound group) names the suffix', 'झलादिः — a suffix BEGINNING with it (tadādi)');
      if (sf.includes('इट्')) fire('1.1.46', '✔', 2, 'इट् is the augment at the start of the suffix', 'इडादिः — a suffix beginning with इट्');
      const dual = sf.includes('लिङ्-सिचौ');
      const M = mean7.flatMap(w => [w.form.replace(/-/g, ''), 'अर्थे', 'वर्तमानात्']);
      if (atm) fire('1.1.66', '✔', 2, 'आत्मनेपदेषु: 7th case', 'names what FOLLOWS (an ātmanepada ending)');
      const tail = [...(atm ? ['आत्मनेपदेषु', 'परे'] : []), ...(opt ? ['विकल्पेन'] : [])];
      const head = neg ? [T0, 'न', dual ? 'भवतः' : 'भवति'] : [vat, dual ? 'भवतः' : 'भवति'];
      const C = [...M, ...base, ...sfP, dual ? 'प्रत्ययौ' : 'प्रत्ययः', ...tail, ...head];
      st.snap(base.length ? ['1.1.67'] : [], `the suffix after the dhātu named → treated ${neg ? 'as not ' + T0 : 'as if ' + T0 + ' (' + vat + ')'}`);
      fin(C, [...C.slice(0, -1), dual ? 'स्याताम्' : 'स्यात्'], C);
      return;
    }
    // other atideśas: “[what] [conditions] X-वत् भवति” — the वत् word (स्थानिवत्, पुंवत्, लङ्वत्) or the property extended (णित्, अपित्, पित्)
    const vatW = words.find(w => /वत्$/.test(w.form)) || carried.map(c => ({ form: c.w, car: true })).find(c => /वत्$/.test(c.form));
    const propW = !vatW ? (words.find(w => /^(णित्|अपित्|पित्|कित्|ङित्)$/.test(w.form)) || carried.map(c => ({ form: c.w })).find(c => /^(णित्|अपित्|पित्|कित्|ङित्)$/.test(c.form))) : null;
    const hd = vatW ? vatW.form.replace(/-/g, '') : propW ? propW.form : null;
    const body = [];
    for (const w of words) {
      if ((vatW && w === vatW) || (propW && w === propW) || w.form === 'न' || w.form === 'च' || lk(w, 'option')) continue;
      const f = w.form.replace(/-/g, ' ');
      if (w.wcase === 7) { const L = NIMK(w.form) || ((has('उत्तरपदे') || w.lex.some(l => l && ['suffix', 'term'].includes(l.kind))) && !/^(छन्दसि|संज्ञायाम्|भाषायाम्|संहितायाम्)$/.test(w.form) ? { sfx: false } : null); body.push(f, L ? (L.sfx ? 'प्रत्यये परे' : 'परे') : 'विषये'); if (L) fire('1.1.66', '✔', 2, `${w.form}: 7th case`, 'names what FOLLOWS'); }
      else if (w.wcase === 5) { body.push(f, 'परः'); fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'what FOLLOWS it is meant'); }
      else body.push(f);
    }
    for (const c of carried) {
      if (SILENT[c.w] !== undefined || (vatW && vatW.car && c.w === vatW.form) || (propW && c.w === propW.form) || /^(न|च|वा|विभाषा|प्रत्ययः|धातोः|ङ्याप्प्रातिपदिकात्|अङ्गस्य|पदस्य|लस्य|संहितायाम्)$/.test(c.w) || /वत्$/.test(c.w)) continue;
      const k7 = cs(c) === 7, L = NIMK(c.w) || (c.w === 'उत्तरपदे' ? { sfx: false } : null);
      body.push(c.w.replace(/-/g, ' '), ...(k7 ? [L ? (L.sfx ? 'प्रत्यये परे' : 'परे') : 'विषये'] : []));
      if (k7 && L) fire('1.1.66', '✔', 2, `${c.w}: 7th case (carried over from ${c.from})`, 'names what FOLLOWS');
    }
    const verb = words.some(w => w.wcase === 1 && w.num === 2) ? 'भवतः' : words.some(w => w.wcase === 1 && w.num === 3) ? 'भवन्ति' : 'भवति';
    const C = [...body, ...(opt ? ['विकल्पेन'] : []), ...(hd ? [hd] : []), ...(neg ? ['न'] : []), verb];
    st.snap([], hd ? `${hd}: the status extended by this atideśa` : 'atideśa');
    fin(C, [...C.slice(0, -1), verb === 'भवतः' ? 'स्याताम्' : verb === 'भवन्ति' ? 'स्युः' : 'स्यात्'], C);
    return;
  }
  if (k === 'atideśa') {
    const tgt = carried.find(c => (LEX[c.w] || {}).kind === 'atidesha');
    const ws = words.map(w => w.form).sort((a, b) => (/^अ/.test(b) && b.length < 6) - (/^अ/.test(a) && a.length < 6));
    const vat = tgt ? glue(jas(tgt.w), 'वत्').replace(/्वत्$/, 'वत्') : '?';
    const vatF = tgt ? jas(tgt.w).replace(/्$/, '्') + 'वत्' : '?';
    if (tgt) st.set(tgt.w, vatF, [], `${tgt.w} (carried) → “like a ${tgt.w}” (${vatF}): the rule extends that status`);
    fin([...ws, vatF, 'भवति'], [...ws, vatF, 'स्यात्'], [...ws, vatF, 'भवति']);
    return;
  }
}

// ───────────────────────── vṛtti steps: a running sentence in sūtra order, one snapshot per step ─────────────────
function makeSteps(rec, words, carriedSpoken, silentNames) {
  const T = words.map(w => ({ k: w.form, t: w.form })).concat(carriedSpoken.map(c => ({ k: 'c:' + c, t: c === 'ङ्याप्प्रातिपदिकात्' ? 'प्रातिपदिकात्' : c })));
  rec.steps = [{ pids: [], what: 'the sūtra’s own words', now: words.map(w => w.form).join(' ') }];
  const find = k => T.find(y => y.k === k || y.k === 'c:' + k);
  const snap = (pids, what) => rec.steps.push({ pids: [].concat(pids || []).filter(Boolean), what, now: plain(T.map(x => x.t)) });
  if (carriedSpoken.length || silentNames.length) snap('1.3.11', 'carried words brought in: ' + (carriedSpoken.join(', ') || '—') + (silentNames.length ? ' · carried but not said aloud: ' + silentNames.join(', ') : ''));
  return {
    snap,
    set(k, t, pids, what) { const x = find(k); if (x) x.t = t; else T.push({ k, t }); snap(pids, what); },
    drop(k, pids, what) { const x = find(k); if (x) x.t = ''; snap(pids, what); },
    ins(afterK, t, pids, what) { const i = T.findIndex(y => y.k === afterK || y.k === 'c:' + afterK); T.splice(i < 0 ? T.length : i + 1, 0, { k: '+' + t, t }); snap(pids, what); },
    has(k) { return !!find(k); },
  };
}
// ───────────────────────── automatic word analysis (lexicon.js) → generator kinds ─────────────────────────
// transitivity of each root (dhātupāṭha field karma: S = takes an object, A = not, D = two objects)
const KARMA = new Map();
{ const d0 = J('dhatu/data.txt'); for (const d of (d0.data || d0)) { const k = d.karma; for (const r of [d.dhatu, d.aupadeshik]) { const prev = KARMA.get(r); if (!prev || k === 'S' || k === 'D') KARMA.set(r, k); } } }
const isAkarmaka = root => [].concat(root).every(r => KARMA.get(r) === 'A');
// 7th-case words that state a meaning / circumstance (→ “… गम्यमाने”), not an upapada
const MEANING7 = /^(संज्ञा|छन्दस्|व्रत|वयस्|भृति|ताच्छील्य|आनुलोम्य|अनुलोम्य|हेतु|अनुद्यमन|आवश्यक|आभीक्ष्ण्य|प्रशंसा|निन्दा|क्षेप|परिप्रश्न|गर्हा|भूत|भविष्यत्|वर्तमान|अनद्यतन|परोक्ष|कर्मव्यतिहार|ताद्धर्म्य|साधुकारिन्|उपमान|उपमा|अभिविधि|मर्यादा|शक्ति|आशीस्|अनुग्रह|सम्भावन|अमर्ष|विस्मय|अधिकार)$|(ने|त्वे|तायाम्|त्वा)$/;
const AUTO = JSON.parse(fs.readFileSync(path.join(__dirname, 'lexicon.json'), 'utf8'));
const ONLY = arg('--pada', null);      // e.g. --pada 3.2 to build one pāda while iterating
function mapAuto(r, cs, last, ctx) {
  // an unanalysed 7th-case word in the operation chapters is almost always a suffix that follows (जुसि, क्त्वि)
  if (r && !r.kind && cs === 7 && last && ctx.opsSec && !ctx.pilot && !MEANING7.test(r.seg || '')) return { kind: 'nimitta', sfx: true, auto: true, guessed: true };
  if (!r || !r.kind) return null;
  const st = r.stem || r.seg;
  const SFX_TERMS = /^(सार्वधातुक|आर्धधातुक|तद्धित|कृत्|कृत्य|सुप्|तिङ्|निष्ठा|प्रत्यय|विभक्ति|सर्वनामस्थान|परस्मैपद|आत्मनेपद|अङ्ग|पद|लट्|लिट्|लुट्|लृट्|लेट्|लोट्|लङ्|लिङ्|लुङ्|लृङ्)$/;
  if (cs === 7 && last && (['suffix', 'pratyahara', 'sound', 'agama'].includes(r.kind) || (r.kind === 'term' && SFX_TERMS.test(st))) && !ctx.pilot) {
    const n = { kind: 'nimitta', sfx: ['suffix', 'term', 'agama'].includes(r.kind), auto: true };
    if (ctx.inAnga && (r.kind === 'pratyahara' || r.kind === 'sound')) n.tadadi = r.kind === 'sound' && /्$/.test(st) ? st.slice(0, -1) + 'कार' : st;
    return n;
  }
  switch (r.kind) {
    case 'pratyahara': return { kind: 'pratyahara', stem: st, auto: true };
    case 'sound': {
      const m = st.match(/^([अआइईउऊऋॠऌएऐओऔ])त्$/); if (m) return { kind: 'varna', stem: m[1], tapara: true, auto: true };
      if (/^[अआइईउऊऋॠऌएऐओऔ]$/.test(st)) return { kind: 'varna', stem: st, auto: true };
      if (/^[कचटतप]ु$/.test(st)) return { kind: 'varna', stem: st, udit: true, auto: true };
      if (/्$/.test(st)) return { kind: 'varna', stem: st, cons: true, auto: true };
      return { kind: 'varna', stem: st, auto: true };
    }
    case 'suffix': return { kind: 'suffix', stem: st, auto: true };
    case 'dhatu':
      if (ctx.inAnga && (cs === 6 || cs === 5)) { const alt = (r.alts || []).find(a => /^(pratyahara|suffix):/.test(a)); if (alt) return alt.startsWith('suffix') ? { kind: 'suffix', stem: alt.split(':')[1], auto: true } : { kind: 'pratyahara', stem: alt.split(':')[1], auto: true }; }
      return { kind: 'dhatu', root: r.root || st, shtip: /श्तिप्/.test(r.src || '') ? st : undefined, auto: true };
    case 'term':
      if (st === 'उपधा') return { kind: 'pos', auto: true };
      if (/^(दीर्घ|ह्रस्व|प्लुत|गुण|वृद्धि|लोप|सम्प्रसारण|संप्रसारण|लुक्|श्लु|लुप्)$/.test(st) && !/म्$/.test(r.seg || '')) return { kind: 'op', auto: true };
      return { kind: 'term', stem: st, auto: true };
    case 'op': return { kind: 'op', auto: true };
    case 'agama': return { kind: 'agama', marker: (st.match(/([टकम])्$/) || [])[1] || '?', auto: true };
    case 'acharya': return { kind: 'option', acharya: true, auto: true };
    case 'upasarga': return { kind: 'upasarga', stem: st, auto: true };
    case 'pronoun': return { kind: 'pronoun', stem: st, auto: true };
    case 'indecl': {
      if (r.seg === 'च') return { kind: 'ca' };
      if (['वा', 'विभाषा', 'अन्यतरस्याम्', 'बहुलम्'].includes(r.seg)) return { kind: 'option' };
      if (r.seg === 'न') return { kind: 'neg' };
      return { kind: 'ind', stem: st, auto: true };
    }
    default: return { kind: 'word', stem: st, src: r.kind, auto: true };
  }
}
const autoOf = (id, form) => { // first occurrence of a word form in sūtra id → its pieces
  const sx = BYID[id]; if (!sx || !AUTO[id]) return null;
  const ws = sx.pc.split('##').filter(Boolean); let i = ws.findIndex(w => w.split('$')[0] === form);
  if (i < 0 && /ः$/.test(form)) i = ws.findIndex(w => w.split('$')[0] === form.slice(0, -1));   // carried सुपः = सुप (visarga lost to sandhi)
  return i < 0 ? null : { pieces: AUTO[id][i], cs: +ws[i].split('$')[2] || +ws[i].split('$')[4] || 0 };   // 5th slot: case of a pada written without its ending
};
const RES = [];
const DHATU_CLASS_RULES = []; // general rules for 3.1.94
for (const s of SUTRAS) {
  const idn = +s.i; const inRange = idn >= FROM && idn <= TO;
  if (ONLY && `${s.a}.${s.p}` !== ONLY && !(inRange || EXTRA_IDS.has(s.i))) continue;
  // inject this sūtra's automatic word analysis (hand entries in LEX win); removed again after the sūtra
  const injected = [];
  const inject = (k, v) => { if (v && LEX[k] === undefined) { LEX[k] = v; injected.push(k); } };
  // a carried word that is a homograph of a pronoun: अस्य of 7.4.32 (अस्य च्वौ) is the 6th of the SOUND अ, not इदम् — for the sūtras that carry it
  const overridden = [];
  const CAR_LEX = { '7.4.32': { 'अस्य': { kind: 'varna', stem: 'अ' } },
    // अजादी (5.3.58) = the two suffixes इष्ठन् / ईयसुन् that begin with a vowel: “अजाद्योः प्रत्यययोः परतः” (prathamāvṛtti 5.3.60–65)
    '5.3.58': { 'अजादी': { kind: 'nimitta', say: ['अजाद्योः', 'प्रत्यययोः'], tadadiSay: true } } };
  anFix(s.i, s.an || '').split('##').filter(Boolean).forEach(x => { const [w, nid] = x.split('$'); const f = CAR_LEX[num(nid)] && CAR_LEX[num(nid)][w]; if (f) { overridden.push([w, LEX[w]]); LEX[w] = f; } });
  if (!inRange) {
    const ctxA = { pilot: false, inAnga: idn >= 64001 && idn <= 74097, opsSec: idn >= 61001 };
    s.pc.split('##').filter(Boolean).forEach((w, wi) => { const [f, , c0, , lc] = w.split('$'), c = c0 || lc; const segs = f.split('-'); (AUTO[s.i] && AUTO[s.i][wi] || []).forEach((r, si) => { const m = mapAuto(r, si === segs.length - 1 ? +c || 0 : 0, si === segs.length - 1, ctxA); inject(segs[si], m); if (segs.length === 1) inject(f, m);
      // a compound in the 7th whose last member names what follows (त-थासोः, इष्ठ-इमन्-ईयस्सु): the whole word does
      else if (si === segs.length - 1 && m && m.kind === 'nimitta') inject(f, Object.assign({}, m, { parts: segs.map((g, j) => j === segs.length - 1 ? g : g + (m.sfx ? '' : '')).map((g, j, arr) => j === arr.length - 1 ? g : g) , compound: true })); }); });
    // in the operation chapters a carried 7th-case word names what follows (नामि, डिति, शिति) unless it is a domain / scope word
    const NOT_NIM7 = /^(संहितायाम्|छन्दसि|संज्ञायाम्|भाषायाम्|उपदेशे|उत्तरपदे|पदान्ते|अवसाने|समासे|बहुव्रीहौ|तत्पुरुषे|द्वन्द्वे|अव्ययीभावे|कर्मधारये|द्विगौ|विषये|अर्थे|आमन्त्रिते|गोत्रे|यजुषि|ऋचि)$/;
    anFix(s.i, s.an || '').split('##').filter(Boolean).forEach(x => { const [w, nid] = x.split('$'); const a = autoOf(nid, w); if (a && a.pieces && a.pieces.length === 1) inject(w, mapAuto(a.pieces[0], a.cs, true, ctxA));
      if (a && a.cs === 7 && ctxA.opsSec && (LEX[w] === undefined || (LEX[w].auto && ['word', 'term', 'ind', 'dhatu', 'upasarga'].includes(LEX[w].kind))) && !NOT_NIM7.test(w) && !MEANING7.test(w) && SILENT[w] === undefined) { LEX[w] = { kind: 'nimitta', sfx: true, auto: true, guessed: true }; if (!injected.includes(w)) injected.push(w); } });   // auto entries are per-sūtra injections, removed after the sūtra
    (s.ad || '').split('##').filter(Boolean).forEach(x => { const [w, a1, p1, n1] = x.split('$'); const nid = a1 + p1 + String(n1).padStart(3, '0'); const a = autoOf(nid, w); if (a && a.pieces && a.pieces.length === 1) inject(w, mapAuto(a.pieces[0], a.cs, true, ctxA)); });
  }
  const id = s.i, words = parseWords(s), notes = [], P = [];
  // word-level data fixes (the data's पदच्छेद misreads a word), and readings (`reading: true`) of padas written without their ending, whose case
  // the data gives in the 5th pc slot ($S$$$<case>, read by parseWords): 6.4.7 न is voiced नः (the 6th of the sound न्).
  // a sūtra-local reading the lexicon gets wrong: 3.1.146 गः is the dhātu गै (PV “गायतेर्धातोः”, Kāśikā “गायतेः”), not the sound ग्
  const LEXFIX = { '31146': { 'गः': { kind: 'dhatu', root: 'गै' } } };
  const PC_FIX = { '61062': { 'अचि': { wcase: 7, why: 'the data codes अचि as 6th; it is the 7th singular of अच् (Kāśikā “आजादौ तद्धिते”)' } }, '33144': { 'लिङ्लृटौ': { form: 'लिङ्-लृटौ', segs: ['लिङ्', 'लृटौ'], wcase: 1, num: 2, why: 'a dvandva of the lakāras लिङ् and लृट् (PV “लिङ् लुटौ प्रत्ययौ”)' } }, '32066': { 'हव्येः': { form: 'हव्ये', segs: ['हव्ये'], wcase: 7, num: 1, why: 'the data reads हव्येः; the sūtra has हव्ये (7th of हव्य, हव्येऽनन्तःपादम्) — PV “हव्यसुबन्त उपपदे”' } }, '64007': { 'न': { form: 'नः', segs: ['नः'], num: 1, reading: true, why: 'न is the sound न् written without its ending — the data gives it the 6th (न$S$$$6); voiced नः, the 6th of the sound न् (Kāśikā: “नान्तस्याङ्गस्य”; prathamāvṛtti: “न अविभक्त्यन्तं पदम्”)' } } };
  // ashtadhyayi.com padaccheda corrections (ashtadhyayi-errata.json, field pc): the pada as it stands in the sūtra
  for (const e of [ERRATA[id], ERRATA[id + '-pc']]) if (e && e.field === 'pc') for (const x of (e.pc || (e.from ? [e] : [])).filter(x => !x.noBuild)) words.forEach((w, i) => { if (w.form === x.from) words[i] = Object.assign({}, w, { form: x.to, segs: x.to.split('-') }); });
  if (PC_FIX[id]) words.forEach((w, i) => { const f = PC_FIX[id][w.form]; if (f) { words[i] = Object.assign({}, w, f); notes.push((f.reading ? 'reading: ' : '⚠ data fix: ') + f.why); if (LEX['नः'] === undefined) { LEX['नः'] = { kind: 'varna', stem: 'न्', cons: true }; injected.push('नः'); } } });
  const fire = (pid, status, layer, trigger, effect, extra) => P.push(Object.assign({ pid, status, layer, trigger, effect }, extra || {}));
  // 6.4.7's नोपधायाः = न (sound न्, 6th written without its ending) + उपधायाः (PC_FIX reads it नः); the carried “न” of 6.4.7 is that same word
  const an = anFix(s.i, s.an || '').split('##').filter(Boolean).map(x => { const [w, n] = x.split('$'); return { w, from: num(n) }; }).map(c => c.w === 'न' && c.from === '6.4.7' ? { w: 'नः', from: c.from } : c);   // …it is नः, the sound न् (6th)
  const ad = (s.ad || '').split('##').filter(Boolean).map(x => { const [w, a, p, n] = x.split('$'); return { w, from: `${a}.${p}.${n}` }; });
  const typ = s.type.split('##').map(t => t.split('$')[0]);
  const AN_FIX = { '72118': { w: 'अचाम्', from: '7.2.117', note: 'the data’s anuvṛtti list for 7.2.118 leaves out अचाम् (7.2.117); the Kāśikā (“अचामादेरचः”) and the class notes (class 58: “अङ्गस्य अचामादेः अचः किति तद्धितेषु वृद्धिः”) both have it — added here' } };
  if (AN_FIX[id]) { an.push({ w: AN_FIX[id].w, from: AN_FIX[id].from }); notes.push('⚠ ' + AN_FIX[id].note); }
  const rec = { id, n: num(id), s: s.s, type: s.type, set: inRange ? 'kṛtya pilot' : EXTRA_IDS.has(s.i) ? 'class notes' : 'general', kind: null, words: [], carried: [], P, gen: null, genK: null, genC: null, notes, cmp: {}, utsarga: [] };
  // working case
  const ov = CASE_OVERRIDE[id];
  for (const w of words) {
    // a case label its ending cannot have (the data marks मन्माभ्याम् 7th, तिसृभ्यः 6th, …उत्तरपदात् 1st): the ending decides
    if (w.wcase === 7 && /भ्याम्$/.test(w.form) || w.wcase === 6 && /भ्यः$/.test(w.form) || w.wcase === 1 && /ात्$/.test(w.form) && w.segs.length > 1) { notes.push(`⚠ ${w.form}: the data gives case ${w.wcase}; the ending makes it the 5th`); w.wcase = 5; }
    let wc = w.wcase;
    if (ov && w.wcase === ov.from && (!ov.word || ov.word === w.form)) { wc = ov.to; if (ov.by === 'data-fix') w.wcase = ov.to; }   // a data error: the word IS that case (not a व्यत्यय)
    w.work = wc;
    w.lex = w.segs.map((seg, i) => LEX[seg] || (suffixOf(seg) ? { kind: 'suffix', stem: suffixOf(seg) } : null) || (/^(लिङ्|लृट्|लुट्|लट्|लोट्|लङ्|लृङ्|लिट्|लुङ्|लेट्)$/.test(seg.replace(/(ौ|ाः)$/, '्')) ? { kind: 'suffix', stem: seg.replace(/(ौ|ाः)$/, '्') } : null));   // लिङ्-लृटौ: a lakāra with the dual ending on the last member
    // a member that is both a pratyāhāra and a suffix name (यञ्) beside another suffix (यञिञोः, अञ्यञिञाम्) is the suffix
    // a long 5th-case list that is mostly suffix names (टिड्ढाणञ्…क्वरपः): every member names what ENDS in it (PV “… इत्येवमन्तेभ्यः”)
    if (w.wcase === 5 && w.segs.length >= 3 && +id >= 41003 && +id <= 54160 && w.lex.filter(l => l && l.kind === 'suffix').length * 2 >= w.segs.length) { w.lex = w.segs.map((g, i) => ({ kind: 'suffix', stem: i === w.segs.length - 1 ? g.replace(/(ः|ात्|भ्यः)$/, '्').replace(/््$/, '्') : g })); w._sfxList = true; }
    if (LEXFIX[id] && LEXFIX[id][w.form]) w.lex = [LEXFIX[id][w.form]];
    // a teacher named in the sūtra (उदीचाम्, प्राचाम्, शाकल्यस्य …) whatever the lexicon says — never a base word or a stem (4.1.130 उदीचाम् ≠ उदच्)
    // उदीचाम्/प्राचाम् name teachers only where a reference says “… आचार्याणाम्”; otherwise the eastern/northern region
    const refA = (((PV0[`${+id[0]}.${+id[1]}.${+id.slice(2)}`] || {}).artha) || '') + ' ' + kashikaVrttiX(id) + ' ' + ((SUTRARTHA[id] || {}).sa || '');
    if (/^(शाकल्यस्य|गार्ग्यस्य|गालवस्य|शाकटायनस्य|स्फोटायनस्य|आपिशलेः|काश्यपस्य|चाक्रवर्मणस्य|भारद्वाजस्य|सेनकस्य|शौनकस्य)$/.test(w.form) || /^(उदीचाम्|प्राचाम्)$/.test(w.form) && new RegExp(w.form.replace(/म्$/, '') + '[मं]?\\s*[आा]चार्य').test(refA)) { w.lex = [{ kind: 'option', acharya: true }]; w._acharya = true; }
    // a suffix the sūtra itself names (यत्, एण्यः, नञ्-स्नञौ, शालच्-शङ्कटचौ, छ, अत्) that the lexicon leaves unmarked: in the kṛt/taddhita sections a
    // 1st-case (or bare) word whose form the prathamāvṛtti/Kāśikā follow with “प्रत्यय…” is the suffix, not a meaning
    if ((idn >= 41076 && idn <= 54160 || idn >= 31091 && idn <= 34117) && [0, 1].includes(w.wcase) && !w.lex.every(l => l && l.kind === 'suffix') && !/^(च|वा|न|तत्|तद्|तेन|तस्य|तस्मै|तस्मिन्|तत्र|इति|अपि|एव|नित्यम्|बहुलम्|विभाषा)$/.test(w.form)) {
      const refT = (((PV0[`${+id[0]}.${+id[1]}.${+id.slice(2)}`] || {}).artha) || '') + ' ' + kashikaVrttiX(id);
      const nrm = g => g.replace(/(ौ|ाः)$/, '्').replace(/््$/, '्').replace(/ः$/, ''), joined = w.segs.map(nrm).join('').replace(/्(?=[^\s])/g, '्'), bare = x => x.replace(/्$/, '');
      const said = x => x.length >= 1 && new RegExp(`(?<![ऀ-ॿ])${bare(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[्ःौ]?\\s*(-\\s*)?(प्रत्यय|इत्ययं प्रत्यय|इत्येतौ प्रत्यय|इत्येते प्रत्यय)`).test(refT);
      const asMean = new RegExp(`(?<![ऀ-ॿ])${bare(w.form.replace(/(ौ|ाः|ः)$/, '').replace(/-/g, '')).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ःो]?\\s*(इत्येत|इत्यस्मि|इत्यर्थे)`).test(refT);
      if (!asMean && !w.segs.some(g => /^(लुक्|लुप्|अलुक्)$/.test(g)) && !/आदयः$/.test(w.form) && (said(w.form.replace(/(ौ|ाः|ः)$/, '').replace(/-/g, '')) || said(joined)) || !w.segs.some(g => /^(लुक्|लुप्|अलुक्)$/.test(g)) && w.segs.length > 1 && w.segs.every(g => said(nrm(g)))) { w.lex = w.segs.map(g => ({ kind: 'suffix', stem: nrm(g).replace(/([क-ह])$/, '$1') })); w._ownSfx = true; }
    }
    if (w.segs.length > 1 && w.lex.some(l => l && l.kind === 'suffix')) w.lex = w.lex.map((l, i) => l && l.kind === 'pratyahara' && /^(यञ्|अण्|अच्|अम्)$/.test(w.segs[i]) ? { kind: 'suffix', stem: w.segs[i] } : l);
  }
  if (ov) {
    if (ov.by === 'kashika') fire('3.1.85', '✔', 1, `${words.find(w => w.wcase === ov.from).form}: written ${CASE[ov.from]}, works as ${CASE[ov.to]}`, 'षष्ठी stands for पञ्चमी', { quote: [{ c: 'kashika', q: 'पञ्चम्यर्थे षष्ठी' }, { c: 'nyaas', q: '`पञ्चम्यर्थे षष्ठी` इति। <<व्यत्ययो बहुलम्>> [[3.1.85]] इत्यनेन' }] });
    else notes.push('⚠ ' + ov.note);
  }
  // classify sūtra
  const isP = typ.includes('P'), isS = typ.includes('S'), isAD = typ.includes('AD') && !words.some(w => w.lex.some(l => l && l.kind === 'suffix'));
  const ownSuffix = words.filter(w => w.wcase === 1 && w.lex.every(l => l && l.kind === 'suffix'));
  const firstCaseOther = words.filter(w => w.wcase === 1 && !ownSuffix.includes(w) && !w.lex.some(l => l && ['option', 'adesha'].includes(l.kind)));
  const hasBase5 = words.some(w => w.work === 5 || (w.work === 6 && w.lex.some(l => l && l.kind === 'dhatu')));
  if (isP || (isS && !ownSuffix.length && idn <= 31095) || (isAD && idn === 31091)) rec.kind = isP ? 'paribhāṣā' : isS ? 'saṃjñā' : 'adhikāra';
  else if (firstCaseOther.length && !hasBase5) rec.kind = 'nipātana';
  else rec.kind = 'vidhi';
  if (!inRange) {
    const kOf = w => w.lex.find(l => l) || LEX[w.form] || null;
    const anyK = k => words.some(w => (LEX[w.form] && LEX[w.form].kind === k) || w.lex.some(l => l && l.kind === k));
    const carriedK = k => an.concat(ad).some(c => LEX[c.w] && LEX[c.w].kind === k);
    const hasDef = ad.some(c => DEFSUF[c.w]) && idn >= 41076 && idn <= 54160;
    const own1 = words.filter(w => w.wcase === 1 && !w.lex.every(l => l && l.kind === 'suffix') && !w.lex.some(l => l && ['option', 'ca', 'neg'].includes(l.kind)));
    const headOwn = own1.map(w => HEADK(w.form)).find(Boolean);
    const headCar = an.concat(ad).filter(c => SILENT[c.w] === undefined && !(/^(परस्मैपदेषु|आत्मनेपदेषु)$/.test(c.w) && an.concat(ad).some(x => /^(वृद्धिः|गुणः)$/.test(x.w)))).flatMap(c => c.w.split(' ')).map(HEADK).filter(Boolean).pop();   // परस्मैपदेषु is the condition of a carried वृद्धिः (7.2.1 ff.), not a pada rule
    const hasSuf = words.some(w => w.wcase === 1 && w.lex.every(l => l && l.kind === 'suffix')) || hasDef || (an.some(c => suffixOf(c.w) && !SILENT[c.w]) && !own1.length && !ad.some(c => c.w === 'लस्य') && !headCar);
    if (isP || (PB[num(id)] && num(id) !== '3.1.2' && !an.some(c => c.w === 'न') && !typ.includes('S') && !typ.includes('AT'))) rec.kind = 'paribhāṣā';   // 3.1.2 is cited for suffix placement but is itself the heading परः (2026-11-20 audit)
    else if (typ.includes('AT')) rec.kind = 'atideśa';
    else if (isS) rec.kind = ['11060', '11061', '11064', '11065', '11071', '13002', '13003', '13004', '13005', '13006', '13007', '13008', '13009'].includes(id) ? 'saṃjñā' : 'saṃjñā*';
    else if (typ.includes('AD') && !hasSuf && !words.some(w => w.wcase === 1)) rec.kind = 'adhikāra';
    else if ((an.some(c => c.w === 'न') || words.some(w => w.form === 'न')) && an.some(c => c.w === 'गुण-वृद्धी' || c.w === 'इकः') && idn < 11010) rec.kind = 'niṣedha';
    // the svara section (6.1.158–6.2.199) with an accent head carried or its own (उदात्तः, अन्तः, आदिः, स्वरितः, अनुदात्तम्, प्रकृत्या): svara before
    // the generic ādeśa / āgama branches (PV “अन्तोदात्तं भवति”, not “स्थाने अन्तः आदेशः”)
    else if (idn >= 61158 && idn <= 62199 && !(an.concat(ad).some(c => /^(एकः पूर्वपरयोः)$/.test(c.w))) && an.concat(ad).map(c => c.w).concat(words.map(w => w.form)).some(f => /^(उदात्तः|अन्तः|आदिः|आदिरुदात्तः|स्वरितः|अनुदात्तम्|अनुदात्तः|प्रकृत्या|अन्तोदात्तः|आद्युदात्तः|उदात्तवत्|सर्वम्)$/.test(f))) rec.kind = 'svara';
    // an augment's name in the 6th is the PLACE of a replacement (इटोऽत्: the ending इट् → अत्; आटश्च: आट् + अच् → वृद्धि), not an augment rule
    else if (anyK('agama') && !words.some(w => [5, 6].includes(w.wcase) && w.lex.some(l => l && l.kind === 'agama'))) rec.kind = 'āgama';
    // an augment named in the sūtra or carried (ईट्, याट्, थुक्, मुम्, नीक् …) where the prathamāvṛtti/Kāśikā say “… आगमो भवति” — not a substitute
    else if ((() => { const AUG = /^(इट्|ईट्|अट्|आट्|याट्|स्याट्|सुट्|यासुट्|सीयुट्|तुक्|नुक्|मुक्|दुक्|युक्|थुक्|पुक्|वुक्|कुक्|रुक्|रिक्|रीक्|नीक्|मुम्|नुम्|सुम्|ङमुट्|आम्|उम्|अम्|यिट्|यक्|रुट्|पुम्|आदुक्)$/;
      const ref = ((PV0[rec.n] || {}).artha || '') + ' ' + kashikaVrttiX(id); if (!/आगम/.test(ref) || /आदेशो भवति|आदेशः भवति/.test(ref) && !/आगमो भवति/.test(ref)) return false;
      if (idn < 61001 && !(idn >= 34077 && idn <= 34117) || words.some(w => w.wcase === 6)) return false;
      return words.some(w => w.wcase === 1 && w.segs.some(g => AUG.test(g))) || an.some(c => SILENT[c.w] === undefined && AUG.test(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 1); })()) rec.kind = 'āgama';
    // an augment carried in (ईट् ← 7.3.93, इट् ← 7.2.35) with no substitute of the sūtra's own: still an augment rule (PV “… आगमो भवति”)
    else if (!own1.length && idn >= 61001 && !words.some(w => [5, 6].includes(w.wcase) && w.lex.some(l => l && l.kind === 'agama')) && an.some(c => { if (SILENT[c.w] !== undefined) return false; const a = autoOf(sid(c.from), c.w); return a && a.cs === 1 && a.pieces && a.pieces.some(p => p && p.kind === 'agama'); }) && !an.some(c => /^(लोपः|लुक्|गुणः|वृद्धिः|दीर्घः|ह्रस्वः)$/.test(c.w))) rec.kind = 'āgama';
    else if (anyK('agama') && an.concat(ad).some(c => c.w === 'एकः पूर्वपरयोः')) rec.kind = 'ekādeśa';
    else if (anyK('agama') && own1.length) rec.kind = 'ādeśa';
    else if (ad.some(c => c.w === 'लस्य') && own1.length) rec.kind = 'ādeśa';
    else if (!hasSuf && an.concat(ad).some(c => c.w === 'एकः पूर्वपरयोः')) rec.kind = 'ekādeśa';
    else if (!hasSuf && an.concat(ad).some(c => c.w === 'अपदान्तस्य मूर्धन्यः')) rec.kind = 'ṣatva';
    else if (!hasSuf && idn >= 84001 && idn <= 84039 && an.concat(ad).some(c => c.w === 'णः' || c.w === 'नः' || c.w === 'रषाभ्याम्')) rec.kind = 'ṇatva';
    // a dhātu in the 6th and a sound in the 1st (हन्तेर्जः): the sound replaces it, even with an operation carried in (नलोपः)
    else if (idn >= 61001 && words.some(w => w.wcase === 6 && w.lex.length === 1 && (w.lex[0] || {}).kind === 'dhatu') && words.some(w => w.wcase === 1 && w.lex.length === 1 && (w.lex[0] || {}).kind === 'varna')) rec.kind = 'ādeśa';
    // a sound in the 6th and a sound in the 1st (एरुः, एत ऐ, आत ऐ, वैतोऽन्यत्र): the second replaces the first
    else if (words.some(w => w.wcase === 6 && w.lex.length === 1 && ['varna', 'pratyahara'].includes((w.lex[0] || {}).kind)) && words.some(w => (w.wcase === 1 || (w.wcase === 0 && /^[अआइईउऊऋएऐओऔ]ः?$/.test(w.form))) && w.lex.length === 1 && (['varna', 'sound'].includes((w.lex[0] || {}).kind) || /^[अआइईउऊऋएऐओऔ]ः?$/.test(w.form)))) rec.kind = 'ādeśa';
    // the प्राग्दिशः section's pronoun replacements (इदम इश्, एतदोऽन्, सर्वस्य सोऽन्यतरस्यां दि, इदमो हः, युष्मदस्मदोः …): a named word in the 6th, its replacement in the 1st
    else if (idn >= 53001 && idn <= 53026 && words.some(w => w.wcase === 6 && /^(इदमः|एतदः|सर्वस्य|किमः|अदसः|तदः)$/.test(w.form)) && words.some(w => w.wcase === 1)) rec.kind = 'ādeśa';
    else if (idn >= 43001 && idn <= 43003) rec.kind = 'ādeśa';
    else if (idn >= 53060 && idn <= 53065 && (words.some(w => w.wcase === 1 && !w.lex.some(l => l && ['option', 'ca'].includes(l.kind))) || ['53061', '53062'].includes(id))) rec.kind = 'ādeśa';   // ज्य च (5.3.61), वृद्धस्य च (5.3.62): प्रशस्यस्य / वृद्धस्य → ज्य   // प्रशस्यस्य श्रः, ज्य च, वृद्धस्य च … (before अजादी)   // युष्मदस्मदोः (4.3.1) → युष्माकास्माकौ, तवकममकौ
    // शतृशानचौ carried with लटः carried (3.2.125 सम्बोधने च, 3.2.126): they replace the लट्
    // a replacement carried over whole — its place (6th) and its substitute (1st) from one ādeśa sūtra (झेर्जुस् → 3.4.109 सिजभ्यस्तविदिभ्यश्च)
    else if (idn >= 24036 && idn <= 24057) rec.kind = 'ādeśa';   // आर्धधातुके (2.4.35): dhātu substitutes — अदो जग्धिर्ल्यप्ति किति … चक्षिङः ख्याञ् (PV “… आदेशो भवति”); a carried आर्धधातुके is the condition, not a suffix
    else if (idn >= 54141 && idn <= 54145) rec.kind = 'ādeśa';   // दन्तस्य दतृ (+ 5.4.142–145 carrying it): PV “दन्तशब्दस्य स्थाने दतृ आदेशो भवति”
    else if (!own1.length && idn >= 34077 && idn <= 34117 && !an.some(c => c.w === 'लोपः') && (() => { const by = {}; an.forEach(c => { const a = autoOf(sid(c.from), c.w); if (a && !SILENT[c.w]) (by[c.from] = by[c.from] || []).push(a.cs); }); return Object.entries(by).some(([f, cs]) => cs.includes(6) && cs.includes(1) && (RES.find(r => r.n === f) || {}).kind === 'ādeśa'); })()) rec.kind = 'ādeśa';
    else if (idn >= 32124 && idn <= 32126 && an.some(c => c.w === 'लटः')) rec.kind = 'ādeśa';
    // (a lakāra in the 6th replaced by a suffix also counts: लिटः कानज्वा, लटः शतृशानचौ; or carried in: क्वसुश्च ← लिटः)
    else if (!words.some(w => w.wcase === 6) && words.some(x => x.wcase === 1 && x.lex.every(l => l && l.kind === 'suffix')) && an.some(c => /^(लटः|लिटः|लोटः|लेटः|लिङः)$/.test(c.w)) && !an.some(c => c.w === 'लस्य') && idn < 34001) rec.kind = 'ādeśa';
    else if ((words.some(w => w.work === 6 && !/^(अस्य|तस्य|एषाम्)$/.test(w.form) && ((w.lex.length && w.lex.every(l => l && l.kind === 'suffix')) || (/^(लटः|लिटः|लुटः|लृटः|लेटः|लोटः|लङः|लिङः|लुङः|लृङः)$/.test(w.form) && words.some(x => x.wcase === 1 && x.lex.every(l => l && l.kind === 'suffix'))))) || an.some(c => !SILENT[c.w] && !/^(अस्य|तस्य|एषाम्)$/.test(c.w) && (LEX[c.w] || {}).kind === 'suffix' && (autoOf(sid(c.from), c.w) || {}).cs === 6)) && (words.some(w => w.wcase === 1 && w.lex.length && w.lex.every(l => l && l.kind === 'suffix')) || an.some(c => !SILENT[c.w] && (LEX[c.w] || {}).kind === 'suffix' && (autoOf(sid(c.from), c.w) || {}).cs === 1))) rec.kind = 'ādeśa';   // च्लेः सिच्: one suffix replacing another
    else if ((() => {   // a suffix or sound in the 6th (own or carried) replaced by a 1st-case word: जसः शी, आत औ णलः, (हः) घः
      const PK = ['suffix', 'pratyahara', 'varna'], STR = new Set(['अङ्गस्य', 'धातोः', 'पदस्य', 'भस्य', 'प्रातिपदिकस्य', 'लस्य', 'अस्य', 'तस्य', 'अस्याः', 'अस्याम्', 'अस्मिन्', 'एषाम्']);
      const place6 = words.some(w => w.work === 6 && w.lex.length && w.lex.every(l => l && PK.includes(l.kind))) || an.concat(ad).some(c => !STR.has(c.w) && SILENT[c.w] === undefined && PK.includes((LEX[c.w] || {}).kind) && (autoOf(sid(c.from), c.w) || {}).cs === 6);
      const rep1 = words.some(w => (w.wcase === 1 || (w.wcase === 0 && !/^(न|च|वा|अपि|तु|एव)$/.test(w.form))) && HEADK(w.form) !== 'op' && !w.lex.some(l => l && ['option', 'ca', 'neg', 'op'].includes(l.kind))) || an.some(c => SILENT[c.w] === undefined && c.w !== 'प्रत्ययः' && PK.includes((LEX[c.w] || {}).kind) && (autoOf(sid(c.from), c.w) || {}).cs === 1);
      return place6 && rep1 && !(idn >= 31001 && idn <= 54160 && !words.some(w => w.work === 6 && w.lex.some(l => l && l.kind === 'suffix')) && !an.some(c => (LEX[c.w] || {}).kind === 'suffix' && (autoOf(sid(c.from), c.w) || {}).cs === 6));
    })()) rec.kind = 'ādeśa';
    else if (!hasSuf && idn >= 61158 && idn <= 62199 && !(an.concat(ad).some(c => /^(एकः पूर्वपरयोः)$/.test(c.w)))) rec.kind = 'svara';
    else if (hasSuf) rec.kind = 'vidhi';
    else if (an.concat(ad).some(c => c.w === 'एकवचनम्') && !hasSuf) rec.kind = 'ekavat';
    else if (!hasSuf && ad.some(c => c.w === 'प्राक्कडारात्समासः' || c.w === 'सुप्सुपा') && idn >= 21005 && idn <= 22038 && !own1.some(w => HEADK(w.form) === 'vibhakti' && idn >= 23001)) rec.kind = 'samāsa';
    else if (['vibhakti', 'accent', 'pada', 'samasa', 'ekavat'].includes(headOwn || headCar)) rec.kind = { vibhakti: 'vibhakti', accent: 'svara', pada: 'pada', samasa: 'samāsa', ekavat: 'ekavat' }[headOwn || headCar];
    else if (anyK('op') || carriedK('op') || headOwn === 'op' || headCar === 'op') rec.kind = 'operation';
    else if (anyK('adesha') || (ad.some(c => c.w === 'लस्य') && words.some(w => w.wcase === 1))) rec.kind = 'ādeśa';
    else if (own1.length && (words.some(w => w.wcase === 6 && !/^(अस्य|तस्य|एषाम्|आसाम्)$/.test(w.form)) || an.concat(ad).some(c => /स्य$/.test(c.w) && !/^(अस्य|तस्य)$/.test(c.w) && !SILENT[c.w] && (LEX[c.w] || {}).kind !== 'suffix'))) rec.kind = 'ādeśa';
    else if (own1.length && !(idn >= 31001 && idn <= 54160)) rec.kind = 'nipātana';
    else if (rec.kind === 'nipātana' && !(idn >= 31001 && idn <= 54160)) rec.kind = 'vidhi';
    // still a "suffix rule" with no suffix in sight: route by what the carried words are (the operation is carried over —
    // आङि चापः takes एत् from 7.3.103, हलि च takes दीर्घः, सनि ग्रहगुहोश्च takes इट्)
    // chapters 1–2 and 6–8 introduce no suffixes: a "suffix rule" there is always a misreading
    if (rec.kind === 'vidhi' && (!hasSuf || idn >= 61001 || idn < 31001)) {
      const carK = an.concat(ad).filter(c => SILENT[c.w] === undefined).map(c => { const a = autoOf(sid(c.from), c.w); return { c, k: (LEX[c.w] || {}).kind || (a && a.pieces && a.pieces[0] && a.pieces[0].kind) || '', cs: a ? a.cs : 0, h: HEADK(c.w) }; });
      if (carK.some(x => x.k === 'agama')) rec.kind = 'āgama';
      else if (carK.some(x => x.h === 'op' || x.k === 'op')) rec.kind = 'operation';
      else if (carK.some(x => x.h && x.h !== 'op')) { const h = carK.filter(x => x.h && x.h !== 'op').pop().h; rec.kind = { vibhakti: 'vibhakti', accent: 'svara', pada: 'pada', samasa: 'samāsa', ekavat: 'ekavat' }[h]; }
      else if ((carK.some(x => x.cs === 1 && ['adesha', 'sound', 'pratyahara', 'word', 'term'].includes(x.k)) || own1.length) && (idn >= 61001 || words.some(w => w.wcase === 6) || carK.some(x => x.cs === 6))) rec.kind = 'ādeśa';   // a replacement needs a place (6th); 3.3.2 उणादयः is a suffix rule
      else { const sc = carK.filter(x => x.cs === 1 && ['adesha', 'sound', 'pratyahara', 'word', 'term', 'suffix', ''].includes(x.k) && !/^(विभाषा|वा|अन्यतरस्याम्|बहुलम्|नित्यम्|प्रत्ययः|परश्च|आद्युदात्तश्च)$|वत्$/.test(x.c.w)).pop(); if (sc) rec._sfxCand = sc.c.w; }
      // still unresolved in chapters 6–8: an augment if one is carried (सुट्कात्पूर्वः, तुक्), else a replacement
      if (rec.kind === 'vidhi' && idn >= 61001) rec.kind = an.concat(ad).some(c => /^(सुट्|तुक्|नुक्|मुक्|दुक्|युक्|आट्|अट्|इट्|नुट्|सुट्कात्पूर्वः)/.test(c.w)) ? 'āgama' : 'ādeśa';
    }
  }
  // a form the references call a nipātana (“… इति निपात्यते”) in chapters 6–8 is a nipātana, not a substitute of its first word (7.4.65 दाधर्ति…, 8.2.12 आसन्दीवत्…)
  if (!inRange && idn >= 61001 && /^(ādeśa|operation)$/.test(rec.kind)) { const ref = ((PV0[rec.n] || {}).artha || '') + ' ' + kashikaVrttiX(id);
    if (/निपात्य/.test(ref) && !/आदेशो भवति|आदेशः भवति|ादेशो भवति/.test(ref) && words.some(w => w.wcase === 1 && w.form.length > 3 && !w.lex.some(l => l && ['option', 'ca', 'neg', 'varna', 'pratyahara', 'sound'].includes(l.kind)))) rec.kind = 'nipātana'; }
  // 5.2.49–5.2.57: augments to the पूरण suffix डट् (मट्, तमट्, थुक्, तिथुक्, इथुक्) — Kāśikā/PV: “डटो मट् आगमो भवति”
  const DAGM = /^(मट्|तमट्|थुक्|तिथुक्|इथुक्|थट्)$/;
  if (!inRange && idn >= 52049 && idn <= 52058 && (words.some(w => w.wcase === 1 && DAGM.test(w.form)) || (!words.some(w => w.wcase === 1 && !/^(नित्यम्)$/.test(w.form)) && an.concat(ad).some(c => DAGM.test(c.w))))) rec.kind = 'āgama';
  // ekaśeṣa (1.2.65–1.2.73): one word remains (1st case), its partner (3rd case) drops — under एकशेषः (1.2.64)
  if (!inRange && idn >= 12065 && idn <= 12073 && idn !== 12066 && an.concat(ad).some(c => /^एक-?शेषः$/.test(c.w))) rec.kind = 'ekaśeṣa';
  // a taddhita sūtra with a suffix carried in (कन् ← 5.2.67, खः ← 5.2.9 …): the 1st-case word is the MEANING (“परिजात इत्येतस्मिन्नर्थे कन्”), not a nipātana (PV)
  if (!inRange && rec.kind === 'nipātana' && ((idn >= 41076 && idn <= 54160) || (idn >= 31091 && idn <= 34117)) && pvSuffixStyle(id) && (an.some(c => SILENT[c.w] === undefined && suffixOf(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 1) || words.some(w => w.wcase === 1 && w.segs.every(g => /^(लिङ्|लृट्|लुट्|लट्|लोट्|लङ्|लृङ्|लिट्|लुङ्|लेट्|लृटौ|लुटौ|लिटौ|लोटौ|लङौ|लेटौ)/.test(g))) || idn >= 31091 && idn <= 34117 && words.some(w => w.wcase === 1 && w.form.length > 3 && ((PV0[rec.n] || {}).artha || '').includes(w.form.replace(/(ाः|ः|ौ)$/, ''))))) rec.kind = 'vidhi';   // किंवृत्ते लिङ्लृटौ: lakāras are suffixes
  // a heading the Kāśikā itself calls an adhikāra in its first sentence (परश्च “अयमप्यधिकारो …”, भूते “भूत इत्यधिकारः”, आदिरुदात्तः “… इत्येतदधिकृतम्”):
  // it is stated as an adhikāra, not run through a rule template (data type AD only)
  if (!inRange && /^AD\$/.test(s.type) && !/##/.test(s.type) && !HAND[`${+String(id).slice(0, 1)}.${+String(id).slice(1, 2)}.${+String(id).slice(2)}`]  && (/^(nipātana|vidhi|svara)$/.test(rec.kind) || id === '82001') && /धिकार|धिक्रियते|धिकृत/.test(((COMM.kashika || {})[id] || '').split(/[।॥]/)[0])) rec.kind = 'adhikāra';
  // taddhita sūtras whose 6th-case word is the BASE (षष्ठीसमर्थ / a suffix-ending base), not the place of a replacement — PV/Kāśikā: “… प्रत्ययो भवति”
  if (!inRange && rec.kind === 'ādeśa' && ['41101', '43001', '43127', '44126', '52019'].includes(id)) rec.kind = 'vidhi';
  // a taddhita sūtra whose only “place” is a pronoun (तदस्य …) is a suffix rule, not a replacement
  if (!inRange && rec.kind === 'ādeśa' && idn >= 41076 && idn <= 54160 && !words.some(w => w.work === 6 && !/^(अस्य|तस्य|एषाम्|आसाम्)$/.test(w.form)) && !an.concat(ad).some(c => SILENT[c.w] === undefined && !/^(अस्य|तस्य)$/.test(c.w) && (autoOf(sid(c.from), c.w) || {}).cs === 6)) rec.kind = 'vidhi';
  // the prātipadika of each pada (lexicon.json, our analysis of the ashtadhyayi.com padas) — shown on hover in the पदच्छेदः line
  const pcForms = (s.pc || '').split('##').filter(Boolean).map(x => x.split('$')[0]);
  const stOf = (w, i) => { const ps = AUTO[id] && AUTO[id][i]; if (!ps || pcForms[i] !== w.form && pcForms[i] !== w.form.replace(/-/g, '')) return null; if (!ps.every(p => p && p.stem)) return null;
    const k = ps[ps.length - 1].kind; return { st: ps.map(p => p.stem).join('-'), sk: k === 'indecl' ? 'अव्ययम्' : k === 'dhatu' ? 'धातुः' : k === 'pratyahara' ? 'प्रत्याहारः' : k === 'suffix' ? 'प्रत्ययः' : k === 'sound' ? 'वर्णः' : k === 'agama' ? 'आगमः' : k === 'upasarga' ? 'उपसर्गः' : k === 'pronoun' ? 'सर्वनाम' : 'प्रातिपदिकम्' }; };
  // fallback for an ordinary a-/ā-stem noun the lexicon leaves open: only endings that are unambiguous for its case·number
  const AEND = { '11': [/ः$/, ''], '21': [/म्$/, ''], '31': [/ेन$/, ''], '41': [/ाय$/, ''], '51': [/ात्$/, ''], '61': [/स्य$/, ''], '71': [/े$/, ''], '73': [/ेषु$/, ''], '63': [/ानाम्$/, ''], '53': [/ेभ्यः$/, ''], '72': [/योः$/, ''] };
  const guess = w => { if (!w.wcase || /[-]/.test(w.form) && false) return null; const last = w.segs[w.segs.length - 1], r = AEND['' + w.wcase + w.num]; if (!r || !r[0].test(last) || /^(अस्य|तस्य|यस्य|एषाम्|अस्मिन्|तस्मिन्)$/.test(last)) return null;
    const st = [...w.segs.slice(0, -1), last.replace(r[0], r[1])].join('-'); return st.length > 1 && !/्$/.test(st) ? { st, sk: 'प्रातिपदिकम्' } : null; };
  rec.words = words.map((w, i) => Object.assign({ form: w.form, wcase: w.wcase, work: w.work, num: w.num, kinds: w.lex.map(l => l ? l.kind : '?') }, stOf(w, i) || (w.lex.every(l => !l || ['word', 'nominal', '?', 'term'].includes(l.kind)) ? guess(w) : null) || {}));
  // a pada written without its ending (5th pc slot, PV «लुप्तप्रथमान्तो निर्देशः»): mark it, and drop the lexicon's "no case ending → अव्ययम्"
  // fallback, which predates reading that slot (1.1.13 शे showed as अव्ययम्; reader report 2026-11-23)
  rec.words.forEach((o, i) => { const w = words[i]; if (!w.lupta) return; o.lupta = true;
    const lx = (AUTO[id] && AUTO[id][i]) || []; if (o.sk === 'अव्ययम्' && lx.length && lx[lx.length - 1].src === 'indeclinable (no case ending)') { delete o.st; delete o.sk; } });
  // carried-over items
  const carriedSuffix = [], carriedCond = [];
  for (const c of an.concat(ad)) {
    if (rec.carried.some(x => x.w === c.w)) continue;
    const silent = SILENT[c.w] !== undefined && c.w !== 'प्रत्ययः';
    const suf = suffixOf(c.w);
    const LK = LEX[c.w] ? LEX[c.w].kind : '';
    let role = silent ? 'silent: ' + SILENT[c.w] : c.w === 'प्रत्ययः' ? 'names what is introduced' : c.w === 'धातोः' ? 'base' : c.w === 'ङ्याप्प्रातिपदिकात्' ? 'base (प्रातिपदिकात्)' : c.w === 'अङ्गस्य' ? 'the aṅga (6th)' : suf ? 'suffix' : c.w === 'सुपि' ? 'upapada' :
      LK === 'nimitta' ? 'what follows (7th)' : LK === 'op' ? 'operation' : LK === 'sthana' ? 'the place (6th)' : LK === 'qual6' ? 'qualifies the place (6th)' : LK === 'neg' ? 'negation' : LK === 'pos' ? 'position' : LK === 'pratyahara' || LK === 'varna' ? 'the sound(s)' : LK === 'dhatu' ? 'dhātu' : LK === 'atidesha' ? 'treated as' : 'condition';
    if (DEFSUF[c.w]) { carriedSuffix.unshift(DEFSUF[c.w]); role = 'section heading — default suffix ' + DEFSUF[c.w]; }
    else if (suf && !silent) carriedSuffix.push(suf); else if (suf && silent) { /* class name, e.g. कृत् — not the suffix */ } else if (!silent && !['प्रत्ययः', 'धातोः', 'ङ्याप्प्रातिपदिकात्'].includes(c.w)) carriedCond.push(c.w);
    // case·number of the word as it stands in its own sūtra (ashtadhyayi.com पदच्छेद), and whether it comes by anuvṛtti or adhikāra
    const pcSrc = ((BYID[sid(c.from)] || {}).pc || '').split('##').map(x => x.split('$')).find(x => x[0] && x[0].replace(/-/g, '') === c.w.replace(/[-\s]/g, ''));
    rec.carried.push({ w: c.w, from: c.from, role, spoken: !silent, via: ad.includes(c) ? 'adhikāra' : 'anuvṛtti', code: pcSrc && pcSrc[1] === 'S' ? `${pcSrc[2]}${pcSrc[3]}` : pcSrc ? 'अव्ययम्' : '' });
  }
  if (rec.carried.length) fire('1.3.11', '✔', 2, rec.carried.map(c => c.w).join(', '), 'carried in from the sūtras named');
  // which carried words the gloss actually says: suffix rules say the base, suffix, conditions (+ प्रत्ययः परश्च);
  // other kinds don't say धातोः/प्रत्ययः/परश्च; a nipātana says only the carried suffix
  const isSuf = rec.kind === 'vidhi', isNip = rec.kind === 'nipātana';
  const sayIt = c => c.spoken && !c.superseded && (isSuf || (!['धातोः', 'प्रत्ययः', 'परश्च', 'ङ्याप्प्रातिपदिकात्'].includes(c.w) && (!isNip || suffixOf(c.w))));
  const spokenC = rec.carried.filter(c => sayIt(c) && c.w !== 'प्रत्ययः').map(c => c.w).concat(isSuf && rec.carried.some(c => c.w === 'प्रत्ययः') ? ['प्रत्ययः'] : []).concat(isSuf && rec.carried.some(c => c.w === 'परश्च') ? ['परश्च'] : []);
  const st = makeSteps(rec, words, spokenC, rec.carried.filter(c => !spokenC.includes(c.w)).map(c => c.w));
  if (ov) st.snap(ov.by === 'kashika' ? '3.1.85' : [], ov.by === 'kashika' ? `${words.find(w => w.wcase === ov.from).form} is written in the ${CASE[ov.from]} but works as the ${CASE[ov.to]} (Kāśikā: “पञ्चम्यर्थे षष्ठी”; Nyāsa: by 3.1.85)` : 'data fix: ' + ov.note);
  rec._st = st;
  // ─── generation
  const vowelStem = r => r.endsWith('्') ? r.slice(0, -1) : r;
  const BN = ad.some(c => c.w === 'ङ्याप्प्रातिपदिकात्') ? 'प्रातिपदिकात्' : (inRange || ad.some(c => c.w === 'धातोः') || an.some(c => c.w === 'धातोः')) ? 'धातोः' : '';
  const TADDHITA = !inRange && idn >= 41076 && idn <= 54160;
  try {
  if (rec.kind === 'vidhi') {
    const baseParts = [], condParts = [], tail = [], prefix = [], prefixC = [], ys = [];
    let usesDhatoh = true, option = '', ca = words.some(w => w.lex.some(l => l && l.kind === 'ca'));
    const sounds = [], upadha = [], dhatus = [], negd = [], ups = [];
    for (const w of words) w.lex.forEach((l, i) => {
      if (!l) return;
      if ((w.work === 5 || w.work === 6) && (l.kind === 'pratyahara' || l.kind === 'varna' || l.kind === 'ugit')) sounds.push({ w, l });
      else if (w.work === 5 && l.kind === 'upadha') upadha.push({ w, l });
      else if ((w.work === 5 || w.work === 6) && l.kind === 'dhatu') (l.neg ? negd : dhatus).push({ w, l, seg: w.segs[i] });
      else if (w.work === 5 && l.kind === 'upasarga') ups.push(w.segs[i]);
      else if (l.kind === 'option') option = w.segs[i] === 'बहुलम्' ? 'बहुलम्' : 'विभाषा';
    });
    // sounds → tadanta
    const segTxt = {};
    const setSeg = (w, i, txt, pids, what) => { segTxt[w.form] = segTxt[w.form] || w.segs.slice(); segTxt[w.form][i] = txt; const arr = segTxt[w.form]; st.set(w.form, arr.join(' ') + (arr.length > 1 && arr.every((x, j) => x !== w.segs[j]) ? ' च' : ''), pids, what); };
    sounds.forEach(({ w, l }, k) => {
      // a pair of sounds in one dual word (ॠदोः = ॠ + उ): each gives its own “ending in it”
      if (l.parts && !l.cons) {
        const ts = l.parts.map(p => (/^[अइउऋऌ]$/.test(p) ? p + 'वर्णान्त' : p + 'कारान्त') + 'ात्');
        baseParts.push(...ts, 'च');
        st.set(w.form, ts.join(' ') + ' च', ['1.1.72', '1.1.69'], `${w.form} = ${l.parts.join(' + ')}: each describes the base → “ending in it” (tadanta); a short अण् vowel stands for all its lengths (1.1.69)`);
        fire('1.1.72', '✔', 2, `${w.form} (${l.parts.join(', ')}) qualifies ${BN}`, `${ts.join(' ')} च (what ends in them)`);
        if (l.parts.some(p => /^[अइउऋऌ]$/.test(p))) fire('1.1.69', '✔', 2, `${l.parts.filter(p => /^[अइउऋऌ]$/.test(p)).join(', ')}: an अण् vowel`, 'stands for all its lengths');
        return;
      }
      let name = l.stem, eff;
      if (l.kind === 'varna') {
        if (l.udit) { name = l.stem.slice(0, -1) + 'वर्ग'; fire('1.1.69', '✔', 2, `${w.form}: उदित् sound`, `${l.stem} = the whole ${name}`); }
        else if (!l.tapara && 'अइउऋऌ'.includes(l.stem)) { name = l.stem + 'वर्ण'; fire('1.1.69', '✔', 2, `${w.form}: अण् vowel, not तपर`, `${l.stem} = ${name} (short, long, pluta)`); }
      }
      let t;
      if (l.kind === 'pratyahara' || l.kind === 'ugit') t = tadantaStem(l.stem);
      else if (l.tapara) { t = tadantaStem(l.stem + 'त्'); fire('1.1.70', '✔', 2, `${w.form}: ${l.stem} with त् after it (तपर)`, taparaLen(l.stem)); }
      else t = (l.cons || /्$/.test(name) ? SNAME(l.stem) : name) + 'ान्त';   // a consonant: यकारान्त, not य्ान्त
      baseParts.push(t + 'ात्');
      { const si = w.segs.findIndex(g => LEX[g] === l); const si2 = si < 0 ? 0 : si;
        if (l.kind === 'varna' && l.udit) setSeg(w, si2, name + 'ात्', '1.1.69', `${l.stem} has a उ marker (उदित्) → it stands for its whole class, the ${name}`);
        else if (l.kind === 'varna' && !l.tapara && 'अइउऋऌ'.includes(l.stem)) setSeg(w, si2, name + 'ात्', '1.1.69', `${l.stem} (an अण् vowel) stands for all its lengths → ${name}`);
        else if (l.tapara) setSeg(w, si2, l.stem + 'कारात्', '1.1.70', `${l.stem}त्: त् after it (तपर) → ${taparaLen(l.stem)}`);
        else if (l.kind === 'pratyahara') rec.steps.push({ pids: ['1.1.71'], what: `${l.stem} is a sound group (first sound + final marker)`, now: rec.steps[rec.steps.length - 1].now });
        setSeg(w, si2, t + 'ात्', ['1.1.72', '1.1.72 vt.2'], `${w.form} describes ${BN} → “ending in it” (tadanta). In a suffix rule vārttika 1 would block this; vārttika 2 lifts the block because the qualifier is ${l.kind === 'ugit' ? 'an ugit' : 'a sound'}`); }
      if (l.kind === 'pratyahara') fire('1.1.71', '✔', 2, `${l.stem}: a sound group`, 'first sound + final marker = everything in between');
      fire('1.1.72', '✔', 2, `${w.form} qualifies ${BN} and names ${l.kind === 'pratyahara' ? 'a sound group' : l.kind === 'ugit' ? 'an ugit (उ/ऋ/ऌ marker)' : 'a sound'}`, `${t}ात् (what ends in it)`);
    });
    if (sounds.length) {
      fire('1.1.72 vt.1', '✖', 2, 'this is a suffix rule (pratyaya-vidhi)', 'would block tadanta — overridden by vt.2');
      fire('1.1.72 vt.2', '✔', 2, sounds.some(x => x.l.kind === 'ugit') ? 'the qualifier is an ugit' : 'the qualifier is a sound (varṇa-grahaṇa)', '…so the block is lifted');
    }
    // a suffix name carried over in the 5th (सुपः into 3.1.9–11) is the base too
    an.filter(c => SILENT[c.w] === undefined && (LEX[c.w] || {}).kind === 'suffix' && [5, 6].includes((autoOf(sid(c.from), c.w) || {}).cs) && !words.some(w => w.work === 5 && w.lex.some(l => l && ['suffix', 'dhatu', 'pratyahara', 'varna'].includes(l.kind)))).forEach(c => {
      const L = LEX[c.w]; const t = antaOf(L.stem) + 'ात्';
      baseParts.push(t); const i = carriedCond.indexOf(c.w); if (i >= 0) carriedCond.splice(i, 1);
      st.set(c.w, t, ['PIS 23'], `${c.w} (carried over, 5th): a suffix named as the base → “what ends in it” (PIS 23)`);
      fire('PIS 23', '✔', 2, `${c.w} (carried over): a suffix named as the base`, `${t} — what ends in it`);
    });
    // a suffix NAME in the 5th/6th is the base: “what ends in that suffix” (घञः → घञन्तात्) — pratyayagrahaṇe tadantagrahaṇam (PIS 23)
    const sfxBase = words.filter(w => (w.work === 5 || (w.work === 6 && TADDHITA && w.segs.length > 1)) && w.lex.length && w.lex.every(l => l && l.kind === 'suffix'));
    sfxBase.forEach(w => {
      const stems = w.segs.map((g, i) => { const L = w.lex[i] || {}; return L.stem || g; });
      const tad = stems.map(x => antaOf(x) + 'ात्');
      const ph = w._sfxList ? [stems.join(' ') + ' इत्येवमन्तेभ्यः'] : tad.length > 1 ? [...tad, 'च'] : tad;
      baseParts.push(...ph);
      st.set(w.form, ph.join(' '), ['PIS 23', '1.1.72'], `${w.form}: a suffix named in the ${CASE[w.work]} → the base is “what ENDS in that suffix” (प्रत्ययग्रहणे यस्मात्स प्रत्ययो विहितस्तदादेस्तदन्तस्य ग्रहणम्)`);
      fire('PIS 23', '✔', 2, `${w.form}: a suffix named as the base`, `${ph.join(' ')} — what ends in it (with what it was added to)`);
      fire('1.1.67', '✔', 2, `${w.form}: ${CASE[w.work]}`, 'the new suffix comes after it');
    });
    // carried bases that name a suffix or a case ending (तिङः ← 5.3.56 in the प्रागिवात् section; सप्तम्याः ← 5.3.10 in the प्राग्दिशः section):
    // “तिङन्तात्”, “सप्तम्यन्तात्” — PIS 23 (a case ending is a suffix too)
    if (!sfxBase.length && (TADDHITA || (idn >= 41003 && idn <= 41075) || (idn >= 31091 && idn <= 34117))) {
      const CASEC = { 'प्रथमायाः': 'प्रथमान्त', 'द्वितीयायाः': 'द्वितीयान्त', 'तृतीयायाः': 'तृतीयान्त', 'चतुर्थ्याः': 'चतुर्थ्यन्त', 'पञ्चम्याः': 'पञ्चम्यन्त', 'षष्ठ्याः': 'षष्ठ्यन्त', 'सप्तम्याः': 'सप्तम्यन्त' };
      const cc = an.filter(c => !SILENT[c.w] && (CASEC[c.w] || c.w === 'तिङः' || /^सप्तमी-पञ्चमी-प्रथमाभ्यः$/.test(c.w)) && !words.some(w => w.form === c.w));
      // the Kāśikā on 5.3.71 says “<<तिङश्च>> [[5.3.56]] इत्येव”: through the प्रागिवात् section the suffixes come after a tiṅanta too
      // (the data's anuvṛtti list leaves it out; the prathamāvṛtti says “तिङन्ताच्च”)
      if (idn >= 53071 && idn <= 53095 && !cc.some(c => c.w === 'तिङः') && !an.some(c => c.w === 'तिङः')) cc.push({ w: 'तिङः', from: '5.3.56 (Kāśikā on 5.3.71: इत्येव)' });
      // a suffix or a sound carried over in the 5th/6th as the base (यञः ← 4.1.16, अतः ← 4.1.4, णेः): “यञन्तात्”, “अदन्तात्”, “ण्यन्तात्”
      const own5w = words.some(w => w.work === 5 && !w.lex.some(l => l && ['upasarga', 'pos'].includes(l.kind)));
      an.filter(c => !SILENT[c.w] && !cc.includes(c) && !words.some(w => w.form === c.w) && ([5, 6].includes((autoOf(sid(c.from), c.w) || {}).cs) || (!autoOf(sid(c.from), c.w) && c.w === 'अतः')) && (c.w === 'णेः' || (LEX[c.w] || {}).kind === 'suffix' || ['varna', 'pratyahara'].includes((LEX[c.w] || {}).kind)) && !/^(स्त्रियाम्|अनुपसर्जनात्)$/.test(c.w) && !(idn >= 31091 && idn <= 34117 && c.w !== 'णेः') && (!own5w || (c.w === 'अतः' && words.every(w => w.work !== 5 || /^(द्विगोः|बहुव्रीहेः)$/.test(w.form)))))
        .forEach(c => cc.push(Object.assign({}, c, { gen: true })));
      // the sūtra's own णेः (णेश्छन्दसि): “ण्यन्तात् धातोः”; an accent word describing the base (वर्णादनुदात्तात् → अनुदात्तान्तात्) — 1.1.72
      if (words.some(w => w.form === 'णेः' && w.work === 5) && !cc.some(c => c.w === 'णेः')) cc.push({ w: 'णेः', from: 'the sūtra itself', gen: true });
      an.concat(words.map(w => ({ w: w.form, from: 'the sūtra itself' }))).filter(c => /^(अनुदात्तात्|उदात्तात्|स्वरितात्)$/.test(c.w) && !cc.some(x => x.w === c.w)).forEach(c => cc.push({ w: c.w, from: c.from, accent: true }));
      if (cc.length) rec._carBase = true;
      cc.forEach(c => { const L0 = LEX[c.w] || {}; const t = c.accent ? [c.w.replace(/ात्$/, 'ान्तात्')] : c.gen ? [c.w === 'णेः' ? 'ण्यन्तात्' : ['varna', 'pratyahara'].includes(L0.kind) ? sTad(L0) + 'ात्' : antaOf(L0.stem || c.w) + 'ात्'] : c.w === 'तिङः' ? ['तिङन्तात्', 'च'] : /^सप्तमी-पञ्चमी-प्रथमाभ्यः$/.test(c.w) ? ['सप्तम्यन्तेभ्यः', 'पञ्चम्यन्तेभ्यः', 'प्रथमान्तेभ्यः', 'च'] : [CASEC[c.w] + 'ात्'];
        const pid0 = c.accent || (c.gen && ['varna', 'pratyahara'].includes(L0.kind)) ? '1.1.72' : 'PIS 23';
        baseParts.push(...t); fire(pid0, '✔', 2, `${c.w} (carried over from ${c.from}): ${pid0 === '1.1.72' ? 'a sound' : 'a suffix / case ending'} describing the base`, `${t.join(' ')} — what ENDS in it`);
        st.set(c.w, t.join(' '), pid0, `${c.w} (carried over): ${pid0 === '1.1.72' ? 'a sound' : 'a suffix or case ending'} describing the base → “what ends in it”`); const i = carriedCond.indexOf(c.w); if (i >= 0) carriedCond.splice(i, 1); });
    }
    // fix the tadanta strings: name+'ान्त' was a placeholder for vowel-final names
    for (let i = 0; i < baseParts.length; i++) baseParts[i] = baseParts[i].replace(/(.)ान्तात्$/, (m, c) => c + 'ान्तात्').replace('वर्णान्तात्', 'वर्णान्तात्');
    upadha.forEach(({ w, l }) => {
      const v = l.stem.slice(0, -2) || l.stem[0];
      const vowel = l.stem.replace('त्', '');
      fire('1.1.70', '✔', 2, `${l.stem}: the sound has त् after it (तपर)`, `${vowel} of that length only`);
      fire('1.1.65', '✔', 2, `${w.form}: उपधा named`, 'the sound before the last');
      baseParts.push(vowel + 'कारोपधात्');
      st.set(w.form, vowel + 'कारोपधात्', ['1.1.70', '1.1.65'], `${l.stem}: त् after it (तपर) → ${taparaLen(vowel)}; उपधा = the sound before the last → “whose penultimate is ${vowel}”`);
    });
    // dhātus
    if (dhatus.length) {
      const ws = [...new Set(dhatus.map(d => d.w))];
      const w6 = dhatus.filter(d => d.w.work === 6);
      if (w6.length) notes.push(`? ${w6[0].w.form}: a 6th-case dhātu name in a suffix rule — no commentator here says it stands for the 5th (Kāśikā on 3.1.99 keeps the 6th: “अनयोर्धात्वोः”)`);
      const multi = dhatus.length > 1 || Array.isArray(dhatus[0].l.root);
      const cite = d => d.l.cite || (d.seg === d.w.segs[d.w.segs.length - 1] && d.w.segs.length > 1 ? d.l.root : d.seg);
      if (!multi) baseParts.push(dhatus[0].w.form, ...(BN ? [BN] : []));
      else if (dhatus.length === 1) baseParts.push(dhatus[0].l.root.join('_') + '_', ...(w6.length ? ['इत्येतयोः', 'धात्वोः'] : ['इत्येतेभ्यः']));
      else baseParts.push(dhatus.map(cite).join('_') + '_', ...(w6.length ? ['इत्येतयोः', 'धात्वोः'] : ['इत्येतेभ्यः']));
      usesDhatoh = false;
      fire('1.1.67', '✔', 2, `${ws.map(w => w.form).join(', ')}: ${w6.length ? 'base named' : '5th case'}`, 'the suffix comes after it');
      if (multi) st.set(ws[0].form, (dhatus.length === 1 ? dhatus[0].l.root.join(' ') : dhatus.map(d => (d.l.cite || (d.seg === d.w.segs[d.w.segs.length - 1] && d.w.segs.length > 1 ? d.l.root : d.seg)).replace(/_/g, ' ')).join(' ')) + (w6.length ? ' इत्येतयोः धात्वोः' : ' इत्येतेभ्यः'), '1.1.67', `the dhātus named (${w6.length ? '6th case' : '5th case'}) are the base — the suffix comes after them`);
      else st.snap('1.1.67', `${ws[0].form}: ${w6.length ? '6th' : '5th'} case → the base; the suffix comes after it`);
    } else if (sounds.length || upadha.length) {
      fire('1.1.67', '✔', 2, `${[...new Set([...sounds, ...upadha].map(x => x.w.form))].join(', ')}: 5th case`, 'the suffix comes after it');
      st.snap(['1.1.67'], `5th case (${[...new Set([...sounds, ...upadha].map(x => x.w.form))].join(', ')}) → the suffix comes AFTER the dhātu so described (with परश्च 3.1.2)`);
    }
    // ── taddhita: base word(s) in the 5th → “X-शब्दात्”; the pronoun gives the case of the base (समर्थ); own 1st-case words = the meaning
    if (TADDHITA) {
      const segStem = (w, i) => { const a = AUTO[s.i] && AUTO[s.i][words.indexOf(w)] && AUTO[s.i][words.indexOf(w)][i]; return (a && a.stem) || w.segs[i]; };
      const notSound = w => !w.lex.some(l => l && ['pratyahara', 'varna', 'ugit', 'upadha', 'upasarga', 'pronoun', 'suffix', 'option', 'ca', 'neg'].includes(l.kind));
      let w5 = words.filter(w => w.work === 5 && notSound(w));
      // a base in an oblique case (पक्षिमत्स्यमृगान् हन्ति): that case is the samartha
      const wObl = !w5.length ? words.filter(w => [2, 3, 4, 6].includes(w.work) && notSound(w)) : [];
      if (wObl.length) w5 = [wObl[0]];
      if (w5.length && !sounds.length) {
        const w = w5[0], last = w.segs[w.segs.length - 1];
        const stemOf = (g, i) => { const x = segStem(w, i); return i === w.segs.length - 1 && x === g ? (/ायाः$/.test(g) ? g.replace(/ायाः$/, 'ा') : g.replace(/(म्|ान्|ात्|स्य|ेः|ोः|ः|ाः|ेभ्यः|ाभ्याम्|ान्|ौ)$/, '')) : x; };   // शिखायाः → शिखा
        // a case name (षष्ठ्याः, सप्तमी-पञ्चमी-प्रथमाभ्यः): a word ending in that case — “षष्ठ्यन्तात्” (PIS 23)
        const CASEA = { 'प्रथमा': 'प्रथमान्त', 'द्वितीया': 'द्वितीयान्त', 'तृतीया': 'तृतीयान्त', 'चतुर्थी': 'चतुर्थ्यन्त', 'पञ्चमी': 'पञ्चम्यन्त', 'षष्ठी': 'षष्ठ्यन्त', 'सप्तमी': 'सप्तम्यन्त' };
        const caseSt = g => { const x = g.replace(/(्याः|याः|ाभ्यः|भ्यः|ाः|्या|या)$/, m => /्या|या/.test(m) ? (g.startsWith('प्रथम') || g.startsWith('द्वितीय') || g.startsWith('तृतीय') ? 'ा' : 'ी') : ''); return Object.keys(CASEA).find(k => x === k || g.startsWith({ 'प्रथमा': 'प्रथम', 'द्वितीया': 'द्वितीय', 'तृतीया': 'तृतीय', 'चतुर्थी': 'चतुर्थ', 'पञ्चमी': 'पञ्चम', 'षष्ठी': 'षष्ठ', 'सप्तमी': 'सप्तम' }[k])) || null; };   // the whole case name, not its first akṣara (द्व्यचः, द्वन्द्वात्, द्वीपात् are not द्वितीया)
        const allCase = w.segs.every(g => caseSt(g));
        if (allCase) { const ts = w.segs.map(g => CASEA[caseSt(g)] + (w.segs.length > 1 || w.num > 1 ? 'ेभ्यः' : 'ात्')); w._caseA = ts.length > 1 ? [...ts, 'च'] : ts; fire('PIS 23', '✔', 2, `${w.form}: a case named`, `${w._caseA.join(' ')} — a word ending in that case ending`); }
        const ph = allCase ? w._caseA.join(' ') : /न्तात्$/.test(w.form) && w.segs.length === 1 ? w.form : /(ादिभ्यः|ाद्भ्यः|भ्यः)$/.test(w.form.replace(/-/g, '')) && !/-/.test(w.form) ? w.form : /आदि/.test(last) ? cjoin(w.form) : w.segs.map(stemOf).join('') + (w.num === 1 ? 'शब्दात्' : w.num === 2 ? 'शब्दाभ्याम्' : 'शब्देभ्यः');
        // samāsānta suffixes (5.4.68 ff.): the word named is the LAST member → “a compound ending in it” (tadanta)
        let SAMANTA = idn >= 54068 && idn <= 54160 && !/आदि/.test(last);
        // two members named (द्वित्रिभ्याम् अञ्जलेः): the 5th is the member before, the later 6th/5th word is the last member
        const lastM = SAMANTA ? words.filter(x => x !== w && [5, 6].includes(x.work) && notSound(x) && words.indexOf(x) > words.indexOf(w)).pop() : null;
        if (lastM) {
          const lst = lastM.segs.map((g, i) => { const a = AUTO[s.i] && AUTO[s.i][words.indexOf(lastM)] && AUTO[s.i][words.indexOf(lastM)][i]; const x = (a && a.stem) || g; return i === lastM.segs.length - 1 && x === g ? g.replace(/(ेः|ोः|स्य|ः|ात्)$/, '') : x; }).join('');
          const phL = [w.form.replace(/-/g, ' '), 'परः', 'यः', lst + 'शब्दः', 'तदन्तात्', 'समासात्'];
          if (!sfxBase.length && !rec._carBase) baseParts.length = 0; baseParts.push(...phL); usesDhatoh = false;
          fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'the member before'); fire('1.1.72', '✔', 2, `${lastM.form}: names the last member of a compound`, `${lst}शब्दः तदन्तात् समासात् — a samāsānta suffix comes after a compound ending in it (tadanta)`);
          st.set(w.form, phL.join(' '), ['1.1.67', '1.1.72'], `${w.form} (5th) is the member before; ${lastM.form} is the compound's last member → “a compound ending in ${lst}” (tadanta)`);
          SAMANTA = 'done';
        }
        // a dvigu carried over (अध्यर्धपूर्वद्विगोः 5.1.28, द्विगोः 5.1.86): the word named is the dvigu's last member → “X-अन्तात् द्विगोः” (1.1.72)
        const dvC = an.concat(ad).find(c => /^(अध्यर्धपूर्व-द्विगोः|द्विगोः)$/.test(c.w));
        if (dvC && SAMANTA === false && !allCase && !/आदि/.test(last) && !/द्विगु/.test(w.form)) {
          // द्वित्रिपूर्वात् निष्कात्: the X-पूर्वात् word names the dvigu's first member, the next 5th word its last member
          const w2 = /पूर्वात्$/.test(w.form) ? w5.find(x => x !== w && !/पूर्वात्$/.test(x.form)) : null;
          const t = w2 ? w.form.replace(/-/g, '') + ' ' + w2.form.replace(/ात्$/, '') + 'शब्दान्तात्' : ph.replace(/शब्दात्$/, 'शब्दान्तात्').replace(/शब्दाभ्याम्$/, 'शब्दान्ताभ्याम्').replace(/शब्देभ्यः$/, 'शब्दान्तेभ्यः');
          const dvP = dvC.w === 'द्विगोः' || w2 ? ['द्विगोः'] : ['अध्यर्धपूर्वात्', 'द्विगोः'];
          if (!sfxBase.length && !rec._carBase) baseParts.length = 0; baseParts.push(t, ...dvP); usesDhatoh = false;
          fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'the base the taddhita suffix comes after');
          fire('1.1.72', '✔', 2, `${w.form} qualifies the dvigu (${dvC.w}, carried over from ${dvC.from})`, `${t} ${dvP.join(' ')} — a dvigu ending in it (tadanta)`);
          st.set(w.form, [t, ...dvP].join(' '), ['1.1.67', '1.1.72'], `${w.form}: the word named is the last member of the dvigu carried over (${dvC.w}) → “a dvigu ending in it” (tadanta)`);
          SAMANTA = 'done';
        }
        const phS = SAMANTA === true ? ph.replace(/(शब्दात्|शब्दाभ्याम्|शब्देभ्यः)$/, m => m === 'शब्दात्' ? 'शब्दान्तात्' : m === 'शब्दाभ्याम्' ? 'शब्दान्ताभ्याम्' : 'शब्दान्तेभ्यः') : ph;
        if (SAMANTA !== 'done') {
        if (!sfxBase.length && !rec._carBase) baseParts.length = 0; baseParts.push(phS, ...(SAMANTA ? ['समासात्'] : [])); usesDhatoh = false;
        fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'the base the taddhita suffix comes after');
        if (SAMANTA) fire('1.1.72', '✔', 2, `${w.form}: names the last member of a compound`, `${phS} समासात् — a samāsānta suffix comes after a compound ending in it (tadanta)`);
        st.set(w.form, SAMANTA ? phS + ' समासात्' : ph, SAMANTA ? ['1.1.67', '1.1.72'] : '1.1.67', SAMANTA ? `${w.form}: in the samāsānta section the word named is the compound's last member → “a compound ending in it” (tadanta); the suffix comes after it` : `${w.form}: the base word(s) in the 5th → the suffix comes after ${/आदि/.test(last) ? 'the words of that list' : 'that word'}`);
        }
      }
      const pron = words.find(w => w.lex.some(l => l && l.kind === 'pronoun')) || null;
      // the samartha case comes from the pronoun of the section's meaning sūtra (तत्र → 7th, तस्य → 6th, तेन → 3rd, तस्मै → 4th …),
      // even when the gloss itself doesn't say the pronoun
      const PRONCASE = { 'तत्र': 7, 'तस्मिन्': 7, 'तस्याम्': 7, 'तस्य': 6, 'तेन': 3, 'तस्मै': 4, 'तस्मात्': 5, 'ततः': 5, 'तत': 5, 'तम्': 2, 'ताम्': 2 };   // तत = ततः before a vowel (तत आगतः)
      // तत् / तद्: प्रथमा with अस्य / अस्मिन् / अस्ति (तदस्य …), द्वितीया with a verb (तदधीते)
      const allW = words.map(w => w.form).concat(an.map(c => c.w));
      const tatCase = allW.some(x => /^(अस्य|अस्मिन्|अस्ति|अस्याम्|अस्याः)$/.test(x)) ? 1 : 2;
      PRONCASE['तत्'] = tatCase; PRONCASE['तद्'] = tatCase;
      const ownPron = !pron ? words.find(w => PRONCASE[w.form] && w.form !== 'तत्' && w.form !== 'तद्') : null;
      const carPron = !pron && !ownPron && an.map(c => ({ c, a: autoOf(c.from.replace(/\./g, (m, i) => '').length ? sid(c.from) : '', c.w) })).map(x => PRONCASE[x.c.w] && !(x.a && x.a.pieces && x.a.pieces[0] && x.a.pieces[0].kind === 'pronoun') ? { c: x.c, a: { cs: PRONCASE[x.c.w], pieces: [{ kind: 'pronoun' }] } } : x).filter(x => x.a && x.a.pieces && x.a.pieces[0] && x.a.pieces[0].kind === 'pronoun')
        // “तत् अस्य”: तत् gives the samartha, the इदम्-form (अस्य, अस्मिन्) the meaning
        .sort((p1, p2) => (/^(अस्य|अस्मिन्|अस्याम्|अस्याः|अस्मै|अनेन)$/.test(p1.c.w) ? 0 : 1) - (/^(अस्य|अस्मिन्|अस्याम्|अस्याः|अस्मै|अनेन)$/.test(p2.c.w) ? 0 : 1)).pop();
      const pcs = pron ? (PRONCASE[pron.form] || pron.wcase) : ownPron ? PRONCASE[ownPron.form] : wObl.length ? wObl[0].work : carPron ? carPron.a.cs : 0;
      if (carPron) carriedCond.splice(0, carriedCond.length, ...carriedCond.filter(x => x !== carPron.c.w));
      const CN = ['', 'प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी'];
      if (!pcs && TADDHITA && idn >= 41083 && idn < 53001 && !rec._noSam) {   // 4.1.82 runs up to 5.3.1 (prathamāvṛtti: “प्राग्दिशो विभक्तिरिति यावत्”)
        // no pronoun names the case here (प्राग्दीव्यतोऽण् and its exceptions): the suffix still comes after the first of the connected words,
        // in whatever case the meaning sūtra that applies names — “समर्थात्” (prathamāvṛtti: “समर्थेभ्यः”)
        baseParts.push('समर्थात्');
        fire('4.1.82', '✔', 2, 'a taddhita suffix', 'it comes after the first of the semantically connected words — समर्थानां प्रथमाद्वा (the case is the one the meaning sūtra that applies names)');
        st.snap([], 'a taddhita suffix comes after the first of the connected words (“समर्थात्”) — the case is set by the meaning sūtra that applies');
      }
      // after 5.2 the samartha adhikāra (4.1.82, “प्राग्दिशो विभक्तिः इति यावत्”) no longer runs: the case word is “X-अन्तात्” (PV 5.3.x “सप्तम्यन्तात्”; PIS 23)
      if (pcs && idn >= 53001) { const CA = { 1: 'प्रथमान्तात्', 2: 'द्वितीयान्तात्', 3: 'तृतीयान्तात्', 4: 'चतुर्थ्यन्तात्', 5: 'पञ्चम्यन्तात्', 6: 'षष्ठ्यन्तात्', 7: 'सप्तम्यन्तात्' };
        baseParts.push(CA[pcs]); fire('PIS 23', '✔', 2, `the base word in the ${CASE[pcs]}`, `${CA[pcs]} — a word ending in that case ending (4.1.82 no longer runs after 5.2)`); st.snap('PIS 23', `the base word in the ${CASE[pcs]} → “${CA[pcs]}”`); }
      else if (pcs) {
        baseParts.push(CN[pcs] + 'समर्थात्');
        const pl = pron ? pron.form : ownPron ? ownPron.form : wObl.length ? wObl[0].form : carPron.c.w, isP = !!(pron || ownPron || (!wObl.length && carPron));
        fire('1.3.11', '✔', 2, `${pl}${pron || wObl.length ? '' : ' (carried over)'}: ${isP ? 'a pronoun' : 'the base word'} in the ${CASE[pcs]}`, `the base word is in the ${CASE[pcs]} (${CN[pcs]}समर्थात्) — 4.1.82 समर्थानां प्रथमाद्वा; class notes 88–103`);
        fire('4.1.82', '✔', 2, `${pl}: the word in the ${CASE[pcs]} names the samartha`, `the suffix comes after the first (base) word, standing in the ${CASE[pcs]} — समर्थानां प्रथमाद्वा`);
        st.snap([], `${pl}: ${isP ? 'a pronoun' : 'the base word'} in the ${CASE[pcs]} → the base word stands in the ${CASE[pcs]} (“${CN[pcs]}समर्थात्”)`);
      }
      // not meanings: लुक्/लुप्/अलुक्/लोपः, augments, substitutes, suffix names (also a dual pair स्नञौ) — said after the suffix instead
      const LOPW = /^(लुक्|लुप्|अलुक्|लुग्|अलुग्)$/, notMean = w => LOPW.test(w.form) || /लोपः$/.test(w.form) || w.segs.length === 1 && w.lex.some(l => l && ['op', 'agama', 'adesha'].includes(l.kind)) || (w.segs.length === 1 && /ौ$/.test(w.form) && !!(suffixOf(w.form.replace(/ौ$/, '्')) || suffixOf(w.form.replace(/ौ$/, ''))));
      const extraT = words.filter(w => w.wcase === 1 && notMean(w) && !w.lex.every(l => l && l.kind === 'suffix') && (LOPW.test(w.form) || /लोपः$/.test(w.form) || w.lex.some(l => l && l.kind === 'agama') || w.segs.length === 1 && w.lex.some(l => l && l.kind === 'adesha')));
      rec._tdExtra = extraT.map(w => /^अलु/.test(w.form) ? 'तस्य लुक् न भवति' : /लोपः$/.test(w.form) ? `${w.form} च भवति` : LOPW.test(w.form) ? `तस्य ${w.form} भवति` : w.lex.some(l => l && l.kind === 'agama') ? `${w.form} आगमः च भवति` : `${w.form} आदेशः च भवति`);
      let means = words.filter(w => !notMean(w) && (w.wcase === 1 || (w.wcase === 0 && w.form.length > 2 && !w.lex.some(l => l && ['ind', 'option', 'ca', 'neg'].includes(l.kind)))) && !w.lex.every(l => l && l.kind === 'suffix') && !w.lex.some(l => l && ['pronoun', 'option', 'ca', 'neg'].includes(l.kind)) && !w5.includes(w));
      // own 7th-case words are the meaning too (श्राद्धे → “श्राद्धेऽभिधेये”)
      const m7 = words.filter(w => w.work === 7 && notSound(w) && !w.lex.some(l => l && ['nimitta', 'domain', 'cond'].includes(l.kind)) && !/^(संज्ञायाम्|छन्दसि|स्त्रियाम्)$/.test(w.form));
      m7.forEach(w => { tail.push(w.form.replace(/-/g, ' '), 'अभिधेये'); rec._m7 = (rec._m7 || []).concat(w.form); });
      // carried meaning words (1st case / verb forms in their sūtra) apply only when the sūtra has no meaning of its own
      const MEAN_HEAD = [[['अस्ति', 'अस्मिन्', 'इति'], 'मत्वर्थे'], [['अपत्यम्'], 'अपत्ये']];
      for (const [ws, nm] of MEAN_HEAD) if (ws.every(x => an.some(c => c.w === x)) && !words.some(w => w.wcase === 1 && !w.lex.every(l => l && l.kind === 'suffix'))) {
        for (const x of ['अस्ति', 'अस्मिन्', 'इति', 'तत्', 'तद्', 'अस्य', 'तस्य', 'अपत्यम्']) { const i = carriedCond.indexOf(x); if (i >= 0) carriedCond.splice(i, 1); }
        tail.push(nm); rec._meanHead = nm; st.snap([], `the carried meaning (${ws.join(' ')}) is said in its standard short form “${nm}”`);
      }
      const carMean = rec._meanHead ? [] : an.filter(c => SILENT[c.w] === undefined && !suffixOf(c.w) && c.w !== 'न' && !(LEX[c.w] && ['pronoun', 'option', 'ca', 'neg', 'suffix'].includes(LEX[c.w].kind))).filter(c => { const a = autoOf(sid(c.from), c.w); return a && (a.cs === 1 || a.cs === 0); });
      for (const c of carMean) { const i = carriedCond.indexOf(c.w); if (i >= 0) carriedCond.splice(i, 1); }
      if (!means.length && carMean.length) means = carMean.map(c => ({ form: c.w, segs: c.w.split('-') }));
      // once the sūtra has its own base / meaning, carried base words and adverbs of the previous sūtra lapse
      if (w5.length || means.length || m7.length) { const keep = c => /^(स्त्रियाम्|संज्ञायाम्|छन्दसि|वा|विभाषा|अन्यतरस्याम्|बहुलम्)$/.test(c) || (LEX[c] && ['option', 'domain', 'cond', 'nimitta'].includes(LEX[c].kind)); for (let i = carriedCond.length - 1; i >= 0; i--) if (!keep(carriedCond[i])) carriedCond.splice(i, 1); }
      if (means.length) {
        const m = means.map(w => w.form.replace(/-/g, ' ')).join(' ');
        tail.push(m.replace(/ /g, '_'), means.length > 1 || means[0].segs.length > 1 ? 'इत्येतेष्वर्थेषु' : 'इत्येतस्मिन्नर्थे');
        st.snap([], `${m}: the meaning of the suffix → “${m} इत्येतस्मिन्नर्थे”`);
      }
      if (!ownSuffix.length && carriedSuffix.length && ad.some(c => DEFSUF[c.w] === carriedSuffix[carriedSuffix.length - 1])) st.snap([], `no suffix named → the section’s default ${carriedSuffix[carriedSuffix.length - 1]} (class notes 88–103)`);
    }
    // strī suffixes (4.1.3–4.1.75): a noun in the 5th describes the prātipadika → “ending in it” (पादः → पादन्तात्), 1.1.72;
    // a list with आदि stays as the list (गौरादिभ्यः)
    const STRI = !inRange && idn >= 41003 && idn <= 41075;
    if (STRI && !sounds.length) {
      const nS = w => !w.lex.some(l => l && ['pratyahara', 'varna', 'ugit', 'upadha', 'upasarga', 'pronoun', 'suffix', 'option', 'ca', 'neg'].includes(l.kind));
      let tadDone = false;
      words.filter(w => w.work === 5 && nS(w) && !sfxBase.includes(w)).forEach(w => {
        if (tadDone && !/आदि/.test(w.segs[w.segs.length - 1])) { const i = baseParts.indexOf('प्रातिपदिकात्'); baseParts.splice(i >= 0 ? i : baseParts.length, 0, w.form.replace(/-/g, '')); return; }   // later 5th words qualify it (उपधालोपिनः)
        if (/^(बहुव्रीहेः|तत्पुरुषात्|द्विगोः|अव्ययीभावात्|द्वन्द्वात्|कर्मधारयात्|समासात्)$/.test(w.form)) { const i = baseParts.indexOf('प्रातिपदिकात्'); baseParts.splice(i >= 0 ? i : baseParts.length, 0, w.form); return; }
        if (/आदि/.test(w.segs[w.segs.length - 1])) { baseParts.unshift(w.form.replace(/-/g, ' ')); fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'the base the suffix comes after'); return; }
        const STEMFIX = { 'अनः': 'अन्', 'मनः': 'मन्' };
        const stems = w.segs.map((g, i) => { if (STEMFIX[g]) return STEMFIX[g]; const a = AUTO[s.i] && AUTO[s.i][words.indexOf(w)] && AUTO[s.i][words.indexOf(w)][i]; return (a && a.stem) || g.replace(/(ात्|ः|ेभ्यः|ाभ्याम्)$/, ''); });
        const tad = stems.map(x => antaOf(x) + 'ात्');
        const ph = tad.length > 1 ? [...tad, 'च'] : tad;
        baseParts.unshift(...ph); tadDone = true;
        st.set(w.form, ph.join(' '), ['1.1.72', '1.1.67'], `${w.form}: a word in the 5th describes the prātipadika → “a prātipadika ending in it” (tadanta; strī suffixes allow it)`);
        fire('1.1.72', '✔', 2, `${w.form} qualifies प्रातिपदिकात्`, `${ph.join(' ')} (a prātipadika ending in it)`);
        fire('1.1.67', '✔', 2, `${w.form}: 5th case`, 'the suffix comes after it');
      });
    }
    const post = [];
    if (negd.length) { post.push(negd[0].l.cite, 'वर्जयित्वा'); st.set(negd[0].w.form, negd[0].l.cite + ' वर्जयित्वा', [], `${negd[0].w.form}: the negated dhātus are excepted`); }
    if (ups.length) { baseParts.unshift(ups.map(u => u.replace(/भ्याम्$/, '')).join('_') + '_', 'इत्येवंपूर्वात्'); const uw = words.find(w => w.lex.some(l => l && l.kind === 'upasarga')); st.set(uw.form, ups.map(u => u.replace(/भ्याम्$/, '')).join(' ') + ' इत्येवंपूर्वात्', [], 'the upasargas in the 5th: “preceded by them”'); }
    if (usesDhatoh) {
      // धातोः goes after the first sound-word (Kāśikā order: ऋवर्णान्ताद् धातोर्हलन्ताच्च)
      // a list of suffix-ending bases (यञन्ताद् इञन्तात् च): the base word goes after the whole list, and the sūtra's च is that च
      const sfxL = sfxBase.length === 1 && sfxBase[0].segs.length > 1 && baseParts[sfxBase[0].segs.length] === 'च' ? sfxBase[0].segs.length + 1 : 0;
      if (sfxL) { if (BN) baseParts.splice(sfxL, 0, BN); }
      else if (sfxBase.some(w => w._sfxList)) { if (BN) baseParts.splice(1, 0, BN === 'प्रातिपदिकात्' ? 'प्रातिपदिकेभ्यः' : BN); }
      else {
      if (BN) { if (baseParts.length > 1) baseParts.splice(1, 0, BN); else baseParts.push(BN); }
      if (sounds.length > 1) baseParts.push('च');
      else if (ca && !ownSuffix.length) baseParts.splice(1, 0, 'च');
      }
    }
    // conditions (own 7th words + carried)
    const own7 = words.filter(w => w.work === 7);
    let all7 = own7.filter(w => !(rec._m7 || []).includes(w.form)).map(w => ({ form: w.form, segs: w.segs, lex: w.lex[0], own: true })).concat(carriedCond.filter(c => !(LEX[c] && LEX[c].kind === 'dhatu')).map(c => ({ form: c, segs: [c], lex: LEX[c], own: false })));
    const carriedDhatu = carriedCond.filter(c => LEX[c] && LEX[c].kind === 'dhatu');
    if (carriedDhatu.length && !dhatus.length && !sounds.length) { baseParts.length = 0; baseParts.push(carriedDhatu[0], 'धातोः'); usesDhatoh = false; fire('1.1.67', '✔', 2, carriedDhatu[0] + ': 5th case (carried over)', 'the suffix comes after it'); st.snap('1.1.67', carriedDhatu[0] + ' (carried over) is the base; the suffix comes after it'); }
    // ── kṛt section (3.1.91–3.4.117): Kāśikā on 3.2.4 — “कर्मणीति च सुपीति च द्वयमप्यनुवर्तते। तत्र सकर्मकेषु धातुषु कर्मणीत्येतदुपतिष्ठते, अन्यत्र सुपीति”
    const KRT = !inRange && idn >= 31091 && idn <= 34117;
    if (KRT) {
      const isUp7 = c => c.lex && c.lex.kind === 'upasarga';
      const ups7 = all7.filter(c => c.own && isUp7(c));
      if (ups7.length) {
        all7 = all7.filter(c => !(isUp7(c) && c.own) && c.form !== 'अनुपसर्गे');
        // an upasarga in the 7th is an upapada (3.1.92; prathamāvṛtti 3.3.27 “प्रोपसर्ग उपपदे”, Kāśikā “प्रशब्द उपपदे”)
        rec._upaUp = ups7.map(c => c.lex.stem.replace(/द्$/, 'त्')).join('_') + 'शब्दे'; condParts.unshift(rec._upaUp, 'उपपदे'); rec._condC = [rec._upaUp, 'उपपदे'].concat(rec._condC || []);
        fire('3.1.92', '✔', 2, `${ups7.map(c => c.form).join(', ')}: an upasarga in the 7th, in the dhātu section`, 'names the upapada');
        fire('1.1.67', '✔', 2, `${ups7.map(c => c.form).join(', ')}: an upasarga in the 7th`, 'the dhātu preceded by it (and the carried अनुपसर्गे no longer applies)');
        ups7.forEach(c => st.set(c.form, c.lex.stem + 'शब्दे उपपदे', '3.1.92', `${c.form}: an upasarga in the 7th, in the dhātu section → the upapada (3.1.92) — the carried अनुपसर्गे lapses`));
      }
      const KARAKA7 = new Set(['कर्तरि', 'करणे', 'अधिकरणे', 'भावे', 'सम्प्रदाने', 'अपादाने', 'करणाधिकरणयोः', 'करण-अधिकरणयोः', 'भावकर्मणोः', 'कारके', 'अकर्तरि']);
      const ownSup = all7.some(c => c.own && c.lex && c.lex.kind === 'sup');
      if (ownSup) all7 = all7.filter(c => !(c.form === 'सुपि' && !c.own));
      const karakaW = all7.filter(c => KARAKA7.has(c.form));
      if ((ownSup || karakaW.length) && all7.some(c => c.form === 'कर्मणि' && !c.own)) {
        all7 = all7.filter(c => !(c.form === 'कर्मणि' && !c.own));
        st.snap('3.1.92', ownSup ? 'the sūtra’s own सुपि is the upapada → the carried कर्मणि lapses' : `${karakaW.map(c => c.form).join(', ')} gives the suffix’s sense → the carried कर्मणि lapses; सुपि is the upapada`);
      }
      // in the kartṛ sections (3.2.x, kṛt with the agent sense) and the णमुल्/क्त्वा section (3.4.x, sense भावे) an own करणे/अधिकरणे names the
      // upapada, not the suffix's sense (PV/Kāśikā 3.2.85 “करण उपपदे”, 3.4.37 “करणे कारक उपपदे”, 3.4.41 “अधिकरणवाचिन्युपपदे”)
      const upK = (+rec.id >= 32078 && +rec.id <= 32086) || (+rec.id >= 34022 && +rec.id <= 34064);   // णिनि (kartari) and णमुल् (bhāve) sections: the sense is fixed, so the kāraka word is the upapada
      karakaW.forEach(c => { if (upK && c.own && /^(करणे|अधिकरणे)$/.test(c.form)) { c.upK = true; return; } c.karaka = true; });
      // an own कर्मणि next to the carried one = the WORD कर्मन् as upapada (Kāśikā 3.2.22: “कर्मशब्द उपपदे”)
      const ownKarm = all7.find(c => c.own && c.form === 'कर्मणि');
      if (ownKarm && all7.some(c => c.form === 'कर्मणि' && !c.own)) { ownKarm.form = 'कर्मशब्दे'; ownKarm.lex = { kind: 'word', stem: 'कर्मशब्द' }; }
      const hasK = all7.some(c => c.form === 'कर्मणि' && !c.own), hasS = all7.some(c => c.form === 'सुपि' && !c.own);
      if (hasK && hasS) {
        const roots = dhatus.flatMap(d => [].concat(d.l.root)).concat(all7.filter(c => !c.own && LEX[c.form] && LEX[c.form].kind === 'dhatu').map(c => LEX[c.form].root));
        const akm = roots.length && roots.every(r => isAkarmaka(r));
        const drop = akm ? 'कर्मणि' : 'सुपि';
        all7 = all7.filter(c => !(c.form === drop && !c.own));
        rec.notes.push(`कर्मणि and सुपि both carry over here; the Kāśikā (on 3.2.4): “सकर्मकेषु धातुषु कर्मणीत्येतदुपतिष्ठते, अन्यत्र सुपीति”. ${roots.length ? 'The dhātu is ' + (akm ? 'intransitive' : 'transitive') + ' (dhātupāṭha)' : 'No specific dhātu — taken as transitive'} → ${akm ? 'सुपि' : 'कर्मणि'}.`);
        st.snap('3.1.92', `कर्मणि and सुपि both carry over; ${akm ? 'intransitive' : 'transitive'} dhātu → ${akm ? 'सुपि' : 'कर्मणि'} (Kāśikā on 3.2.4)`);
      }
      // the sūtra's own 7th-case nouns: meanings (→ गम्यमाने) or upapadas (3.1.92)
      const own7n = all7.filter(c => c.own && !c.karaka && (!c.lex || ['word', 'meaning', 'term', 'pronoun', 'ind', 'dhatu', 'suffix', 'varna', 'pratyahara', 'nimitta'].includes(c.lex.kind) || !c.lex.kind) && !(c.lex && ['sup', 'cond', 'domain', 'option'].includes(c.lex.kind)));
      const stem7 = c => (c.lex && c.lex.stem) || c.form.replace(/(े|ि|ौ|ायाम्|याम्|सु|षु)$/, '');
      const vac = own7n.filter(c => /वचने$/.test(c.form) && !/प्रतिवचने$/.test(c.form)); const vacUp = vac.length === 1 && own7n.length === 1 ? vac[0] : null;
      const meanings = own7n.filter(c => !c.upK && c !== vacUp && (MEANING7.test(stem7(c)) || MEANING7.test(c.form.replace(/सि$/, 'स्'))));   // X-वचने = a word saying X, an upapada (Kāśikā 3.2.112 “…वचन उपपदे”)
      // a 7th-case word that the reference vṛttis read as the sense (“गेहे कर्तरि वाच्ये”, “X अभिधेये”) and none as an upapada is a meaning, not an upapada (PV/Kāśikā 3.1.144)
      const refsT = [...OTHER(rec, id).map(x => x[1]), (inRange ? '' : kashikaVrttiX(id)) || (COMM.kashika[id] || '').split(/[।॥]/)[0] || ''].join(' ');
      own7n.filter(c => !meanings.includes(c)).forEach(c => { const st = stem7(c).replace(/्$/, ''); if (st.length < 2) return;
        const asUp = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,6}\\s+(\\S+\\s+)?(उपपदे|उपपदयोः|उपपदेषु)`).test(refsT), asK = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,4}\\s+(कर्तरि|कर्त्तरि|कर्मणि|करणे|अधिकरणे)\\s+(वाच्ये|अभिधेये|कारके)?`).exec(refsT);
        if (!asUp && asK) { c.senseOf = asK[1].replace('त्त', 'त'); meanings.push(c); } });
      // no reference vṛtti calls anything here an upapada, and they name the word with a sense marker (“समभिहारे गम्यमाने”, “मन्त्रे विषये”, “नपुंसके भावे”):
      // it is the sense, not an upapada (an upasarga or particle — निर्, सम्, उत, अपि — stays an upapada)
      const markFor = c => { const st = stem7(c).replace(/्$/, '').replace(/र्त्त/g, 'र्त').split('-').pop(); const T = refsT.replace(/र्त्त/g, 'र्त'); if (st.length < 2) return {};
        const asUp = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,6}\\s+(\\S+\\s+)?(\\S*पपदे|\\S*पपदयोः|\\S*पपदेषु)`).test(T) || new RegExp(`${ESC1(st)}\\S{0,6}पपद`).test(T);
        const all = [...T.matchAll(new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,6}\\s+(\\S+)`, 'g'))].map(m => m[1].replace(/[,।॥]$/, ''));
        const k = all.find(x => /^(कर्तरि|कर्मणि)$/.test(x)); if (k && !asUp) return { senseOf: k, found: true, asUp };
        const m = all.find(x => /^(गम्यमाने|गम्यमानायाम्|अभिधेये|अभिधेययोः|वाच्ये|वाच्यायाम्|विषये|काले)$/.test(x));
        return { found: all.length > 0, asUp, mk: m ? (/^(अभिधेये|अभिधेययोः|वाच्ये|वाच्यायाम्)$/.test(m) ? 'अभिधेये' : m === 'विषये' ? 'विषये' : m === 'काले' ? 'काले' : 'गम्यमाने') : null }; };
      const refsUp = /पपद|सुबन्त/.test(refsT), MARK = /^(गम्यमाने|गम्यमानायाम्|अभिधेये|अभिधेययोः|वाच्ये|वाच्यायाम्|विषये|काले|कर्तरि|कर्त्तरि|कर्मणि|भावे|परतः|सति)$/;
      own7n.filter(c => !meanings.includes(c) && !((c.segs || [c.form]).length === 1 && c.lex && ['upasarga', 'ind', 'suffix', 'pratyahara'].includes(c.lex.kind)) && !/^(उत|अपि|सम्|निर्|अभि|प्र)/.test(c.form)).forEach(c => {
        const mf = markFor(c); if (!mf.found || mf.asUp) return; if (refsUp && !mf.senseOf && !mf.mk) return;   // some reference speaks of an upapada: only a word they mark as the sense moves
        c.senseOf = mf.senseOf || null; if (!c.senseOf) c.meaningMk = mf.mk || 'गम्यमाने';
        meanings.push(c); });
      const upas = own7n.filter(c => !meanings.includes(c));
      const karmK = all7.some(c => c.form === 'कर्मणि' && !c.own);
      all7 = all7.filter(c => !own7n.includes(c) && !(karmK && upas.length && c.form === 'कर्मणि') && !(upas.length && c.form === 'सुपि' && !c.own));   // the sūtra's own upapada replaces the carried सुपि (Kāśikā 3.2.66 “हव्यशब्द उपपदे”)
      if (upas.length) {
        const w = upas[0], many = w.segs.length;
        const list = many > 1 ? listOf(w.segs, 'loc').replace(/ष्षु$|ष्ु$/, 'ष्') : w.form;
        const ph = many > 1 ? [list, many === 2 ? 'इत्येतयोः' : 'इत्येतेषु', ...(karmK ? [many === 2 ? 'कर्मणोः' : 'कर्मसु'] : []), many === 2 ? 'उपपदयोः' : 'उपपदेषु'] : [list, ...(karmK ? ['कर्मणि'] : []), 'उपपदे'];
        // Kāśikā abbreviates long lists: “दिवादिषूपपदेषु”, “शब्दादिषूपपदेषु”
        const adi = x => x.endsWith('्') ? glue(jas(x), 'आदिषु') : /ा$/.test(x) ? x + 'दिषु' : /[िी]$/.test(x) ? x.slice(0, -1) + '्यादिषु' : /[ुू]$/.test(x) ? x.slice(0, -1) + '्वादिषु' : /[ािीुूृेैोौ]$/.test(x) ? x + 'ादिषु' : x + 'ादिषु';
        const phK = many > 5 ? [adi(w.segs[0]), ...(karmK ? ['कर्मसु'] : []), 'उपपदेषु'] : ph;
        condParts.push(...phK); rec._condC = (rec._condC || []).concat(ph);
        const nd = dhatus.length > 1 ? dhatus.length : dhatus.length === 1 && Array.isArray(dhatus[0].l.root) ? dhatus[0].l.root.length : 0;
        if (nd > 1 && nd === many) { ys.push('यथासंख्यम्'); fire('1.3.10', '✔', 2, `${nd} dhātus and ${many} upapadas`, 'paired in order (yathāsaṅkhya)'); st.snap('1.3.10', `${nd} dhātus and ${many} upapadas → paired in order (यथासंख्यम्)`); }
        fire('3.1.92', '✔', 2, `${upas.map(c => c.form).join(', ')}: 7th case in the dhātu section`, 'names the upapada' + (karmK ? ' (as the object, कर्मणि)' : ''));
        st.set(w.form, ph.join(' ').replace(/_/g, ' '), '3.1.92', `${w.form}: a 7th-case word in the dhātu section → the upapada (3.1.92)`);
      } else if (karmK) {
        all7 = all7.filter(c => c.form !== 'कर्मणि');
        condParts.push('कर्मणि', 'उपपदे');
        fire('3.1.92', '✔', 2, 'कर्मणि (carried over): 7th case in the dhātu section', 'names the upapada — a word denoting the object');
        st.set('कर्मणि', 'कर्मणि उपपदे', '3.1.92', 'कर्मणि (carried): a 7th-case word in the dhātu section → the upapada, a word for the object');
      }
      // a 7th-case word carried over in the dhātu section is an upapada too (3.1.137 ← उपसर्गे of 3.1.136)
      if (!upas.length) {
        const car7u = all7.filter(c => !c.own && !c.karaka && !['कर्मणि', 'सुपि'].includes(c.form) && !(c.lex && ['nimitta', 'domain', 'cond', 'option', 'sup', 'meaning', 'suffix', 'pronoun'].includes(c.lex.kind)) && !MEANING7.test(c.form.replace(/(े|ि|ायाम्)$/, '')) && /(े|ि|ौ|सु|षु|याम्)$/.test(c.form) && !/\s/.test(c.form) && !/(कारके|कर्तरि|कर्मणि|भावे)/.test(c.form) && !/^(संज्ञायाम्|छन्दसि|भाषायाम्|अनुपसर्गे|भविष्यति|वर्तमाने|भूते|उपदेशे)$/.test(c.form));
        if (!refsUp) for (const c of car7u.slice()) { if (/^(उपसर्गे|सुपि|अपि|कर्मणि)$/.test(c.form) || (c.lex && ['upasarga'].includes(c.lex.kind))) continue;
          const mk = markFor(c); car7u.splice(car7u.indexOf(c), 1); all7 = all7.filter(x => x !== c);
          tail.push(c.form.replace(/-/g, ' '), ...(mk.senseOf ? [mk.senseOf, 'वाच्ये'] : [mk.mk || 'गम्यमाने'])); }   // no reference names an upapada here: the carried word is the sense
        // the same check for a carried 7th: read as the agent by the references (PV/Kāśikā 3.1.146 “शिल्पिनि कर्तरि”), it is not an upapada
        for (const c of car7u.slice()) { const st = stem7(c).replace(/्$/, ''); if (st.length < 2) continue;
          const asUp = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,6}\\s+(\\S+\\s+)?(उपपदे|उपपदयोः|उपपदेषु)`).test(refsT), asK = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}\\S{0,4}\\s+(कर्तरि|कर्त्तरि|कर्मणि|करणे|अधिकरणे)`).exec(refsT);
          if (!asUp && asK) { car7u.splice(car7u.indexOf(c), 1); all7 = all7.filter(x => x !== c); tail.push(c.form, asK[1].replace('त्त', 'त'), 'वाच्ये'); } }
        if (car7u.length) {
          all7 = all7.filter(c => !car7u.includes(c));
          car7u.forEach(c => { condParts.push(c.form, 'उपपदे'); rec._condC = (rec._condC || []).concat([c.form, 'उपपदे']); st.set(c.form, c.form + ' उपपदे', '3.1.92', `${c.form} (carried over): a 7th-case word in the dhātu section → the upapada (3.1.92)`); });
          fire('3.1.92', '✔', 2, `${car7u.map(c => c.form).join(', ')} (carried over): 7th case in the dhātu section`, 'names the upapada');
        }
      }
      const gtoks = new Set([...condParts, ...tail, ...baseParts].map(x => String(x).replace(/-/g, '')));
      for (const m of meanings) { if ((m.meaningMk || m.senseOf) && gtoks.has(m.form.replace(/-/g, ''))) continue; if (m.senseOf && (an.concat(ad).some(c => c.w === m.senseOf) || words.some(w => w.form === m.senseOf))) { tail.push(m.form.replace(/-/g, ' ')); continue; } if (m.meaningMk && !m.senseOf) { tail.push(m.form, m.meaningMk); st.set(m.form, `${m.form} ${m.meaningMk}`, [], `${m.form}: the sense or circumstance, as the reference vṛttis read it — none of them calls it an upapada`); continue; } if (m.senseOf) { tail.push(m.form, m.senseOf, 'वाच्ये'); st.set(m.form, `${m.form} ${m.senseOf} वाच्ये`, [], `${m.form}: the ${m.senseOf === 'कर्तरि' ? 'agent' : 'kāraka'} the suffix denotes, as the reference vṛttis read it — not an upapada`); continue; } tail.push(m.form, 'गम्यमाने'); st.set(m.form, m.form + ' गम्यमाने', [], `${m.form}: a meaning/circumstance → “when that is meant”`); }
    }
    const ord = c => { const k = c.lex ? c.lex.kind : 'meaning'; return k === 'sup' ? 0 : k === 'cond' ? 1 : k === 'domain' ? 3 : 2; };
    all7 = all7.map(c => Object.assign(c, { lex: LEX[c.form] || c.lex })).sort((a, b) => ord(a) - ord(b));
    const nims = all7.filter(c => c.lex && c.lex.kind === 'nimitta');
    let nimLists = 0;
    if (nims.length) {
      const means = all7.filter(c => !c.lex || c.lex.kind === 'meaning');
      for (const m of means) { prefix.push(m.form); prefixC.push(m.form); }
      for (const n of nims) {
        prefix.push(n.form.replace(/-/g, '')); prefixC.push(n.form.replace(/-/g, ''));
        st.set(n.form, n.form.replace(/-/g, '') + (n.lex.sfx && !n.lex.self ? ' प्रत्यये परे' : ' परे'), '1.1.66', `${n.form}: 7th case → it names what FOLLOWS; the suffix goes on what comes before it`);
        if (n.lex.lists) nimLists = n.lex.lists;
        fire('1.1.66', '✔', 2, `${n.form}: 7th case${n.own ? '' : ' (carried over)'}`, 'names what FOLLOWS — the suffix goes on what precedes it');
      }
      prefix.push('परतः'); prefixC.push(...(nims.some(n => n.lex.sfx && !n.lex.self) ? ['प्रत्यये', 'परे'] : ['परे']));
      all7 = all7.filter(c => !nims.includes(c) && !means.includes(c));
    }
    // a section's governing condition is stated at the section head in the Kāśikā, not in every sūtra:
    // keep it in the class style (everything spelled out), leave it out of the Kāśikā/Kaumudī style
    const ADW = new Set(ad.map(c => c.w)), condAdC = [];
    const SECT = c => !inRange && !c.own && ADW.has(c.form) && (/^(भावे|अकर्तरि च कारके संज्ञायाम्|वर्तमाने|भूते|भविष्यति|संहितायाम्|पदस्य)$/.test(c.form) || (c.form === 'स्त्रियाम्' && idn >= 33094 && idn <= 33112));
    for (const c of all7.filter(SECT)) { condAdC.push(c.form); st.snap([], `${c.form}: the section’s governing condition (carried over) — the Kāśikā states it at the head of the section; kept in the class style`); }
    all7 = all7.filter(c => !SECT(c));
    rec._condAdC = condAdC;
    for (const c of all7) {
      const k = c.lex ? c.lex.kind : 'meaning';
      if (k === 'sup') {
        condParts.push('सुबन्ते', 'उपपदे');
        st.set(c.form, 'सुबन्ते उपपदे', ['3.1.92', 'PIS 23'], `${c.form}: a 7th-case word in the dhātu section → an upapada (3.1.92); सुप् names suffixes → “a word ending in a सुप्” (PIS 23)`);
        fire('3.1.92', '✔', 2, `${c.form}: a 7th-case word in the dhātu section${c.own ? '' : ' (carried over)'}`, 'it names the upapada');
        fire('PIS 23', '✔', 2, 'सुप् is a suffix group', 'सुबन्त (the word ending in a sup suffix)');
        fire('kṛtrima (Tattvabodhinī on 3.2.4)', '?', 2, 'सुप् = the pratyāhāra or the 7th plural?', 'the technical term is taken — not named by a commentator at this sūtra');
      } else if (k === 'cond') condParts.push(c.form);
      else if (k === 'domain') { condParts.push(c.form, 'विषये'); st.set(c.form, c.form + ' विषये', [], `${c.form}: the domain`); }
      else if (c.segs.length > 1) { condParts.push(listOf(c.segs, 'loc'), 'इत्येतेषु', 'अर्थेषु'); st.set(c.form, listOf(c.segs, 'loc').replace(/_/g, ' ') + ' इत्येतेषु अर्थेषु', [], `${c.form}: a list of meanings`); }
      else condParts.push(c.form);
    }
    if (option) { fire('1.1.44', '✔', 2, 'विभाषा / अन्यतरस्याम्', 'the rule applies optionally'); st.snap('1.1.44', 'विभाषा → the rule applies optionally'); }
    // suffix
    let suf = ownSuffix.flatMap(w => w.lex.map(l => l.stem));
    let sufPhrase;
    if (suf.length === 2 && ownSuffix.length === 1) sufPhrase = [ownSuffix[0].form.replace(/-/g, ''), 'प्रत्ययौ', 'भवतः'];
    else if (suf.length > 1) sufPhrase = [suf.join('_') + '_', 'इत्येते', 'प्रत्ययाः', 'भवन्ति'];
    else if (suf.length === 1) sufPhrase = [suf[0], 'प्रत्ययः', 'भवति'];
    else if (carriedSuffix.length) { suf = [carriedSuffix[carriedSuffix.length - 1]];
      const hasH = h => ad.some(c => c.w === h);
      const yv = TADDHITA && (hasH('प्राक्क्रीताच्छः') || hasH('प्राग्दीव्यतोऽण्') || (hasH('प्राग्वतेष्ठञ्') && hasH('आर्हादगोपुच्छसंख्यापरिमाणाट्ठक्'))) && ad.some(c => DEFSUF[c.w] === suf[0]) && !an.some(c => suffixOf(c.w) === suf[0]);
      const nParts = suf[0].split('-').length;   // a carried compound of suffixes (क्त्वा-णमुलौ) agrees in number
      sufPhrase = yv ? ['यथाविहितम्', 'प्रत्ययः', 'भवति'] : nParts === 2 ? [suf[0].replace(/-/g, ''), 'प्रत्ययौ', 'भवतः'] : nParts > 2 ? [suf[0].replace(/-/g, '_') + '_', 'इत्येते', 'प्रत्ययाः', 'भवन्ति'] : [suf[0], 'प्रत्ययः', 'भवति'];
      if (yv) { rec._defsuf = suf[0]; st.snap([], `no suffix named; the section heading gives ${suf[0]} as the default — the Kāśikā writes “यथाविहितम्” (as prescribed in this section)`); } }
    else sufPhrase = ['?', 'प्रत्ययः', 'भवति'];
    rec.suffixes = suf;
    const extra = [];
    if (ca && ownSuffix.length && carriedSuffix.length) extra.push(['चकारात्', carriedSuffix[carriedSuffix.length - 1], 'च']);
    else if (ca && !ownSuffix.length && !usesDhatoh && !words.some(w => w.lex.some(l => l && l.kind === 'adesha'))) { baseParts.push('च'); }
    const ad1 = words.find(w => w.lex.some(l => l && l.kind === 'adesha'));
    if (ad1) {
      const ast = ad1.lex.find(l => l.kind === 'adesha').stem, nm = (ast.endsWith('्') ? ast.slice(0, -1) : ast) + 'कारः';
      extra.push([nm, ca ? 'च' : '', 'अन्तादेशः']);
      st.set(ad1.form, nm + ' अन्तादेशः', ['1.1.49', '1.1.52'], `${ad1.form}: a one-sound replacement of the dhātu (6th) → it replaces the LAST sound`);
      const sth = words.find(w => w.lex.some(l => l && l.kind === 'dhatu')) || words.find(w => w.wcase === 6 || w.wcase === 5);
      if (sth) fire('1.1.49', sth.wcase === 6 ? '✔' : '?', 2, `${sth.form}: ${sth.wcase === 6 ? '6th case' : '5th case, read as 6th for the replacement'}`, 'names the thing replaced');
      fire('1.1.52', '✔', 2, `${ad1.form}: a single-sound replacement`, 'replaces the LAST sound of the dhātu');
    }
    if (ca && ownSuffix.length && carriedSuffix.length) st.snap([], `च → the carried ${carriedSuffix[carriedSuffix.length - 1]} applies too (“चकारात्”)`);
    if (!inRange && (words.some(w => w.form === 'न' && w.wcase === 0) || an.some(c => c.w === 'न'))) {
      const vi = sufPhrase.findIndex(x => /^भव/.test(x)); if (vi >= 0) sufPhrase.splice(vi, 0, 'न');
      fire('1.1.44', '?', 2, 'न', 'the rule is negated: the suffix does NOT come'); st.snap([], 'न → the suffix does not come here (a negation of the preceding rule)');
    }
    if (nimLists && nimLists === suf.length) { ys.push('यथासंख्यम्'); st.snap('1.3.10', `${suf.length} suffixes, ${nimLists} following items → paired in order (यथासंख्यम्)`); fire('1.3.10', '✔', 2, `${suf.length} suffixes and ${nimLists} following items`, 'paired in order (yathāsaṅkhya)'); }
    for (let i = baseParts.length - 1; i > 0; i--) if (/न्तात्$/.test(baseParts[i]) && baseParts.indexOf(baseParts[i]) < i) baseParts.splice(i, 1);   // a carried suffix that is also named in the sūtra
    const core = [...prefix, ...baseParts, ...condParts, ...tail, option, ...ys, ...sufPhrase, ...post];
    rec.gen = join(core) + (extra.length ? ', ' + extra.map(e => join(e)).join(', ') : '');
    const verbK = sufPhrase.includes('भवन्ति') ? 'स्युः' : sufPhrase.includes('भवतः') ? 'स्तः' : 'स्यात्';
    const tKv = [...prefix.map(x => x === 'परतः' ? 'परे' : x), ...baseParts, ...condParts, ...tail, option, ...ys, sufPhrase[0], verbK, ...post];
    rec.genK = joinFull(tKv) + (extra.length ? ', ' + extra.map(e => join(e)).join(', ') : '');
    if (!extra.length) { rec._tG = core.flatMap(x => String(x || '').split(' ')).filter(Boolean); rec._tK = tKv.flatMap(x => String(x || '').split(' ')).filter(Boolean); }
    const sufC = sufPhrase.map(x => x === 'यथाविहितम्' ? rec._defsuf : x).flatMap(x => x === 'प्रत्ययः' ? ['प्रत्ययः', 'परः', 'च'] : x === 'प्रत्ययाः' ? ['प्रत्ययाः', 'पराः', 'च'] : x === 'प्रत्ययौ' ? ['प्रत्ययौ', 'परौ', 'च'] : [x]);
    rec.genC = plain([...prefixC, ...baseParts, ...condParts, ...(rec._condAdC || []), ...tail, option, ...ys, ...sufC, ...post]) + (extra.length ? ', ' + extra.map(e => plain(e)).join(', ') : '');
    // base description for 3.1.94
    rec.base = { sounds: sounds.map(x => x.l.stem), upadha: upadha.map(x => x.l.stem), dhatus: dhatus.flatMap(d => [].concat(d.l.root)), all: !sounds.length && !upadha.length && !dhatus.length, conds: all7.map(c => c.form), option: !!option };
  } else if (rec.kind === 'nipātana') {
    const forms = firstCaseOther[0], rest = firstCaseOther.slice(1);
    const meanings = words.filter(w => w.work === 7 && w.lex.every(l => !l || !['domain', 'option'].includes(l.kind)));
    const domain = words.filter(w => w.work === 7 && w.lex.some(l => l && l.kind === 'domain'));
    const LAK7 = /^(लिटि|लुङि|लङि|लिङि|लोटि|लृटि|लुटि|लेटि|लृङि|सनि|यङि|णौ|लुङ्|सन्|लिट्|लिङ्|सनोः|लुङ्-सनोः)$/;
    const SFX7N = m => (!!NIMK(m.form) && !NIMK(m.form).guessed) || LAK7.test(m.form) || m.segs.every(g => LAK7.test(g));
    const has0 = w => an.concat(ad).some(c => c.w === w);
    const many = forms.segs.length > 1, two = forms.segs.length === 2;
    const out = [many ? listOf(forms.segs, 'nom') : forms.form, 'इति'];
    if (many) out.splice(1, 1, two ? 'इत्येतौ' : 'इत्येते', two ? 'शब्दौ' : 'शब्दाः');
    // the forms named end in the carried suffix: “क्यप्प्रत्ययान्तौ शब्दौ निपात्येते” (prathamāvṛtti) — PIS 23
    // class style (prathamāvṛtti): “क्यप्प्रत्ययान्तौ निपात्येते” — PIS 23; Kāśikā style keeps the Kāśikā's locative “क्यपि निपात्यन्ते”
    let locK = null;
    if (carriedSuffix.length) { const sf = carriedSuffix[carriedSuffix.length - 1]; locK = sf.replace(/्$/, '') + 'ि'; rec.carriedLoc = sf + 'प्रत्ययान्त' + (two ? 'ौ' : many ? 'ाः' : 'ः'); out.push(rec.carriedLoc); fire('PIS 23', '✔', 2, `${sf} (carried over): the suffix the forms are made with`, `${rec.carriedLoc} — forms ENDING in it`); }
    out.push(two ? 'निपात्येते' : many ? 'निपात्यन्ते' : 'निपात्यते');
    if (domain.length) out.splice(0, 0, domain[0].form, 'विषये');
    for (const m of meanings) {
      if (many && m.segs.length === forms.segs.length && m.segs.length > 1) {
        out.push('यथासंख्यम्', listOf(m.segs, 'loc'), 'इत्येतेषु', 'अर्थेषु');
        fire('1.3.10', '✔', 2, `${forms.segs.length} forms and ${m.segs.length} meanings`, 'paired in order (yathāsaṅkhya)');
      } else if (SFX7N(m)) { out.push(m.form.replace(/-/g, ''), 'परतः'); fire('1.1.66', '✔', 2, `${m.form}: a suffix in the 7th`, 'names what FOLLOWS'); }   // लिटि, लुङ्सनोः: a suffix that follows, not a meaning
      else out.push(m.form.replace(/-/g, ''), 'अभिधेये');
    }
    if (out.some(x => x === 'परतः') && has0('आर्धधातुके') && !out.includes('आर्धधातुके')) out.splice(out.lastIndexOf('परतः'), 0, 'आर्धधातुके');
    const optW = words.find(w => w.lex.some(l => l && l.kind === 'option'));
    if (optW) { out.push(optW.form); fire('1.1.44', '✔', 2, optW.form, 'the nipātana is optional'); }
    for (const r of rest) out.push(r.form, 'चेत्');
    const outK = locK ? out.map(x => x === rec.carriedLoc ? locK : x) : out;
    rec.gen = join(outK); rec.genK = joinFull(outK); rec.genC = plain(out); rec._tG = rec._tK = outK;
    st.snap(rec.P.some(p => p.pid === '1.3.10') ? '1.3.10' : [], 'a ready-made form (nipātana): the forms are “stated as they are”' + (rec.P.some(p => p.pid === '1.3.10') ? ', paired in order with the meanings' : ''));
  }
  } catch (e) { if (inRange || process.env.VG_DEBUG === id) throw e; rec.gen = rec.genK = rec.genC = null; rec.error = 'generation failed: ' + String(e.message).slice(0, 120); }
  // the definitional saṃjñās of the pilot range (1.1.60 ff., 1.3.2–8, 3.1.93/95) had no vṛtti: run them through the saṃjñā template
  if (!rec.genC && rec.kind === 'saṃjñā') rec._sjAuto = true;
  if (!inRange || (!rec.genC && (rec.kind === 'adhikāra' || rec._sjAuto))) { try { buildExtra(rec, words, an, ad, fire, notes, typ, BN); } catch (e) { rec.gen = rec.genK = rec.genC = null; rec.error = 'generation failed: ' + String(e.message).slice(0, 120); } }
  // tidy the class-style text: a word repeated right after itself (वर्तमाने वर्त्तमाने), an accent said twice (आद्युदात्तः … आदिः उदात्तः)
  if (rec.genC) {
    const nz = t => t.replace(/र्त्त/g, 'र्त').replace(/त्त्व/g, 'त्व');
    const toks = rec.genC.split(' '), out = [];
    for (const t of toks) { if (out.length && nz(out[out.length - 1]) === nz(t) && !/^(च|न)$/.test(t)) continue; out.push(t); }
    let g = out.join(' ');
    if (/आद्युदात्त/.test(g)) g = g.replace(/\s*आदिः उदात्तः/, '').replace(/(आद्युदात्त\S*)\s+आदिः(?=\s)/, '$1');
    if (/अन्तोदात्त/.test(g)) g = g.replace(/\s*अन्तः उदात्तः/, '').replace(/(अन्तोदात्त\S*)\s+अन्तः(?=\s)/, '$1');
    rec.genC = g;
  }
  // the gloss says “X-अन्त” of a suffix (सुबन्त, द्वितीयान्त, क्तप्रत्ययान्त): pratyayagrahaṇe tadantagrahaṇam (PIS 23)
  if (rec.genC && /(सुबन्त|तिङन्त|प्रथमान्त|द्वितीयान्त|तृतीयान्त|चतुर्थ्यन्त|पञ्चम्यन्त|षष्ठ्यन्त|सप्तम्यन्त|प्रत्ययान्त)/.test(rec.genC) && !P.some(p => p.pid === 'PIS 23')) {
    const m = rec.genC.match(/\S*(सुबन्त|तिङन्त|प्रथमान्त|द्वितीयान्त|तृतीयान्त|चतुर्थ्यन्त|पञ्चम्यन्त|षष्ठ्यन्त|सप्तम्यन्त|प्रत्ययान्त)\S*/)[0];
    fire('PIS 23', '✔', 2, `${m}: a suffix (or case ending) named`, 'what ENDS in it, together with what it was added to (प्रत्ययग्रहणे … तदन्तस्य ग्रहणम्)');
    if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['PIS 23'], what: `${m}: a suffix named stands for what ends in it (PIS 23)`, now: rec.steps[rec.steps.length - 1].now });
  }
  // bahuvrīhi samāsāntas (5.4.113–5.4.159, बहुव्रीहौ carried): the word the sūtra names is the compound's LAST member —
  // “जायाशब्दान्तस्य बहुव्रीहेः”, “ककुदशब्दान्तस्य बहुव्रीहेः” (PV/Kāśikā; 1.1.72)
  if (!rec.error && +rec.id >= 54113 && +rec.id <= 54159 && an.concat(ad).some(c => c.w === 'बहुव्रीहौ') && rec._tG && rec.genC) {
    const w6 = words.find(w => w.wcase === 6 && w.segs.length === 1 && (w.lex[0] || {}).kind === 'word' && /(ायाः|स्य)$/.test(w.form));
    if (w6 && !/बहुव्रीहेः|उत्तरस्य/.test(rec.genC)) {
      const stem = w6.form.replace(/ायाः$/, 'ा').replace(/स्य$/, ''), t = [stem + 'शब्दान्तस्य', 'बहुव्रीहेः'];
      const alt = [w6.form, stem + 'शब्दस्य'], rep = a => { const i = a.findIndex(x => alt.includes(x)); if (i >= 0) a.splice(i, 1, ...t); return a; };
      rec._tG = rep(rec._tG.slice()); rec._tK = rep((rec._tK || []).slice()); rec.gen = join(rec._tG); rec.genK = joinFull(rec._tK);
      rec.genC = rec.genC.split(' ').flatMap(x => alt.includes(x) ? t : [x]).join(' ');
      fire('1.1.72', '✔', 2, `${w6.form}: the last member of the bahuvrīhi (बहुव्रीहौ carried over)`, `${t.join(' ')} — a bahuvrīhi ENDING in it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.72'], what: `${w6.form} names the last member of the bahuvrīhi (बहुव्रीहौ carried over) → “a bahuvrīhi ending in it” (tadanta)`, now: rec.genC });
    }
  }
  // the bha section names stem endings in the 6th (वाहः, अनः): “वाह् इत्येवमन्तस्य भस्य अङ्गस्य” (PV/Kāśikā 6.4.132, 6.4.134; 1.1.72)
  if (!rec.error && +rec.id >= 64129 && +rec.id <= 64175 && an.concat(ad).some(c => c.w === 'भस्य') && rec._tG && rec.genC) {
    const ENDS = { 'वाहः': 'वाह्', 'अनः': 'अन्' }; const w6 = words.find(w => w.wcase === 6 && ENDS[w.form]);
    if (w6 && !/इत्येवमन्त/.test(rec.genC)) {
      const t = [ENDS[w6.form] + '_', 'इत्येवमन्तस्य'], rep = a => { const i = a.indexOf(w6.form); if (i >= 0) a.splice(i, 1, ...t); if (!a.includes('भस्य')) { const j = a.indexOf('अङ्गस्य'); if (j >= 0) a.splice(j, 0, 'भस्य'); } return a; };
      rec._tG = rep(rec._tG.slice()); rec._tK = rep((rec._tK || []).slice()); rec.gen = join(rec._tG); rec.genK = joinFull(rec._tK);
      rec.genC = plain(rep(rec.genC.split(' ')));
      fire('1.1.72', '✔', 2, `${w6.form}: a stem ending named in the 6th (भस्य carried over)`, `${ENDS[w6.form]} इत्येवमन्तस्य भस्य — a bha ENDING in it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.72'], what: `${w6.form} describes the bha aṅga → “ending in ${ENDS[w6.form]}” (tadanta)`, now: rec.genC });
    }
  }
  // word order as the vṛttis have it: “प्रातिपदिकात् तिङन्तात् च”
  if (rec.genC && /तिङन्तात् प्रातिपदिकात् च/.test(rec.genC)) { rec.genC = rec.genC.replace('तिङन्तात् प्रातिपदिकात् च', 'प्रातिपदिकात् तिङन्तात् च'); if (rec.gen) rec.gen = rec.gen.replace(/तिङन्तात्प्रातिपदिकाच्च|तिङन्तात् प्रातिपदिकाच्च/, 'प्रातिपदिकात् तिङन्ताच्च'); }
  // the sūtra's own नित्यम् (“always”) must not be lost
  if (rec.genC && words.some(w => w.form === 'नित्यम्') && !/नित्यम्/.test(rec.genC)) { const toks = rec.genC.split(' '); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः)$/.test(toks[i])) i--; if (i > 0) { toks.splice(i, 0, 'नित्यम्'); rec.genC = toks.join(' '); } }
  // two lists of the same length in different cases pair up in order: 1.3.10 यथासङ्ख्यमनुदेशः समानाम्
  {
    // a pratyāhāra counts as its members (एचः = ए ओ ऐ औ → 4: एचोऽयवायावः pairs with अय्-अव्-आय्-आवः)
    const prN = w => { const L0 = LEX[w.form] || w.lex[0] || {}; return w.segs.length === 1 && L0.kind === 'pratyahara' && PLIST[L0.stem] ? PLIST[L0.stem] : 0; };
    // named groups of endings have a known size: the prathama puruṣa = 3 (तिप् तस् झि), the parasmaipada endings = 9 (PV 2.4.85, 3.4.82 “यथासङ्ख्यम्”)
    const GROUPN = { 'प्रथमस्य': 3, 'मध्यमस्य': 3, 'उत्तमस्य': 3, 'परस्मैपदानाम्': 9, 'आत्मनेपदानाम्': 9 };
    const cnt = w => GROUPN[w.form] || (w.segs.length > 1 ? w.segs.length : prN(w) > 1 ? prN(w) : (w.num === 2 && w.wcase) ? 2 : 1);
    // carried lists pair too (युष्मदस्मदोः ← 7.2.86 with यूयवयौ; णलतुसुस्… with लटः)
    const carL = an.filter(c => !SILENT[c.w] && (/-/.test(c.w) || /^(युष्मदस्मदोः)$/.test(c.w)) && !/\s/.test(c.w) && (autoOf(sid(c.from), c.w) || {}).cs).map(c => ({ form: c.w, segs: /-/.test(c.w) ? c.w.split('-') : ['युष्मद्', 'अस्मदोः'], wcase: (autoOf(sid(c.from), c.w) || {}).cs, num: 0, lex: [], carried: true }));
    carL.push(...an.filter(c => GROUPN[c.w] && !words.some(w => w.form === c.w)).map(c => ({ form: c.w, segs: [c.w], wcase: 6, num: 3, lex: [], carried: true })));
    const L = [...words, ...carL].filter(w => w.wcase && cnt(w) >= 2 && !w.lex.some(l => l && l.kind === 'pos'));   // उद्-उपधात् is one description, not a list
    // a carried list pairs only as a 6th-case place with the sūtra's own 1st-case replacements; a pratyāhāra only with an own list
    const okPair = (a, b) => { if (a.carried && b.carried) return false; const c = a.carried ? a : b.carried ? b : null, o = c === a ? b : a; if (c && !(c.wcase === 6 && o.wcase === 1)) return false; if ((prN(a) > 1 && a.segs.length === 1 && b.segs.length < 2) || (prN(b) > 1 && b.segs.length === 1 && a.segs.length < 2)) return false; return true; };
    const pair = L.find((a, i) => L.some((b, j) => j > i && cnt(a) === cnt(b) && a.wcase !== b.wcase && okPair(a, b)));
    if (pair && rec.genC && !P.some(p => p.pid === '1.3.10')) {
      const b = L.find(x => x !== pair && cnt(x) === cnt(pair) && x.wcase !== pair.wcase && okPair(pair, x));
      fire('1.3.10', '✔', 2, `${pair.form} and ${b.form}: ${cnt(pair)} members each`, 'they pair up in order (यथासङ्ख्यम्)');
      if (!/यथासङ्ख्यम्/.test(rec.genC)) { const toks = rec.genC.split(' '); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः|स्यात्|निपात्यते|निपात्यन्ते|शिष्यते|शिष्येते|शिष्यन्ते)$/.test(toks[i])) i--; if (i > 0 && toks[i - 1] === 'न') i--; if (i > 0 && toks[i - 1] === 'विकल्पेन') i--; if (i > 0) { toks.splice(i, 0, 'यथासङ्ख्यम्'); rec.genC = toks.join(' '); } }
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.3.10'], what: `${pair.form} and ${b.form} have ${cnt(pair)} members each → they pair up in order (1.3.10, “यथासङ्ख्यम्”)`, now: rec.steps[rec.steps.length - 1].now });
    }
  }
  // “त्रीणि त्रीणि … प्रथममध्यमोत्तमाः / एकवचनद्विवचनबहुवचनानि”: each triad pairs with the three names in order (PV 1.4.101–103 “यथाक्रमम्”);
  // ऊकालः (उ ऊ उ३) with ह्रस्वदीर्घप्लुतः (PV 1.2.27 “यथासङ्ख्यम्”) — 1.3.10
  if (rec.genC && !P.some(p => p.pid === '1.3.10')) {
    const all = words.map(w => w.form).concat(an.map(c => c.w)).join(' ');
    const tri = /त्रीणि/.test(all) && /प्रथम-?मध्यम-?उत्तम|एकवचन-?द्विवचन-?बहुवचन/.test(all), uk = /ऊ-?कालः/.test(all) && /ह्रस्व-?दीर्घ-?प्लुत/.test(all);
    if ((tri || uk) && /संज्ञ/.test(rec.genC)) { fire('1.3.10', '✔', 2, tri ? 'त्रीणि त्रीणि and three names' : 'ऊकालः (उ ऊ उ३) and three names', 'they pair up in order (यथासङ्ख्यम्)');
      const toks = rec.genC.split(' '); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः)$/.test(toks[i])) i--; if (i > 0) { toks.splice(i, 0, 'यथासङ्ख्यम्'); rec.genC = toks.join(' '); }
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.3.10'], what: `${tri ? 'each triad' : 'the three lengths उ ऊ उ३'} and the three names pair up in order (1.3.10, “यथासङ्ख्यम्”)`, now: rec.genC }); }
  }
  // ल in the saṃjñā rules 1.4.99–100 means the substitutes that stand in its place (the नैलेश-वृत्तिः: “लकारस्य स्थाने विहितानाम् आदेशानाम्”,
  // the Kāśikā/PV “लादेशाः”): षष्ठी स्थानेयोगा — 1.1.49
  { const LSUB = { '14099': ['लः', 'लस्य स्थाने विहितानाम् आदेशानाम्'], '14100': ['तङानौ', 'लस्य स्थाने विहितौ तङानौ'] }[id];
    if (LSUB && rec.genC && !HAND[rec.n]) { const tc = rec.genC.split(' '), j = tc.indexOf(LSUB[0]); if (j >= 0) { tc[j] = LSUB[1]; rec.genC = tc.join(' ');
      fire('1.1.49', '✔', 2, `${id === '14099' ? 'लः' : 'लस्य (carried over)'}: the 6th of ल`, 'what stands in the place of ल — its substitutes (षष्ठी स्थानेयोगा), as the नैलेश-वृत्तिः reads it');
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.49'], what: `ल in the 6th → “लस्य स्थाने” (1.1.49): the name goes to the substitutes of ल, as the नैलेश-वृत्तिः (and the Kāśikā’s “लादेशाः”) read it`, now: rec.genC }); } } }
  // the aṅga adhikāra (6.4.1–7.4.97) where the gloss left out “अङ्गस्य” and a reference has it (PV/Kāśikā 7.3.106 “आबन्तस्याङ्गस्य”) — 1.4.13
  if (rec.genC && !HAND[rec.n] && (idn >= 64001 && idn <= 74097 && /^(ādeśa|operation|āgama)$/.test(rec.kind) || idn >= 41001 && idn <= 54160 && rec.kind === 'āgama') && !/(^|\s)(अङ्गस्य|अङ्गात्)(\s|$)/.test(rec.genC)) {
    const AR = /(?<!न्तर|अन्तर)(अ|ा|[क-ह])ङ्गस्य(?![ऀ-ॿ])/, refs = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]].filter(([, t]) => AR.test(t || ''));
    const tc = rec.genC.split(' '), jb = tc.indexOf('भस्य'), ja = rec.kind === 'āgama' && idn < 61001 ? tc.indexOf('आगमः') - 1 : -1, j = ja > 0 ? ja : jb >= 0 ? jb + 1 : tc.findIndex(t => /^(टेः|अन्त्यस्य|स्थाने|लोपः|अत्-लोपः|आदेः|उपधायाः)$/.test(t));
    if (refs.length && j >= 0) { tc.splice(j, 0, 'अङ्गस्य'); rec.genC = tc.join(' '); const by = refs.map(([l]) => l).join(', ');
      fire('1.4.13', '✔', 2, 'the aṅga adhikāra (6.4.1)', `the operation is on the aṅga — the ${by} say${refs.length > 1 ? '' : 's'} अङ्गस्य`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.4.13'], what: `अङ्गस्य (adhikāra 6.4.1): the base before the suffix is the aṅga (1.4.13), as the ${by} read${refs.length > 1 ? '' : 's'} it`, now: rec.genC }); }
  }
  // a sound or sound group in the 7th that a reference reads “X-आदौ” (PV/Kāśikā 8.2.21 “अजादौ”, 7.4.53 “यकारादौ”): what BEGINS with it — PIS 33
  if (rec.genC && !HAND[rec.n] && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(rec.kind) && !P.some(p => p.pid === 'PIS 33' && p.status === '✔' && p.layer !== 1)) {
    const refsA = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    const cand = [...words.filter(w => w.wcase === 7 && w.segs.length === 1).map(w => ({ f: w.form, L: w.lex[0] || LEX[w.form] })), ...an.filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 7 && !/-/.test(c.w)).map(c => ({ f: c.w, L: LEX[c.w], car: true })),
      // a sound group in the 1st that names a suffix beginning with it (झल् विभक्तिः → “झलादिः”, PV/Kāśikā 6.1.183)
      ...words.filter(w => w.wcase === 1 && w.segs.length === 1 && (PRATYAHARA.has(w.form) || PRATYAHARA.has(w.form.replace(/्$/, '')))).map(w => ({ f: w.form, L: { kind: 'pratyahara', stem: w.form }, c1: true })),
      ...an.filter(c => !SILENT[c.w] && (PRATYAHARA.has(c.w) || PRATYAHARA.has(c.w.replace(/्$/, ''))) && (autoOf(sid(c.from), c.w) || {}).cs === 1).map(c => ({ f: c.w, L: { kind: 'pratyahara', stem: c.w }, car: true, c1: true }))];
    for (const x of cand) { if (x.L && x.L.kind === 'nimitta' && /[क-ह]ि$/.test(x.f)) { const s0 = x.f.replace(/ि$/, '्'); if (/^[क-ह]्$/.test(s0)) x.L = { kind: 'varna', stem: s0 }; else if (PRATYAHARA.has(s0) || PRATYAHARA.has(s0.replace(/्$/, ''))) x.L = { kind: 'pratyahara', stem: s0 }; }
      if (!x.L || !['varna', 'pratyahara'].includes(x.L.kind) || !x.L.stem) continue;
      const st = x.L.stem, VD = { 'च्': 'ज्', 'ट्': 'ड्', 'त्': 'द्', 'प्': 'ब्', 'क्': 'ग्' };
      const forms = /^[क-ह]्$/.test(st) && !x.c1 ? [SNAME(st)] : [...new Set([st.replace(/[चटतपक]्$/, c => VD[c]).replace(/्$/, ''), SNAME(st)])].filter(f => f.length > 1);
      let hit = null, fm = null; for (const f of forms) { const re = x.c1 ? new RegExp(`(?<![ऀ-ॿ])${ESC1(f)}(ादिः|ादिर्|ादि(?![ऀ-ॿ]))`) : new RegExp(`(?<![ऀ-ॿ])${ESC1(f)}(ादौ|ादाव|ादि(?![ऀ-ॿ])|ादिर|ादिप्रत्यय|ादिषु|ादिके)`); const h = refsA.filter(([, t]) => re.test(t || '')); if (h.length) { hit = h; fm = f; break; } }
      if (!hit) continue;
      const tc = rec.genC.split(' '), j = tc.indexOf(x.f); if (j < 0 || /ादौ$/.test(tc[j])) continue;
      tc[j] = fm + (x.c1 ? 'ादिः' : 'ादौ'); rec.genC = tc.join(' '); const by = hit.map(([l]) => l).join(', ');
      fire('PIS 33', '✔', 2, `${x.f}${x.car ? ' (carried over)' : ''}: ${x.L.kind === 'pratyahara' ? 'a sound group' : 'a sound'} in the 7th`, `→ ${fm}${x.c1 ? 'ादिः' : 'ादौ'} (what BEGINS with it), as the ${by} read${hit.length > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['PIS 33'], what: `${x.f}: a sound in the 7th stands for what begins with it (PIS 33) → “${fm}${x.c1 ? 'ादिः' : 'ादौ'}”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // बहुलम् / नित्यम् (own or carried) that the gloss left out once it no longer stands in the substitute's slot: before the verb
  if (rec.genC && !HAND[rec.n] && rec.kind === 'ādeśa') for (const m of ['बहुलम्', 'नित्यम्']) {
    if (!(words.some(w => w.form === m) || an.some(c => c.w === m && !(rec.superseded || []).some(x => x.w === m))) || rec.genC.split(' ').includes(m)) continue;
    const toks = rec.genC.split(' '); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः),?$/.test(toks[i])) i--; if (i > 0 && toks[i - 1] === 'न') i--; if (i > 0 && /^(विकल्पेन)$/.test(toks[i - 1])) i--;
    if (i > 0) { toks.splice(i, 0, m); rec.genC = toks.join(' '); }
  }
  if (rec.genC && / न नित्यम् भवति/.test(rec.genC)) rec.genC = rec.genC.replace(' न नित्यम् भवति', ' नित्यम् न भवति');
  // the taddhita template's non-meaning words (लुक्, तुट्, अकङ् …): after the suffix — “…, तस्य लुक् भवति”, “…, तुट् आगमः च भवति”
  if (rec.genC && rec._tdExtra && rec._tdExtra.length && !HAND[rec.n]) { rec.genC = rec.genC.replace(/,?\s*$/, '') + ', ' + rec._tdExtra.join(', '); if (rec.steps && rec.steps.length) rec.steps.push({ pids: [], what: `${rec._tdExtra.join('; ')} — not a meaning of the suffix: said after it`, now: rec.genC }); }
  // a quoted word of the sūtra (case 0) that is the PLACE, not the substitute (8.3.11 स्वतवान्, 8.3.10 नॄन्, 8.2.68 अहन्): “X इत्येतस्य … स्थाने”
  if (rec.genC && !HAND[rec.n] && rec.kind === 'ādeśa') {
    const gw = rec.genC.split(' ');
    for (const w of words.filter(w => w.wcase === 0 && w.segs.length === 1 && w.form.length > 2 && !w.lex.some(l => l && ['option', 'ca', 'neg', 'acharya'].includes(l.kind)) && !gw.includes(w.form) && (/न्$/.test(w.form) && +id >= 82001))) {
      const toks = rec.genC.split(' '), k = toks.indexOf('स्थाने'); if (k < 0) continue; let j = k; while (j > 0 && /स्य$/.test(toks[j - 1])) j--;
      toks.splice(j, 0, w.form, 'इत्येतस्य'); rec.genC = toks.join(' ');
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: [], what: `${w.form}: the quoted word is the place → “${w.form} इत्येतस्य”`, now: rec.genC }); }
  }
  // a suffix rule whose suffix is carried in (3.1.134 ल्यु-णिनि-अचः, 3.4.75 उणादयः, 3.1.35 आम्): fill the “?” with it
  if (rec.genC && rec.kind === 'vidhi' && / \? प्रत्यय/.test(rec.genC) && !HAND[rec.n] && idn >= 31001 && idn <= 34117) {
    const o1 = words.filter(w => w.wcase === 1 && !w.lex.some(l => l && ['option', 'ca', 'neg', 'dhatu'].includes(l.kind)) && !/^(विभाषा|बहुलम्|नित्यम्)$|वत्$/.test(w.form)).map(w => w.form);
    const cand = rec._sfxCand || (o1.length === 1 ? o1[0] : null);
    if (cand) { let toks = rec.genC.split(' '); const cf = cand.replace(/-/g, ''), i = toks.findIndex(t => t === cand || t === cf); if (i >= 0 && !/^इत्येत/.test(toks[i + 1] || '')) toks.splice(i, 1);
      if (!toks.join(' ').replace(/-/g, '').includes(cf.replace(/ः$/, ''))) rec.genC = toks.join(' ').replace(' ? प्रत्यय', ' ' + cand.replace(/-/g, ' ') + ' प्रत्यय'); }
  }
  // a nimitta (7th) the references read “X परतः” that a recent sūtra had but the anuvṛtti data leaves out (7.4.12 लिटि ← 7.4.9) — 1.1.66
  if (rec.genC && !HAND[rec.n] && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā|samāsa)$/.test(rec.kind) && !P.some(p => p.pid === '1.1.66' && p.status === '✔' && p.layer !== 1)) {
    const refsN = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    const recent = new Map(); for (const r0 of RES.slice(-8)) { if (r0.n.split('.').slice(0, 2).join('.') !== rec.n.split('.').slice(0, 2).join('.')) continue; for (const w of r0.words || []) if (w.wcase === 7 && !/-/.test(w.form || "")) recent.set(w.form, r0.n); for (const c of r0.carried || []) if ((autoOf(sid(c.from), c.w) || {}).cs === 7 && !/-/.test(c.w)) recent.set(c.w, c.from); }
    const gT = rec.genC.split(' ');
    for (const [l, t] of refsN) { if (!t) continue; let done = false;
      for (const m of t.matchAll(/(?<![ऀ-ॿ])([ऀ-ॿ]+?)\s+(परतः|परतो|परत(?=\s)|परे(?![ऀ-ॿ]))/g)) { const x = m[1]; if (!recent.has(x) || gT.includes(x) || /^(अनुदात्ते|छन्दसि|संहितायाम्|सति)$/.test(x)) continue;
        const by = refsN.filter(([, tt]) => tt && new RegExp(`(?<![ऀ-ॿ])${ESC1(x)}\\s+पर(त|े)`).test(tt)).map(([ll]) => ll).join(', ');
        rec.genC = x + ' परे ' + rec.genC; fire('1.1.66', '✔', 2, `${x} (carried over from ${recent.get(x)}): 7th case`, `names what follows — the ${by} read${by.includes(',') ? '' : 's'} “${x} परतः”`);
        if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.66'], what: `${x} (from ${recent.get(x)}; the anuvṛtti data leaves it out): 7th case → “${x} परे” (1.1.66), as the ${by} read${by.includes(',') ? '' : 's'} it`, now: rec.genC });
        done = true; break; }
      if (done) break; }
  }
  // a sound group in the 7th from a recent sūtra (हलि ← 7.2.85) that the references read “X-आदौ” and the data's anuvṛtti leaves out — PIS 33
  if (rec.genC && !HAND[rec.n] && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(rec.kind) && !P.some(p => p.pid === 'PIS 33' && p.status === '✔' && p.layer !== 1)) {
    const refsQ = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    const near = new Map(); for (const r0 of RES.slice(-6)) for (const w of r0.words || []) if (w.wcase === 7 && /[क-ह]ि$/.test(w.form || '')) { const s0 = w.form.replace(/ि$/, '्'); if (PRATYAHARA.has(s0)) near.set(s0, r0.n); }
    for (const [s0, from] of near) { const VD = { 'च्': 'ज्', 'ट्': 'ड्', 'त्': 'द्', 'प्': 'ब्', 'क्': 'ग्' }, f = s0.replace(/[चटतपक]्$/, c => VD[c]).replace(/्$/, '') + 'ादौ';
      if (rec.genC.includes(f)) continue; const hit = refsQ.filter(([, t]) => t && new RegExp(`(?<![ऀ-ॿ])${ESC1(f.slice(0, -1))}(ौ|ाव)`).test(t)); if (!hit.length) continue;
      const toks = rec.genC.split(' '), j = toks.findIndex(t => /^(विभक्तौ|प्रत्यये|सार्वधातुके|आर्धधातुके)$/.test(t)); if (j < 0) continue;
      toks.splice(j, 0, f); rec.genC = toks.join(' '); const by = hit.map(([l]) => l).join(', ');
      fire('PIS 33', '✔', 2, `${s0.replace(/्$/, 'ि')} (from ${from}; the anuvṛtti data leaves it out): a sound group in the 7th`, `→ ${f} (what BEGINS with it), as the ${by} read${hit.length > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['PIS 33'], what: `${s0.replace(/्$/, 'ि')} (from ${from}): what begins with it (PIS 33) → “${f}”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // an upapada (7th) from a recent sūtra that the references read “X उपपदे / उपपदेषु” and the anuvṛtti data leaves out (3.3.129 ← 3.3.126) — 3.1.92
  if (rec.genC && !HAND[rec.n] && idn >= 31091 && idn <= 34117 && rec.kind === 'vidhi' && !P.some(p => p.pid === '3.1.92' && p.status === '✔' && p.layer !== 1)) {
    const refsU = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    const near = new Map(); for (const r0 of RES.slice(-8)) for (const w of r0.words || []) if (w.wcase === 7) near.set((w.form || '').replace(/-/g, ''), r0.n);
    const gT = rec.genC.replace(/-/g, '');
    for (const [x, from] of near) { if (x.length < 3 || gT.includes(x) || gT.includes('अन' + x.slice(1)) || gT.includes('अनु' + x.slice(1)) || gT.includes('अ' + x) || /^(छन्दसि|भूते|भविष्यति|वर्तमाने|संज्ञायाम्|कर्तरि|भावे|अन्यतरस्याम्)$/.test(x)) continue;
      const re = new RegExp(`(?<![ऀ-ॿ])${ESC1(x.replace(/(षु|ेषु|े|ौ|ि|योः)$/, ''))}\\S{0,4}?(?:\\s+इत्येत\\S+)?\\s*(?:[उुू]|्यु|र्यु|्वु)पपद(े|योः|योर्|ेषु|ेषू)`);
      const hit = refsU.filter(([, t]) => t && re.test(t)); if (!hit.length) continue;
      const num = /(षु|ेषु)$/.test(x) ? 'उपपदेषु' : /योः$/.test(x) ? 'उपपदयोः' : 'उपपदे'; const by = hit.map(([l]) => l).join(', ');
      const toks = rec.genC.split(' '), j = toks.indexOf('धातोः'); toks.splice(j >= 0 ? j + 1 : 0, 0, x, num); rec.genC = toks.join(' ');
      fire('3.1.92', '✔', 2, `${x} (from ${from}; the anuvṛtti data leaves it out): 7th case`, `the upapada — the ${by} read${hit.length > 1 ? '' : 's'} it so`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['3.1.92'], what: `${x} (from ${from}) is the upapada (3.1.92) → “${x} ${num}”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // “… -अन्तात् अङ्गात् उत्तरस्य” where a reference says अङ्गात् (नैलेश-वृत्तिः 7.3.51, 3.4.110) — 1.4.13
  if (rec.genC && !HAND[rec.n] && /^(ādeśa|āgama)$/.test(rec.kind) && !/(^|\s)(अङ्गात्|अङ्गस्य)(\s|$)/.test(rec.genC) && !P.some(p => p.pid === '1.4.13' && p.status === '✔')) {
    const refsA = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]].filter(([, t]) => t && /(?<![ऀ-ॿ])(अ|ा|[क-ह])ङ्गात्(?![ऀ-ॿ])/.test(t));
    const toks = rec.genC.split(' '), j = toks.indexOf('उत्तरस्य');
    if (refsA.length && j > 0 && /(न्तात्|न्तेभ्यः|इत्येतेभ्यः|धातोः)$/.test(toks[j - 1])) { toks.splice(toks[j - 1] === 'धातोः' ? j - 1 : j, 0, 'अङ्गात्'); rec.genC = toks.join(' '); const by = refsA.map(([l]) => l).join(', ');
      fire('1.4.13', '✔', 2, 'the base before the suffix', `the aṅga — the ${by} say${refsA.length > 1 ? '' : 's'} अङ्गात्`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.4.13'], what: `अङ्गात्: the base before the suffix is the aṅga (1.4.13), as the ${by} read${refsA.length > 1 ? '' : 's'} it`, now: rec.genC }); }
  }
  // a 6th-case word the references read “X स्थाने” where the gloss has no “स्थाने” (PV 8.2.4 “उदात्तस्वरितयोः स्थाने”) — 1.1.49
  if (rec.genC && !HAND[rec.n] && !/(^|\s)स्थाने(\s|$)/.test(rec.genC) && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā|samāsa|vibhakti)$/.test(rec.kind) && !P.some(p => p.pid === '1.1.49' && p.status === '✔' && p.layer !== 1)) {
    const refsS = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    for (const w of words.filter(w => w.wcase === 6)) { const f = w.form.replace(/-/g, ''); if (f.length < 3) continue;
      const re = new RegExp(`(?<![ऀ-ॿ])${ESC1(f)}\\s+स्थाने`); const hit = refsS.filter(([, t]) => t && re.test(t)); if (!hit.length) continue;
      const toks = rec.genC.split(' '), j = toks.findIndex(t => t === w.form || t === f); if (j < 0 || toks[j + 1] === 'उत्तरस्य') continue;
      toks.splice(j + 1, 0, 'स्थाने'); rec.genC = toks.join(' '); const by = hit.map(([l]) => l).join(', ');
      fire('1.1.49', '✔', 2, `${w.form}: 6th case`, `names the place — the ${by} read${hit.length > 1 ? '' : 's'} “${f} स्थाने”`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.49'], what: `${w.form}: the 6th names the place (1.1.49) → “${w.form} स्थाने”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // a carried 5th/6th the gloss dropped although the references read it “X-अन्तस्य / X-अन्तात्” (PV 7.3.106 “आबन्तस्याङ्गस्य” ← आपः 7.3.105) — 1.1.72 / PIS 23
  if (rec.genC && !HAND[rec.n] && /^(ādeśa|operation|āgama)$/.test(rec.kind)) {
    const NZ2 = t => (t || '').replace(/ं(?=[पफबभम])/g, 'म्').replace(/ं(?=[तथदधन])/g, 'न्');
    const refsT = [...OTHER(rec, id).map(([l, t]) => [l, NZ2(t)]), ['Kāśikā', NZ2((rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, ''))]];
    const gT = rec.genC.replace(/-/g, '');
    const recentW = []; for (const r0 of RES.slice(-4)) if (r0.n.split('.').slice(0, 2).join('.') === rec.n.split('.').slice(0, 2).join('.')) for (const w of r0.words || []) if ([5, 6].includes(w.wcase) && !/-/.test(w.form || '') && !an.some(c => c.w === w.form)) recentW.push({ w: w.form, from: r0.n });
    // + an own uninflected word the gloss dropped (6.4.37 अनुनासिक → PV “अनुनासिकान्तानाम्”)
    const own0 = words.filter(w => w.wcase === 0 && w.segs.length === 1 && w.form.length > 4 && !w.lex.some(l => l && ['option', 'ca', 'neg', 'acharya'].includes(l.kind))).map(w => ({ w: w.form, from: num(id), own0: true }));
    for (const c of an.concat(recentW, own0)) { if (SILENT[c.w] !== undefined || /-/.test(c.w)) continue; const a = c.own0 ? { cs: 6, pieces: [{ stem: c.w }] } : autoOf(sid(c.from), c.w); if (!a || ![5, 6].includes(a.cs)) continue;
      const p0 = a.pieces && a.pieces[a.pieces.length - 1], raw = (p0 && p0.stem) || (LEX[c.w] || {}).stem || ''; if (!raw || raw.length < 2) continue;
      const VD = { 'प': 'ब', 'त': 'द', 'क': 'ग', 'ट': 'ड', 'च': 'ज' }, b = /्$/.test(raw) ? raw.slice(0, -1).replace(/[पतकटच]$/, x => VD[x]) : raw.replace(/ी$/, '्य').replace(/[ुू]$/, '्व');
      if (gT.includes(c.w) || gT.includes(b + 'न्त')) continue;
      const end = a.cs === 5 ? 'ात्' : 'स्य', re = new RegExp(`(?<![ऀ-ॿ])(?:${ESC1(b)}|${ESC1(b.replace(/स$/, 'ः'))})(प्रत्यया|शब्दा)?न्त${a.cs === 5 ? '(ात्|ाद्)' : c.own0 ? '(स्य|ानाम्|ानां)' : 'स्य'}`); const hit = refsT.filter(([, t]) => re.test(t)); if (!hit.length) continue;
      const m = hit[0][1].match(re), form = (m[1] === 'शब्दा' ? b.replace(/स$/, 'ः') : b) + (m[1] || '') + 'न्त' + (c.own0 && m[2] ? (m[2] === 'स्य' ? 'स्य' : 'ानाम्') : end), toks = rec.genC.split(' '), j = toks.findIndex(t => /^(अङ्गस्य|स्थाने|अङ्गात्|उत्तरस्य)$/.test(t)); if (j < 0 || toks.includes(form) || rec.genC.split(/[\s-]+/).includes(raw)) continue;
      toks.splice(j, 0, form); rec.genC = toks.join(' '); const pid = (p0 && p0.kind === 'suffix') || (LEX[c.w] || {}).kind === 'suffix' ? 'PIS 23' : '1.1.72', by = hit.map(([l]) => l).join(', ');
      fire(pid, '✔', 2, `${c.w} (carried over from ${c.from}; the gloss had dropped it)`, `${form} — what ENDS in it, as the ${by} read${hit.length > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: [pid], what: `${c.w} (from ${c.from}) stands for what ends in it (${pid}) → “${form}”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // “X विषये” where a reference reads “X परतः” (PV 1.4.98 “कृञि परतः”): the 7th names what follows — 1.1.66
  if (rec.genC && !HAND[rec.n] && / विषये/.test(' ' + rec.genC) && !P.some(p => p.pid === '1.1.66' && p.status === '✔' && p.layer !== 1)) {
    const refsV = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]], toks = rec.genC.split(' ');
    for (let j = 0; j < toks.length - 1; j++) { if (toks[j + 1] !== 'विषये' || /^(छन्दसि|संज्ञायाम्|भाषायाम्|असंज्ञायाम्|संहितायाम्|लोके|वेदे)$/.test(toks[j])) continue;
      const x = toks[j], xs = [x, ...({ 'कृञि': ['करोतौ'], 'भुवि': ['भवतौ'], 'अस्तौ': ['अस्तौ'] }[x] || [])].map(ESC1).join('|'), hit = refsV.filter(([, t]) => t && new RegExp(`(?<![ऀ-ॿ])(${xs})\\s+(परतः|परतो|परत(?=\\s)|परे(?![ऀ-ॿ]))`).test(t)); if (!hit.length) continue;
      toks[j + 1] = 'परे'; rec.genC = toks.join(' '); const by = hit.map(([l]) => l).join(', ');
      fire('1.1.66', '✔', 2, `${x}: 7th case`, `names what follows — the ${by} read${hit.length > 1 ? '' : 's'} “${x} परतः”`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.66'], what: `${x}: 7th case → “${x} परे” (1.1.66), as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
      break; }
  }
  // a 5th-case compound the gloss joined into one “XYशब्दात्” while the references read each member “X-अन्तात्” (PV/Kāśikā 5.2.137
  // “मन्नन्तात् मशब्दान्तात् च”): one tadanta per member, joined by च — 1.1.72
  if (rec.genC && !HAND[rec.n] && rec.kind === 'vidhi') {
    const refsM = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]].map(([l, t]) => [l, (t || '').replace(/ं(?=[तथदधन])/g, 'न्')]);
    for (const w of words.filter(w => w.wcase === 5 && w.segs.length > 1)) {
      const toks = rec.genC.split(' '), j = toks.findIndex(t => /शब्दा(त्|भ्याम्|भ्यः)$/.test(t) && t.replace(/शब्दा(त्|भ्याम्|भ्यः)$/, '').length >= 2 && w.segs[0].startsWith(t.slice(0, 2))); if (j < 0) continue;
      const out = [], by = new Set();
      for (const [i, g] of w.segs.entries()) { const st = (i === w.segs.length - 1 ? g.replace(/(ाभ्याम्|ेभ्यः|भ्यः|भ्याम्|ात्|ः)$/, '') : g).replace(/्$/, '');
        let f = null; for (const v of [...new Set([st, st.replace(/[ािीुू]$/, '')])].filter(v => v.length >= 1)) { const re = new RegExp(`(?<![ऀ-ॿ])${ESC1(v)}(्न|शब्दा|)न्ता(त्|द्|च्)`); const h = refsM.filter(([, t]) => re.test(t)); if (h.length) { const m = h[0][1].match(re); f = v + m[1] + 'न्तात्'; h.forEach(([l]) => by.add(l)); break; } }
        if (!f) { out.length = 0; break; } out.push(f); }
      if (out.length !== w.segs.length) continue;
      toks.splice(j, 1, ...out, 'च'); rec.genC = toks.join(' '); const b = [...by].join(', ');
      fire('1.1.72', '✔', 2, `${w.form}: each member names what ends in it`, `${out.join(' ')} — as the ${b} read${by.size > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.72'], what: `${w.form}: each member stands for what ends in it (1.1.72) → “${out.join(' ')} च”, as the ${b} read${by.size > 1 ? '' : 's'} it`, now: rec.genC });
    }
  }
  // the sūtra's own अपि / एव that the gloss dropped (3.3.2 भूतेऽपि दृश्यन्ते, 3.4.112 … शाकटायनस्यैव) when a reference keeps it: after the word it follows
  if (rec.genC && !HAND[rec.n]) {
    const refsP = [...OTHER(rec, id).map(x => x[1]), (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '')].join(' ');
    words.forEach((w, i) => { if (!/^(अपि|एव)$/.test(w.form) || i === 0) return; const toks = rec.genC.split(' '); if (toks.includes(w.form)) return;
      if (!(w.form === 'अपि' ? /(अपि|ऽपि|प्यु|प्या)/ : /(एव|ैव)/).test(refsP)) return;
      const prev = words[i - 1].form, k = toks.findIndex(t => t === prev || t === prev.replace(/-/g, '')); if (k < 0) return;
      const at = /^(गम्यमाने|विषये|अभिधेये|परे|उपपदे|आचार्यस्य|आचार्याणाम्)$/.test(toks[k + 1] || '') ? (toks[k + 2] === 'मतेन' ? k + 3 : k + 2) : k + 1;
      toks.splice(at, 0, w.form); rec.genC = toks.join(' ');
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: [], what: `${w.form}: the sūtra's own particle, kept as the references keep it`, now: rec.genC }); });
  }
  if (rec.genC && / उणादय प्रत्ययः/.test(rec.genC)) rec.genC = rec.genC.replace(' उणादय प्रत्ययः परः च भवति', ' उणादयः प्रत्ययाः पराः च भवन्ति');   // a plural list keeps its form
  // an ācārya named in the sūtra (उदीचाम्, शाकटायनस्य, own or carried): “X आचार्यस्य / आचार्याणाम् मतेन” (PV 3.4.111 “शाकटायनस्याचार्यस्य मतेन”) —
  // never a place in the 6th, never dropped
  if (rec.genC && !HAND[rec.n]) {
    const isA = (form, from) => { const L = LEX[form]; if (L && L.acharya) return true; const a = autoOf(sid(from || num(id)), form); return !!(a && a.pieces && a.pieces.some(p => p && p.kind === 'acharya')); };
    const ac = [...words.filter(w => w.segs.length === 1 && (w._acharya || w.lex.some(l => l && l.acharya) || isA(w.form))).map(w => w.form), ...an.filter(c => !(rec.superseded || []).some(x => x.w === c.w) && isA(c.w, c.from)).map(c => c.w)];
    for (const a of [...new Set(ac)].filter(a => !/े$/.test(a))) { let toks = rec.genC.split(' '); if (toks.includes(a + ' आचार्यस्य') || rec.genC.includes(a + ' आचार्य')) continue;
      toks = toks.filter(t => t !== a); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः|निपात्यते|निपात्यन्ते|निपात्येते|समस्यते),?$/.test(toks[i])) i--; if (i > 0 && toks[i - 1] === 'न') i--; if (i > 0 && /^(विकल्पेन|बहुलम्|नित्यम्|यथासङ्ख्यम्)$/.test(toks[i - 1])) i--;
      if (i <= 0) continue; toks.splice(i, 0, a, /ाम्$/.test(a) ? 'आचार्याणाम्' : 'आचार्यस्य', 'मतेन'); rec.genC = toks.join(' ');
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: [], what: `${a}: an ācārya named → “${a} ${/ाम्$/.test(a) ? 'आचार्याणाम्' : 'आचार्यस्य'} मतेन” (in his view)`, now: rec.genC }); }
  }
  // the sūtra's own 7th-case word that the gloss left out (पायौ, आदिनी, भावकर्मणोः): put it back when a reference has the word itself —
  // “X परतः / परे” there → “X परे” (1.1.66); “X विषये / अभिधेये / गम्यमाने” → that marker; otherwise the word as it stands
  if (rec.genC && !HAND[rec.n] && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(rec.kind)) {
    const refs7 = [...OTHER(rec, id), ['Kāśikā', (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '')]];
    const gT = rec.genC.replace(/-/g, '');
    for (const w of words.filter(w => w.wcase === 7)) {
      const L = w.lex[w.segs.length - 1] || LEX[w.form] || {}, f = w.form.replace(/-/g, '');
      if (/^(अन्यतरस्याम्|सुपि|तस्मिन्|यस्मिन्|एतस्मिन्|अस्मिन्)$/.test(w.form) || ['suffix', 'varna', 'pratyahara', 'option', 'it'].includes(L.kind) || f.length < 2 || w.segs.some(g => /्$/.test(g)) || /^[क-ह]्[क-ह][ोे]/.test(f) && /कारे/.test(gT)) continue;
      const sg = w.segs.map((g, i) => i === w.segs.length - 1 ? g.replace(/(योः|ेषु|ायाम्|ासु|ाम्|े|ौ|ि)$/, '') : g);
      // already said in another shape: ढे → ढकारादौ, हलि → हलादौ, प्रे → प्रशब्दे, नौ → निशब्दे, उदि → उत्शब्दे, ऋचि → ऋच्शब्दे
      const st7 = f.replace(/(ायाम्|याम्|े|ि|ौ)$/, ''), shapes = [st7 + 'ादौ', st7 + 'कारादौ', f[0] + 'कारादौ', st7 + 'शब्द', st7 + '्शब्द', f.replace(/ौ$/, 'ि') + 'शब्द', st7.replace(/द$/, 'त्') + 'शब्द', st7.replace(/[चजदबग]$/, c => c + '्') + 'शब्द'];
      if (f.length > 4 && (gT.includes(f.slice(0, -2)) || gT.includes(f.replace(/र्त्त/g, 'र्त').slice(0, -2)) || sg.every(g => gT.includes(g.slice(0, Math.max(2, g.length - 1)))))) continue;
      if (f.length <= 4 && (gT.split(' ').includes(f) || shapes.some(x => gT.includes(x)))) continue;
      const wre = new RegExp(`(?<![ऀ-ॿ])${ESC1(f)}(?:\\s+(परतः|परतो|परत(?=\\s)|परे|विषये|अभिधेये|गम्यमाने)|(?![ऀ-ॿ]))`);
      // also “X-अर्थे” joined by sandhi (पूजायामर्थे, विमोहनेऽर्थे, अगतावर्थे, भूषणार्थे): the word names a meaning → “X अर्थे”
      const stA = f.replace(/(ायाम्|याम्|े|ि|ौ)$/, ''), are = new RegExp(`(?<![ऀ-ॿ])${ESC1(stA)}\\S{0,4}?(र्थे|र्थ(?![ऀ-ॿ]))`);
      let hit = refs7.map(([l, t]) => [l, (t || '').match(wre)]).filter(([, m]) => m), artha = false;
      if (!hit.length && stA.length >= 2) { hit = refs7.map(([l, t]) => [l, (t || '').match(are)]).filter(([, m]) => m); artha = hit.length > 0; }
      if (!hit.length) continue;
      const mk = artha ? 'अर्थे' : (hit.find(([, m]) => m[1]) || [, []])[1][1], by = hit.map(([l]) => l).join(', ');
      const par = /^पर/.test(mk || ''), phr = w.form + (par ? ' परे' : mk ? ' ' + mk : '');
      rec.genC = phr + ' ' + rec.genC;
      if (par) fire('1.1.66', '✔', 2, `${w.form}: 7th case`, `the operation happens with ${w.form} following — as the ${by} read${hit.length > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: par ? ['1.1.66'] : [], what: `${w.form} (the sūtra's own word, 7th case) → “${phr}”, as the ${by} read${hit.length > 1 ? '' : 's'} it`, now: rec.genC });
    }
  }
  // tadanta read by the नैलेश-वृत्तिः or the Kāśikā: a 5th/6th-case word of the sūtra that they render “X-अन्तात् / X-अन्तस्य”
  // (PV/Kāśikā 4.1.149 “फिञन्तात्”, 6.1.159 “घञन्तस्य”) — 1.1.72 / PIS 23 (Harsha 2026-11-16: a reference agreeing is enough)
  if (rec.genC && !HAND[rec.n] && !/^(adhikāra|paribhāṣā)$/.test(rec.kind)) {
    const isSam = /^saṃjñā/.test(rec.kind), sfxish = w => w.segs.length === 1 && (w.lex.some(l => l && l.kind === 'suffix') || PRATYAHARA.has(w.form) || /^(सप्तमी|षष्ठी|पञ्चमी|चतुर्थी|तृतीया|द्वितीया|प्रथमा)$/.test(w.form));
    const NZ = t => t.replace(/ं(?=[पफबभम])/g, 'म्').replace(/ं(?=[कखगघ])/g, 'ङ्').replace(/ं(?=[तथदधन])/g, 'न्');
    const sa = NZ(OTHER(rec, id).map(x => x[1]).join(' ')), kv = NZ((rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, ''));
    const fix = t => t.replace(/ाद्$|ाच्$|ाज्$|ाञ्$|ान्$|ाद$/, 'ात्').replace(/ेभ्य$/, 'ेभ्यः');
    // carried words count too when the gloss shows them (अनः ← 6.4.134 in 6.4.136 → “अन्नन्तस्य”); their case from the sūtra they come from
    const gTok = new Set(rec.genC.split(' '));
    const carW = an.filter(c => !words.some(w => w.form === c.w) && (gTok.has(c.w) || gTok.has(c.w.replace(/-/g, '')))).map(c => { const a = autoOf(sid(c.from), c.w); const cs = a ? a.cs : 0;
      return { form: c.w, segs: c.w.split('-'), wcase: cs || (/(ात्|ाद्|ेभ्यः)$/.test(c.w) ? 5 : /(स्य|ानाम्|योः)$/.test(c.w) ? 6 : /(ः)$/.test(c.w) ? 56 : 0), lex: [], carried: true, ap: a && a.pieces && a.pieces[a.pieces.length - 1] }; });
    // svara rules: a suffix named in the 7th or bare (रिति, चङि, तवै) that the references read as “the word ending in it” (रित्प्रत्ययान्तस्य)
    const svS = w => rec.kind === 'svara' && [0, 7].includes(w.wcase) && w.segs.length === 1 && (w.lex.some(l => l && l.kind === 'suffix') || /^[क-ह]ि[तद]ि$|ङि$/.test(w.form) || (sa + ' ' + kv).includes(w.form + 'प्रत्ययान्त'));
    for (const w of words.filter(w => !isSam && [5, 6].includes(w.wcase) || w.wcase === 1 && sfxish(w) || svS(w)).concat(isSam ? [] : carW.filter(w => [5, 6, 56].includes(w.wcase)))) {
      const L = w.lex[w.segs.length - 1] || (w.segs.length === 1 ? LEX[w.form] : null) || {}, wi = words.indexOf(w), ap = w.carried ? w.ap : AUTO[id] && AUTO[id][wi] && AUTO[id][wi][w.segs.length - 1];
      const lastSeg = w.segs[w.segs.length - 1], head = w.segs.slice(0, -1);
      const st0 = ((ap && ap.stem) || L.stem || lastSeg.replace(/(ात्|ाद्|स्य|भ्यः|ानाम्|ाम्)$/, '').replace(/ेः$/, 'ि').replace(/ोः$/, 'ु').replace(/ः$/, '')).replace(/-/g, '').replace(/्$/, ''), st = st0.replace(/ञ$/, '');
      const fst = lastSeg.replace(/-/g, '').replace(/ुवोः$/, 'ु').replace(/ियोः$/, 'ि').replace(/(ात्|ाद्|स्य|भ्यः|ानाम्|ाम्)$/, '').replace(/ेः$/, 'ि').replace(/ोः$/, 'ु').replace(/्याः$/, 'ी').replace(/ः$/, '');   // from the form itself: वतोः → वतु (the lexicon has वतुप्)
      if (st.length < 2 && st0.length < 2 && !(w.form === 'अस्य' || w.form === 'अतः' || L.kind === 'varna') || rec.genC.split(' ').some(t => t.startsWith(st) && /न्त(ात्|स्य|ानाम्|ेभ्यः)$/.test(t))) continue;
      const E5 = 'न्तात्|न्ताद्|न्ताच्|न्ताज्|न्ताद(?=[ऀ-ॿ])|न्तेभ्यः|न्तेभ्य|न्ताभ्याम्', E6 = 'न्तस्य|न्तानाम्|न्तानां|न्तयोः';
      const endRe = '(' + ([0, 7].includes(w.wcase) ? E6 : w.wcase === 1 ? 'न्तम्|न्तः|न्ताः|न्तौ|न्तानि' : w.wcase === 5 ? E5 : w.wcase === 6 ? E6 : E5 + '|' + E6) + ')';   // sandhi-joined: ह्रस्वान्तादङ्गात्
      // the stem as it shows before -अन्त: नदी → नद्य(न्त), धेनु → धेन्व, अप् → अब(न्त), घञ् → घञ(न्त)
      const VC0 = { 'प': 'ब', 'त': 'द', 'क': 'ग', 'ट': 'ड', 'च': 'ज' }, vOf = x => [x, x.replace(/ी$/, '्य').replace(/ि$/, '्य').replace(/[ुू]$/, '्व'), /[पतकटच]$/.test(x) ? x.replace(/[पतकटच]$/, c => VC0[c]) : x];
      const sndN = w.form === 'अस्य' || w.form === 'अतः' ? ['अवर्ण', 'अकार'] : L.kind === 'varna' && L.stem ? [SNAME(L.stem)] : [];   // अस्य (7.4.32) = the sound अ → “अवर्णान्तस्य”
      const sv = [...new Set([...vOf(st), ...vOf(st0), ...(fst.length > 1 ? vOf(fst) : []), ...sndN])].filter(v => v.length > 1);
      let re, mS = null, mK = null;
      for (const v of sv) { re = new RegExp(`(?<![ऀ-ॿ])(${ESC1(v)}[^\\s]{0,9}?${endRe})`);
        const okM = m => m && /^(|ा|ञ|ञ्|्न|्ङ|्ण|कारा|शब्दा|वर्णा|ि|ु|दा|प्रत्यया|ाप्रत्यया|्प्रत्यया|प्रत्ययाः)$/.test(m[1].slice(v.length, m[1].length - m[2].length)) ? m : null;   // only the stem + -अन्त (फिञन्तात्, ह्रस्वान्तस्य, कुलशब्दान्तात्, सन्नन्तात्), not a longer word
        mS = okM(sa.match(re)); mK = okM(kv.match(re)); if (mS || mK) break; }
      // “X … तदन्तात्” (PV/Kāśikā 2.4.60 “गोत्रे य इञ् तदन्तात्”): the word ending in X
      let tadF = null;
      if (!mS && !mK) for (const v of sv.filter(v => v.length >= 2)) {
        const reT = new RegExp(`(?<![ऀ-ॿ])${ESC1(v)}[^\\s]{0,10}?\\s*तदन्त(ात्|ाद्|ाच्|स्य|ेभ्यः|ेभ्य|ानाम्|ायाः)`);
        const hS = sa.match(reT), hK = kv.match(reT); if (!hS && !hK) continue;
        const e0 = (hK || hS)[1], end = /^ा[दच]्$/.test(e0) ? 'ात्' : e0 === 'ेभ्य' ? 'ेभ्यः' : e0;
        if (w.wcase === 5 && !/^(ात्|ेभ्यः)$/.test(end) || w.wcase === 6 && !/^(स्य|ानाम्|ायाः)$/.test(end)) continue;
        const raw = ((ap && ap.stem) || L.stem || '').replace(/-/g, ''), VC1 = { 'त': 'द', 'ट': 'ड', 'प': 'ब', 'क': 'ग', 'च': 'ज' }, b = /्$/.test(raw) ? raw.slice(0, -1).replace(/[तटपकच]$/, c => VC1[c]) : /[िीुू]$/.test(st) ? vOf(st)[1] : /[ा-ौ]$/.test(st) ? st : st + 'ा';
        tadF = b + 'न्त' + end; re = reT; mS = hS; mK = hK; break; }
      if (!mS && !mK) continue;
      const form0 = tadF || fix((mK || mS)[1]).replace(/नां$/, 'नाम्'), form = head.length ? head.join(' ') + ' ' + form0 : form0;
      const alts = [w.form, w.form.replace(/-/g, ''), w.form.replace(/-/g, ' '), st + 'शब्दात्', st + 'शब्दस्य', st + 'शब्देभ्यः', st + 'शब्दानाम्'], tc0 = rec.genC.split(' ');
      // a compound shows as several tokens (हु श्नुवोः): match its last member and replace the run
      let j = tc0.findIndex(t => alts.includes(t)), tc = tc0; if (j < 0 && head.length) { const k = tc0.findIndex((t, x) => t === lastSeg && head.every((h, y) => tc0[x - head.length + y] === h)); if (k >= 0) { tc = [...tc0.slice(0, k - head.length), w.form, ...tc0.slice(k + 1)]; j = k - head.length; } }
      let lastOnly = false; if (j < 0 && head.length) { const k = tc0.indexOf(lastSeg); if (k > 0 && tc0[k - 1].endsWith(head[head.length - 1].replace(/्$/, '').slice(-2))) { j = k; lastOnly = true; } }
      if (j < 0 || tc[j + 1] === 'परः' && tc[j + 2] === 'यः') continue; tc[j] = lastOnly ? form0 : tc === tc0 && /-/.test(tc0[j]) && head.length ? head.join('-') + '-' + form0 : form; if (w.wcase === 7 && /^(परतः|परे)$/.test(tc[j + 1] || '')) tc.splice(j + 1, 1); if (w.wcase === 7 && j > 0 && /^(उपोत्तमम्|आदिः|अन्तः)$/.test(tc[j - 1])) [tc[j - 1], tc[j]] = [tc[j], tc[j - 1]]; rec.genC = tc.join(' ');   // “नावः परः यः द्विगुः” keeps its own phrasing
      if (mK && rec._tG) { const i = rec._tG.findIndex(t => alts.includes(t)); if (i >= 0) { rec._tG[i] = form; rec.gen = join(rec._tG); } }
      const pid = L.kind === 'suffix' ? 'PIS 23' : '1.1.72', by = [mS ? otherBy(rec, id, re) : '', mK ? 'Kāśikā' : ''].filter(Boolean).join(' and ');
      fire(pid, '✔', 2, `${w.form}: ${w.wcase === 5 ? '5th' : '6th'} case`, `${form} — what ENDS in it, as the ${by} read${mS && mK ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: [pid], what: `${w.form} stands for what ends in it (${pid}): “${form}”, as the ${by} read${mS && mK ? '' : 's'} it`, now: rec.genC });
    }
  }
  // compounds: a member that a reference renders “X-अन्त” (नदी-आप्-नीभ्यः → PV/Kāśikā “नद्यन्तादाबन्तात्”; ऋत्-हनोः → “ऋकारान्तानाम्”)
  if (rec.genC && !HAND[rec.n] && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(rec.kind)) {
    const NZ = t => t.replace(/ं(?=[पफबभम])/g, 'म्').replace(/ं(?=[कखगघ])/g, 'ङ्').replace(/ं(?=[तथदधन])/g, 'न्');
    const refs = [...OTHER(rec, id).map(x => [x[0], NZ(x[1])]), ['Kāśikā', NZ((rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, ''))]];
    for (const w of words.filter(w => [5, 6].includes(w.wcase) && w.segs.length > 1)) {
      const wi = words.indexOf(w), tc = rec.genC.split(' '), segT = w.segs.map((g, i) => i === w.segs.length - 1 ? null : g);
      let k0 = tc.findIndex((t, x) => w.segs.slice(0, -1).every((g, y) => tc[x + y] === g)), hyph = false;
      if (k0 < 0 && tc.indexOf(w.form) >= 0) { k0 = tc.indexOf(w.form); tc.splice(k0, 1, ...w.segs); hyph = true; }   // the gloss keeps the compound whole: सन्-आशंस-भिक्षः
      if (k0 < 0) continue;
      if (/^अन्त/.test(w.segs[w.segs.length - 1])) continue;   // अतु-अस्-अन्तस्य already says “-अन्त”
      const end5 = 'न्तात्', end6 = 'न्तस्य';   // each member singular (PV 7.3.116 “नद्यन्तादाबन्तात्”); the reference may use the other case (PV 3.2.168 “सन्नन्तस्य”)
      const endRe = '(न्तात्|न्ताद्|न्ताच्|न्ताज्|न्ताद(?=[ऀ-ॿ])|न्तेभ्यः|न्तेभ्य|न्तस्य|न्तानाम्|न्तानां|न्तयोः)';
      let changed = [], by = new Set();
      w.segs.slice(0, -1).forEach((g, i) => { const ap = AUTO[id] && AUTO[id][wi] && AUTO[id][wi][i]; let st = ((ap && ap.stem) || g).replace(/्$/, '');
        if (st.length < 1) return; const VC = { 'प': 'ब', 'त': 'द', 'क': 'ग', 'ट': 'ड', 'च': 'ज' }; const vars = [st, st.replace(/ी$/, '्य').replace(/ि$/, '्य').replace(/[ुू]$/, '्व'), /[पतकटच]$/.test(st) ? st.replace(/[पतकटच]$/, c => VC[c]) : null, (LEX[g] && ['varna', 'pratyahara'].includes(LEX[g].kind)) ? SNAME(LEX[g].stem) : null].filter(Boolean);
        for (const v of vars) { const re = new RegExp(`${i > 0 && v.length > 1 ? '' : '(?<![ऀ-ॿ])'}(${ESC1(v)}(|ा|ञ|्न|कारा|शब्दा|वर्णा|प्रत्यया|्प्रत्यया)${endRe})`); const hit = refs.filter(([, t]) => re.test(t)); if (!hit.length) continue;
          tc[k0 + i] = v + (re.exec(hit[0][1])[2] || '') + (w.wcase === 5 ? end5 : end6); changed.push(g); hit.forEach(([l]) => by.add(l)); break; } });
      if (!changed.length) continue;
      if (hyph) tc.splice(k0, w.segs.length, tc.slice(k0, k0 + w.segs.length).join('-').replace(/(न्तात्|न्तस्य)-/g, '$1 '));
      rec.genC = tc.join(' '); const b = [...by].join(', ');
      fire('1.1.72', '✔', 2, `${changed.join(', ')}: member${changed.length > 1 ? 's' : ''} of ${w.form}`, `what ENDS in ${changed.length > 1 ? 'them' : 'it'}, as the ${b} read${by.size > 1 ? '' : 's'} it`);
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.72'], what: `${changed.join(', ')} (in ${w.form}) stand${changed.length > 1 ? '' : 's'} for what ends in ${changed.length > 1 ? 'them' : 'it'} (1.1.72), as the ${b} read${by.size > 1 ? '' : 's'} it`, now: rec.genC });
    }
  }
  // यथासङ्ख्यम् read by the नैलेश-वृत्तिः or the Kāśikā where the sūtra (with what it carries) has two lists — 1.3.10 (Harsha 2026-11-16: a reference agreeing is enough)
  if (rec.genC && !P.some(p => p.pid === '1.3.10') && !/यथासङ्ख्यम्/.test(rec.genC) && !HAND[rec.n]) {
    const sa = OTHER(rec, id).map(x => x[1]).join(' '), kv = rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '', YS = /यथासङ्ख्य|यथासंख्य|यथाक्रम|क्रमेण/;
    const lists = words.filter(w => w.wcase && (w.segs.length > 1 || w.num > 1) && !/^(अ|अन्)$/.test(w.segs[0])).length + an.filter(c => !SILENT[c.w] && /-/.test(c.w)).length;
    const nYS = OTHER(rec, id).filter(([, t]) => YS.test(t || '')).length + (YS.test(kv) ? 1 : 0);
    if ((YS.test(sa) || YS.test(kv)) && (lists >= 2 || lists >= 1 && (nYS >= 2 || /^(ādeśa|āgama|operation)$/.test(rec.kind) || !/^saṃjñā/.test(rec.kind) && words.some(w => w.segs.length >= 3)) || /^(ādeśa|āgama|operation)$/.test(rec.kind) && nYS >= 1 && words.concat(an.map(c => ({ form: c.w }))).some(w => PRATYAHARA.has(String(w.form).replace(/(ः|ाम्|ि|ोः)$/, '्').replace(/््$/, '्'))))) { const by = [YS.test(sa) ? otherBy(rec, id, YS) : '', YS.test(kv) ? 'Kāśikā' : ''].filter(Boolean).join(' and ');
      fire('1.3.10', '✔', 2, 'two lists in the sūtra', `they pair up in order — the ${by} say${by.includes(' and ') ? '' : 's'} so (यथासङ्ख्यम्)`);
      const toks = rec.genC.split(' '); let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः|निपात्यते|निपात्यन्ते|निपात्येते),?$/.test(toks[i])) i--; if (i > 0 && toks[i - 1] === 'न') i--; if (i > 0 && /^(विकल्पेन|विभाषा)$/.test(toks[i - 1])) i--;
      if (i > 0) { toks.splice(i, 0, 'यथासङ्ख्यम्'); rec.genC = toks.join(' '); }
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.3.10'], what: `the two lists pair up in order (1.3.10, “यथासङ्ख्यम्”), as the ${by} say${by.includes(' and ') ? '' : 's'}`, now: rec.genC }); }
  }
  // an option (विभाषा / अन्यतरस्याम् / वा, own or carried): 1.1.44 न वेति विभाषा — class style says विकल्पेन before the verb
  {
    const OPT = /^(विभाषा|अन्यतरस्याम्|वा)$/;
    const optOwn = words.some(w => OPT.test(w.form)), optCar = (an.some(c => OPT.test(c.w)) || (rec.kind === 'samāsa' && ad.some(c => c.w === 'विभाषा'))) && !(rec.superseded || []).some(x => OPT.test(x.w));
    // the text keeps the term “विभाषा” (samāsa rules, as the class notes write them): the step defining it is still 1.1.44
    if (rec.kind === 'samāsa' && rec.genC && (optOwn || optCar) && /(^|\s)विभाषा(\s|$)/.test(rec.genC) && !/विकल्पेन/.test(rec.genC) && rec.n !== '1.1.44') { fire('1.1.44', '✔', 2, 'विभाषा (carried over)', 'विभाषा = optional (न वेति विभाषा) — the gloss keeps the term'); if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.44'], what: 'विभाषा → the rule applies optionally (1.1.44); the gloss keeps the term “विभाषा”', now: rec.steps[rec.steps.length - 1].now }); }
    else if (rec.genC && (optOwn || optCar) && !/विकल्पेन/.test(rec.genC) && rec.n !== '1.1.44') {   // 1.1.44 defines विभाषा: the word is the term, not an option
      const toks = rec.genC.split(' ').filter(t => !OPT.test(t));
      let i = toks.length - 1; while (i > 0 && !/^(भवति|भवन्ति|भवतः|स्यात्|निपात्यते|निपात्यन्ते|उच्यते)$/.test(toks[i])) i--;
      if (i > 0 && toks[i - 1] === 'न') i--;
      if (i > 0) { toks.splice(i, 0, 'विकल्पेन'); rec.genC = toks.join(' '); }
    }
    if ((optOwn || optCar) && rec.genC && !P.some(p => p.pid === '1.1.44' && p.status === '✔')) {
      fire('1.1.44', '✔', 2, `${optOwn ? words.find(w => OPT.test(w.form)).form : an.find(c => OPT.test(c.w)).w}${optOwn ? '' : ' (carried over)'}`, 'विभाषा = optional (न वेति विभाषा) → “विकल्पेन”');
      if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.1.44'], what: 'विभाषा → the rule applies optionally (1.1.44): “विकल्पेन”', now: rec.steps[rec.steps.length - 1].now });
    }
  }
  // अङ्गस्य in the gloss: what an aṅga is comes from 1.4.13 (yasmāt pratyayavidhis tadādi pratyaye 'ṅgam)
  if (rec.genC && /अङ्ग(स्य|ात्|ानाम्)/.test(rec.genC) && !P.some(p => p.pid === '1.4.13')) {
    fire('1.4.13', '✔', 2, 'अङ्गस्य', 'the aṅga = what the suffix was introduced after, together with whatever begins it, when that suffix follows');
    if (rec.steps && rec.steps.length) rec.steps.push({ pids: ['1.4.13'], what: 'अङ्गस्य: the aṅga is what the suffix was introduced after (with whatever begins it), when that suffix follows (1.4.13)', now: rec.steps[rec.steps.length - 1].now });
  }
  if (rec.gen) {
    rec.steps.push({ pids: [], what: 'assemble in prose order, everything spelled out (class style)', now: rec.genC, fin: true });
    rec.steps.push({ pids: [], what: 'Kāśikā style: leave out what is implied (परः च, स्थाने …), apply sandhi', now: rec.gen, fin: true });
    rec.steps.push({ pids: [], what: 'Kaumudī style: स्यात् / स्युः for भवति', now: rec.genK, fin: true });
  } else rec.steps = [];
  delete rec._st;
  // ─── layer 1: what commentators name at this sūtra
  for (const [c, d] of Object.entries(COMM)) {
    const t = d[id]; if (!t) continue;
    const st = strip(t);
    for (const [pid, probes] of Object.entries(PROBES)) {
      if (pid === num(id)) continue;
      const hit = probes.find(p => st.includes(strip(p)));
      if (!hit) continue;
      const sent = t.split(/[।॥\n]/).find(x => strip(x).includes(strip(hit))) || '';
      const ex = P.find(x => x.pid === pid);
      if (ex) { (ex.quote = ex.quote || []).push({ c, q: sent.trim().slice(0, 300) }); if (ex.layer === 2) ex.layer = '1+2'; }
      else fire(pid, '✔', 1, `named by ${CNAME[c]}`, PB[pid].gloss, { quote: [{ c, q: sent.trim().slice(0, 300) }] });
    }
    // utsarga evidence ("X-ऽपवादः", "X प्राप्ते")
    for (const m of t.matchAll(/([^।॥]*?(?:ऽपवादः|ोऽपवादः|प्राप्ते)[^।॥]*)/g)) rec.utsarga.push({ c, q: m[1].trim().slice(0, 240) });
  }
  // compare
  rec.kv = inRange ? kashikaVrtti(id) : kashikaVrttiX(id);
  { const ss = (COMM.kaumudi[id] || '').split(/[।॥]/).map(x => x.trim()).filter(Boolean); rec.sk = ss.find(x => /स्या[त्च्द्ज्]|स्युः|स्तः/.test(x)) || ss[0] || ''; }
  rec.lsk = (COMM.laghukaumudi[id] || '').split(/[।॥]/)[0].trim();
  RES.push(rec);
  // इक्श्तिपौ धातुनिर्देशे (vārttika on 3.3.108): a dhātu of the sūtra is identified in the dhātupāṭha and named, as the vṛttis do,
  // by its श्तिप् form — the present 3rd singular (सु → षुञ् अभिषवे, 5th class → सुनोति → सुनोतेः). Several roots of that shape → the
  // one whose श्तिप् form the Kāśikā uses; none used and still several → left open (?).
  const NOT_DHATU = new Set(['3.1.17|शब्द', '3.1.17|अभ्र', '3.1.21|मुण्ड', '3.1.21|मिश्र', '3.1.21|कल', '3.1.25|रूप', '3.1.25|तूल', '3.1.25|श्लोक', '3.1.25|त्वच', '3.1.25|वर्ण', '3.1.25|चूर्ण',
    '3.2.13|कर्ण', '3.2.21|भास', '3.2.21|लिप', '3.2.21|बल', '3.2.21|चित्र', '3.2.23|श्लोक', '3.2.23|सूत्र', '3.2.23|मन्त्र', '3.2.31|कूल', '3.2.35|रुष', '3.2.48|पार', '3.2.50|क्लेश', '3.2.56|अन्ध',
    '3.2.71|मन्त्र', '3.2.87|भ्रूण', '3.2.89|मन्त्र', '3.2.96|सह', '3.4.35|चूर्ण', '3.4.43|जीव', '3.4.57|काल', '3.4.66|अर्थ', '3.4.101|तम', '6.1.199|पथ', '6.3.104|पथ', '6.4.19|ऊठ', '6.4.55|अय',
    '6.4.101|धि', '6.4.130|पत', '6.4.132|ऊठ', '6.4.134|अन', '6.4.156|स्थूल', '6.4.157|बंह', '6.4.157|वर्ष', '6.4.157|त्रप', '6.4.157|द्राघ', '6.4.162|ऋज', '6.4.167|अन', '7.1.1|यु', '7.1.1|अन',
    '7.1.20|शि', '7.1.25|पञ्च', '7.1.33|साम', '7.1.39|या', '7.1.40|मश', '7.1.45|तप', '7.1.45|तन', '7.1.50|जस', '7.1.50|जसेः', '7.1.84|दिव', '7.1.89|पुंस', '7.2.18|मन्थ', '7.2.18|स्वर',
    '7.2.111|अय', '7.2.111|पुंस', '7.2.112|आप', '7.3.16|वर्ष', '7.3.34|मान', '7.3.34|तस', '7.3.44|आप', '7.3.116|आप']);
  if (!HAND[rec.n] && st && rec.genC) {
    const KV = COMM.kashika[id] || '', SKt = (COMM.kaumudi || {})[id] || '', KVg = rec.kv || '', SKg = rec.sk || '';   // full texts help identify the root; only the vṛtti sentence decides our wording
    const seen = new Set();
    for (const w of words) w.lex.forEach((l, i) => {
      if (!l || l.kind !== 'dhatu' || l.shtip) return;
      for (const root of [].concat(l.parts || l.root || w.segs[i]).flatMap(x => String(x).split(',')).map(x => x.trim()).filter(Boolean)) {
        const r0 = String(root).replace(/(ः|ेः|ोः|े|ि)$/, m => m === 'ेः' || m === 'े' || m === 'ि' ? 'ि' : '');
        const cands = DHATU.filter(d => d.dhatu === root || d.aupadeshik === root || d.dhatu === r0).filter(d => DFORM[d.baseindex] && (DFORM[d.baseindex].plat || DFORM[d.baseindex].alat));
        if (!cands.length || seen.has(root)) continue; seen.add(root);
        // not a dhātu here (peer review 2026-11-18, each read): the taddhita section names no dhātus; पूर्व is “the preceding”; and these
        // stems / suffixes / substitutes only look like dhātus (6.4.156 स्थूल, 3.2.13 the upapada कर्ण, 7.1.50 जस्, 6.4.157 बंह …)
        if (+id >= 41001 && +id <= 54160 || /^पूर्व/.test(root) || (NOT_DHATU.has(rec.n + '|' + root) || NOT_DHATU.has(rec.n + '|' + root.replace(/्$/, '')))) continue;
        const nm = d => { const F = DFORM[d.baseindex]; const p = (F.plat || F.alat || '').split(';')[0]; return { d, p, abl: p.replace(/(ति|ते)$/, 'तेः'), stem: p.replace(/(ति|ते)$/, 'ते') }; };
        const opts = cands.map(nm);
        // tie-breaks, in order: the sūtra keeps the root's marker (गाङ्, पूङः → पूङ्); the Kāśikā/SK name it by its श्तिप् form;
        // the prathamāvṛtti names it with its meaning (ञिष्विदा गात्रप्रक्षरणे) and gaṇa (दिवा०)
        const GN = { 1: 'भ्वा', 2: 'अदा', 3: 'जुहो', 4: 'दिवा', 5: 'स्वा', 6: 'तुदा', 7: 'रुधा', 8: 'तना', 9: 'क्र्या', 10: 'चुरा' };
        const sForm = String(w.segs[i]).replace(/(ः|स्य|ात्|भ्याम्|भ्यः|ोः|ेः)$/, '');
        const PVT = (PV0[rec.n] && (PV0[rec.n].artha || '')) || '';
        const tries = [
          opts.filter(o => o.d.aupadeshik.replace(/ँ/g, '') === sForm || o.d.aupadeshik.replace(/ँ/g, '') === sForm + '्'),
          opts.filter(o => KV.includes(o.stem) || SKt.includes(o.stem)),
          opts.filter(o => o.d.artha && PVT.includes(o.d.artha.replace(/[ःं]$/, '')) && (PVT.includes(GN[+o.d.gana] || '##') || opts.filter(x => x.d.artha === o.d.artha).length === 1)),
        ];
        const ti = tries.findIndex(t => t.length === 1), hit = ti >= 0 ? tries[ti] : [];
        const pick = hit.length === 1 ? hit[0] : opts.length === 1 ? opts[0] : null;
        const src = hit.length === 1 ? ['marker', 'kashika', 'prathama'][ti] : 'only';
        // does the Kāśikā itself name it by this श्तिप् form? (then our Kāśikā/Kaumudī-style text does too)
        const okP = pick && /(ति|ते)$/.test(pick.p);   // मार्ष्टि etc. have no -ति/-ते श्तिप् name to decline
        const kvUses = okP && KVg.includes(pick.stem), skUses = okP && SKg.includes(pick.stem);
        const keepDh = kvUses && new RegExp(pick.stem + '(र्|ः\\s*)धातो').test(KVg);   // “भवतेर्धातोः” keeps धातोः; “सुनोतेर्यजतेश्च” does not
        if (pick) {
          fire('3.3.108 vt.2', '✔', 2, `${root}: the dhātu ${pick.d.aupadeshik} ${pick.d.artha} (gaṇa ${pick.d.gana})`, `a dhātu may be named by its इक् or श्तिप् form (इक्श्तिपौ धातुनिर्देशे); the vṛtti names it by the श्तिप् form ${pick.p} → ${pick.abl}${hit.length === 1 && opts.length > 1 ? ' — the Kāśikā’s choice among ' + opts.length + ' roots of this shape' : ''}`);
          st.snap('3.3.108 vt.2', `${root} = ${pick.d.aupadeshik} ${pick.d.artha} (dhātupāṭha, gaṇa ${pick.d.gana}); a dhātu may be named by its इक् or श्तिप् form (इक्श्तिपौ धातुनिर्देशे); the vṛtti uses the श्तिप् form ${pick.p} → “${pick.abl}”`);
          (rec.dhatus = rec.dhatus || []).push({ w: root, up: pick.d.aupadeshik, artha: pick.d.artha, gana: pick.d.gana, shtip: pick.p, abl: pick.abl, src, kvUses, skUses, keepDh });
        } else {
          fire('3.3.108 vt.2', '?', 2, `${root}: ${opts.length} roots of this shape in the dhātupāṭha (${opts.map(o => o.d.aupadeshik + ' ' + o.d.artha).join('; ')})`, 'the sūtra does not say which; the vṛttis name the one meant by its श्तिप् form');
          st.snap('3.3.108 vt.2', `${root}: ${opts.length} dhātus of this shape (${opts.map(o => o.d.aupadeshik + ' → ' + o.p).join(', ')}); which one is meant is not settled here`);
        }
      }
    });
  }
  // Kāśikā / Kaumudī style name the dhātus by their श्तिप् form (सुयजोः धातोः → सुनोतेः यजतेः च), when every dhātu of the word is identified
  if (!HAND[rec.n] && rec.dhatus && rec.dhatus.length && rec.gen) {
    for (const w of words) {
      const roots = [...new Set(w.lex.filter(l => l && l.kind === 'dhatu').flatMap(l => [].concat(l.parts || l.root || w.form)).flatMap(x => String(x).split(',')).map(x => x.trim()).filter(Boolean))];
      if (w.wcase === 1) continue;
      // only where the Kāśikā (for our Kāśikā style) / the Kaumudī (for our Kaumudī style) itself names the dhātu so
      const dsFor = key => { const ds = roots.map(r => rec.dhatus.find(d => d.w === r && d[key])).filter(Boolean); return ds.length && ds.length === roots.length ? ds : null; };
      const sub = (arr, ds, keep) => { if (!arr || !ds) return arr; const i = arr.findIndex(t => t === w.form || t === w.form.replace(/-/g, ' ') || t === w.form.replace(/-/g, '')); if (i < 0) return arr; const rep = ds.map(d => d.abl).concat(ds.length > 1 ? ['च'] : []); const out = arr.slice(); out.splice(i, out[i + 1] === 'धातोः' && !keep ? 2 : 1, ...rep); return out; };
      const dG = dsFor('kvUses'), dK = dsFor('skUses');
      const tG = sub(rec._tG, dG, dG && dG.every(d => d.keepDh)), tK = sub(rec._tK, dK, false);
      if (tG && tG !== rec._tG) { rec._tG = tG; rec.gen = join(tG); }
      if (tK && tK !== rec._tK) { rec._tK = tK; rec.genK = joinFull(tK); }
    }
  }
  // 3.1.92 तत्रोपपदं सप्तमीस्थम् is CONSIDERED for every 7th-case word in the dhātu section; where the word does not become an
  // upapada (a kāraka sense, a time, a meaning, a domain, what follows), the step says so — evaluated, not applicable (Harsha 2026-11-15)
  // Harsha 2026-11-16: a paribhāṣā the engine would mark “not applicable” is APPLIED when the नैलेश-वृत्तिः or the Kāśikā reads the word that
  // way (8.4.56 सूत्रार्थ “अवसाने परे”; 3.4.38 Kāśikā “करण उपपदे”). The class text gets the word; the Kāśikā-style text only if the Kāśikā has it.
  const refAgree = (f, tail, gap = true) => { if (/^(छन्दसि|संज्ञायाम्|संहितायाम्|भाषायाम्|असंज्ञायाम्|यजुषि|गोत्रे)$/.test(f)) return null; const st = f.replace(/-/g, '').replace(/(े|ि|ौ|ायाम्|याम्|सु|षु|ोः|योः)$/, ''); if (st.length < 2) return null;
    const re = new RegExp(`(?<![ऀ-ॿ])${ESC1(st)}${gap ? '\\S*' : '(?:\\S{0,5}|\\S{0,2}शब्दे)'}\\s+${gap ? '(\\S+\\s+)?' : ''}(${tail})`), sa = OTHER(rec, id).map(x => x[1]).join(' '), kv = (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '');
    const inSA = re.test(sa), inKV = re.test(kv); return inSA || inKV ? { inSA, inKV, by: [inSA ? otherBy(rec, id, re) : '', inKV ? 'Kāśikā' : ''].filter(Boolean).join(' and ') } : null; };
  const applyAgree = (f, wC, wK) => { const pl = f.replace(/-/g, ' '); const ins = (arr, w) => { if (!arr) return arr; const i = arr.findIndex(x => x === pl || x === f || x === f.replace(/-/g, '')); if (i >= 0 && arr[i + 1] !== w) { arr.splice(i + 1, 0, w); if (/^(गम्यमाने|अभिधेये)$/.test(arr[i + 2] || '')) arr.splice(i + 2, 1); } return arr; };
    const tc = rec.genC.split(' '); const j = tc.findIndex(x => x === f.replace(/-/g, '') || x === f);
    if (wC === 'उपपदे' && tc.includes('उपपदे')) return () => {};   // another word already stands as the upapada (हस्ते … करणे): the 7th only qualifies it
    if (j >= 0 && tc[j + 1] !== wC) { tc.splice(j + 1, 0, wC); if (/^(गम्यमाने|अभिधेये)$/.test(tc[j + 2] || '')) tc.splice(j + 2, 1); rec.genC = tc.join(' '); } else if (j < 0) { rec.genC = [pl, wC, ...tc].join(' '); if (rec._tG) rec._tG.unshift(pl, wC === 'परे' ? 'परतः' : wC); }
    return ins; };
  if (!HAND[rec.n] && rec.genC && idn >= 31091 && idn <= 34117 && rec.steps) {
    const ss = [...words.filter(w => w.wcase === 7).map(w => ({ f: w.form, own: true })), ...an.concat(ad).filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 7).map(c => ({ f: c.w, own: false, from: c.from }))];
    const seen7 = new Set(), last = () => rec.steps.length ? rec.steps[rec.steps.length - 1].now : '';
    for (const x of ss) {
      if (seen7.has(x.f) || x.f === 'अन्यतरस्याम्') continue; seen7.add(x.f);
      const ff = x.f.replace(/-/g, ' '), plain0 = x.f.replace(/-/g, '');
      const isUp = new RegExp(`(${ESC1(ff)}|${ESC1(plain0)})\\S*\\s+(\\S+\\s+)?(\\S+\\s+)?(उपपदे|उपपदयोः|उपपदेषु)`).test(rec.genC) || (/सुपि|कर्मणि/.test(x.f) && /उपपद/.test(rec.genC) && rec.genC.includes(x.f === 'सुपि' ? 'सुबन्ते' : 'कर्मणि'));
      if (isUp) continue;
      const L = LEX[x.f] || {};
      const KAR7 = /^(कर्तरि|करणे|अधिकरणे|भावे|सम्प्रदाने|अपादाने|करणाधिकरणयोः|भावकर्मणोः|अकर्तरि च कारके संज्ञायाम्|अकर्तरि|कारके)$/;
      const why = KAR7.test(x.f) ? 'it names the kāraka sense the suffix expresses, not a word standing nearby'
        : /^(वर्तमाने|भूते|भविष्यति|अनद्यतने|परोक्षे|आशिषि|लिङि|लुङि|लङि|लिटि|लटि|लृटि|लुटि|लोटि|लेटि|लृङि)$/.test(x.f) ? 'it names the time / the lakāra, not a word standing nearby'
        : /^(छन्दसि|संज्ञायाम्|भाषायाम्|असंज्ञायाम्)$/.test(x.f) ? 'it names the domain of usage'
        : L.kind === 'nimitta' ? 'it names what FOLLOWS (1.1.66), not a word standing nearby'
        : /गम्यमाने|अभिधेये|वर्तमाने|विषये/.test(rec.genC.slice(rec.genC.indexOf(plain0))) && rec.genC.includes(plain0) ? 'it states a meaning or circumstance (“… गम्यमाने”), not a word standing nearby'
        : null;
      if (!why) continue;
      { const ag = refAgree(x.f, 'उपपदे|उपपदयोः|उपपदेषु'); const hadUp = / उपपदे( |$)/.test(' ' + rec.genC); if (ag) { const ins = applyAgree(x.f, 'उपपदे'); if (ag.inKV && rec._tG) { ins(rec._tG, 'उपपदे'); rec.gen = join(rec._tG); }
        fire('3.1.92', '✔', 2, `${x.f}${x.own ? '' : ' (carried over)'}: a 7th case in the dhātu section`, `an upapada — the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it so`);
        rec.steps.splice(rec.steps.findIndex(s => s.fin) >= 0 ? rec.steps.findIndex(s => s.fin) : rec.steps.length, 0, { pids: ['3.1.92'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 7th case in the dhātu section → ${hadUp ? 'describes the upapada' : 'an upapada'} (3.1.92), as the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it`, now: rec.genC }); continue; } }
      fire('3.1.92', '✖', 2, `${x.f}${x.own ? '' : ' (carried over' + (x.from ? ' from ' + x.from : '') + ')'}: a 7th case in the dhātu section`, `not an upapada — ${why}`);
      rec.steps.splice(rec.steps.findIndex(s => s.fin) >= 0 ? rec.steps.findIndex(s => s.fin) : rec.steps.length, 0, { pids: [], no: ['3.1.92'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 7th case in the dhātu section → is it an upapada (3.1.92)? No — ${why}`, now: (rec.steps.filter(s => !s.fin).pop() || {}).now || last() });
    }
  }
  // a 7th-case word the templates leave without “परे” although the नैलेश-वृत्तिः or the Kāśikā reads it “X परे / परतः”: 1.1.66 applies (Harsha 2026-11-16)
  if (!HAND[rec.n] && rec.genC && rec.steps && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(rec.kind)) {
    const ss = [...words.filter(w => w.wcase === 7).map(w => ({ f: w.form, own: true })), ...an.concat(ad).filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 7).map(c => ({ f: c.w, own: false }))];
    const seen = new Set();
    for (const x of ss) { if (seen.has(x.f)) continue; seen.add(x.f); const pl = x.f.replace(/-/g, '');
      if (new RegExp(`${ESC1(pl)}\\S*\\s+(प्रत्यये\\s+)?(परे|परतः)`).test(rec.genC.replace(/-/g, ''))) continue;
      if (P.some(p => p.pid === '1.1.66' && p.status === '✔' && (p.trigger || '').startsWith(x.f))) continue;
      const ag = refAgree(x.f, 'परे|परतः|परतो|परत', false); if (!ag) continue;
      const ins = applyAgree(x.f, 'परे'); if (ag.inKV && rec._tG) { ins(rec._tG, 'परतः'); rec.gen = join(rec._tG); }
      fire('1.1.66', '✔', 2, `${x.f}${x.own ? '' : ' (carried over)'}: a 7th case`, `names what follows — the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it so`);
      const fi = rec.steps.findIndex(s => s.fin); rec.steps.splice(fi >= 0 ? fi : rec.steps.length, 0, { pids: ['1.1.66'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 7th case → names what follows (1.1.66), as the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it`, now: rec.genC }); }
  }
  // likewise a 5th-case word read “X उत्तरस्य / परस्य” by the नैलेश-वृत्तिः or the Kāśikā: 1.1.67 (PV/Kāśikā 6.1.166 “तिसृभ्य उत्तरस्य”)
  if (!HAND[rec.n] && rec.genC && rec.steps && !/^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā|vidhi|nipātana)$/.test(rec.kind) && !P.some(p => p.pid === '1.1.67' && p.status === '✔' && p.layer !== 1)) {
    // a 6th that can only be a 5th (तिसृभ्यः: the data says 6th, -भ्यः has no 6th) counts as a 5th; a 6th dual the references read as a 5th
    // (“धेट्श्विभ्यां / एताभ्याम् उत्तरस्य”) becomes the 5th dual — षष्ठी in the sense of the पञ्चमी
    const d6 = words.filter(w => w.wcase === 6 && /योः$/.test(w.form) && !w.lex.some(l => l && ['upasarga'].includes(l.kind)));
    for (const w of d6) { const wi = words.indexOf(w), ap = AUTO[id] && AUTO[id][wi] && AUTO[id][wi][w.segs.length - 1], stm = ap && ap.stem || w.segs[w.segs.length - 1].replace(/्योः$/, 'ि').replace(/्वोः$/, 'ु').replace(/^.*[^ि]$|^.*[^ु]$/, m => /[िु]$/.test(m) ? m : ''); const ls = w.segs[w.segs.length - 1]; if (!stm || ![stm.replace(/ि$/, '्योः'), stm.replace(/ु$/, '्वोः'), stm + 'योः', stm.replace(/्$/, 'ोः')].includes(ls) || /्$/.test(stm) && !/[टडतदपबकग]्$/.test(stm)) continue;
      const sa = OTHER(rec, id).map(x => x[1]).join(' '), kv = (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, ''), re = /(भ्याम्|भ्यां)\s*(धातुभ्याम्|धातुभ्यां|प्रातिपदिकाभ्याम्)?\s*([उु]त्तरस्य|परस्य)/;
      const inSA = re.test(sa), inKV = re.test(kv); if (!inSA && !inKV) continue;
      const VD = { 'ट्': 'ड्', 'त्': 'द्', 'प्': 'ब्', 'क्': 'ग्' }, f5 = [...w.segs.slice(0, -1), stm.replace(/[टतपक]्$/, c => VD[c]) + 'भ्याम्'].join('-');
      const tc = rec.genC.split(' '), j = tc.findIndex(t => t === w.form || t === w.form.replace(/-/g, '')); if (j < 0 || /^(उत्तरस्य|परस्य)$/.test(tc[j + 1] || '')) continue;
      tc.splice(j, 1, f5, 'उत्तरस्य'); rec.genC = tc.join(' ');
      const by = [inSA ? otherBy(rec, id, re) : '', inKV ? 'Kāśikā' : ''].filter(Boolean).join(' and ');
      fire('1.1.67', '✔', 2, `${w.form}: a 6th read as the 5th (${f5})`, `on what FOLLOWS — the ${by} read${inSA && inKV ? '' : 's'} it so`);
      const fi = rec.steps.findIndex(s => s.fin); rec.steps.splice(fi >= 0 ? fi : rec.steps.length, 0, { pids: ['1.1.67'], what: `${w.form}: the 6th stands for the 5th (${f5}) → on what follows it (1.1.67, “… उत्तरस्य”), as the ${by} read${inSA && inKV ? '' : 's'} it`, now: rec.genC }); }
    const ss = [...words.filter(w => (w.wcase === 5 || w.wcase === 6 && /भ्यः$/.test(w.form)) && !w.lex.some(l => l && ['upasarga'].includes(l.kind)) && (!w.lex.some(l => l && l.kind === 'dhatu') || /-/.test(w.form) || /भ्यः$/.test(w.form))).map(w => ({ f: w.form, own: true, dh: w.lex.some(l => l && l.kind === 'dhatu') })), ...an.filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 5 && !/^(धातोः|पदात्|अङ्गात्)$/.test(c.w)).map(c => ({ f: c.w, own: false }))];
    for (const x of ss) { const pl = x.f.replace(/-/g, '');
      if (new RegExp(`${ESC1(pl)}\\S*\\s+(उत्तरस्य|परस्य)`).test(rec.genC.replace(/-/g, ''))) continue;
      const st5 = pl.replace(/(भ्यः|भ्याम्|ात्|ोः|ः)$/, '').replace(/े$/, 'ि'); if (st5.length < 2) continue;
      const re = new RegExp(`(?<![ऀ-ॿ])${ESC1(st5)}(\\S*\\s+(?:(?:उपसर्गात्|शब्दात्|धातोः|ततः|तस्मात्|प्रातिपदिकात्)\\s+)?(उत्तरस्य|परस्य)|\\S{0,5}?(ाद|द|भ्य)[उु]त्तरस्य)`), sa = OTHER(rec, id).map(x => x[1]).join(' '), kv = (rec.kv || (inRange ? '' : kashikaVrttiX(id)) || '').replace(/-/g, '');
      // a list in the 5th that the references close with “इत्येतेभ्य उत्तरस्य” (PV/Kāśikā 2.4.78, 7.2.59, 6.2.162)
      const reL = /(इत्येतेभ्य|एतेभ्य|इत्येताभ्या|एताभ्या|धातुभ्य)\S*\s*([उु]त्तरस्य|परस्य)/, isList = x.own && (/-/.test(x.f) || /भ्यः$/.test(x.f));
      let inSA = !x.dh && re.test(sa), inKV = !x.dh && re.test(kv); if (!inSA && !inKV && isList) { inSA = reL.test(sa); inKV = reL.test(kv); }
      if (!inSA && !inKV) continue;
      const tc = rec.genC.split(' '), segsT = x.f.split('-'); let j = tc.findIndex(t => t === pl || t === x.f.replace(/-/g, ' ') || t === x.f);
      if (j < 0 && segsT.length > 1) { const k = tc.findIndex((t, i) => segsT.every((g, y) => tc[i + y] === g)); if (k >= 0) j = k + segsT.length - 1; }
      if (j < 0) continue;
      const viaL = !(re.test(sa) || re.test(kv)) && segsT.length > 1 && tc[j] === segsT[segsT.length - 1];
      tc.splice(j + 1, 0, ...(viaL ? [segsT.length === 2 ? 'इत्येताभ्याम्' : 'इत्येतेभ्यः', 'उत्तरस्य'] : ['उत्तरस्य'])); rec.genC = tc.join(' ');
      if (inKV && rec._tG) { const i = rec._tG.findIndex(t => t === pl || t === x.f.replace(/-/g, ' ')); if (i >= 0) { rec._tG.splice(i + 1, 0, 'उत्तरस्य'); rec.gen = join(rec._tG); } }
      const by = [inSA ? (otherBy(rec, id, re) || otherBy(rec, id, reL)) : '', inKV ? 'Kāśikā' : ''].filter(Boolean).join(' and ');
      fire('1.1.67', '✔', 2, `${x.f}${x.own ? '' : ' (carried over)'}: 5th case`, `on what FOLLOWS it — the ${by} read${inSA && inKV ? '' : 's'} it so`);
      const fi = rec.steps.findIndex(s => s.fin); rec.steps.splice(fi >= 0 ? fi : rec.steps.length, 0, { pids: ['1.1.67'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 5th case → on what follows it (1.1.67, “… उत्तरस्य”), as the ${by} read${inSA && inKV ? '' : 's'} it`, now: rec.genC }); break; }
  }
  // 1.1.66 तस्मिन्निति निर्दिष्टे पूर्वस्य is considered for every 7th-case word of an operation rule (6.1 ff.); a 7th that names a
  // domain (छन्दसि, संहितायाम्) or a meaning does not name “what follows” — evaluated, not applicable
  if (!HAND[rec.n] && rec.genC && idn >= 61001 && rec.steps && !/^(svara|atideśa|adhikāra|nipātana)$/.test(rec.kind)) {
    const ss = [...words.filter(w => w.wcase === 7).map(w => ({ f: w.form, own: true })), ...an.concat(ad).filter(c => !SILENT[c.w] && (autoOf(sid(c.from), c.w) || {}).cs === 7).map(c => ({ f: c.w, own: false, from: c.from }))];
    const seen7 = new Set();
    for (const x of ss) {
      if (seen7.has(x.f) || x.f === 'अन्यतरस्याम्') continue; seen7.add(x.f);
      const pl = x.f.replace(/-/g, '');
      if (new RegExp(`${ESC1(pl)}\\S*\\s+(प्रत्यये\\s+)?(परे|परतः|उत्तरपदे)`).test(rec.genC.replace(/-/g, ''))) continue;   // applied
      const why = /^(छन्दसि|संज्ञायाम्|संहितायाम्|भाषायाम्|असंज्ञायाम्|यजुषि|गोत्रे)$/.test(x.f) ? 'it names the domain in which the rule holds'
        : /^(पदान्ते|अवसाने|उपदेशे|अपदान्ते)$/.test(x.f) ? 'it names a position or stage, not a sound or suffix that follows'
        : rec.genC.includes(pl + ' गम्यमाने') || rec.genC.includes(pl + ' अभिधेये') || MEANING7.test(x.f.replace(/(े|ि|ायाम्)$/, '')) ? 'it states a meaning or circumstance'
        : null;
      if (!why) continue;
      { const ag = refAgree(x.f, 'परे|परतः|परतो|परत', false); if (ag) { const ins = applyAgree(x.f, 'परे'); if (ag.inKV && rec._tG) { ins(rec._tG, 'परतः'); rec.gen = join(rec._tG); }
        fire('1.1.66', '✔', 2, `${x.f}${x.own ? '' : ' (carried over)'}: a 7th case`, `names what follows — the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it so`);
        const fi2 = rec.steps.findIndex(s => s.fin); rec.steps.splice(fi2 >= 0 ? fi2 : rec.steps.length, 0, { pids: ['1.1.66'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 7th case → names what follows (1.1.66), as the ${ag.by} read${ag.inSA && ag.inKV ? '' : 's'} it`, now: rec.genC }); continue; } }
      fire('1.1.66', '✖', 2, `${x.f}${x.own ? '' : ' (carried over)'}: a 7th case`, `not “what follows” — ${why}`);
      const fi = rec.steps.findIndex(s => s.fin);
      rec.steps.splice(fi >= 0 ? fi : rec.steps.length, 0, { pids: [], no: ['1.1.66'], what: `${x.f}${x.own ? '' : ' (carried over)'}: 7th case → does it name what follows (1.1.66)? No — ${why}`, now: (rec.steps.filter(s => !s.fin).pop() || {}).now || '' });
    }
  }
  // hand-written vṛttis for the definitional sūtras (handwritten.json): they replace whatever the templates produced
  if (HAND[rec.n]) {
    const H = HAND[rec.n], toks = H.c.split(' ');
    rec.hand = true; rec.error = undefined; rec.P.length = 0; rec.notes = rec.notes.filter(x => !/^\?/.test(x));
    rec.genC = H.c; rec.gen = join(toks); rec.genK = joinFull(rec._tK = toks.map(t => t === 'भवति' ? 'स्यात्' : t === 'भवन्ति' ? 'स्युः' : t)); rec._tG = toks;
    rec.steps = [{ pids: [], what: 'the sūtra’s own words', now: rec.s }, ...H.steps.map(([pid, what, now]) => ({ pids: pid ? pid.split(',') : [], what, now })), { pids: [], what: 'hand-written vṛtti (class style), from the prathamāvṛtti and the Kāśikā', now: H.c, fin: true }];
    H.steps.forEach(([pid, what]) => { if (pid) pid.split(',').forEach(p => fire(p, '✔', 2, rec.n, what)); });
    // student view for the hand-written sūtras too (Harsha 2026-11-17: "why is 1.1.3 not showing the student view?"): each hand step
    // already names the rule that supplies its words and says why — one card per step, the rule's own text from the data
    const VIBh = ['अव्ययम्', 'प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी'], VACh = { 1: 'एकवचनम्', 2: 'द्विवचनम्', 3: 'बहुवचनम्' };
    const pbTextH = pid => /^PIS /.test(pid) ? (PIS[pid.slice(4)] || '') : ((BYID[sid(pid)] || {}).s || '');
    rec.why = { kind: { 'paribhāṣā': 'परिभाषा — tells how to read other rules', 'saṃjñā': 'संज्ञासूत्रम् — gives a technical name', 'adhikāra': 'अधिकारः — a heading', 'atideśa': 'अतिदेशः — extends a property' }[String(rec.kind).replace('*', '')] || String(rec.kind || ''),
      pc: (rec.words || []).map(w => ({ f: w.form, v: w.wcase ? (w.lupta ? 'लुप्त' : '') + VIBh[w.wcase] + (VACh[w.num] ? ' ' + VACh[w.num] : '') : 'अव्ययम्' })), hand: true,
      cards: H.steps.map(([pid, what, now], i) => ({ q: ['', `step ${i + 1}`], role: 'step', word: '', own: true, vib: '', ans: now,
        why: (pid ? pid.split(',') : []).map(p => ({ t: 'pb', pid: p, txt: what, pt: pbTextH(p) })).concat(pid ? [] : [{ t: 'case', txt: what }]), no: [], ev: null })),
      silent: [], left: [], fin: H.c, note: H.note || 'This vṛtti is hand-written from the prathamāvṛtti and the Kāśikā (a definitional sūtra the generator does not template).' };
  }
  injected.forEach(k => delete LEX[k]);
  overridden.reverse().forEach(([k, v]) => { if (v === undefined) delete LEX[k]; else LEX[k] = v; });
}

// ───────────────────────── 3.1.94: utsarga / apavāda / sarūpa (computed) ─────────────────────────
// general (utsarga) rules of the kṛtya section: base classes with no extra condition
const general = RES.filter(r => r.kind === 'vidhi' && r.base && !r.base.conds.length && !r.base.option && !r.base.dhatus.length && !r.base.upadha.length);
const dhatuFinal = r => finalSound(r);
const classOf = d => { const f = dhatuFinal(d); return { hal: f === 'hal', ac: f !== 'hal', r: f === 'ऋ' || f === 'ॠ', u: f === 'उ' || f === 'ऊ' }; };
function generalsFor(rec) {
  // which general rules would otherwise apply in rec's domain
  const out = [];
  const add = (g, why) => { if (g && g.id !== rec.id && !out.some(o => o.g.id === g.id)) out.push({ g, why }); };
  const G = n => general.find(g => g.n === n);
  const all = G('3.1.96');
  const domain = [];
  if (rec.base.dhatus.length) rec.base.dhatus.forEach(d => domain.push({ d, cls: classOf(d) }));
  if (rec.base.sounds.includes('अच्')) domain.push({ d: 'अजन्त', cls: { ac: true } });
  if (rec.base.sounds.includes('पु') || rec.base.upadha.length) domain.push({ d: rec.base.sounds.includes('पु') ? 'पवर्गान्त' : 'उपधा-rule', cls: { hal: true } });
  if (rec.base.sounds.includes('ऋ') || rec.base.sounds.includes('हल्')) domain.push({ d: 'ऋ/हल्-अन्त', cls: { hal: true } });
  if (rec.base.sounds.includes('उ')) domain.push({ d: 'उवर्णान्त', cls: { ac: true, u: true } });
  if (!domain.length) return out;
  if (all && rec.n !== '3.1.96') add(all, 'all dhātus');
  for (const { d, cls } of domain) {
    if (rec.n === '3.1.97' || rec.n === '3.1.124') continue;
    if (cls.ac && !cls.r) add(G('3.1.97'), d + ': ends in a vowel');
    if (cls.hal || cls.r) add(G('3.1.124'), d + (cls.r ? ': ends in ऋ' : ': ends in a consonant'));
  }
  return out;
}
const STRI = [33094, 33112];
for (const r of RES) {
  if (r.kind !== 'vidhi' || !r.base || !r.suffixes || !r.suffixes.length) continue;
  if (+r.id < 31091 || +r.id > 34117) continue;   // 3.1.94 holds only in the dhātu adhikāra (Kāśikā: “अस्मिन् धात्वधिकारे”); not for vikaraṇas/sanādi (3.1.1–90) or strī/taddhita suffixes
  const inStri = +r.id >= STRI[0] && +r.id <= STRI[1];
  for (const { g, why } of generalsFor(r)) {
    for (const X of r.suffixes) {
      const Ys = (g.suffixes || []).filter(Y => Y !== X); if (!Ys.length) continue;
      const dx = KRUT[X], sar = Ys.filter(Y => KRUT[Y] === dx), asar = Ys.filter(Y => KRUT[Y] !== dx);
      const show = Y => `${Y} (${KRUT[Y]})`;
      if (asar.length) r.P.push({ pid: '3.1.94', status: inStri ? '✖' : '✔', layer: 2, trigger: `${X} is an apavāda of ${asar.join(', ')} (${g.n}; ${why})`, effect: inStri ? `strī section: ${X} always blocks them` : `${X} (${dx}) ≠ ${asar.map(show).join(', ')} → they stay available as options` });
      if (sar.length) {
        r.P.push({ pid: '3.1.94', status: '✖', layer: 2, trigger: `${X} is an apavāda of ${sar.join(', ')} (${g.n}; ${why})`, effect: `${X} (${dx}) and ${sar.map(show).join(', ')} look the same → ${X} always blocks ${sar.join(', ')}` });
        if (!r.P.find(p => p.pid === 'PIS 8')) r.P.push({ pid: 'PIS 8', status: '✔', layer: 2, trigger: `${X} vs ${sar.join(', ')}`, effect: 'markers removed before comparing' });
      }
    }
  }
}

// ───────────────────────── verdicts ─────────────────────────
const sk = s => strip(s).replace(/[।॥,]/g, '');
for (const r of RES) {
  if (!r.gen) { r.verdict = 'n/a'; continue; }
  const kvCore = r.kv.replace(/^[^,]*(?:षष्ठी|वर्तते|इति च),\s*/, '');
  if (sk(r.gen) === sk(kvCore)) { r.verdict = 'exact'; continue; }
  // content probes: every content word of our vṛtti must be in the Kāśikā sentence (sandhi-insensitive stem)
  const stemify = w => strip(w).replace(/[ःंॆ्]$/g, '').replace(/(ात्|ाद्|ाच्|ोः|ेः|ाः|ौ|ः|म्|ं|े|ो|र्)$/, '').replace(/[ःं्]/g, '');
  const kk = strip(r.kv.replace(/ऽ/g, 'अ')).replace(/[।॥,]/g, '').replace(/[ःं्]/g, '');
  const skip = new Set(['इति', 'इत्येते', 'शब्दाः', 'प्रत्ययः', 'प्रत्ययाः', 'भवति', 'भवन्ति', 'च', 'धातोः', 'धातुभ्यः', 'इत्येतेभ्यः', 'इत्येतयोः', 'धात्वोः', 'विषये', 'अभिधेये', 'इत्येतेषु', 'अर्थेषु', 'चेत्', 'निपात्यते', 'निपात्यन्ते', 'चकारात्', 'उपपदे']);
  if (r.carriedLoc) skip.add(r.carriedLoc);
  const toks = r.gen.replace(/,/g, ' ').split(/\s+/).flatMap(t => t.split('ऽ').map((x, i) => i ? 'अ' + x : x)).filter(t => t && !skip.has(t));
  const missing = toks.filter(t => { const s0 = stemify(t); return s0.length > 1 && !kk.includes(s0.slice(0, Math.max(2, s0.length - 1))); });
  r.missing = missing;
  r.verdict = missing.length ? 'differs' : 'same reading';
}

for (const r of RES) for (const p of r.P) if (p.quote) { const qs = p.quote; p.quote = qs.filter((q, i) => !qs.some((o, j) => j !== i && o.c === q.c && strip(o.q).includes(strip(q.q)) && (strip(o.q) !== strip(q.q) || j < i))); }
// hand review (review.json): v = style | gap | ours ; marked stale if the generated text has changed since
const REVIEW = fs.existsSync(path.join(__dirname, 'review.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'review.json'), 'utf8')) : {};
for (const r of RES) { const rv = REVIEW[r.n]; if (rv && r.verdict !== 'exact') r.review = Object.assign({}, rv, { stale: rv.gen !== r.gen }); }
for (const r of RES) { const rc = REVIEW['C:' + r.n]; if (rc) r.reviewC = Object.assign({}, rc, { stale: rc.gen !== r.genC }); }
for (const r of RES) { const rs = REVIEW['S:' + r.n]; if (rs) r.reviewS = Object.assign({}, rs, { stale: rs.gen !== r.genK }); }
// anuvṛtti-sahita sūtra line (the class's format): own words with case·number, carried words in brackets
const BR_SKIP = new Set(['कृत्', 'कृत्याः', 'तद्धिताः', 'आद्युदात्तश्च', 'समर्थानां प्रथमाद्वा', 'प्राग्दीव्यतोऽण्', 'आकडारात् एका संज्ञा', 'तत्र', 'असिद्धवदत्राभात्', 'अनुपसर्जनात्', 'तस्य', 'अपत्यम्']);
const CLASSKEY = fs.existsSync(path.join(__dirname, 'class-key.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'class-key.json'), 'utf8')) : {};
for (const r of RES) {
  for (const sp of r.superseded || []) { const c = r.carried.find(x => x.w === sp.w); if (c) { c.role = 'replaced by the sūtra’s own ' + sp.by; c.spoken = false; c.superseded = true; } }
  const own = r.words.map(w => `${w.form} (${w.lupta ? 'लुप्त·' + w.wcase + (w.num || '') : w.wcase ? '' + w.wcase + (w.num || '') : w.num ? 'लुप्त·' + w.num : 'अव्ययम्'})`).join(' ');   // लुप्त·1 = case 1, ending dropped (no number in the data)
  const car = r.carried.filter(c => !BR_SKIP.has(c.w) && !c.superseded).map(c => (c.w === 'ङ्याप्प्रातिपदिकात्' ? 'प्रातिपदिकात्' : c.w) + (c.code ? ` (${c.code})` : ''));   // carried words with their case·number too: [अपित् (11)]
  r.bracket = own + (car.length ? ' [' + car.join(', ') + ']' : '');
  r.pcLine = own;
  // which words make up each sandhi-joined word of OUR Kāśikā/Kaumudī-style text (for the comparison): align the joined text with the words it was built from
  const splitMap = (txt, toks) => { if (!txt || !toks) return null; const T = toks.filter(Boolean).flatMap(t => String(t).split(/[_\s]+/)).filter(Boolean); const out = {}; let i = 0;
    for (const w of txt.split(/\s+/)) { let acc = '', grp = []; for (let k = i; k < T.length && k < i + 6; k++) { grp.push(T[k]); acc = grp.length === 1 ? T[k] : SS.sandhiJoin(acc, T[k]); const nj = x => SS.normalize(x).replace(/[\s‌‍ऽ']/g, ''); if (nj(acc) === nj(w) || nj(acc).replace(/[ःं्]$/, '') === nj(w).replace(/[ःं्]$/, '')) { if (grp.length > 1) out[w.replace(/[।॥,;()'"]/g, '')] = grp.join(' + '); i = k + 1; break; } } }
    return Object.keys(out).length ? out : null; };
  try { r.spG = splitMap(r.gen, r._tG); r.spK = splitMap(r.genK, r._tK); } catch (e) { }
  delete r._tG; delete r._tK;   // the पदच्छेद, from the ashtadhyayi.com data, in the class's (11) notation
  if (CLASSKEY[r.n]) {
    r.ck = CLASSKEY[r.n];
    if (r.genC && r.ck.g && r.ck.g.length) {
      const norm = t => t.replace(/[\[\]()'।,]/g, ' ').replace(/[-/]/g, ' ').split(/\s+/).filter(Boolean).map(x => strip(x));
      const ours = norm(r.genC), theirs = norm(r.ck.g[r.ck.g.length - 1].t);
      r.ckDiff = { classOnly: theirs.filter(t => !ours.includes(t)), oursOnly: ours.filter(t => !theirs.includes(t)) };
    }
  }
  if (r.genK && r.sk) r.skExact = strip(r.genK).replace(/[।॥,]/g, '') === strip(r.sk).replace(/[।॥,]/g, '');
}
// soft agreement with the Kāśikā gloss (for tracking progress per section; not a verdict)
const EXQ = new Map();
const FUNC = new Set(['भवति', 'भवन्ति', 'भवतः', 'प्रत्ययः', 'प्रत्ययो', 'प्रत्यया', 'प्रत्ययौ', 'च', 'इति', 'इत्येते', 'इत्येतौ', 'इत्येतयोः', 'इत्येतेषु', 'इत्येतेभ्यः', 'धातोः', 'परतः', 'विषये', 'गम्यमाने', 'उपपदे', 'उपपदेषु', 'उपपदयोः', 'आदेशः', 'स्थाने', 'अस्माद्', 'एतेभ्यः', 'शब्दाः', 'शब्दौ', 'निपात्यते', 'निपात्यन्ते']);
const stemT = t => strip(t).replace(/[ःंऽ्]/g, '').replace(/(ात|ाद|ाच|ोः|ेः|ाः|ौ|ो|े|ं|र|स्य|स्या|ाय)$/, '');
for (const r of RES) {
  if (!r.gen || !r.kv) continue;
  const kv = r.kv.replace(/<<[^>]*>>/g, ' ').replace(/^[^,]*(?:वर्तते|इत्येव|अनुवर्तते),\s*/, '');
  const toks = t => t.replace(/[,।॥()\[\]]/g, ' ').split(/\s+/).filter(x => x && !FUNC.has(x)).map(stemT).filter(x => x.length > 1);
  const A = toks(r.gen), Bk = toks(kv), Bs = Bk.join('|'), As = A.join('|');
  const hitB = Bk.filter(x => As.includes(x.slice(0, Math.max(2, x.length - 1)))).length, hitA = A.filter(x => Bs.includes(x.slice(0, Math.max(2, x.length - 1)))).length;
  r.overlapOld = Bk.length && A.length ? Math.round(100 * (hitB / Bk.length + hitA / A.length) / 2) : 0;
  // sandhi-tolerant (the site's own search library): each content word of one text searched in the other
  const words = t => t.replace(/<<[^>]*>>/g, ' ').replace(/[,।॥()\[\]?]/g, ' ').split(/\s+/).filter(x => x && !FUNC.has(x) && x.replace(/[ःंऽ्]/g, '').length > 1);
  const bg = SS.prepBlock(r.gen), bk = SS.prepBlock(kv);
  const found = (blk, w) => { let ex = EXQ.get(w); if (!ex) { try { ex = SS.expandQuery(w, 'sandhi', true); } catch (e) { ex = null; } EXQ.set(w, ex); } return ex ? SS.matches(blk, ex) : false; };
  const wk = words(kv), wg = words(r.gen);
  const rk = wk.length ? wk.filter(w => found(bg, w)).length / wk.length : 0, rg = wg.length ? wg.filter(w => found(bk, w)).length / wg.length : 0;
  r.overlap = wk.length && wg.length ? Math.round(100 * (rk + rg) / 2) : 0;
}
// ── yardsticks (Harsha 2026-11-15): cover the paribhāṣās involved; compare with the simple vṛtti (ashtadhyayi.com sūtrārtha) — not Kāśikā word-overlap
const PBSET = new Set(Object.keys(PB).filter(k => /^\d/.test(k)));
for (const r of RES) {
  const sr = SUTRARTHA[r.id] || {};
  r.sa = (sr.sa || '').trim();
  const refs = [...new Set([...(sr.sd || '').matchAll(/\[\[(\d+)\.(\d+)\.(\d+)\]\]/g)].map(m => `${+m[1]}.${+m[2]}.${+m[3]}`))].filter(n => n !== r.n);
  const isPar = n => PBSET.has(n) || /^(P|AT)/.test((BYID[sid(n)] || {}).type || '');
  r.pbCited = refs.filter(isPar);
  // citations made only inside a worked derivation (a “→ …” step or a <pr> block) vs. in the explanation of the sūtra's own words
  { const sd = (sr.sd || '').replace(/<pr>[\s\S]*?<\/pr>/g, m => m.replace(/\[\[/g, '[[§'));
    const top = new Set(); for (const line of sd.split('\n')) { if (/^\s*→/.test(line)) continue; for (const m of line.matchAll(/\[\[(\d+)\.(\d+)\.(\d+)\]\]/g)) top.add(`${+m[1]}.${+m[2]}.${+m[3]}`); }
    r.pbCitedTop = r.pbCited.filter(n => top.has(n)); }
  const fired = new Set(r.P.filter(p => p.status !== '✖').map(p => p.pid));
  r.pbCovered = r.pbCited.filter(n => fired.has(n));
  r.pbMissing = r.pbCited.filter(n => !fired.has(n));
  if (r.sa && r.genC) {
    const words2 = t => t.replace(/<[^>]*>/g, ' ').replace(/[,।॥()\[\]?'‘’\-–]/g, ' ').split(/\s+/).filter(x => x && !FUNC.has(x) && x.replace(/[ःंऽ्]/g, '').length > 1);
    const bc = SS.prepBlock(r.genC), bs = SS.prepBlock(r.sa);
    const found2 = (blk, w) => { let ex = EXQ.get(w); if (!ex) { try { ex = SS.expandQuery(w, 'sandhi', true); } catch (e) { ex = null; } EXQ.set(w, ex); } return ex ? SS.matches(blk, ex) : false; };
    const ws = words2(r.sa), wc = words2(r.genC);
    r.overlapSA = ws.length && wc.length ? Math.round(100 * ((ws.filter(w => found2(bc, w)).length / ws.length) + (wc.filter(w => found2(bs, w)).length / wc.length)) / 2) : 0;
  }
}
// ── prathamāvṛtti (Harsha's print; OCR + Gemini reading, checked against Vision): simple vṛtti + anuvṛtti ranges
const PV = fs.existsSync(path.join(__dirname, 'prathama.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'prathama.json'), 'utf8')) : {};
const cmpN = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
const PVRANGE = [];   // {word, from, to}
for (const [n, e] of Object.entries(PV)) for (const a of e.anuv || []) PVRANGE.push({ word: a.word, from: n, to: a.to });
const PVKEYS = Object.keys(PV);
const PVMIS = fs.existsSync(path.join(__dirname, 'prathama-misprints.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'prathama-misprints.json'), 'utf8')) : {};
const PVABS = fs.existsSync(path.join(__dirname, 'prathama-absent.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'prathama-absent.json'), 'utf8')) : {};
for (const r of RES) {
  let e = PV[r.n]; if (!e) { if (PVABS[r.n]) r.pvAbsent = PVABS[r.n]; continue; }
  // word-level tie-break with the Vision OCR (prathama/arbitrate.js, blind re-reading of the page): applied choices only
  const AR = ARB[r.n] || {};
  if (AR.arthaCore && AR.arthaCore.ok && AR.arthaCore.before === (e.arthaCore || e.artha)) { e = Object.assign({}, e, { arthaCore: AR.arthaCore.after, artha: e.artha === e.arthaCore ? AR.arthaCore.after : e.artha }); }
  if (AR.samasa && AR.samasa.ok && AR.samasa.before === e.samasa) e = Object.assign({}, e, { samasa: AR.samasa.after });
  r.pv = { artha: e.arthaCore || e.artha, arthaFull: e.arthaCore && e.artha !== e.arthaCore ? e.artha : '', padaccheda: e.padaccheda, samasa: e.samasa, type: e.type, anuvritti: e.anuvritti, check: e.check, pages: e.pages, printed: (() => { const pr = PVNUM[r.n] || e.raw; return pr && pr !== r.n ? pr : ''; })(), misprints: PVMIS[r.n] || [], manual: !!e.manual, combinedWith: e.combinedWith || '', sutra: e.sutra };
  if (r.pv.artha && r.genC) {
    const words2 = t => t.replace(/[,।॥()\[\]?'‘’\-–=]/g, ' ').split(/\s+/).filter(x => x && !FUNC.has(x) && x.replace(/[ःंऽ्]/g, '').length > 1);
    const found2 = (blk, w) => { let ex = EXQ.get(w); if (!ex) { try { ex = SS.expandQuery(w, 'sandhi', true); } catch (er) { ex = null; } EXQ.set(w, ex); } return ex ? SS.matches(blk, ex) : false; };
    const bc = SS.prepBlock(r.genC), bp = SS.prepBlock(r.pv.artha), wp = words2(r.pv.artha), wc = words2(r.genC);
    r.overlapPV = wp.length && wc.length ? Math.round(100 * ((wp.filter(w => found2(bc, w)).length / wp.length) + (wc.filter(w => found2(bp, w)).length / wc.length)) / 2) : 0;
  }
  // anuvṛtti cross-check: words the prathamāvṛtti carries into this sūtra vs the data's anuvṛtti list
  const inc = PVRANGE.filter(x => cmpN(x.from, r.n) < 0 && cmpN(r.n, x.to) <= 0);
  if (PVKEYS.length > 20) {
    const dataAn = anFix(r.id, BYID[r.id].an || '').split('##').filter(Boolean).map(x => x.split('$')[0]);
    const pvWords = inc.filter(x => x.word !== '*').map(x => x.word.replace(/[ःम्]$/, ''));
    r.anuvCheck = { pvCarries: inc.map(x => `${x.word} (${x.from}→${x.to})`), dataOnly: dataAn.filter(w => !SILENT[w] && !pvWords.some(p => strip(w).startsWith(strip(p).slice(0, 3)))) };
  }
}
// ── ROLE TABLE (Harsha 2026-11-16: "do 1 through 3" — the role-table approach becomes the generator's front end). Where
//    rolepilot/roles.json has the sūtra (roles extracted from PV/KV/SA/SK with verified quotes), the class-style vṛtti and its
//    paribhāṣā steps come from those roles; the heuristic gloss stays as r.genHeur (and is the fallback where the table has no entry).
//    VG_NOROLES=1 rebuilds the old heuristic output.
{
  const RF = path.join(__dirname, 'rolepilot', 'roles.json'), ROLES = !process.env.VG_NOROLES && fs.existsSync(RF) ? JSON.parse(fs.readFileSync(RF, 'utf8')) : {};
  const RR = require('./rolepilot/render.js');
  const FBF = path.join(__dirname, 'rolepilot', 'fallback.json'), FALLBACK = fs.existsSync(FBF) ? (JSON.parse(fs.readFileSync(FBF, 'utf8')).fallback || {}) : {};
  const CLS = { case: 'derived from its case', tadanta: 'stands for what ends in it', tadadi: 'stands for what begins with it', carried: 'carried in (anuvṛtti / adhikāra)', vyakhyana: 'settled by the commentary' };
  let nRole = 0;
  for (const r of RES) {
    const s = ROLES[r.n]; if (!s || !r.genC || HAND[r.n] || (FALLBACK[r.n] && !RR.repairOn(r.n) && !HANDFIX[r.n])) continue;   // a fallback sūtra whose repair passed review is built from roles again   // a sūtra the blind review found wrong from roles but right before: keep the old gloss
    // sound names keep the old engine's expansion (1.1.1 आदैच् → “आ ऐ औ इति एतेषाम् वर्णानाम्”, by 1.1.70/1.1.71): the role table names
    // the word, the heuristic engine knows how a pratyāhāra / taparakaraṇa spells out
    { const mx = (r.genC || '').match(/^(.*?\S)\s+इति\s+(एतेषाम्|एतयोः|एतस्य)\s+(वर्णानाम्|वर्णयोः|वर्णस्य)/);
      if (mx) for (const x of s.roles || []) if (/^(samjni|sthani|qualifier|prakriti)$/.test(x.role) && (PRATYAHARA.has(String(x.word).replace(/[ःम्]$/, '').replace(/्?$/, '्')) || /त्/.test(x.word) || /(ैच्|ेङ्|ाच्)/.test(x.word)) && !/इति एते/.test(x.render || '')) { x.render = mx[0]; x._expanded = true; } }
    const d = RR.prep(r.n, s, r); if (!d.neu || /^\s*$/.test(d.neu)) continue;
    for (const x of d.roles) if (x._expanded) { if (/त्/.test(x.word) && !x.pb.includes('1.1.70')) x.pb.push('1.1.70'); if (!x.pb.includes('1.1.71')) x.pb.push('1.1.71'); }
    nRole++; const idn = +sid(r.n);
    r.genHeur = r.genC; r.kindHeur = r.kind; r.roleKind = d.kind; r.roles = d.roles; r.roleNote = d.note || ''; r.genSource = 'roles';
    const oldGen = r.gen, oldGenK = r.genK, sameAsOld = d.neu === r.genC;
    r.genC = d.neu;
    const toks = d.neu.split(' ').filter((t, i, a) => !(/^(परः|परौ|पराः)$/.test(t) && a[i + 1] === 'च') && !(t === 'च' && /^(परः|परौ|पराः)$/.test(a[i - 1])));
    r.gen = sameAsOld && oldGen ? oldGen : toks.some(t => /^[अआइईउऊऋॠऌएऐओऔ]३?$/.test(t)) ? toks.join(' ') : join(toks); r.genK = sameAsOld && oldGenK ? oldGenK : r.gen.replace(/भवति$/, 'स्यात्').replace(/भवतः$/, 'स्याताम्').replace(/भवन्ति$/, 'स्युः');
    // our paribhāṣā steps now come from the roles; the commentaries' own citations (layer 1) stay
    // keep EVERY paribhāṣā step the engine found (Harsha 2026-11-17: "make sure that nothing is lost") — sthānivat, ik-śtip, vibhāṣā,
    // alo'ntyasya, anuvṛtti … — and add what the roles show; a role-derived ✔ upgrades a ✖ for the same rule
    const P2 = (r.P || []).map(p => ({ ...p })), engineP = P2.filter(p => p.layer !== 1 && p.status === '✔');
    const add = (pid, st, trig, eff) => { if (!PB[pid] && !/^\d/.test(pid)) return; const ex = P2.find(p => p.pid === pid && p.layer !== 1); if (ex) { if (st === '✔' && ex.status !== '✔') Object.assign(ex, { status: '✔', trigger: trig, effect: eff }); return; } P2.push({ pid, status: st, layer: 2, trigger: trig, effect: eff }); };
    // a role-derived paribhāṣā must be ELIGIBLE where it is credited (Harsha 2026-11-16 domains): 3.1.92 only in 3.1.91–3.4.117; 4.1.82 only in
    // 4.1.82–5.2.140 — in the samāsa section the “समर्थ” is 2.1.1 समर्थः पदविधिः; 1.4.13's aṅga only from 3.1.1 on
    const elig = pid => pid === '3.1.92' ? idn >= 31091 && idn <= 34117 : pid === '4.1.82' ? idn >= 41082 && idn <= 52140 : pid === '1.4.13' ? idn >= 31001 : true;
    for (const x of d.roles) x.pb = x.pb.map(pid => pid === '4.1.82' && idn >= 21001 && idn <= 22038 ? '2.1.1' : pid).filter(elig);
    for (const x of d.roles) for (const pid of x.pb) add(pid, '✔', `${x.word}: ${x.role}`, `“${x.render}”`);
    if (d.yathasankhya) add('1.3.10', '✔', 'two lists', 'they pair up in order (यथासङ्ख्यम्)');
    // a vowel with त् after it (आत्, अत्, इत् …) in the sūtra: तपरस्तत्कालस्य — only that length (1.1.1 आत् = long आ only)
    for (const w of r.words || []) String(w.form).split('-').forEach((g, gi) => { if (!(/^[अआइईउऊऋॠऌएऐओऔ][तद]्$/.test(g) && (w.kinds || [])[gi] === 'varna') || d.roles.some(y => y.role === 'samjna' && String(y.word).replace(/-/g, '') === g)) return;   // a SOUND seg (आत्, ईत्), not the upasarga उद् or the saṃjñā इत् (1.3.2)   // the segment IS a vowel + त् (आत्, ईत्), not a word starting so (आत्ममाने, अत्यन्त)
      const v = g[0]; add('1.1.70', '✔', `${g}: ${v} with त् after it (तपर)`, `only the ${/[आईऊॠ]/.test(v) ? 'long' : 'short'} ${v}, not its other lengths`);
      const x = d.roles.find(y => String(y.word).replace(/-/g, '').includes(g.replace(/्$/, ''))) || d.roles.find(y => /samjni|sthani/.test(y.role)); if (x && !x.pb.includes('1.1.70')) x.pb.push('1.1.70'); });
    // considered and found NOT applicable (the eligible paribhāṣā a word's case would suggest, but the role says otherwise) — per word
    const noOf = x => { const no = [];
      if (x.wcase === 7 && /^(vishaya|artha|qualifier)$/.test(x.role)) { const head = x.role === 'qualifier' ? d.roles.find(y => y.role === 'nimitta' && y.wcase === 7) : null; const why66 = head ? `describes ${head.word} (the same thing, in the same case), not a separate thing that follows; 1.1.66 applies through ${head.word}` : `names a ${x.role === 'artha' ? 'meaning' : x.role === 'vishaya' ? 'domain' : 'qualification'}, not what follows`; add('1.1.66', '✖', `${x.word}: 7th case`, why66); no.push('1.1.66'); x._noWhy = (x._noWhy || []).concat(`1.1.66 not applicable: ${why66}`); }
      if (x.wcase === 7 && idn >= 31091 && idn <= 34117 && x.role !== 'upapada') { add('3.1.92', '✖', `${x.word}: 7th case`, `not an upapada — ${/^[aeiou]/.test(x.role) ? "an" : "a"} ${x.role}`); no.push('3.1.92'); x._noWhy = (x._noWhy || []).concat(`3.1.92 not applicable: not an upapada (${/^[aeiou]/.test(x.role) ? "an" : "a"} ${x.role})`); }
      if (x.wcase === 6 && !/^(sthani)$/.test(x.role) && x.source === 'own') { add('1.1.49', '✖', `${x.word}: 6th case`, `not the place — ${/^[aeiou]/.test(x.role) ? "an" : "a"} ${x.role}`); no.push('1.1.49'); x._noWhy = (x._noWhy || []).concat(`1.1.49 not applicable: not the place (${/^[aeiou]/.test(x.role) ? "an" : "a"} ${x.role})`); }
      return no; };
    r.P = P2;
    // steps in the old shape: the sūtra's words, then one step per word in the sūtra's order (its role, the phrase, the paribhāṣā that
    // applies, the ✖ ones considered), then the carried / supplied words, then the three prose-order styles
    const CLSs = { case: 'read from its case', tadanta: 'what ends in it', tadadi: 'what begins with it', carried: 'carried in', vyakhyana: 'settled by the commentary' };
    const REFN = { PV: 'प्रथमावृत्तिः', KV: 'काशिका', SA: 'नैलेश-वृत्तिः', SK: 'SK', LSK: 'LSK' };   // Harsha 2026-11-17: no abbreviation for the prathamāvṛtti; SK/LSK fine
    const ev = x => x.quote && x.verified ? ` · ${REFN[x.ref] || x.ref}: “${x.quote}”` : '';   // unverified quotes are not shown (review 2026-11-18)
    const RN0 = { samjna: 'the name', samjni: 'what is named', sthani: 'what is replaced', adesha: 'the substitute', pratyaya: 'the suffix', agama: 'the augment', nimitta: 'what follows', purva: 'what it comes after', prakriti: 'the base', vishaya: 'the domain', artha: 'the meaning', qualifier: 'describes', upapada: 'the word alongside (upapada)', samartha: 'the samartha word', option: 'option', negation: 'negation', accent: 'the accent', atidesha: 'treated like', nipatana: 'the stated form', acharya: 'in whose view', adhikara: 'heading', other: 'also said' };
    const RN = k => RN0[k] || k;   // plain labels in the steps, not the role-table keys (review 2026-11-18)
    const nrm = t => String(t || '').replace(/[-\s]/g, '');
    let cur = (r.words || []).map(w => w.form.replace(/-/g, ' ')), used = new Set();
    const steps = [{ pids: [], what: 'the sūtra’s own words', now: cur.join(' ') }];
    (r.words || []).forEach((w, i) => {
      const xs = d.roles.filter(x => !used.has(x) && (nrm(x.word) === nrm(w.form) || nrm(x.word) && nrm(w.form).includes(nrm(x.word)) && nrm(x.word).length > 1 && x.source === 'own'));
      if (!xs.length) { if (/^(च|तु|एव|अपि|इति|ह|वै)$/.test(w.form)) { cur[i] = ''; steps.push({ pids: [], what: (' ' + d.neu + ' ').includes(' ' + w.form + ' ') ? `${w.form}: a particle — kept in the vṛtti where it joins the parts` : `${w.form}: a particle — it joins the parts; the vṛtti does not need it as a word`, now: cur.filter(Boolean).join(' ') }); } return; }
      xs.forEach(x => used.add(x)); cur[i] = xs.map(x => x.render).join(' ');
      const no = [].concat(...xs.map(noOf));
      steps.push({ _w: [w.form, ...xs.map(x => x.word)], pids: [...new Set([].concat(...xs.map(x => x.pb)))], ...(no.length ? { no } : {}), what: xs.map(x => `${w.form} → ${RN(x.role)}: “${x.render}” (${CLSs[x.why] || x.why})${ev(x)}${x._noWhy ? ' — ' + x._noWhy.join('; ') : ''}`).join('; '), now: cur.filter(Boolean).join(' ') });
    });
    // an own role whose word the sandhi hides (आदैच् = आत्-ऐच्): the next sūtra word that got no role
    for (const x of d.roles.filter(x => !used.has(x) && x.source === 'own')) { const i = (r.words || []).findIndex((w, j) => cur[j] === w.form.replace(/-/g, ' ') && !/^(च|तु|एव|अपि|इति|ह|वै)$/.test(w.form)); if (i < 0) break;
      used.add(x); cur[i] = x.render; const no = noOf(x); const w = r.words[i];
      steps.splice(steps.length, 0, { _w: [w.form, x.word], pids: x.pb, ...(no.length ? { no } : {}), what: `${w.form} → ${RN(x.role)}: “${x.render}” (${CLSs[x.why] || x.why})${ev(x)}`, now: cur.filter(Boolean).join(' ') }); }
    const rest = d.roles.filter(x => !used.has(x));
    rest.forEach(x => { cur.push(x.render); const no = noOf(x);
      steps.push({ _w: [x.word], pids: x.pb, ...(no.length ? { no } : {}), what: `${x.word} (${String(x.source).replace('carried:', 'carried from ').replace('supplied:', 'supplied from ').replace('own', 'the sūtra')}) → ${RN(x.role)}: “${x.render}” (${CLSs[x.why] || x.why})${ev(x)}`, now: cur.filter(Boolean).join(' ') }); });
    const roleP = new Set([].concat(...d.roles.map(x => x.pb)));
    // a paribhāṣā only the engine found goes on the step of the word(s) it is about (Harsha 2026-11-17, on 1.1.6: separate trailing
    // steps that repeat the finished sentence explain nothing); its own step only when no word step matches. Internal labels dropped.
    const tidyE = t => String(t || '').replace(/\s*—?\s*\bclass \d+(\/\d+)*[;,]?\s*/g, ' ').replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
    for (const p of engineP.filter(p => !roleP.has(p.pid))) {
      const tr = nrm(p.trigger), trW = new Set(String(p.trigger || '').split(/[\s,;:()“”]+|\band\b/).map(nrm).filter(Boolean)), hits = steps.filter(st => st._w && st._w.some(w => trW.has(nrm(w)) || nrm(w).length > 1 && tr.includes(nrm(w))));
      const note = `${tidyE(p.trigger)} → ${tidyE(p.effect)}`;
      if (!hits.length) { steps.push({ pids: [p.pid], what: note, now: cur.filter(Boolean).join(' ') }); continue; }
      const last = hits[hits.length - 1];   // one explanation, on the last word it concerns; the paribhāṣā is credited on every one
      for (const st of hits) if (!st.pids.includes(p.pid)) st.pids = st.pids.concat(p.pid);
      last.what += ` — also: ${note}`; }
    for (const st of steps) { if (st._w) st.w = st._w; delete st._w; }   // st.w: the words a step is about — the merged student layout links steps to cards (2026-11-18)
    steps.push({ pids: [], what: 'assemble in prose order, everything spelled out (class style)', now: d.neu, fin: true },
      ...(r.gen === r.genK ? [{ pids: [], what: 'Kāśikā and Kaumudī style (the same here): leave out what is implied, apply sandhi', now: r.gen, fin: true }] : [{ pids: [], what: 'Kāśikā style: leave out what is implied (परः च), apply sandhi', now: r.gen, fin: true },
      { pids: [], what: 'Kaumudī style: स्यात् / स्युः for भवति', now: r.genK, fin: true }]));
    // points the commentaries settle that the steps alone would not explain (vyākhyāna) — shown as a step right after the sūtra's words
    const VNOTE = { '1.1.1': 'word order: the name (वृद्धिः) comes FIRST here, unlike the usual order (1.1.2 अदेङ् गुणः) — for auspiciousness at the start of the śāstra. Mahābhāṣya: “माङ्गलिक आचार्यो महतः शास्त्रौघस्य मङ्गलार्थं वृद्धिशब्दमादितः प्रयुङ्क्ते”; Padamañjarī: “इह तु महासंज्ञाकरणं मङ्गलार्थम्” (hence also a long name, not a short one like घि). Which word is the name is known not from position but “आचार्याचारादेव … अनाकृतिः संज्ञा, आकृतिमन्तः संज्ञिनः” (Mahābhāṣya): वृद्धि is the label used in later rules; आ ऐ औ are the things it names (settled by the commentary)' };
    // VNOTE is shown once, as the student view's note (review 2026-11-18: it was also a step that changed nothing)
    r.steps = steps;
    // ── STUDENT VIEW (Harsha 2026-11-17: "presenting the vṛtti steps with WHY, tailored for a student to understand what is happening
    // and how each paribhāṣā walks in"). One card per question the sūtra answers, in the order a class asks them; each card: the word,
    // its case, the answer phrase, and WHY it is read so — the paribhāṣā (its own text, from the data) explained for THIS word, or the
    // anuvṛtti, or the commentary that settles it. Engine-only paribhāṣās become notes on the word they concern; ✖ ones go in "why not".
    {
      const VIB = ['अव्ययम्', 'प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी'], VAC = { 1: 'एकवचनम्', 2: 'द्विवचनम्', 3: 'बहुवचनम्' };
      const pbText = pid => /^PIS /.test(pid) ? (PIS[pid.slice(4)] || '') : ((BYID[sid(pid)] || {}).s || '');
      const EXP = { '1.1.49': 'a word in the 6th case in a rule names WHAT IS REPLACED — so we read “… स्थाने”',
        '1.1.66': 'a word in the 7th case names what must FOLLOW — so we read “… परे”',
        '1.1.67': 'a word in the 5th case: the operation falls on what comes AFTER it — so we read “… उत्तरस्य / परस्य”',
        '1.1.72': 'a qualifier (viśeṣaṇa), agreeing with the word it qualifies (viśeṣya), stands for whatever ENDS in it — so we read “…-अन्त”; only the qualifier, never the qualified word (Nyāsa: “विशेषणेन चतदन्तविधिः [= च तदन्तविधिः], न विशेष्येण”)',
        'PIS 23': 'a suffix named in a rule stands for the word that ENDS in that suffix (starting from what it was added to)',
        'PIS 33': 'a SOUND (a letter, a pratyāhāra, or the augment इट् — not a suffix or a word) in the 7th case, qualifying a 7th-case condition, stands for what BEGINS with it — so we read “…-आदि” (an exception to tadanta-vidhi, 1.1.72)',
        '3.1.92': 'in the kṛt section a word in the 7th case is the UPAPADA, the word used alongside the dhātu',
        '1.4.13': 'what a suffix is added after is the AṄGA of that suffix',
        '4.1.82': 'a taddhita suffix goes after the first of the words able to take it, standing in the case the rule names',
        '1.1.70': 'a vowel with त् after it (तपर) means only that one length', '1.1.71': 'a pratyāhāra (first sound + an इत् letter) means every sound from the first up to the one before that इत्',
        '1.1.69': 'a vowel/अण् (or an उदित्) also stands for its savarṇas', '1.3.10': 'when two lists have the same number of members they pair up IN ORDER (yathāsaṅkhya)',
        '1.1.44': 'वा / विभाषा / अन्यतरस्याम् = OPTIONALLY', '1.3.11': 'words of an earlier sūtra run on into later ones (anuvṛtti / adhikāra)',
        '1.1.3': 'guṇa or vṛddhi named without a target replaces an इक् vowel', '1.1.52': 'a substitute replaces only the LAST sound', '1.1.53': 'a ङित् substitute replaces only the last sound',
        '1.1.54': 'a substitute for what follows replaces its FIRST sound', '1.1.55': 'a substitute of more than one sound (or शित्) replaces the WHOLE', '1.1.50': 'the substitute chosen is the NEAREST in articulation',
        '1.1.56': 'a substitute behaves like the original (except in a rule about single sounds)', '1.1.68': 'a word in a rule means ITSELF (its own form), not its meaning — unless it is a technical name',
        '1.1.46': 'a टित् augment goes at the BEGINNING, a कित् one at the END', '1.1.47': 'a मित् augment goes after the LAST vowel', '1.1.51': 'ऋ replaced by a / i / u comes with र्' };
      const Q = { pratyaya: ['कः प्रत्ययः?', 'which suffix is introduced?'], adesha: ['किम् आदेशः?', 'what comes in its place?'], agama: ['कः आगमः?', 'which augment is added?'],
        accent: ['कः स्वरः?', 'which accent?'], samjna: ['का संज्ञा?', 'which name is given?'], samjni: ['कस्य संज्ञा?', 'to what is the name given?'], atidesha: ['किंवत्?', 'treated like what?'],
        nipatana: ['किं निपात्यते?', 'which ready-made form does the sūtra state?'], sthani: ['कस्य स्थाने?', 'what is replaced / operated on?'], prakriti: ['कस्मात्?', 'after which base?'],
        purva: ['कस्मात् परस्य?', 'what does it come after?'], nimitta: ['कस्मिन् परे?', 'when what follows?'], upapada: ['केन उपपदेन?', 'with which word alongside?'],
        samartha: ['कस्मात् समर्थात्?', 'from a word in which case?'], artha: ['कस्मिन् अर्थे?', 'in which meaning?'], vishaya: ['कुत्र?', 'in which domain?'],
        qualifier: ['कीदृशम्?', 'which one exactly?'], option: ['नित्यं विकल्पेन वा?', 'always, or optionally?'], negation: ['निषेधः', 'what is blocked?'], acharya: ['कस्य मतेन?', 'in whose view?'],
        adhikara: ['अधिकारः', 'heading for the sūtras that follow'], other: ['', 'also said'] };
      const ORD = ['adhikara', 'samjna', 'samjni', 'nipatana', 'pratyaya', 'adesha', 'agama', 'accent', 'atidesha', 'sthani', 'prakriti', 'purva', 'nimitta', 'upapada', 'samartha', 'artha', 'vishaya', 'qualifier', 'acharya', 'option', 'negation', 'other'];
      const KINDN = { 'vidhi-pratyaya': 'प्रत्ययविधिः — introduces a suffix', adesha: 'आदेशविधिः — a substitution', agama: 'आगमविधिः — adds an augment', ekadesha: 'एकादेशः — one substitute for two sounds', svara: 'स्वरविधिः — an accent rule', samjna: 'संज्ञासूत्रम् — gives a technical name', paribhasha: 'परिभाषा — tells how to read other rules', adhikara: 'अधिकारः — a heading', atidesha: 'अतिदेशः — extends a property', nipatana: 'निपातनम् — states a ready-made form', nishedha: 'निषेधः — blocks a rule', niyama: 'नियमः — restricts a rule', samasa: 'समाससूत्रम् — a compound rule', vibhakti: 'विभक्तिसूत्रम् — assigns a case', pada: 'पदव्यवस्था — assigns parasmaipada / ātmanepada' };
      const wcOf = x => { const w = (r.words || []).find(w => nrm(w.form) === nrm(x.word)); return w ? (w.wcase ? (w.lupta ? 'लुप्त' : '') + VIB[w.wcase] + (VAC[w.num] ? ' ' + VAC[w.num] : '') : (w.num ? '' : 'अव्ययम्')) : ''; };
      const engOnly = engineP.filter(p => !roleP.has(p.pid) && p.pid !== '1.3.11' && p.pid !== '1.1.56');   // 1.1.56: the engine credits sthānivat on every substitution — kept in the detailed steps, not taught here   // 1.3.11 is said once, on each carried word
      const CASEWHY = { nipatana: 'the sūtra states the finished form itself', vishaya: 'a 7th-case word naming the setting — “in X” (not “when X follows”)', artha: 'the case names the meaning — “in the sense of X”',
        option: 'a word meaning “optionally”', negation: 'न — the rule says “not”', samjna: 'the name being given', samjni: 'what receives the name', qualifier: 'it describes another word of the rule', acharya: 'a teacher whose view is reported',
      // ādeśa: no sūtra says the substitute is in the 1st case; the Bhāṣya states the convention (Harsha 2026-11-18)
        pratyaya: 'the suffix named in the 1st case is what is introduced', adesha: 'the substitute stands in the 1st case — Mahābhāṣya on 1.1.57: “आदेशः प्रथमानिर्दिष्टः”', agama: 'the augment stands in the 1st case', accent: 'the accent named in the 1st case is the result' };
      const engSeen = new Set();
      const ordI = x => d.kind === 'nishedha' && x.role === 'negation' ? -1 : ORD.indexOf(x.role);
      // a carried operation the sūtra's न blocks (7.3.3 वृद्धिः: “वृद्धिर्न भवति”) is what is blocked, not what comes in (review 2026-11-18)
      const hasNeg = d.roles.some(y => y.role === 'negation');
      const negBlocked = x => hasNeg && /^(adesha|agama|pratyaya|accent)$/.test(x.role) && x.source !== 'own' && /(न|र्न|ो न|ा न) (भवति|भवतः|भवन्ति|स्यात्)|न भवेत्/.test(String(x.quote || ''));
      const blockedR = d.roles.find(negBlocked);
      const cards = d.roles.filter(x => x.render || /^(negation|option)$/.test(x.role)).slice().sort((a, b) => ordI(b) - ordI(a)).map(x => {
        const why = [];
        const carried = /^carried/.test(x.source), from = String(x.source).split(':')[1];
        // a word written in one case but read in another (3.1.124 ऋहलोः: षष्ठी read as पञ्चमी) — the step that makes the rest possible
        // (Harsha 2026-11-17: “this is true only if ऋ-हलोः (62) is treated as 51 … it isn't listed”)
        for (const p of P2.filter(p => p.pid === '3.1.85' && /written .*, works as /.test(p.trigger || '') && nrm(String(p.trigger).split(':')[0]) === nrm(x.word))) {
          const m = String(p.trigger).match(/written (\S+), works as (\S+)/), qs = (p.quote || []).map(q => `${CNAME[q.c] || q.c}: “${String(q.q).replace(/<<|>>|\[\[|\]\]|`/g, '')}”`).join('; ');
          why.push({ t: 'vy', pid: '3.1.85', pt: pbText('3.1.85'), txt: `written in the ${m ? m[1] : '?'} case but read as the ${m ? m[2] : '?'} — ${qs}` }); }
        // the same reading stated by the Kāśikā alone (3.2.146 “पञ्चम्यर्थे प्रथमा”): the card of the sūtra word written in that case
        if (!why.some(w => w.pid === '3.1.85') && x.source === 'own' && !/^(pratyaya|adesha|agama|samjna|nipatana|accent|option|negation)$/.test(x.role)) {
          // not the operation's own word (वुञ् is the suffix, not the base)
          const CN = { 'प्रथम': 1, 'द्वितीय': 2, 'तृतीय': 3, 'चतुर्थ्य': 4, 'पञ्चम्य': 5, 'षष्ठ्य': 6, 'सप्तम्य': 7 }, WN = { 'प्रथमा': 1, 'द्वितीया': 2, 'तृतीया': 3, 'चतुर्थी': 4, 'पञ्चमी': 5, 'षष्ठी': 6, 'सप्तमी': 7 };
          const m = String(COMM.kashika[r.id] || '').match(/(प्रथम|द्वितीय|तृतीय|चतुर्थ्य|पञ्चम्य|षष्ठ्य|सप्तम्य)र्थे (प्रथमा|द्वितीया|तृतीया|चतुर्थी|पञ्चमी|षष्ठी|सप्तमी)/);
          const w0 = (r.words || []).find(w => nrm(w.form) === nrm(x.word)) || (r.words || []).find(w => nrm(w.form).length > 5 && nrm(w.form).slice(0, 6) === nrm(x.word).slice(0, 6));   // the table may spell a long list word differently at the end (3.2.146 …असूञः for …असूयः)
          if (m && w0 && w0.wcase === WN[m[2]] && !(r.s || '').includes(m[1] + 'र्थे'))   // not when the phrase is the rule's own content (2.3.62)
            why.push({ t: 'vy', pid: '3.1.85', pt: pbText('3.1.85'), txt: `written in the ${m[2]} case but read as the ${{ 1: 'प्रथमा', 2: 'द्वितीया', 3: 'तृतीया', 4: 'चतुर्थी', 5: 'पञ्चमी', 6: 'षष्ठी', 7: 'सप्तमी' }[CN[m[1]]]} — काशिका: “${m[0]}”` }); }
        if (carried) why.push({ t: 'anu', txt: `runs on from ${from} (anuvṛtti)`, pid: '1.3.11' });
        if (/^supplied/.test(x.source)) why.push({ t: 'sup', txt: `not in the sūtra or the anuvṛtti — the references supply it` });
        for (const pid of x.pb || []) if (pid !== '1.3.11') why.push({ t: 'pb', pid, txt: EXP[pid] || '', pt: pbText(pid) });
        if (x.why === 'vyakhyana' && x.quote) why.push({ t: 'vy', txt: `as the ${REFN[x.ref] || x.ref} reads it`, q: x.quote });
        if (!why.length && x.why === 'case' && CASEWHY[x.role]) why.push({ t: /^(negation|option)$/.test(x.role) ? 'word' : 'case', txt: CASEWHY[x.role] });   // an indeclinable has no case; no empty “read from its case”
        const hasPb = new Set(why.map(w => w.pid).filter(Boolean));
        const tr = engOnly.filter(p => { if (engSeen.has(p.pid)) return false; const vb = String(p.pid).match(/^(\S+) vt\.\d+$/); if (vb && hasPb.has(vb[1])) return true;   // a vārttika on a paribhāṣā goes with it
          const W = new Set(String(p.trigger || '').split(/[\s,;:()“”]+|\band\b/).map(nrm).filter(Boolean)); return W.has(nrm(x.word)) || nrm(x.word).length > 1 && nrm(p.trigger).includes(nrm(x.word)); });
        for (const p of tr) engSeen.add(p.pid);
        for (const p of tr) why.push({ t: 'pb', pid: p.pid, txt: EXP[p.pid] ? EXP[p.pid] + ' — ' + tidyE(p.effect) : `${tidyE(p.trigger)} → ${tidyE(p.effect)}`, pt: pbText(p.pid) });   // no gloss of our own (a vārttika): say the engine's reason in full
        const no = (x._noWhy || []).map(t => { const m = t.match(/^(\S+) not applicable: (.*)$/); return m ? { pid: m[1], txt: m[2], pt: pbText(m[1]) } : { txt: t }; });
        // a vārttika on one of this card's paribhāṣās that was considered and set aside (1.1.72 vt.1, lifted by vt.2)
        const hasPb2 = new Set(why.map(w => w.pid).filter(Boolean));
        for (const p of P2.filter(p => p.status === '✖' && p.layer !== 1 && /^(\S+) vt\.\d+$/.test(p.pid) && hasPb2.has(p.pid.replace(/ vt\.\d+$/, ''))))
          if (!no.some(n => n.pid === p.pid)) no.push({ pid: p.pid, txt: `${tidyE(p.trigger)} → ${tidyE(p.effect)}`, pt: pbText(p.pid) });
        const blocked = negBlocked(x);
        return { q: blocked ? ['किं निषिध्यते?', 'what is blocked (न)?'] : x.role === 'negation' && blockedR ? ['निषेधः', 'the negation, in full'] : (x.role === 'sthani' && nrm(x.word) === 'अङ्गस्य') ? ['किम् अङ्गम्?', 'on which stem (aṅga) does it operate?'] : Q[x.role] || ['', x.role], role: blocked ? 'blocked' : x.role, word: x.word, own: x.source === 'own', vib: wcOf(x), ans: x.role === 'negation' && blockedR ? `${blockedR.render} न भवति` : (x.render || x.word), why, no, ev: x.quote && x.verified ? { ref: REFN[x.ref] || x.ref, q: x.quote, ok: true } : null };   // an unverified quote is not shown to students (review 2026-11-18)
      });
      cards.reverse();
      // words that run on but the vṛtti does not voice — said, not hidden (3.1.104: a nipātana gives the finished form)
      const voiced = new Set(d.roles.map(x => nrm(x.word)));
      const finW = (r.genC || d.neu || '').split(' ').map(t => nrm(t).replace(/[ःंम्]$/, '')), saysIt = w => { const k = nrm(w).replace(/(श्च|ः|म्|ं)$/, ''); return k.length > 1 && finW.some(t => t.startsWith(k) || k.startsWith(t) && t.length > 2); };
      const silent = [...new Set((r.carried || []).filter(c => !voiced.has(nrm(c.w)) && !c.superseded && !saysIt(c.w)).map(c => `${c.w} (${c.from})`))];   // review 2026-11-18: never list a word the vṛtti says (परश्च, विभाषा)
      const left = engOnly.filter(p => !cards.some(c => c.why.some(w => w.pid === p.pid))).map(p => ({ pid: p.pid, txt: (EXP[p.pid] ? EXP[p.pid] + ' — ' : '') + tidyE(p.trigger) + ' → ' + tidyE(p.effect), pt: pbText(p.pid) }));
      r.why = { kind: KINDN[d.kind] || d.kind, pc: (r.words || []).map(w => ({ f: w.form, v: w.wcase ? (w.lupta ? 'लुप्त' : '') + VIB[w.wcase] + (VAC[w.num] ? ' ' + VAC[w.num] : '') : 'अव्ययम्' })),
        p1311: pbText('1.3.11'), cards, silent, left, fin: r.genC || d.neu, note: VNOTE[r.n] || d.handNote || '' };
    }
    if (d.note) r.notes = (r.notes || []).concat('⚑ ' + d.note);
  }
  console.log(`role table: ${nRole} sūtras generated from roles (of ${Object.keys(ROLES).length} in the table)`);
}
// ── case → paribhāṣā tagging corrected (peer review 2026-11-18): 1.1.67 only for a 5th case (3.2.13 रमिजपोः is a 6th: the suffix follows
// by 3.1.2); a 5th case read with पूर्व (7.3.3 ताभ्याम् … पूर्वौ, 6.1.135 कात् पूर्वः) means BEFORE it; 1.1.66 not for a locative of place
// or of intervention (8.2.29 अन्ते, 8.3.65 अड्व्यवाये); an augment rule asks “कस्य आगमः?”, not “कस्य स्थाने?”
{ const nW = t => String(t || '').replace(/[-\s]/g, ''), CN = ['', 'प्रथमा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी', 'षष्ठी', 'सप्तमी']; let c67 = 0, c66 = 0, cAg = 0;
  const unCredit = (r, pid, word, eff) => { for (const p of r.P || []) if (p.pid === pid && p.layer !== 1 && p.status === '✔' && nW(String(p.trigger).split(':')[0]) === nW(word)) { p.status = '✖'; p.effect = eff; }
    const still = (r.P || []).some(p => p.pid === pid && p.layer !== 1 && p.status === '✔');
    for (const st of r.steps || []) if ((st.w || []).some(w => nW(w) === nW(word)) && st.pids.includes(pid)) { st.pids = st.pids.filter(x => x !== pid); st.no = (st.no || []).concat(pid); }
    if (!still) for (const st of r.steps || []) if (st.pids.includes(pid) && !st.w) st.pids = st.pids.filter(x => x !== pid);
    if (r.why) for (const c of r.why.cards) if (nW(c.word) === nW(word)) c.why = c.why.filter(w => w.pid !== pid); };
  for (const r of RES) { if (r.hand) continue; const W = r.words || [];
    // the 5th-case word read with पूर्व: the next one after it (particles skipped), else the one before (7.3.3 पूर्वौ तु ताभ्याम्)
    const PART = /^(च|तु|वा|एव|अपि)$/, withPurva = new Set(); W.forEach((v, k) => { if (!/^पूर्व(ः|ौ|म्|े|स्य)$/.test(v.form)) return; let j = k + 1; while (W[j] && PART.test(W[j].form)) j++;
      if (W[j] && W[j].wcase === 5) { withPurva.add(W[j]); return; } j = k - 1; while (W[j] && PART.test(W[j].form)) j--; if (W[j] && W[j].wcase === 5) withPurva.add(W[j]); });
    W.forEach((w, i) => { const f = w.form;
      // …unless the Kāśikā reads the word as what the operation follows (7.2.78 ईडजनोः: “ईड जन इत्येताभ्यामुत्तरस्य”) — a 6th used for a 5th
      const asAbl = (r.roles || []).some(x => nW(x.word) === nW(f) && /^(purva|prakriti)$/.test(x.role)) && /[उु]त्तरस्य|परस्य|[उु]त्तरेषाम्|परेषाम्|[उु]त्तरयोः|इत्येतेभ्य|इत्येताभ्या|इत्येतस्मा|(^|\s)एभ्य[ःो]|(^|\s)आभ्या/.test((r.kv || '') + ' ' + (r.sk || '')) || ((r.kv || '') + ' ' + (r.sk || '')).includes(f.replace(/-/g, '') + ' परस्य');
      // in the suffix sections a base written in another case is still read “after which” — धातोः (3.1.91) / ङ्याप्प्रातिपदिकात् (4.1.1) are carried
      // in the 5th (KV “हन्तेर्धातोः … क्यप्”): 1.1.67 stays, only its explanation changes
      const idn2 = +sid(r.n), sufSec = idn2 >= 31001 && idn2 <= 54160 && (r.roles || []).some(x => nW(x.word) === nW(f) && /^(purva|prakriti)$/.test(x.role));
      if (sufSec && w.wcase && w.wcase !== 5 && w.wcase !== 7) { const carr = idn2 >= 41001 ? '4.1.1 ङ्याप्प्रातिपदिकात्' : idn2 >= 31091 ? '3.1.91 धातोः' : '3.1.1–2 प्रत्ययः परश्च';
        const txt = `${f} is written in the ${CN[w.wcase]}, but as the base of the suffix it is read “after ${f}” — ${carr} runs on in the 5th case`;
        for (const p of r.P || []) if (p.pid === '1.1.67' && p.layer !== 1 && nW(String(p.trigger).split(':')[0]) === nW(f)) { p.status = '✔'; p.effect = txt; }
        if (r.why) for (const c of r.why.cards) if (nW(c.word) === nW(f)) for (const ww of c.why) if (ww.pid === '1.1.67') ww.txt = txt;
        return; }
      const abl5 = W.find(v => v.wcase === 5 && v !== w);
      if (w.wcase && w.wcase !== 5 && abl5 && (r.P || []).some(p => p.pid === '1.1.67' && p.layer !== 1 && p.status === '✔' && nW(String(p.trigger).split(':')[0]) === nW(f))) {
        for (const p of r.P) if (p.pid === '1.1.67' && p.layer !== 1 && nW(String(p.trigger).split(':')[0]) === nW(f)) { p.trigger = `${abl5.form}: 5th case`; p.effect = 'the operation falls on what comes after it'; }
        if (r.why) { for (const c of r.why.cards) if (nW(c.word) === nW(f)) c.why = c.why.filter(x => x.pid !== '1.1.67'); const c5 = r.why.cards.find(c => nW(c.word) === nW(abl5.form)); if (c5 && !c5.why.some(x => x.pid === '1.1.67')) c5.why.push({ t: 'pb', pid: '1.1.67', txt: 'a word in the 5th case: the operation falls on what comes after it', pt: ((BYID[sid('1.1.67')] || {}).s) || '' }); }
        c67++; return; }
      if (w.wcase && w.wcase !== 5 && !asAbl && !(r.P || []).some(p => p.pid === '3.1.85' && nW(String(p.trigger)).includes(nW(f))) && (r.P || []).some(p => p.pid === '1.1.67' && p.layer !== 1 && p.status === '✔' && nW(String(p.trigger).split(':')[0]) === nW(f))) { unCredit(r, '1.1.67', f, `not here — ${f} is in the ${CN[w.wcase]}, not the 5th case`); c67++; }
      if (withPurva.has(w)) { unCredit(r, '1.1.67', f, `not here — read with पूर्व: the operation comes BEFORE ${f}, not after it`); c67++;
        if (r.why) for (const c of r.why.cards) if (nW(c.word) === nW(f)) c.q = ['कस्मात् पूर्वम्?', 'what does it come before?']; }
      if (w.wcase === 7 && /(अन्ते|व्यवाये)$/.test(f.replace(/-/g, ''))) { unCredit(r, '1.1.66', f, `not here — ${f} names a place (“at the end”) or something in between, not what follows`); c66++; } });
    for (const p of r.P || []) if (p.pid === '1.1.66' && p.layer !== 1 && p.status === '✔' && /(अन्ते|व्यवाये)(:|\s|$)/.test(String(p.trigger).split(':')[0].replace(/-/g, ''))) { p.status = '✖'; p.effect = 'not here — it names a place (“at the end”) or something in between, not what follows'; c66++;
      for (const st of r.steps || []) if (st.pids.includes('1.1.66') && String(st.what).includes(String(p.trigger).split(':')[0])) { st.pids = st.pids.filter(x => x !== '1.1.66'); st.no = (st.no || []).concat('1.1.66'); }
      if (r.why) r.why.left = (r.why.left || []).filter(l => !(l.pid === '1.1.66' && /(अन्ते|व्यवाये)/.test(l.txt))); }
    if (r.why) for (const c of r.why.cards) if (/(अन्ते|व्यवाये)$/.test(nW(c.word)) && (c.why.some(w => w.pid === '1.1.66') || /कस्मिन् परे/.test(c.q[0]))) { c.why = c.why.filter(w => w.pid !== '1.1.66'); c.q = /व्यवाये$/.test(nW(c.word)) ? ['केन व्यवाये?', 'even with what in between?'] : ['कुत्र?', 'where?']; c66++; }
    // a “… स्थाने” card is a substitution's place even on an augment rule (7.3.3 अचः स्थाने: the vṛddhi) — not asked “कस्य आगमः?”
    if (r.why && /आगम/.test(r.why.kind || '')) for (const c of r.why.cards) if (c.role === 'sthani' && !/स्थाने/.test(c.ans || '')) { c.q = ['कस्य आगमः?', 'which element receives the augment?']; c.why = c.why.filter(w => w.pid !== '1.1.49'); cAg++; } }
  console.log(`case-tag fixes: 1.1.67 ×${c67}, 1.1.66 ×${c66}, augment questions ×${cAg}`); }
// ── paribhāṣās that settle WHERE a substitute goes, which the engine never credited (Harsha 2026-11-18: “a basic bug that needs immediate
// fixing”): 1.2.28 अचश्च (ह्रस्व/दीर्घ/प्लुत taught by name fall only on a vowel), 1.1.48 एच इग्घ्रस्वादेशे (a short for ए/ऐ/ओ/औ is इ/उ),
// 1.1.53 ङिच्च (a ङित् substitute of several sounds takes only the last sound — not the whole, 1.1.55)
{ const pt = pid => ((BYID[sid(pid)] || {}).s) || '';
  const credit = (r, pid, x, trig, eff, why) => { r.P = r.P || []; const ex = r.P.find(p => p.pid === pid && p.layer !== 1); if (ex) Object.assign(ex, { status: '✔', trigger: trig, effect: eff }); else r.P.push({ pid, status: '✔', layer: 2, trigger: trig, effect: eff });
    for (const st of r.steps || []) if (!st.fin && (st.w || []).some(w => nrmW(w) === nrmW(x.word)) && !st.pids.includes(pid)) st.pids = st.pids.concat(pid);
    if (r.why) { const c = r.why.cards.find(c => nrmW(c.word) === nrmW(x.word)) || r.why.cards.find(c => c.role === 'sthani'); if (c && !c.why.some(w => w.pid === pid)) c.why.push({ t: 'pb', pid, txt: why, pt: pt(pid) }); } };
  const nrmW = t => String(t || '').replace(/[-\s]/g, '');
  let n28 = 0, n48 = 0, n53 = 0;
  for (const r of RES) { if (r.hand || ['1.2.27', '1.2.28', '1.1.48'].includes(r.n)) continue; const ad = (r.roles || []).filter(x => x.role === 'adesha');
    for (const x of ad.filter(x => /^(ह्रस्व|दीर्घ|प्लुत)/.test(x.render || '') || /^(ह्रस्वः|दीर्घः|प्लुतः)$/.test(x.word))) {
      const nm = /ह्रस्व/.test((x.render || '') + x.word) ? 'ह्रस्व' : /दीर्घ/.test((x.render || '') + x.word) ? 'दीर्घ' : 'प्लुत';
      credit(r, '1.2.28', x, `${nm} taught by name as the substitute`, 'it falls only on a vowel — “अचः” is understood', `${nm} is taught by its own name, so it falls only on a vowel (अचः) — काशिका on 1.2.28: “ह्रस्वदीर्घप्लुताः स्वसंज्ञया शिष्यमाणा अच एव स्थाने वेदितव्याः”`); n28++;
      // 1.1.48 only where the Kāśikā's own examples shorten ए/ऐ/ओ/औ (a looser test credited 28, most with ā/ī/ū stems — read and narrowed 2026-11-18)
      const EX48 = { '1.2.47': 'अतिरि कुलम्, अतिनु कुलम् (रै → रि, नौ → नु)', '1.2.48': 'चित्रगुः (गो → गु)', '7.4.59': 'डुढौके (ढौ → ढु)' };
      if (nm === 'ह्रस्व' && EX48[r.n]) { credit(r, '1.1.48', x, 'ह्रस्व for ए/ऐ/ओ/औ', 'the short for ए/ऐ is इ, for ओ/औ is उ', `where the vowel is ए/ऐ/ओ/औ, its short is इ/उ, not अ — काशिका: ${EX48[r.n]}`); n48++; }
      break; }
    for (const x of ad.filter(x => /(अनङ्|तातङ्|इयङ्|उवङ्|अवङ्|अकङ्|आनङ्)/.test((x.render || '') + ' ' + x.word))) {
      credit(r, '1.1.53', x, `${x.word}: a ङित् substitute of more than one sound`, 'it replaces only the last sound', `${String(x.word).replace(/[ःौ]$/, '')} is ङित्: though it has several sounds it replaces only the last sound (not the whole, as 1.1.55 would have it)`); n53++;
      const p55 = (r.P || []).find(p => p.pid === '1.1.55' && p.layer !== 1 && p.status === '✔'); if (p55) { p55.status = '✖'; p55.effect = 'not here — the substitute is ङित्: 1.1.53 ङिच्च takes the last sound only'; }
      for (const st of r.steps || []) if (st.pids.includes('1.1.55')) { st.pids = st.pids.filter(p => p !== '1.1.55'); st.no = (st.no || []).concat('1.1.55'); }
      if (r.why) for (const c of r.why.cards) c.why = c.why.filter(w => w.pid !== '1.1.55');
      break; } }
  // 1.1.54 आदेः परस्य — where the commentaries invoke it, each read (2026-11-18): it applies on these, and 1.1.52 credited there was wrong
  const A54 = { '6.3.97': ['the ई replaces the first sound of अप् after द्वि/अन्तर्/an upasarga', 'BM'], '6.3.98': ['the ऊ replaces the first sound of अप्', 'BM'],
    '6.4.49': ['on the reading of हलः as a 5th case, the य् right after the consonant is elided', 'KV: “हल इति वा पञ्चमीनिर्देशः, तत्र आदेः परस्य इति यकारोऽनेन लुप्यते”'],
    '6.4.50': ['the elision takes the first sound of क्य after the consonant', 'SK'], '6.4.158': ['the elision takes the first sound of इष्ठ/इमन्/ईयस् after बहु', 'BM: “प्रत्ययोरादिलोपः”'],
    '6.4.159': ['the elision takes the first sound of इष्ठ after बहु', 'BM'], '6.4.160': ['आ replaces the first sound of ईयस् after ज्य', 'SK'], '7.1.29': ['न् replaces the first sound of शस् after युष्मद्/अस्मद्', 'SK'],
    '7.2.83': ['ई replaces the first sound of आन after आस्', 'SK: “आसः परस्यानस्य ईत्स्यात् । आदेः परस्य”'] };
  const X54 = { '5.3.83': 'ऊर्ध्वम् makes it everything after the second vowel, not only its first sound', '5.4.135': 'a samāsānta substitute goes at the end (BM)', '5.4.138': 'a samāsānta substitute goes at the end (BM)',
    '6.4.153': 'य उपधायाः runs on, so only the य् is elided (BM)', '7.1.21': 'औश् is शित्, so it replaces the whole (1.1.55; BM)', '7.1.23': 'a लुक् takes the whole suffix (BM)' };
  for (const r of RES) { const a54 = A54[r.n], x54 = X54[r.n]; if (!a54 && !x54) continue; r.P = r.P || []; const ex = r.P.find(p => p.pid === '1.1.54' && p.layer !== 1);
    if (a54) { if (ex) Object.assign(ex, { status: '✔', trigger: 'after a 5th-case word', effect: `${a54[0]} (${a54[1]})` }); else r.P.push({ pid: '1.1.54', status: '✔', layer: 2, trigger: 'after a 5th-case word', effect: `${a54[0]} (${a54[1]})` });
      for (const p of r.P) if (p.pid === '1.1.52' && p.layer !== 1 && p.status === '✔') { p.status = '✖'; p.effect = 'not here — the place follows a 5th-case word, so 1.1.54 takes its FIRST sound'; }
      if (r.why) { const c = r.why.cards.find(c => c.role === 'sthani') || r.why.cards.find(c => c.role === 'adesha'); for (const cc of r.why.cards) cc.why = cc.why.filter(w => w.pid !== '1.1.52'); if (c && !c.why.some(w => w.pid === '1.1.54')) c.why.push({ t: 'pb', pid: '1.1.54', txt: `${a54[0]} — ${a54[1]}`, pt: pt('1.1.54') }); }
      for (const st of r.steps || []) if (st.pids.includes('1.1.52')) { st.pids = st.pids.filter(x => x !== '1.1.52'); st.no = (st.no || []).concat('1.1.52'); } }
    else if (!ex || ex.status !== '✔') { if (ex) Object.assign(ex, { status: '✖', effect: `considered, not applicable — ${x54}` }); else r.P.push({ pid: '1.1.54', status: '✖', layer: 2, trigger: 'after a 5th-case word', effect: `considered, not applicable — ${x54}` }); } }
  // 6.1.158 अनुदात्तं पदमेकवर्जम् — “परिभाषेयं स्वरविधिविषया” (KV): credited on every accent rule that teaches an udātta or svarita (2026-11-18;
  // the audit had wrongly filed it as derivation-only). And the 12 cards whose उदात्तः was only “supplied” get its source: sāmarthya (KV on
  // 6.2.27) grounded in 6.1.158 (KV + Nyāsa on 6.1.158, quoted as our text has them, slips marked).
  const Q158 = 'काशिका on 6.1.158: “यत्रान्यः स्वर उदात्तः स्वरितो वा विधीयते, तत्रानुदात्तं पदमेकं वर्जयित्वा भवतीत्येतदुपस्थितं द्रष्टव्यम्”';
  let n158 = 0, nUd = 0;
  for (const r of RES) { if (r.hand || r.n === '6.1.158') continue; const g = r.genC || '';
    const sv = (r.roles || []).some(x => x.role === 'accent') || r.kind === 'svara' || /^svara/.test(r.roleKind || '');
    if (sv && /[उुो]दात्त|स्वरित/.test(g.replace(/अनुदात्त/g, '')) && !/ न भवति| न भवन्ति/.test(g)) { r.P = r.P || [];   // [उुो]: आद्युदात्त / अन्तोदात्त hide the उ in sandhi (6.1.158 audit, 46 rules incl. 3.1.3)
      if (!r.P.some(p => p.pid === '6.1.158' && p.layer !== 1 && p.status === '✔')) r.P.push({ pid: '6.1.158', status: '✔', layer: 2, trigger: 'an udātta or svarita is taught for one vowel', effect: 'the rest of the pada is anudātta' });
      if (r.why) { const c = r.why.cards.find(c => c.role === 'accent') || r.why.cards.find(c => /उदात्त|स्वरित/.test(c.ans || '')); if (c && !c.why.some(w => w.pid === '6.1.158')) c.why.push({ t: 'pb', pid: '6.1.158', txt: `one vowel's accent is taught here, so the rest of the pada is anudātta — ${Q158}`, pt: pt('6.1.158') }); }
      n158++; }
    if (r.why) for (const c of r.why.cards) { const i = c.why.findIndex(w => w.t === 'sup'); if (i < 0 || !/^उदात्त/.test(String(c.word))) continue;
      c.why.splice(i, 1, { t: 'vy', txt: 'उदात्तः is understood from the sense (sāmarthya) — काशिका on 6.2.27: “उदात्त इत्येतदत्र सामर्थ्याद् वेदितव्यम्”' },
        { t: 'pb', pid: '6.1.158', pt: pt('6.1.158'), txt: 'the vowel the rule names is the one that keeps the accent; the rest of the pada is anudātta — काशिका on 6.1.158: “कः पुनरेको वर्ज्यते ? यस्यासौ स्वरो विधीयते”; न्यासः: “यस्य चोदात्तः स्वरतो [sic: स्वरितो] वा विधीयते स एवाको [sic: एवैको] वज्र्यते [sic: वर्ज्यते]”' });
      c.why = c.why.filter((w, j, a) => !(w.pid === '6.1.158' && a.findIndex(x => x.pid === '6.1.158') !== j)); nUd++; } }
  console.log(`6.1.158 credited on ${n158} accent rules; ${nUd} उदात्तः cards given their source`);
  // 1.1.68 स्वं रूपं शब्दस्याशब्दसंज्ञा (2026-11-18): where the vṛtti writes “X-शब्द…” for a word of the sūtra — the commentators' own mark
  // that X means the word X itself, not its meaning or synonyms (KV on 1.1.68: “अग्निशब्दोऽग्निशब्दस्यैव ग्राहको भवति, न ज्वलनः पावको
  // धूमकेतुरिति”). Not where X-शब्द names a CLASS read by meaning (दिक्शब्दाः = words for directions; KV-read exceptions below).
  const MEANCLS = new Set(['2.2.5|काल', '2.3.45|नक्षत्र', '5.1.108|काल', '5.3.81|जाति', '6.3.17|काल']);
  const Q68 = 'काशिका on 1.1.68: “शास्त्रे स्वमेव रूपं शब्दस्य ग्राह्यं बोध्यं प्रत्याय्यं भवति, न बाह्योऽर्थः”';
  let n68 = 0;
  for (const r of RES) { if (r.hand || r.n === '1.1.68') continue; const g = r.genC || ''; let hit = false;
    for (const m of g.matchAll(/(?:^|\s)([^\s]+?)-?शब्द(ात्|स्य|ौ|ः|े|ाभ्याम्|ेभ्यः|योः|म्|ानाम्|ाः|ान्त[^\s,]*)(?=\s|,|$)/g)) {   // + “X-शब्दान्त-” (1.1.68 audit: 52 sūtras, e.g. 5.4.134 जायाशब्दान्तस्य)
      const x = m[1].replace(/[-ः]$/, '').replace(/ं$/, 'म्'); if (!x || /^(इति|एते|ते|च)$/.test(x) || /^(दिक्|दिग्)$/.test(x) || MEANCLS.has(r.n + '|' + x)) continue;
      hit = true; const xs = x.split('-').map(t => t.replace(/[ःम्]$/, '')).filter(t => t.length > 1);
      if (r.why) { const c = r.why.cards.find(c => xs.some(t => nrmW(c.word).includes(t) || nrmW(c.ans).includes(t + 'शब्द') || nrmW(c.ans).includes(t))); if (c && !c.why.some(w => w.pid === '1.1.68')) c.why.push({ t: 'pb', pid: '1.1.68', pt: pt('1.1.68'), txt: `${m[1].replace(/-$/, '')} here means the word ${m[1].replace(/-$/, '')} itself, not its meaning or its synonyms — ${Q68}` }); } }
    if (hit) { r.P = r.P || []; if (!r.P.some(p => p.pid === '1.1.68' && p.layer !== 1 && p.status === '✔')) r.P.push({ pid: '1.1.68', status: '✔', layer: 2, trigger: 'the vṛtti writes the word as “X-शब्द”', effect: 'the word means its own form, not its meaning or synonyms' }); n68++; } }
  console.log(`1.1.68 credited on ${n68} sūtras`);
  // 8.2.1 पूर्वत्रासिद्धम् (Harsha 2026-11-18: yes) — every rule of the tripādī (8.2.2–8.4.68) is asiddha for the rules before it
  const Q821 = 'काशिका on 8.2.1: “इत उत्तरं चोत्तर उत्तरो योगः पूर्वत्रपूर्वत्रासिद्धो भवति, असिद्धवद् भवति। सिद्धकार्यं न करोतीत्यर्थः”'; let n821 = 0;
  for (const r of RES) { const idn3 = +sid(r.n); if (idn3 < 82002 || idn3 > 84068 || r.hand) continue; r.P = r.P || [];
    if (!r.P.some(p => p.pid === '8.2.1' && p.layer !== 1 && p.status === '✔')) r.P.push({ pid: '8.2.1', status: '✔', layer: 2, trigger: 'a rule of the tripādī (8.2–8.4)', effect: 'it counts as not having applied (asiddha) for every rule before it' });
    if (r.why && !(r.why.left || []).some(l => l.pid === '8.2.1')) (r.why.left = r.why.left || []).push({ pid: '8.2.1', pt: pt('8.2.1'), txt: `this rule is in the tripādī: for every rule before it, it counts as not having applied — ${Q821}` }); n821++; }
  console.log(`8.2.1 noted on ${n821} tripādī sūtras`);
  // ── Paribhāṣenduśekhara audit (2026-11-18): only PIS 8/23/33 ever fired. Fixes: PIS 23 (a SUFFIX stands for what ends in it) was credited
  // to words that are no suffix — each read against the KV; 8.2.9 मात् is a sound-tadanta (1.1.72). Credits where the trigger is visible:
  // PIS 122 (vṛtti “स्वार्थे”), PIS 119 (nipātana pages), PIS 28 / PIS 123 (where the KV/SK invokes them), PIS 18 (6.1.131, KV).
  const ppt = n => PIS[n] || '';
  const NOT23 = { '6.3.8|परस्य': 'पर is an ordinary word, not a suffix', '6.3.73|नञः': 'नञ् is a particle, not a suffix', '6.4.127|अनञः': 'नञ् is a particle, not a suffix',
    '7.1.44|तात्': 'तात् is a substitute, not a suffix after which something ends', '7.3.44|कात्': 'क् is a sound (after which, 1.1.67), not a suffix', '8.2.80|दात्': 'द् is a sound (after which, 1.1.67), not a suffix',
    '8.4.44|शात्': 'श् is a sound (after which, 1.1.67), not a suffix', '8.2.47|श्यः': 'श्यः is the root श्यै, not the suffix श्यन्', '8.2.9|मात्': 'म् is a sound — a sound-tadanta (1.1.72), not a suffix' };
  let nFix = 0; const nP = {}; const bump = k => nP[k] = (nP[k] || 0) + 1;
  for (const r of RES) { for (const p of r.P || []) { const w = String(p.trigger).split(':')[0].trim(); const why = NOT23[r.n + '|' + w]; if (p.pid !== 'PIS 23' || p.layer === 1 || p.status !== '✔' || !why) continue;
      p.status = '✖'; p.effect = `not here — ${why}`; nFix++;
      if (r.why) { for (const c of r.why.cards) c.why = c.why.filter(x => !(x.pid === 'PIS 23' && nrmW(c.word) === nrmW(w))); r.why.left = (r.why.left || []).filter(l => !(l.pid === 'PIS 23' && String(l.txt).includes(w))); }
      for (const st of r.steps || []) if (st.pids.includes('PIS 23') && String(st.what).includes(w)) { st.pids = st.pids.filter(x => x !== 'PIS 23'); st.no = (st.no || []).concat('PIS 23'); }
      if (r.n === '6.4.127' && !r.P.some(q => q.pid === '1.1.72' && q.layer !== 1 && q.status === '✔')) { r.P.push({ pid: '1.1.72', status: '✔', layer: 2, trigger: 'अर्वणः', effect: 'the aṅga ending in अर्वन् — SK: “रहितस्यार्वन्नन्तस्याङ्गस्य”' });
        if (r.why) { const c = r.why.cards.find(c => /अर्व/.test(c.word || '')); if (c && !c.why.some(x => x.pid === '1.1.72')) c.why.push({ t: 'pb', pid: '1.1.72', pt: ((BYID[sid('1.1.72')] || {}).s) || '', txt: 'the aṅga ending in अर्वन् — SK: “रहितस्यार्वन्नन्तस्याङ्गस्य”' }); } }
      if (r.n === '8.2.9' && !r.P.some(q => q.pid === '1.1.72' && q.layer !== 1 && q.status === '✔')) r.P.push({ pid: '1.1.72', status: '✔', layer: 2, trigger: 'मात्: a sound', effect: 'what ends in म् — काशिका: “मकारान्ताद्”' }); } }
  const credit2 = (r, pid, txt, onCard) => { r.P = r.P || []; if (!r.P.some(p => p.pid === pid && p.layer !== 1 && p.status === '✔')) r.P.push({ pid, status: '✔', layer: 2, trigger: txt.split(' — ')[0], effect: txt });
    if (r.why) { const c = onCard && r.why.cards.find(onCard); if (c) { if (!c.why.some(w => w.pid === pid)) c.why.push({ t: 'pb', pid, pt: ppt(pid.slice(4)), txt }); } else if (!(r.why.left || []).some(l => l.pid === pid)) (r.why.left = r.why.left || []).push({ pid, pt: ppt(pid.slice(4)), txt }); } bump(pid); };
  const kvSnip = (t, re) => { const m = String(t || '').match(new RegExp('[^।॥]{0,50}(' + re + ')[^।॥]{0,40}')); return m ? m[0].replace(/<<|>>|\[\[[^\]]*\]\]/g, '').replace(/\s+/g, ' ').trim() : ''; };
  for (const r of RES) { if (r.hand) continue; const g = r.genC || '', kv = (COMM.kashika || {})[r.id] || '', sk = (COMM.kaumudi || {})[r.id] || '';
    if (/स्वार्थे/.test(g)) credit2(r, 'PIS 122', 'no meaning is taught for this suffix, so it is in the base’s own sense (स्वार्थे)', c => /स्वार्थ/.test(c.ans || '') || /स्वार्थ/.test(c.word || ''));
    if (r.why && /निपातन/.test(r.why.kind || '')) credit2(r, 'PIS 119', 'a nipātana stands against the general rules that would give another form', null);
    { const q = kvSnip(kv, 'गतिकारकपूर्व') || kvSnip(sk, 'गतिकारकपूर्व'); if (q) credit2(r, 'PIS 28', `where a kṛt suffix is named, the word with a gati or kāraka before it is meant too — “${q}”`, null); }
    { const q = kvSnip(kv, 'योगविभाग|पृथग्योग'); if (q) credit2(r, 'PIS 123', `the sūtra is stated separately for a purpose — काशिका: “${q}”`, null); }
    if (r.n === '6.1.131') credit2(r, 'PIS 18', 'only part of an earlier word runs on (पद from पदान्तात्, 6.1.109) — काशिका: “… [6.1.109] इत्यतः पदग्रहणमनुवर्तते”', c => /पद/.test(c.word || '')); }
  console.log(`PIS audit: PIS 23 taken off ${nFix} non-suffixes; credited ${Object.entries(nP).map(([k, v]) => k + ' ×' + v).join(', ')}`);
  // 1.1.52 / 1.1.55 credited to an AUGMENT (6.4.159 यिट्, review: 7.3.3) — an āgama replaces nothing
  let nAg = 0; for (const r of RES) { const ags = new Set((r.roles || []).filter(x => x.role === 'agama').map(x => nrmW(x.word)));
    for (const p of r.P || []) if (/^1\.1\.5[25]$/.test(p.pid) && p.layer !== 1 && p.status === '✔' && ags.has(nrmW(String(p.trigger).split(':')[0]))) { p.status = '✖'; p.effect = 'not here — an augment (āgama) replaces nothing; 1.1.46 places it'; nAg++;
      if (r.why) for (const c of r.why.cards) if (ags.has(nrmW(c.word))) c.why = c.why.filter(w => w.pid !== p.pid); } }
  console.log(`substitute-place paribhāṣās credited: 1.2.28 on ${n28}, 1.1.48 on ${n48}, 1.1.53 on ${n53} sūtras; 1.1.54 read on ${Object.keys(A54).length + Object.keys(X54).length}; 1.1.52/55 taken off augments ×${nAg}`); }
// where a SUPPLIED word comes from, when one sūtra settles it (2026-11-18): इकः on guṇa/vṛddhi (1.1.3), अच् on ह्रस्व/दीर्घ/प्लुत (1.2.28),
// “of the suffix” on a लुक् rule (1.1.61 defines लुक् as a suffix's disappearance), the four meanings at 4.2.67–70 (चातुरर्थिक). Other
// supplied words keep “the references supply it”.
{ const pt = pid => ((BYID[sid(pid)] || {}).s) || ''; let n = 0;
  for (const r of RES) { if (!r.why) continue; const g = r.genC || '';
    for (const c of r.why.cards) { const i = c.why.findIndex(w => w.t === 'sup'); if (i < 0) continue; const w = String(c.word).replace(/-/g, '');
      let rep = null;
      if (/^(इकः|इगन्तस्य|इक्)$/.test(w) && /गुण|वृद्धि/.test(g)) rep = { t: 'pb', pid: '1.1.3', txt: 'guṇa and vṛddhi, taught by those words, fall on an इक् vowel', pt: pt('1.1.3') };
      else if (/^(अचः|अजन्तस्य|अच्)$/.test(w) && /ह्रस्व|दीर्घ|प्लुत/.test(g)) rep = { t: 'pb', pid: '1.2.28', txt: 'ह्रस्व, दीर्घ and प्लुत, taught by name, fall only on a vowel', pt: pt('1.2.28') };
      else if (/^प्रत्ययस्य$/.test(w) && /लुक्|लुग्/.test(g)) rep = { t: 'pb', pid: '1.1.61', txt: 'लुक् is by definition the disappearance of a suffix, so “of the suffix” is understood', pt: pt('1.1.61') };
      else if (/^चातुरर्थिक/.test(w)) rep = { t: 'sup', txt: 'the four meanings set up at 4.2.67–70 — तदस्मिन्नस्तीति देशे तन्नाम्नि, तेन निर्वृत्तम्, तस्य निवासः, अदूरभवश्च; the suffixes taught from there on are for these' };
      if (!rep) continue; n++;
      if (rep.pid && c.why.some(x => x.pid === rep.pid)) c.why.splice(i, 1); else c.why.splice(i, 1, rep);
      if (rep.pid) { r.P = r.P || []; if (!r.P.some(p => p.pid === rep.pid && p.layer !== 1 && p.status === '✔')) r.P.push({ pid: rep.pid, status: '✔', layer: 2, trigger: `${c.word}: supplied`, effect: rep.txt }); } } }
  // the Gemini proposals Claude read and accepted (rolepilot/supplied-accepted.json, 2026-11-18): each with its verified quote
  const SA = (() => { try { const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'rolepilot', 'supplied-accepted.json'), 'utf8')); delete j._about; return j; } catch (e) { return {}; } })();
  const REFN2 = { KV: 'काशिका', SK: 'SK', BM: 'बालमनोरमा', PV: 'प्रथमावृत्तिः' }; let m = 0;
  for (const r of RES) { if (!r.why) continue; for (const c of r.why.cards) { const a = SA[r.n + '|' + c.word]; const i = c.why.findIndex(w => w.t === 'sup'); if (!a || i < 0) continue;
    const q = `${REFN2[a.ref] || a.ref}: “${a.quote}”`;
    const line = a.kind === 'carried' ? { t: 'anu', pid: '1.3.11', txt: a.sutra ? `runs on from ${a.sutra} ${a.sutraText}` : `runs on from an earlier sūtra — as the ${REFN2[a.ref] || a.ref} says`, q: a.quote }
      : a.kind === 'adhikara' ? { t: 'anu', pid: '1.3.11', txt: `under the heading ${a.sutra} ${a.sutraText}`, q: a.quote }
      : a.kind === 'paribhasha' ? { t: 'pb', pid: a.sutra, txt: a.explain, pt: pt(a.sutra), q: a.quote }
      : { t: 'vy', txt: a.quote ? `${a.explain} — ${q}` : a.explain };
    c.why.splice(i, 1, line); m++; } }
  console.log(`supplied words given their source: ${n} by rule, ${m} read from the Gemini and helper passes`); }
// enumerations keep their items apart in the Kāśikā style (3.4.78 “तिप् तस् झि …” had become “तिप् तो झि”, 1.3.29 “गम्यृच्छि”): the sūtra's own
// word-parts listed right before इति / इत्येते… get join()'s list guard (“_”), so sandhi never fuses two items (2026-11-18)
const LSTV = { 'ड्': 'ट्', 'ब्': 'प्', 'ग्': 'क्', 'द्': 'त्', 'ज्': 'च्' }, lstN = g => String(g).replace(/-/g, '').replace(/ं(?=[क-ह])/g, 'म्').replace(/(ड्|ब्|ग्|द्|ज्)$/, m => LSTV[m]);
const markLists = (toks, r) => { const seg = new Set(); for (const w of r.words || []) { const gs = (w.segs || String(w.form).split('-')).map(String); gs.forEach((g, i) => { seg.add(lstN(g));
    if (i === gs.length - 1) { const b = g.replace(/(ेभ्यः|ाभ्याम्|ानाम्|ेषाम्|ेषु|ाणाम्|भ्यः|भ्याम्|योः|ानि|ोः|ैः|ाः|ाम्|ः|स्य|ात्|ौ|े|म्)$/, ''); if (b !== g) { seg.add(lstN(b)); seg.add(lstN(b.replace(/ि$/, 'ि'))); } } }); }
  const out = toks.slice(), pairSeg = new Set();   // two list items that make up one sūtra part (3.2.42 सर्व + कूल = सर्वकूल)
  for (let k = 1; k < out.length; k++) if (seg.has(lstN(out[k - 1] + out[k]))) { pairSeg.add(k - 1); pairSeg.add(k); }
  const isSegAt = k => seg.has(lstN(out[k])) || pairSeg.has(k); let hit = false;
  for (let i = 1; i < out.length; i++) { if (!/^(इति|इत्येत)/.test(out[i]) || /^'/.test(out[i - 1])) continue; let k = i - 1; while (k >= 0 && isSegAt(k)) k--;
    if (i - 1 - k >= 2) { for (let j = k + 1; j < i; j++) out[j] = out[j] + '_'; hit = true; } }
  return hit ? out : null; };
for (const r of RES) { if (!r.genC || !r.gen || r.handFix) continue; const T = r.genC.split(' ').filter((t, i, a) => !(/^(परः|परौ|पराः)$/.test(t) && a[i + 1] === 'च') && !(t === 'च' && /^(परः|परौ|पराः)$/.test(a[i - 1])));
  const M = markLists(T, r); if (!M) continue; const g = join(M); if (g !== r.gen) { r.genListFix = r.gen; r.gen = g; } }
// ── style fixes (peer review 2026-11-18)
// Kaumudī style: a visarga before स्यात्/स्युः stays (6.1.77 printed “यणादेशो स्यात्” — the ओ was the sandhi before भवति)
for (const r of RES) { if (!r.genK || !r.genC) continue; const w = r.genK.split(' '), T = r.genC.split(' '), pv = T[T.length - 2] || '';
  if (w.length < 2 || !/^(स्यात्|स्याताम्|स्युः)$/.test(w[w.length - 1]) || !/ः$/.test(pv)) continue;
  const i = w.length - 2; if (/ो$/.test(w[i]) && /[^ा]ः$/.test(pv)) w[i] = w[i].slice(0, -1) + 'ः'; else if (/ा$/.test(w[i]) && /ाः$/.test(pv)) w[i] += 'ः'; else continue;
  r.genK = w.join(' '); }
// verb number: a plural / dual subject right before the final भवति (2.3.32 “विभक्ति प्रत्ययाः भवति”, 3.4.78 “आदेशाः भवति”) takes भवन्ति / भवतः
for (const r of RES) { const t = (r.genC || '').split(' '); if (t[t.length - 1] !== 'भवति' || r.hand) continue; const pv = t[t.length - 2] || '';
  const v = /ाः$/.test(pv) ? ['भवन्ति', 'स्युः'] : /ौ$/.test(pv) ? ['भवतः', 'स्याताम्'] : null; if (!v) continue;
  const old = r.genC; t[t.length - 1] = v[0]; r.genC = t.join(' '); r.gen = r.gen.replace(/भवति$/, v[0]); r.genK = r.genK.replace(/स्यात्$/, v[1]);
  for (const st of r.steps || []) if (st.now === old) st.now = r.genC; if (r.why && r.why.fin === old) r.why.fin = r.genC; }
// 1.1.1 / 1.1.2: “आत् ऐच् च 'वृद्धिः' …” is the Kaumudī's split (आदैच्च), not the Kāśikā's wording — the Kāśikā style is the class style with sandhi
for (const r of RES) if (r.gen && / च '/.test(r.gen) && /इति संज्ञा/.test(r.gen) && r.genC) { const t = r.genC.split(' '), k = t.findIndex(x => !/^[अआइईउऊऋॠऌएऐओऔ]३?$/.test(x)); r.gen = k > 0 ? t.slice(0, k).join(' ') + ' ' + join(t.slice(k)) : join(t); }   // the sound names stay apart (आ ऐ औ), sandhi from इति on
for (const r of RES) for (const st of r.steps || []) if (st.fin) { if (/^Kāśikā and Kaumudī/.test(st.what)) st.now = r.gen; else if (/^Kāśikā style/.test(st.what)) st.now = r.gen; else if (/^Kaumudī style/.test(st.what)) st.now = r.genK; }
// one step per rule (Harsha 2026-11-18, yes to the review's point): a sound name built by two rules (1.1.1 आत्-ऐच्: 1.1.70 makes आत् = आ,
// 1.1.71 makes ऐच् = ऐ औ) gets a step for each rule before the step that uses the whole
for (const r of RES) { const S = r.steps || []; for (let i = 1; i < S.length; i++) { const st = S[i];
  if (st.sub || !(st.pids || []).includes('1.1.70') || !st.pids.includes('1.1.71')) continue;
  const seg = String((st.w || [])[0] || '').split('-'), X = seg.find(g => /^[अआइईउऊऋॠऌएऐओऔ]त्$/.test(g)), Y = seg.find(g => PRATYAHARA.has(g));
  const m = String(st.what).match(/“([^”]+)”/), snd = m ? m[1].split(' इति ')[0].split(' ') : [];
  if (!X || !Y || snd.length < 2 || snd[0] !== X[0]) continue;
  const v = snd[0], rest = snd.slice(1).join(' '), prevNow = S[i - 1].now;
  const A = { pids: ['1.1.70'], what: `${X} → ${v}: a vowel with त् after it means only that length`, now: prevNow.split(' ').map(t => t === X ? v : t).join(' '), sub: { q: `${X} = ?`, ans: v, pid: '1.1.70' } };
  const B = { pids: ['1.1.71'], what: `${Y} → ${rest}: a pratyāhāra — from the first sound up to the one before the इत्`, now: A.now.split(' ').map(t => t === Y ? rest : t).join(' '), sub: { q: `${Y} = ?`, ans: rest, pid: '1.1.71' } };
  st.pids = st.pids.filter(p => p !== '1.1.70' && p !== '1.1.71'); st.subDone = ['1.1.70', '1.1.71']; S.splice(i, 0, A, B); i += 2; } }
// ── hand-fixed final vṛttis (handwritten.json entries with "keep": true) — applied after the role table
for (const r of RES) { const H = HANDFIX[r.n]; if (!H) continue;
  // an entry with no "c" only adds paribhāṣā steps (the gap pass, 2026-11-18): the vṛtti is left as built
  if (H.c) { const toks = H.c.split(' '); r.genBeforeFix = r.genC; r.genC = H.c; r.gen = join(markLists(toks, r) || toks); { const KM = { 'भवति': 'स्यात्', 'भवतः': 'स्याताम्', 'भवन्ति': 'स्युः' }; r.genK = joinFull(toks.map(t => { const m = t.match(/^(.*?)(,?)$/); return KM[m[1]] ? KM[m[1]] + m[2] : t; })); } r.genSource = 'hand'; r.handFix = true; }
  const drop = new Set(H.drop || []);
  if (drop.size) { r.P = (r.P || []).filter(p => p.layer === 1 || !drop.has(p.pid)); if (r.steps) r.steps = r.steps.filter(st => !(st.pids || []).length || (st.pids || []).some(p => !drop.has(p)));
    if (r.why) { r.why.cards.forEach(c => { c.why = c.why.filter(w => !drop.has(w.pid)); c.no = (c.no || []).filter(w => !drop.has(typeof w === 'string' ? w : w.pid)); }); r.why.left = (r.why.left || []).filter(w => !drop.has(w.pid)); } }
  for (const [pid, what, now] of H.steps || []) { const pids = pid ? pid.split(',') : [];
    for (const q of pids) { const ex = (r.P || []).find(p => p.pid === q && p.layer !== 1); if (ex) { ex.status = '✔'; ex.trigger = what; ex.effect = now; } else (r.P = r.P || []).push({ pid: q, status: '✔', layer: 2, trigger: what, effect: now }); }
    if (r.steps) { const fi = r.steps.findIndex(st => st.fin); r.steps.splice(fi >= 0 ? fi : r.steps.length, 0, { pids, what, now }); }
    if (r.why) r.why.cards.push({ q: ['', H.c ? 'how the clauses go' : 'what the references add'], role: 'step', word: '', own: true, vib: '', ans: now, why: pids.length ? pids.map(q => ({ t: 'pb', pid: q, txt: what, pt: ((BYID[sid(q)] || {}).s) || (/^PIS /.test(q) ? (PIS[q.slice(4)] || '') : '') })) : [{ t: 'case', txt: what }], no: [], ev: null }); }
  if (!H.c) continue;
  const finWhat = 'final vṛtti written by hand from the references (the vṛtti built from the role table was found wrong in review)';
  if (r.steps) { const f = r.steps.find(st => st.fin); if (f) { f.now = H.c; f.what = finWhat; } else r.steps.push({ pids: [], what: finWhat, now: H.c, fin: true }); }
  // the Kāśikā / Kaumudī style lines follow the hand-written vṛtti too (they still showed the role-table version — found 2026-11-18)
  for (const st of r.steps || []) if (st.fin) { if (/^Kāśikā and Kaumudī/.test(st.what) || /^Kāśikā style/.test(st.what)) st.now = r.gen; else if (/^Kaumudī style/.test(st.what)) st.now = r.genK; }
  if (r.steps && r.gen === r.genK) { const ks = r.steps.filter(st => st.fin && /^Kāśikā style|^Kaumudī style/.test(st.what)); if (ks.length === 2) { ks[0].what = 'Kāśikā and Kaumudī style (the same here): leave out what is implied, apply sandhi'; r.steps.splice(r.steps.indexOf(ks[1]), 1); } }
  if (r.why) { r.why.fin = H.c; r.why.note = H.note || ''; }   // review 2026-11-18: no process history on the page — only a note a student needs
  r.notes = (r.notes || []).filter(x => !/^\?/.test(x)); }
// ── अङ्गस्य apposition fix (Harsha approved 2026-11-20, audit/APPOSITION-review.md): the carried heading अङ्गस्य (6.4.1) was rendered as a
// second “place” next to the real one (“च्छ्वोः स्थाने अङ्गस्य स्थाने”), equating a sound or a suffix with the aṅga — the reading the Bhāṣya
// rejects at 7.2.35. P1: the aṅga is the whole (“अङ्गस्य च्छ्वोः स्थाने”); P2: drop the अङ्गस्य apposed to a suffix (Kāśikā leaves it implied).
// Applied only where the vṛtti is still exactly the reviewed text; anything else is printed, not changed.
{ let APP = []; try { APP = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', 'APPOSITION-proposals.json'), 'utf8')); } catch (e) {}
  let nA = 0; const skipped = [];
  for (const row of APP) { if (!row.proposed) continue; const r = RES.find(x => x.n === row.n); if (!r) continue;
    if ((r.genC || '').trim() !== row.ours.trim()) { skipped.push(row.n); continue; }
    const toks = row.proposed.trim().split(' '); const was = r.genC;
    r.genC = row.proposed.trim(); r.gen = join(markLists(toks, r) || toks);
    { const KM = { 'भवति': 'स्यात्', 'भवतः': 'स्याताम्', 'भवन्ति': 'स्युः' }; r.genK = joinFull(toks.map(t => { const m = t.match(/^(.*?)(,?)$/); return KM[m[1]] ? KM[m[1]] + m[2] : t; })); }
    for (const st of r.steps || []) { if (st.now === was) st.now = r.genC; if (st.fin && /^Kāśikā and Kaumudī/.test(st.what || '')) st.now = r.gen; else if (st.fin && /^Kāśikā style/.test(st.what || '')) st.now = r.gen; else if (st.fin && /^Kaumudī style/.test(st.what || '')) st.now = r.genK; }
    if (r.why && r.why.fin === was) r.why.fin = r.genC;
    r.notes = (r.notes || []).concat([`अङ्गस्य is the whole, not apposed to the sound/suffix replaced (paribhāṣā audit, 1.4.13; Kāśikā: “${String(r.kv || '').slice(0, 90)}…”)`]);
    nA++; }
  console.log(`अङ्गस्य apposition fix: ${nA} vṛttis corrected${skipped.length ? ` · skipped (text changed since review): ${skipped.join(' ')}` : ''}`); }
// ── tadādi audit (Harsha 2026-11-20): PIS 33 यस्मिन्विधिस्तदादावल्ग्रहणे holds only for a SOUND (letter / pratyāhāra; the commentaries
// count the augment इट् too) in the 7th that qualifies a 7th-case word — Nāgeśa: “विशेष्यविशेषणयोरुभयोः सप्तम्यन्तत्व एव प्रवर्तते”.
// Elsewhere a reference's “X-आदि” has another source: (a) the sūtra's own word already says -आदि → no paribhāṣā; (b) the commentaries
// carry “आदि” from an earlier sūtra + sāmarthya, or read it by sāmarthya → cite them (entries below, shown as “not a paribhāṣā”).
{
  const CQ = (c, n, q) => `${c} on ${n}: “${q}”`;
  PB['ādi ← 1.1.73'] = { id: 'ādi ← 1.1.73', kind: 'anuvṛtti + sāmarthya', text: 'वृद्धिर्यस्याचामादिस्तद्वृद्धम् (1.1.73) इत्यत आदिग्रहणमनुवर्तते', src: 'Nyāsa and Padamañjarī on 1.2.2 and 1.2.9', gloss: 'not PIS 33 (the sound is not in the 7th): the word “ādi” runs on from 1.1.73, and a suffix that is only इट् / only a झल् is impossible or pointless, so the sound names what BEGINS the suffix',
    skh: 'the commentaries', sk: { prelude: '', text: [CQ('न्यासः', '1.2.2', 'एवं मन्यते - <<वृद्धिर्यस्याचामादिस्तद् वृद्धम्>> [[1.1.73]] इत्यत आदिग्रहणमनुवर्तते, तेन चेड् विशिष्यते … तस्य च केवलस्यादिभूतस्य ङित्वे प्रयोजनं नास्तीति सामर्थ्यादिडादेः प्रत्ययस्य ङित्त्वं विज्ञायत इति'), CQ('पदमञ्जरी', '1.2.2', 'वृद्धसंज्ञासूत्राद् यस्यादिरिति वर्तते, तेनेड्विशेष्यते-यस्यादिरिडिति'), CQ('न्यासः', '1.2.9', 'वृद्धसंज्ञा [[1.1.72]] सूत्रादिहादिग्रहणमनुवर्तते, तेन झल् विशिष्यते; तस्मात् तदादिविधिरेव विज्ञायिते, न तदन्तविधिरिति (the Nyāsa numbers the vṛddha-saṃjñā sūtra 1.1.72; it is 1.1.73 वृद्धिर्यस्याचामादिस्तद्वृद्धम्)'), CQ('पदमञ्जरी', '1.2.9', 'कथं पुनस्सत्सप्तमीनिर्देशे तदादिविधिः शक्यो विज्ञातुम् ? झल्मात्रस्य सनोऽसम्भवात्')].join(' | ') } };
  PB['ādi ← 6.1.179'] = { id: 'ādi ← 6.1.179', kind: 'anuvṛtti + sāmarthya', text: 'षट्त्रिचतुर्भ्यो हलादिः (6.1.179) इत्यत आदिग्रहणमनुवर्तते', src: 'Padamañjarī on 6.1.183', gloss: 'not PIS 33 (झल् is not in the 7th): no case ending consists of a झल् alone, so “ādi” runs on from 6.1.179 — a case ending BEGINNING with a झल्',
    skh: 'the commentaries', sk: { prelude: '', text: CQ('पदमञ्जरी', '6.1.183', 'कथं पुनरसति सप्तमीनिर्देशे तदादिविधिर्भवति; केवलझलात्मिकाया विभक्तेरभावात्, अस्तु तर्हि तदन्तविधिः, का पुनर्झलन्ता विभक्ति, शसादिः सकारान्ता ? एवं तर्हि \'षट्त्रिचतुर्भ्या हलादिः\' इत्यत आदिग्रहणमनुवर्तते, दिवः परा विभक्तिर्नोदाता भवति, कीदृशी ? यस्या झलादिरिति (the quoted sūtra is 6.1.179 षट्त्रिचतुर्भ्यो हलादिः)') } };
  PB['sāmarthya (8.4.31)'] = { id: 'sāmarthya (8.4.31)', kind: 'sāmarthya', text: 'इजुपधस्य हलन्तत्वाव्यभिचारात् सामर्थ्यादादिविशेषणं हल्ग्रहणम्', src: 'Padamañjarī and Tattvabodhinī on 8.4.31', gloss: 'not PIS 33 (हलः is in the 5th): a root with इ/उ as penultimate always ENDS in a consonant, so हल् can only describe how it BEGINS',
    skh: 'the commentaries', sk: { prelude: '', text: [CQ('पदमञ्जरी', '8.4.31', 'इजुपधस्य हलन्तत्वाव्यभिचारात् सामर्थ्यादादिविशेषणं हल्ग्रहणमित्यर्थः'), CQ('तत्त्वबोधिनी', '8.4.31', 'इजुपधस्य हलन्तत्वाऽव्यभिचाराद्धल इत्यनेन तदादित्वं लक्ष्यत इत्याह — हलादेरिति')].join(' | ') } };
  const REW = { '1.2.2': 'ādi ← 1.1.73', '1.2.3': 'ādi ← 1.1.73', '1.2.9': 'ādi ← 1.1.73', '1.2.10': 'ādi ← 1.1.73', '1.2.11': 'ādi ← 1.1.73', '1.2.12': 'ādi ← 1.1.73', '1.2.13': 'ādi ← 1.1.73', '6.1.183': 'ādi ← 6.1.179', '6.1.184': 'ādi ← 6.1.179', '8.4.31': 'sāmarthya (8.4.31)' };
  // a word pulled back from the next sūtra — the tadādi happens there, the reading travels with the word (Bālamanoramā)
  const PULL = { '4.1.88': ['अचि (pulled back from 4.1.89, there a 7th qualifying a 7th; turned into the 6th, qualifying the taddhita)', 'Bālamanoramā: “‘गोत्रेऽलुगचि’ इत्युत्तरसूत्रेऽचीति सप्तम्यन्तस्य गोत्रविशेषणतया तदादिविधिः । अजादावित्यर्थकमचीति पदमिहाऽपकृष्यते । तच्च षष्ठ्या विपरिणतं तद्धितविशेषणम्” (spelling normalised; the digitised text reads गोत्रेऽलुगची॑त्युत्तर…, षष्ठआ)'],
    '7.2.84': ['हलि (pulled back from 7.2.85, qualifying विभक्तौ — both 7th)', 'Bālamanoramā: “‘रायो हलि’ इत्यतो हलीत्यपकृष्यते । तच्च विभक्तेर्विशेषणं, तदादिविधिः” (spelling normalised; the digitised text reads रायो हली॑त्यो हलीत्यपकृष्यते)'] };
  const wordOf = p => String(p.trigger || '').split(':')[0].replace(/\s*\(.*$/, '').trim();
  const pbPt = q => (PB[q] || {}).text || '';
  let nDrop = 0, nRew = 0; const dropped = [], rew = [];
  for (const r of RES) {
    if (!r.P) continue;
    const mine = r.P.filter(p => p.pid === 'PIS 33' && p.layer !== 1);
    if (!mine.length) continue;
    const to = REW[r.n];
    if (PULL[r.n]) { for (const p of mine) { p.trigger = PULL[r.n][0]; p.effect = (p.effect || '') + ' — ' + PULL[r.n][1]; } continue; }
    const own = !to && mine.every(p => /ाद|आद/.test(wordOf(p)));
    if (!to && !own) continue;
    const swap = arr => (arr || []).map(q => q === 'PIS 33' ? to : q).filter(Boolean);
    if (to) {
      for (const p of mine) { p.pid = to; p.trigger = `${wordOf(p)}: not in the 7th — ${PB[to].src}`; }
      for (const st of r.steps || []) if ((st.pids || []).includes('PIS 33')) { st.pids = swap(st.pids); st.what = String(st.what).replace(/\(tadādi\)|\(PIS 33\)|tadādi/g, `(${to})`); }
      for (const c of (r.why && r.why.cards) || []) for (const w of c.why || []) if (w.pid === 'PIS 33') Object.assign(w, { pid: to, pt: pbPt(to), txt: PB[to].gloss });
      for (const l of (r.why && r.why.left) || []) if (l.pid === 'PIS 33') Object.assign(l, { pid: to, pt: pbPt(to), txt: PB[to].gloss });
      for (const x of r.roles || []) if (x.pb) x.pb = swap(x.pb);
      r.tadadiBy = to; nRew++; rew.push(r.n);
    } else {
      r.P = r.P.filter(p => !(p.pid === 'PIS 33' && p.layer !== 1));
      if (r.steps) r.steps = r.steps.filter(st => !((st.pids || []).length === 1 && st.pids[0] === 'PIS 33' && /PIS 33/.test(st.what || '')));
      for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== 'PIS 33');
      if (r.why) { for (const c of r.why.cards) c.why = (c.why || []).filter(w => w.pid !== 'PIS 33'); r.why.left = (r.why.left || []).filter(l => l.pid !== 'PIS 33'); }
      for (const x of r.roles || []) if (x.pb) x.pb = x.pb.filter(q => q !== 'PIS 33');
      r.tadadiBy = 'own'; nDrop++; dropped.push(r.n);
    }
  }
  // a SUFFIX name in the 7th the auto-lexicon took for a sound (घे → “घकारादौ”): no tadādi — the Kāśikā reads each as the suffix / ending
  const SFXN = { '6.4.96': ['घे', 'घप्रत्यये परतः'], '6.4.97': ['घे', 'घ (carried)'], '6.4.135': ['अणि', 'अणि परतः'], '6.4.147': ['ढे', 'ढे परतः'], '7.3.28': ['ढे', 'ढे परतः'], '7.1.59': ['शे', 'शे प्रत्यये परतः'], '7.2.96': ['ङसि', 'ङसि परतः'], '7.2.105': ['अति', 'अतीत्येतस्यां विभक्तौ परतः'], '7.3.18': ['जे', 'तत्र यस्तद्धितो विहितस्तस्मिन्'], '7.3.64': ['के', 'के प्रत्यये'], '7.4.13': ['के', 'के प्रत्यये परतः'], '7.3.88': ['तिङि', 'तिङि सार्वधातुके'] };
  const sfxDropped = [];
  for (const [n, [w]] of Object.entries(SFXN)) { const r = RES.find(x => x.n === n); if (!r || !r.P) continue;
    const before = r.P.length; r.P = r.P.filter(p => !(p.pid === 'PIS 33' && p.layer !== 1 && wordOf(p) === w)); if (r.P.length === before) continue;
    const ALSO = new RegExp(` — also: ${w}: a (single sound|sound group) in the 7th → → \\S+ \\(what BEGINS with it\\)`);
    for (const st of r.steps || []) if (String(st.what).startsWith(w + ' →') || ALSO.test(st.what || '')) { st.what = String(st.what).replace(ALSO, ''); st.pids = (st.pids || []).filter(q => q !== 'PIS 33'); }
    if (r.steps) r.steps = r.steps.filter(st => !((st.pids || []).length === 0 && new RegExp(`^${w}: a (single sound|sound group) in the 7th`).test(st.what || '')));
    if (r.why) for (const c of r.why.cards) if (c.word === w) c.why = (c.why || []).filter(x => x.pid !== 'PIS 33');
    if (!r.P.some(p => p.pid === 'PIS 33' && p.layer !== 1)) { if (r.why) r.why.left = (r.why.left || []).filter(l => l.pid !== 'PIS 33'); for (const x of r.roles || []) if (x.pb) x.pb = x.pb.filter(q => q !== 'PIS 33'); }
    sfxDropped.push(n); }
  console.log(`tadādi audit: PIS 33 dropped on a suffix name read as a sound: ${sfxDropped.length} (${sfxDropped.join(' ')})`);
  console.log(`tadādi audit: PIS 33 dropped where the sūtra itself says -आदि: ${nDrop} (${dropped.join(' ')}) · re-cited to the commentaries: ${nRew} (${rew.join(' ')})`);
  // anything left that is not a 7th-case word deserves a look (printed, never silent)
  for (const r of RES) for (const p of (r.P || [])) if (p.pid === 'PIS 33' && p.layer !== 1) { const w = (r.words || []).find(x => x.form === wordOf(p)); if (w && w.wcase !== 7) console.log(`tadādi audit: CHECK ${r.n} — ${wordOf(p)} is case ${w.wcase} in the data`); }
}
// ── paribhāṣā applicability audit (Harsha 2026-11-20): blind Opus audits per paribhāṣā (audit/<pid>-audit.md), quotes verified verbatim,
// reviewed → audit/verdicts.json (audit/make_verdicts.js). A not-licensed credit is dropped or re-pointed (1.1.67 suffix placement → 3.1.2);
// a commentator mention (layer 1) that names the rule without applying it stays visible as ✖ with the reason. Gate: an ✔ credit of an audited
// paribhāṣā on a sūtra the audit never saw is printed as UNAUDITED (check.sh fails on it).
const AUDIT = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', 'verdicts.json'), 'utf8')).pids; } catch (e) { return {}; } })();
{
  const nW = t => String(t || '').replace(/[-\s‹›“”]/g, '');
  const wordOf = p => String(p.trigger || '').split(':')[0].replace(/\s*\(.*$/, '').trim();
  const stat = {}, unaudited = [], audited_ok = new Set();
  for (const r of RES) {
    if (!r.P) continue;
    for (const [pid, A] of Object.entries(AUDIT)) {
      const V = A.notLicensed[r.n];
      if (!V) continue;
      for (const v of V) {
        const cand = r.P.filter(p => p.pid === pid && p.status === '✔' && (v.layer === 0 ? true : v.layer === 1 ? p.layer === 1 : p.layer !== 1));   // layer 0 = any (a deny from the auditor's “missed” note)
        const exact = cand.filter(p => nW(wordOf(p)) === nW(v.word));   // exact word first — two triggers can differ only by a tail (4.2.123 “… a sound” / “… a sound group”)
        const mine = !v.word || v.layer === 1 ? cand : exact.length ? exact : cand.filter(p => nW(p.trigger).includes(nW(v.word)));
        if (!mine.length) continue;
        const k = `${pid}→${v.act || v.to || (v.layer === 1 ? '✖' : 'drop')}`; stat[k] = (stat[k] || 0) + mine.length;
        // keep the credit as a DERIVATION note (shown on the paribhāṣā list, not as a reading step) / mark it ✖ with the commentary's denial
        if (v.act === 'derivation' || v.act === 'deny') {
          for (const p of mine) { if (v.act === 'derivation') { p.status = '↪'; p.effect = `applies later, in the derivation — not a step in reading this sūtra (Kāśikā on ${pid}: “स्थानिवदादेशो भवति स्थान्याश्रयेषु कार्येष्वनलाश्रयेषु”)`; } else { p.status = '✖'; p.effect = `the commentary says it does not apply here — ${String(v.why).slice(0, 200)}`; } }
          if (!r.P.some(p => p.pid === pid && p.status === '✔')) { for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== pid); if (r.why) { for (const c of r.why.cards) c.why = (c.why || []).filter(x => x.pid !== pid); r.why.left = (r.why.left || []).filter(l => l.pid !== pid); } for (const x of r.roles || []) if (x.pb) x.pb = x.pb.filter(q => q !== pid); }
          continue; }
        if (v.layer === 1) { for (const p of mine) { p.status = '✖'; p.effect = `named here, not applied — ${v.why}`; } if (!r.P.some(p => p.pid === pid && p.status === '✔')) { if (r.why) for (const c of r.why.cards) c.why = (c.why || []).filter(x => x.pid !== pid); for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== pid); } continue; }
        const w = v.word || wordOf(mine[0]);
        const onW = x => !w || nW(x.word) === nW(w) || (x.w || []).some(y => nW(y) === nW(w)) || nW(x.what).startsWith(nW(w));
        if (v.to && !PB[v.to] && /^PIS (\d+)$/.test(v.to) && PIS[v.to.slice(4)]) PB[v.to] = { id: v.to, kind: 'परिभाषेन्दुशेखरः', text: PIS[v.to.slice(4)], src: 'Paribhāṣenduśekhara ' + v.to.slice(4), link: null, gloss: 'cited by the paribhāṣā audit — see Nāgeśa\'s text' };   // a PIS an auditor names that the engine had no entry for (e.g. PIS 105)
        if (v.to && !PB[v.to] && /^\d+\.\d+\.\d+$/.test(v.to) && BYID[sid(v.to)]) PB[v.to] = { id: v.to, kind: /^S/.test(BYID[sid(v.to)].type || '') ? 'saṃjñā' : 'paribhāṣā', text: stext(v.to), src: 'sūtra ' + v.to, link: 'https://ashtadhyayi.com/sutraani/' + v.to.replace(/\./g, '/'), gloss: 'cited by the paribhāṣā audit' };   // e.g. 1.3.3 (it-saṃjñā) from the 1.1.70 audit
        if (v.to) {
          for (const p of mine) { p.effect = `${(PB[v.to] || {}).gloss || ''}${(PB[v.to] || {}).text ? ` — “${PB[v.to].text}”` : ''}`; }   // the old rule's effect text no longer fits (1.1.49 → 1.1.46 still said “the thing replaced”)
          for (const p of mine) { p.pid = v.to; p.trigger = v.to === '3.1.2' ? `${w}: the suffix is placed after it — ${v.to} ${((PB[v.to] || {}).text) || ''} (not ${pid}: ${pid} needs an element already there; Mahābhāṣya on 3.1.2)` : `${w}: ${v.to} ${((PB[v.to] || {}).text) || ''} (not ${pid} — paribhāṣā audit: ${String(v.why).slice(0, 160)})`; }
          const dup = r.P.filter(p => p.pid === v.to && p.layer !== 1); if (dup.length > 1) r.P = r.P.filter(p => p === dup[0] || !dup.includes(p));
          for (const st of r.steps || []) if ((st.pids || []).includes(pid) && onW(st)) st.pids = [...new Set(st.pids.map(q => q === pid ? v.to : q))];
          if (r.why) for (const c of r.why.cards) if (onW(c)) for (const x of c.why || []) if (x.pid === pid) Object.assign(x, { pid: v.to, pt: (PB[v.to] || {}).text || '', txt: (PB[v.to] || {}).gloss || '' });
        } else {
          r.P = r.P.filter(p => !mine.includes(p));
          for (const st of r.steps || []) if ((st.pids || []).includes(pid) && onW(st)) st.pids = st.pids.filter(q => q !== pid);
          if (r.why) for (const c of r.why.cards) if (onW(c)) c.why = (c.why || []).filter(x => x.pid !== pid);
        }
        // no applying credit left → nothing on the page may cite the rule (cards / steps / roles whose word did not match exactly)
        if (!r.P.some(p => p.pid === pid && p.status === '✔' && p.layer !== 1)) {
          if (r.why) { r.why.left = (r.why.left || []).filter(l => l.pid !== pid); for (const c of r.why.cards) if (v.to) { for (const x of c.why || []) if (x.pid === pid) Object.assign(x, { pid: v.to, pt: (PB[v.to] || {}).text || '', txt: (PB[v.to] || {}).gloss || '' }); } else c.why = (c.why || []).filter(x => x.pid !== pid); }
          for (const st of r.steps || []) if ((st.pids || []).includes(pid)) st.pids = [...new Set(st.pids.map(q => q === pid ? v.to : q).filter(Boolean))];
          for (const x of r.roles || []) if (x.pb) x.pb = [...new Set(x.pb.map(q => q === pid ? v.to : q).filter(Boolean))]; }
        if (v.to) audited_ok.add(r.n + '|' + v.to);   // a credit re-pointed by an audit was judged by that audit (e.g. 1.1.55 → 1.1.52 before 1.1.52's own audit)
        (r.auditFix = r.auditFix || {})[pid] = v;
      }
    }
    // an audited MISS: the engine marked the rule ✖ but the sources apply it (e.g. through a carried 5th — Kāśikā 7.4.88 “अभ्यासात् परस्य”)
    for (const [pid, A] of Object.entries(AUDIT)) for (const m of (A.missed || []).filter(m => m.n === r.n)) {
      const ex = r.P.find(p => p.pid === pid && p.layer !== 1 && p.status === '✖');   // only turn a ✖ into ✔ — never overwrite another word's ✔
      const eff = m.why + (m.quote ? ` — ${m.quote.file} ${m.quote.id}: “${m.quote.quote}”` : '');
      if (ex) Object.assign(ex, { status: '✔', trigger: 'audit: applies (the engine had marked it not applicable)', effect: eff }); else r.P.push({ pid, status: '✔', layer: 2, trigger: 'audit: applies', effect: eff });
      for (const st of r.steps || []) if (st.no) st.no = st.no.filter(q => q !== pid);
      stat[`${pid} ✖→✔`] = (stat[`${pid} ✖→✔`] || 0) + 1; audited_ok.add(r.n + '|' + pid); }
    for (const [pid, A] of Object.entries(AUDIT)) if (r.P.some(p => p.pid === pid && p.status === '✔') && !A.audited.includes(r.n) && !audited_ok.has(r.n + '|' + pid)) unaudited.push(`${r.n} ${pid}`);
  }
  // a DISPUTED credit (Harsha 2026-11-20: “put a note that this ambiguity exists”): kept as the Kāśikā reads it, with a note naming the other view
  const DISPUTE = { IT: (r) => {
    const RE = /[^।॥]*(?<![ऀ-ॿ])(?:परत(?:ः|ो|\s)|परे(?:\s|$|ऽ)|परयोः|परेषु)[^।॥]*/, kv = (String(r.kv || '').match(RE) || [''])[0].trim(), pv = (String(r.pv ? r.pv.arthaFull || r.pv.artha || '' : '').match(RE) || [''])[0].trim(), sk = (String(r.sk || '').match(RE) || [''])[0].trim(), lsk = (String(r.lsk || '').match(RE) || [''])[0].trim();
    const MBH = 'the Mahābhāṣya on 6.4.62 (“आर्धधातुकस्येट् यावानिण् नाम स सर्व आर्धधातुकस्य भवतीति विज्ञेयम्”) and the Nyāsa on 7.2.35 make every इट् the augment of the ārdhadhātuka suffix itself, so on that view the 7th names the suffix that takes it and 1.1.66 does not decide it';
    return kv || pv || sk || lsk ? `the commentaries differ here: ${kv ? `the Kāśikā (“${kv}”)` : pv ? `the prathamāvṛtti (“${pv}”)` : sk ? `the Siddhānta-kaumudī (“${sk}”)` : `the Laghu-kaumudī (“${lsk}”)`} reads the 7th as what follows — 1.1.66; but ${MBH}`
      : `doubtful: no reference here reads the 7th as what follows (no “परतः”), and ${MBH}`; } };
  let nDisp = 0;
  for (const [pid, A] of Object.entries(AUDIT)) for (const d of A.disputed || []) {
    const r = RES.find(x => x.n === d.n); if (!r || !r.P || !DISPUTE[d.kind]) continue;
    const ps = r.P.filter(p => p.pid === pid && p.status === '✔' && p.layer !== 1 && nW(wordOf(p)) === nW(d.word)); if (!ps.length) continue;
    const note = DISPUTE[d.kind](r);
    if (/^doubtful/.test(note)) {   // Harsha 2026-11-20: drop the doubtful ones (no reference reads the 7th as what follows); keep + note where the commentaries differ
      r.P = r.P.filter(p => !ps.includes(p));
      if (!r.P.some(p => p.pid === pid && p.status === '✔')) { for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== pid); if (r.why) { for (const c of r.why.cards) c.why = (c.why || []).filter(x => x.pid !== pid); r.why.left = (r.why.left || []).filter(l => l.pid !== pid); } for (const x of r.roles || []) if (x.pb) x.pb = x.pb.filter(q => q !== pid); }
      stat['disputed (doubtful, dropped)'] = (stat['disputed (doubtful, dropped)'] || 0) + ps.length; continue; }
    for (const p of ps) { p.disputed = note; if (!String(p.effect).includes('commentaries differ')) p.effect = `${p.effect} — ${note}`; }
    if (r.why) for (const c of r.why.cards) if (nW(c.word) === nW(d.word)) for (const x of c.why || []) if (x.pid === pid && !String(x.txt).includes('commentaries differ')) x.txt = `${x.txt} — ⚠ ${note}`;
    nDisp += ps.length; }
  stat['disputed (noted)'] = nDisp;
  // ruling 2026-11-20 (Harsha, by the Mahābhāṣya on 1.1.44): the saṃjñā names the MEANING of “na vā” — it is needed only where the term
  // विभाषा itself is read; वा / अन्यतरस्याम् / बहुलम् / उभयथा / एकेषाम् / an ācārya convey that meaning by themselves
  const MBH44 = 'Mahābhāṣya on 1.1.44: “आचार्यः खल्वपि सञ्ज्ञामारभमाणो भूयिष्ठमन्यैरपि शब्दैरेतमर्थं सम्प्रत्याययति - बहुलमन्यतरस्यामुभयथा वा एकेषामिति”';
  let n44 = 0;
  for (const r of RES) { if (!r.P) continue;
    const hasVibhasha = /विभाषा/.test(r.s || '') || (r.carried || []).some(c => /विभाषा/.test(c.w || c.word || '')) || (r.words || []).some(w => /विभाषा/.test(w.form || ''));
    if (hasVibhasha) continue;
    const ps = r.P.filter(p => p.pid === '1.1.44' && (p.status === '✔' || p.status === '?') && p.layer !== 1); if (!ps.length) continue;   // “?” = a plain न (1.1.44 audit: not a candidate)
    r.P = r.P.filter(p => !ps.includes(p));
    r.P.push({ pid: '1.1.44', status: '✖', layer: 2, trigger: 'no “विभाषा” in this sūtra', effect: `the option word here carries the meaning itself — the saṃjñā is not needed (${MBH44})` });
    for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== '1.1.44');
    if (r.why) { for (const c of r.why.cards) c.why = (c.why || []).filter(x => x.pid !== '1.1.44'); r.why.left = (r.why.left || []).filter(l => l.pid !== '1.1.44'); }
    for (const x of r.roles || []) if (x.pb) x.pb = x.pb.filter(q => q !== '1.1.44');
    n44 += ps.length; }
  stat['1.1.44 only for विभाषा (Bhāṣya)'] = n44;
  // 4: a paribhāṣā that BARS an audited rule at a sūtra (Harsha 2026-11-20, PIS 68/69/70 for 3.1.94): the bar is credited ✔, the rule shown ✖
  let nBar = 0;
  for (const [pid, A] of Object.entries(AUDIT)) for (const [bar, ns] of Object.entries(A.bars || {})) {
    const m = /^PIS (\d+)$/.exec(bar); if (!m || !PIS[m[1]]) continue;
    if (!PB[bar]) PB[bar] = { id: bar, kind: 'परिभाषेन्दुशेखरः', text: PIS[m[1]], src: 'Paribhāṣenduśekhara ' + m[1], link: null, gloss: `bars ${pid} in its domain` };
    for (const n of ns) { const r = RES.find(x => x.n === n); if (!r || !r.P) continue;
      if (!r.P.some(p => p.pid === bar)) r.P.push({ pid: bar, status: '✔', layer: 2, trigger: `bars ${pid} here`, effect: `“${PIS[m[1]]}” — ${pid} does not apply in this domain (paribhāṣā audit)` });
      const ex = r.P.filter(p => p.pid === pid && p.layer !== 1);
      if (ex.length) for (const p of ex) { p.status = '✖'; p.effect = `barred by ${bar} “${PIS[m[1]]}”`; } else r.P.push({ pid, status: '✖', layer: 2, trigger: `barred by ${bar}`, effect: `“${PIS[m[1]]}”` });
      for (const st of r.steps || []) if (st.pids) st.pids = st.pids.filter(q => q !== pid);
      if (r.why) for (const c of r.why.cards) c.why = (c.why || []).filter(x => x.pid !== pid);
      nBar++; } }
  stat['bars credited'] = nBar;
  // effect-text corrections from the audits (the credit stays; its trigger/effect wording was wrong) — 3.1.94 wrong-utsarga ones become “?” (open)
  let nFix = 0, nOpen = 0;
  for (const [pid, A] of Object.entries(AUDIT)) for (const f of A.effectFix || []) {
    const r = RES.find(x => x.n === f.n); if (!r || !r.P) continue;
    const ps = r.P.filter(p => p.pid === pid && (p.status === '✔' || p.status === '↪') && p.layer !== 1 && (!f.word || nW(wordOf(p)) === nW(f.word) || nW(p.trigger).includes(nW(f.word))));
    for (const p of ps) { const q = f.quote ? ` (${f.quote.file} ${f.quote.id}: “${String(f.quote.quote).slice(0, 160)}”)` : '';
      if (f.open) { p.status = '?'; p.effect = `open — the engine named the wrong utsarga; ${String(f.text).slice(0, 260)}`; nOpen++; }
      else { p.effect = `corrected by the paribhāṣā audit: ${String(f.text).slice(0, 300)}${q}`; nFix++; }
      for (const st of r.steps || []) if ((st.pids || []).includes(pid) && st.what && nW(st.what).startsWith(nW(wordOf(p))) && !/corrected by the audit/.test(st.what)) st.what += f.open ? ` — open: wrong utsarga (paribhāṣā audit)` : ` — corrected by the audit: ${String(f.text).split(' — ')[0].slice(0, 120)}`; } }
  stat['effect texts corrected'] = nFix; stat['3.1.94 wrong-utsarga → open'] = nOpen;
  // verified missed credits from the engine-fix pass (audit/make_candidates.js → blind verifier → audit/ENGINEFIX-verdicts.json):
  // only “licensed” entries are credited; each counts as audited (2026-11-20)
  const EFV = {}; for (const f of fs.readdirSync(path.join(__dirname, 'audit')).filter(f => /^ENGINEFIX-verdicts.*\.json$/.test(f))) { try { const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', f), 'utf8')); for (const [k, v] of Object.entries(j)) EFV[k] = (EFV[k] || []).concat(v); } catch (e) { console.error('bad', f); } }   // every ENGINEFIX-verdicts*.json
  let nEf = 0;
  for (const [pid, xs] of Object.entries(EFV)) { if (!Array.isArray(xs)) continue;
    if (!PB[pid] && /^\d+\.\d+\.\d+$/.test(pid) && BYID[sid(pid)]) PB[pid] = { id: pid, kind: 'paribhāṣā', text: stext(pid), src: 'sūtra ' + pid, link: 'https://ashtadhyayi.com/sutraani/' + pid.replace(/\./g, '/'), gloss: '' };
    for (const x of xs) { if (x.verdict !== 'licensed') continue; const r = RES.find(y => y.n === x.n); if (!r) continue; r.P = r.P || [];
      if (!r.P.some(p => p.pid === pid && p.status === '✔' && (!x.word || p.trigger.startsWith(x.word)))) { r.P.push({ pid, status: '✔', layer: 2, trigger: x.word ? `${x.word}: verified` : 'verified', effect: String(x.why || '').slice(0, 220) }); nEf++; }
      audited_ok.add(r.n + '|' + pid); } }
  stat['verified missed credits added'] = nEf;
  // an audited paribhāṣā may not be CITED (step / card / role) on a sūtra where it has no ✔ credit — such a citation was never audited
  // (2026-11-20: 4.1.89 viṣaya-saptamī, 6.1.177 “मतुपि यो ह्रस्वः”, 7.2.52 / 7.2.12 6th-case readings, 8.3.71 on the base word)
  let stray = 0;
  for (const r of RES) for (const pid of Object.keys(AUDIT)) {
    if ((r.P || []).some(p => p.pid === pid && p.status === '✔')) continue;
    for (const st of r.steps || []) if ((st.pids || []).includes(pid)) { st.pids = st.pids.filter(q => q !== pid); stray++; }
    if (r.why) { for (const c of r.why.cards) { const n0 = (c.why || []).length; c.why = (c.why || []).filter(x => x.pid !== pid); stray += n0 - c.why.length; } r.why.left = (r.why.left || []).filter(l => l.pid !== pid); }
    for (const x of r.roles || []) if (x.pb && x.pb.includes(pid)) { x.pb = x.pb.filter(q => q !== pid); stray++; }
  }
  stat['stray citations removed'] = stray;
  console.log(`paribhāṣā audit: applied ${Object.entries(stat).map(([k, n]) => `${k} ${n}`).join(' · ') || 'nothing'}`);
  fs.writeFileSync('/tmp/vg-unaudited.json', JSON.stringify(unaudited));   // the full list (the log line shows 20)
  console.log(`paribhāṣā audit: UNAUDITED credits ${unaudited.length}${unaudited.length ? ' — ' + unaudited.slice(0, 20).join(', ') : ''}`);
}
// ── 1.1.72 / PIS 23 cards name the viśeṣya (Harsha 2026-11-20, on 3.1.97): tadanta works only for a qualifier agreeing with a qualified word —
// KV 1.1.72 “येन विशेषणेन विधिर्विधीयते”; the viśeṣya may be in the sūtra, carried by an adhikāra, or implied (Padamañjarī “क्वचिदधिकाराद् यथा 'एरच्' इति धातोः”)
{ const CASEN = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th']; const nW = t => String(t || '').replace(/[-\s‹›“”]/g, '');
  const caseOfWord = (r, w) => { const ow = (r.words || []).find(x => nW(x.form) === nW(w)); if (ow && ow.wcase) return ow.wcase; const c = (r.carried || []).find(x => nW(x.w || '') === nW(w)); const a = c && autoOf(sid(c.from), c.w); return a && a.cs ? a.cs : 0; };
  let nV = 0;
  for (const r of RES) { if (!r.why || !r.P) continue;
    for (const c of r.why.cards) for (const x of c.why || []) { if (x.pid !== '1.1.72' && x.pid !== 'PIS 23') continue;
      const p = r.P.find(p => p.pid === x.pid && p.status === '✔' && p.layer !== 1 && /\squalifies\s/.test(p.trigger || '') && (!c.word || nW(p.trigger).startsWith(nW(c.word)) || nW(p.trigger).includes(nW(c.word)))); if (!p) continue;
      const m = /^(.+?)\s+qualifies\s+(\S+)/.exec(p.trigger); if (!m) continue;
      const X = m[1].trim(), Y = m[2].replace(/[,;]$/, '');
      const own = (r.words || []).some(w => nW(w.form) === nW(Y)), car = (r.carried || []).find(cc => nW(cc.w || '') === nW(Y));
      const src = own ? 'in the sūtra' : car ? `${/^(धातोः|अङ्गस्य|प्रत्ययः|पदस्य|ङ्याप्प्रातिपदिकात्)$/.test(car.w) ? 'the heading' : 'carried in'} from ${car.from}` : 'implied';
      const cx = caseOfWord(r, X), cy = caseOfWord(r, Y);
      const agree = cx && cy ? (cx === cy ? `, both in the ${CASEN[cx]}` : '') : '';
      x.txt = `${X} qualifies ${Y} (${src}${agree}) — a qualifier agreeing with the word it qualifies stands for whatever ends in it → “${c.ans || ''}”${x.pid === 'PIS 23' ? ' (a suffix named: from its base up to the suffix)' : ''}`;
      nV++; } }
  console.log(`1.1.72/PIS 23 cards naming their viśeṣya: ${nV}`); }
// ── teaching review (Harsha approved 2026-11-20): a step/card clause that asserts an audited rule which this sūtra no longer credits is
// replaced by “not so — <the auditor's reason for this sūtra>”; 3.1.94 claims on open credits say so. (audit/TEACHING-review.md, contradicted texts)
{ const nW2 = t => String(t || '').replace(/[-\s‹›“”]/g, '');
  const CL = { '1.1.55': [/([^\s—:·]+): more than one sound → it replaces the WHOLE of the place/g],
    '1.1.52': [/([^\s—:·]+): a single sound → it replaces the LAST sound(?: → अन्त्यस्य अलः)?/g, /()the place is a whole aṅga\/dhātu and the replacement is one sound → it replaces the LAST sound(?: → अन्त्यस्य अलः)?/g],
    '1.1.49': [/([^\s—·]+?)(?: \(carried from [\d.]+\))?: 6th case → names the place — the thing replaced \(“स्थाने”\)/g, /([^\s—·]+?)(?: \(carried from [\d.]+\))? → what is replaced: “[^”]*”(?: \([^)]*\))?/g],
    '1.1.56': [/([^\s—·]+) replaces [^→—·]+ → the replacement is treated like what it replaced[^—·]*/g, /()the replacement is treated like what it replaced \(sthānivat\)/g],
    '1.1.46': [/([^\s—:·]+): ṭit augment → it goes at the BEGINNING of the place/g],
    '3.1.94': [/([^\s—·]+ is an apavāda of [^→]+)→[^—·]*they stay available as options/g], 'PIS 8': [/([^\s—·]+ is an apavāda of [^→]+)→[^—·]*they stay available as options/g] };
  const short = t => { const s0 = String(t || ''); let depth = 0, cut = -1;   // first sentence end outside parentheses / quotes
    for (let i = 0; i < s0.length; i++) { const ch = s0[i]; if ('(“[‘'.includes(ch)) depth++; else if (')”]’'.includes(ch)) depth = Math.max(0, depth - 1); else if (ch === '.' && depth === 0 && /\s/.test(s0[i + 1] || ' ')) { cut = i + 1; break; } }
    const x = cut > 0 ? s0.slice(0, cut) : s0; return x.length > 200 ? x.slice(0, 197) + '…' : x; };
  let nS = 0;
  for (const r of RES) { if (!r.P) continue;
    for (const [pid, res] of Object.entries(CL)) {
      const live = r.P.some(p => p.pid === pid && (p.status === '✔' || p.status === '↪'));
      const open = r.P.some(p => p.pid === pid && p.status === '?');
      if (live && !open) continue;
      const v = ((AUDIT[pid] || {}).notLicensed || {})[r.n]; const why = v && v[0] ? short(v[0].why) : open ? 'open — the utsarga named is not the right one (paribhāṣā audit: kṛtya suffixes are taught only in 3.1.95–132, for bhāva/karman)' : `${pid} does not operate here (paribhāṣā audit)`;
      const fix = t => { let o = String(t || ''); for (const re of res) o = o.replace(re, (m, w) => { nS++; return `${w ? w + ': ' : ''}${open && /apavāda/.test(m) ? '' : `not so (${pid}) — `}${why}`; }); return o; };
      for (const st of r.steps || []) if (st.what) st.what = fix(st.what);
      if (r.why) { for (const c of r.why.cards) for (const x of c.why || []) if (x.txt) x.txt = fix(x.txt); for (const l of r.why.left || []) if (l.txt) l.txt = fix(l.txt); }
      for (const p of r.P) if (p.pid === pid && p.status !== '✔' && p.effect) p.effect = fix(p.effect); } }
  console.log(`teaching review: ${nS} contradicted clauses replaced`); }
// ── teaching review A: reviewed gloss on every audited rule (also those registered late), and the reviewed general explanation on every
// card that showed the old generic sentence (specific card texts — e.g. 1.1.72's viśeṣya notes — are kept)
{ let nG = 0, nE = 0;
  for (const [pid, t] of Object.entries(TEACH)) {
    if (!PB[pid]) { const m = /^PIS (\d+)$/.exec(pid);   // rules credited without an entry (1.1.62, 2.1.1, 8.2.1, PIS 119 …): register them so the chip has text + gloss
      if (m && PIS[m[1]]) PB[pid] = { id: pid, kind: 'परिभाषेन्दुशेखरः', text: PIS[m[1]], src: 'Paribhāṣenduśekhara ' + m[1], link: null, gloss: '' };
      else if (/^\d+\.\d+\.\d+$/.test(pid) && BYID[sid(pid)]) PB[pid] = { id: pid, kind: /^S/.test(BYID[sid(pid)].type || '') ? 'saṃjñā' : 'paribhāṣā', text: stext(pid), src: 'sūtra ' + pid, link: 'https://ashtadhyayi.com/sutraani/' + pid.replace(/\./g, '/'), gloss: '' }; }
    if (PB[pid] && t.proposed_gloss) { PB[pid].gloss = t.proposed_gloss; nG++; }
    if (PB[pid] && t.proposed_explanation) PB[pid].explain = t.proposed_explanation;
    const old = (TEACH_IN[pid] || {}), olds = [old.generalExplanation, old.gloss].filter(Boolean);
    if (!t.proposed_explanation || !olds.length) continue;
    for (const r of RES) if (r.why) for (const c of r.why.cards) for (const x of c.why || []) if (x.pid === pid && olds.includes(x.txt)) { x.txt = t.proposed_explanation; nE++; } }
  console.log(`teaching review: ${nG} glosses + ${nE} card explanations replaced`); }
// ── Kaumudī-style line: the sandhi made before भवति (voiced भ्) must be undone before स्यात् / स्याताम् / स्युः (s) — sūtra-level teaching
// review 2026-11-20: “प्रत्ययो स्यात्” (1,173 lines) → “प्रत्ययः स्यात्”; “-द् स्यात्” → “-त् स्यात्”; “-र्स्यात्” → “-ः स्यात्”
{ let nK = 0;
  for (const r of RES) { if (!r.genK) continue; const was = r.genK;
    r.genK = r.genK.replace(/([क-ह])ो (स्यात्|स्याताम्|स्युः)(?=$|[\s,।])/g, '$1ः $2').replace(/([क-हा-ौ])द् ?(स्यात्|स्याताम्|स्युः)(?=$|[\s,।])/g, '$1त् $2').replace(/([ा-ौ]?)र् ?(स्यात्|स्याताम्|स्युः)(?=$|[\s,।])/g, (m, v, w) => `${v}ः ${w}`);
    if (r.genK !== was) { nK++; for (const st of r.steps || []) if (st.now === was) st.now = r.genK; } }
  console.log(`Kaumudī-style sandhi before स्यात् fixed: ${nK}`); }
// ── engine placeholders never shown to students (sūtra-level review 2026-11-21): where the engine could not find the place it wrote “?”
// (“?: 6th case → names the place”, “X replaces ? → …”); drop those clauses / say only that X is the substitute
{ let nP = 0;
  const clean = t => { if (!/\?/.test(String(t || ''))) return t; const o = String(t)
      .replace(/(?:\s—\s*also:\s*)?(?<![ऀ-ॿ\w])\?:\s[^—·]*/g, () => { nP++; return ''; })
      .replace(/(\S+(?: etc\.)?) replaces \? → the replacement is treated like what it replaced[^—·]*/g, (m, w) => { nP++; return `${w} is the substitute`; })
      .replace(/^\s*—\s*/, '').replace(/\s{2,}/g, ' ').trim(); return o; };
  for (const r of RES) {
    for (const st of r.steps || []) if (st.what) st.what = clean(st.what);
    if (r.why) { for (const c of r.why.cards) for (const x of c.why || []) if (x.txt) x.txt = clean(x.txt); for (const l of r.why.left || []) if (l.txt) l.txt = clean(l.txt); }
    for (const p of r.P || []) { if (p.trigger === '?' || /^\?:/.test(p.trigger || '')) p.trigger = String(p.trigger).replace(/^\?/, 'the place (not named in the sūtra)'); if (p.effect) p.effect = clean(p.effect); } }
  console.log(`engine placeholders removed from student text: ${nP}`); }
// ── card questions follow the audit (sūtra-level review 2026-11-21): a card asking “कस्मिन् परे?” of a word whose 7th the 1.1.66 audit ruled
// not a following element (a meaning, a domain, a cause …), or “कस्य स्थाने?” of a word whose 6th the 1.1.49 audit ruled not the place, asks
// what the word really is — by the audit's reason code
{ const Q66 = [[/^ARTHA/, ['कस्मिन् अर्थे?', 'in which meaning?']], [/^VIS|^DOMAIN|^VISAYA/, ['कस्मिन् विषये?', 'in which domain (when what is in view)?']], [/^NIMITTA/, ['कस्मिन् सति?', 'on account of what (a nimitta-saptamī)?']],
    [/^QUAL/, ['कस्य विशेषणम्?', 'describing which element?']], [/^YOGA/, ['केन योगे?', 'when connected with / used with what?']], [/^LOPA/, ['कस्य लोपे?', 'when what has been elided?']],
    [/^LADESA/, ['कस्य?', 'which lakāra / element is meant?']], [/^IT$/, ['कस्य प्रत्ययस्य?', 'which suffix takes (or is denied) the iṭ?']]];
  const Q49 = [[/avayava\/viśeṣaṇa/, ['कस्य अवयवस्य?', 'the part of which word is replaced?']], [/svara avayava/, ['कस्य?', 'of which word (whose vowel takes the accent)?']], [/āgama/, ['कस्य आगमः?', 'which element receives the augment?']], [/no substitute/, ['कस्य?', 'of what?']]];
  const nW3 = t => String(t || '').replace(/[-\s‹›“”]/g, '');
  const near = (a, b) => { a = nW3(a); b = nW3(b); return a && b && (a === b || a.includes(b) || b.includes(a)); };
  let nQ = 0; const byCode = {};
  for (const r of RES) { if (!r.why) continue;
    for (const c of r.why.cards) { const q = (c.q || []).join(' ');
      for (const [pid, PAT, MAP] of [['1.1.66', 'कस्मिन् परे', Q66], ['1.1.49', 'कस्य स्थाने', Q49]]) {
        if (!q.includes(PAT)) continue;
        if ((r.P || []).some(p => p.pid === pid && p.status === '✔' && near(String(p.trigger).split(':')[0], c.word))) continue;   // still credited on this word
        const v = (((AUDIT[pid] || {}).notLicensed || {})[r.n] || []).find(v => near(v.word, c.word)); if (!v) continue;
        const m = MAP.find(([re]) => re.test(v.reason || '') || re.test(v.why || '')); if (!m) continue;
        c.q = m[1]; nQ++; byCode[pid + ' ' + (v.reason || '?')] = (byCode[pid + ' ' + (v.reason || '?')] || 0) + 1; } } }
  console.log(`card questions set by the audit: ${nQ} (${Object.entries(byCode).map(([k, n]) => k + ' ' + n).join(', ')})`); }
// ── card / step corrections from the sūtra-level teaching review (audit/CARD-fixes.json; Harsha approved 2026-11-21)
{ let CF = {}; try { CF = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit', 'CARD-fixes.json'), 'utf8')); } catch (e) {}
  let nC = 0, nT = 0; const unused = [];
  for (const [n, f] of Object.entries(CF)) { if (n[0] === '_') continue; const r = RES.find(x => x.n === n); if (!r) continue;
    for (const cf of f.cards || []) { const cs = ((r.why && r.why.cards) || []).filter(c => c.word === cf.word); if (!cs.length) { unused.push(`${n} card ${cf.word}`); continue; }
      if (cf.drop) { r.why.cards = r.why.cards.filter(c => !cs.includes(c)); nC += cs.length; continue; }
      for (const c of cs) { if (cf.q) c.q = cf.q; if (cf.ans) c.ans = cf.ans; nC++; } }
    for (const t of f.text || []) { const re = new RegExp(t.find, 'g'); let hit = 0;
      const fx = s => String(s || '').replace(re, () => { hit++; return t.replace; });
      for (const st of r.steps || []) if (st.what) st.what = fx(st.what);
      if (r.why) for (const l of r.why.left || []) if (l.txt) l.txt = fx(l.txt);
      for (const p of r.P || []) { if (p.trigger) p.trigger = fx(p.trigger); if (p.effect) p.effect = fx(p.effect); }
      if (hit) nT += hit; else unused.push(`${n} text /${t.find.slice(0, 30)}/`); } }
  console.log(`card fixes: ${nC} cards · ${nT} text spans${unused.length ? ' · UNUSED: ' + unused.join('; ') : ''}`); }
// ── paribhāṣās that go into the REFERENCE vṛttis (Harsha 2026-11-15): every one must be covered by our steps
const PBN = require('./pbneed.js');
const PBREV = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'tools', 'pbneed-reviewed.json'), 'utf8')); } catch (e) { return {}; } })();
const isParG = n => PBSET.has(n) || /^(P|AT)/.test((BYID[sid(n)] || {}).type || '');
const PBCTX = { quotes: PBN.quoteCues(SUTRAS.map(x => ({ n: `${+x.a}.${+x.p}.${+x.n}`, s: x.s })), isParG) };
for (const r of RES) {
  if (!r.P) continue;
  const fired = new Set(r.P.filter(p => p.status !== '✖').map(p => p.pid));
  // a rule cited ONLY inside the sūtrārtha's worked derivation (prakriyā) is derivation-level, not vṛtti-level (Harsha 2026-11-15: ignore for now)
  const need0 = PBN.need(r, PBCTX);
  // DEFERRED (Harsha 2026-11-15): the exception — a citation made while explaining the sūtra's own words (r.pbCitedTop, outside any
  // derivation) may be vṛtti-level after all. Set VG_TOPCITE=1 to count those; by default every sūtrārtha-only citation is set aside.
  const isDeriv = x => x.from.length === 1 && x.from[0] === 'नैलेश-वृत्तिः' && x.why.every(w => /cited/.test(w)) && !(process.env.VG_TOPCITE && (r.pbCitedTop || []).includes(x.pid));
  r.pbDeriv = need0.filter(isDeriv).map(x => x.pid);
  // reviewed exclusions (tools/pbneed-reviewed.json): a flagged wording read and confirmed NOT to be a use of the paribhāṣā in this rule — shown
  // on the page with its reason, never silently dropped
  // the tadādi audit: where the reference's “-आदि” is the sūtra's own word or comes from the commentaries' anuvṛtti/sāmarthya, PIS 33 is not the source
  const TAD = r.tadadiBy, AF = r.auditFix || {}, rv = x => PBREV[r.n + '|' + x.pid] || (AF[x.pid] ? `audit: ${AF[x.pid].why}` : '') || (x.pid === '1.1.72' && AF['PIS 23'] ? `audit (PIS 23 — the tadanta reading here is not licensed): ${AF['PIS 23'].why}` : '') || (TAD && x.pid === 'PIS 33' ? (TAD === 'own' ? 'the “-आदि” is the sūtra’s own word (or a word it carries) — nothing for PIS 33 to supply' : `the “-आदि” comes from ${TAD} (${PB[TAD].src}) — the sound is not in the 7th, so not PIS 33`) : '');
  r.pbReviewed = need0.filter(x => !isDeriv(x) && rv(x)).map(x => ({ pid: x.pid, why: rv(x) }));
  r.pbNeed = need0.filter(x => !isDeriv(x) && !rv(x));
  if (PADSPLIT[r.n]) r.ps = PADSPLIT[r.n];
  r.pbGap = r.pbNeed.filter(x => !PBN.met(x.pid, fired));
}
{
  const withNeed = RES.filter(r => r.pbNeed && r.pbNeed.length), gaps = RES.filter(r => r.pbGap && r.pbGap.length);
  const tot = withNeed.reduce((a, r) => a + r.pbNeed.length, 0), miss = gaps.reduce((a, r) => a + r.pbGap.length, 0);
  const by = {}; for (const r of gaps) for (const g of r.pbGap) by[g.pid] = (by[g.pid] || 0) + 1;
  console.log(`paribhāṣās behind the references: ${tot} in ${withNeed.length} sūtras · covered ${tot - miss} · missing ${miss} in ${gaps.length} sūtras · (derivation-level only, not counted: ${RES.reduce((a, r) => a + (r.pbDeriv || []).length, 0)})`);
  require('fs').writeFileSync('/tmp/vg-gaps.json', JSON.stringify(gaps.map(r => ({ n: r.n, s: r.s, kind: r.kind, gen: r.gen, g: r.pbGap })), null, 0));
  console.log('  most missed:', Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => `${k}:${v}`).join(' '));
}
// paribhāṣā index
const IDX = {};
for (const r of RES) for (const p of r.P) (IDX[p.pid] = IDX[p.pid] || []).push({ n: r.n, status: p.status, layer: p.layer });
const summary = RES.reduce((a, r) => (a[r.verdict] = (a[r.verdict] || 0) + 1, a), {});
console.log('sūtras', RES.length, summary);
for (const r of RES) if (r.gen) console.log(r.n, r.verdict.padEnd(12), '| GEN:', r.gen, '\n', ' '.repeat(16), '| KĀŚ:', r.kv, r.missing && r.missing.length ? '\n' + ' '.repeat(18) + 'missing: ' + r.missing.join(' ') : '');

// ── output: light index in the page; full records + commentaries in one file per pāda (loaded on demand)
const vOf = r => r.verdict === 'exact' ? 'exact' : r.verdict === 'n/a' ? 'n/a' : (r.review ? r.review.v : r.gen ? 'unreviewed' : 'none');
const padaOf = r => r.n.split('.').slice(0, 2).join('.');
const DDIR = path.join(__dirname, 'data'); fs.mkdirSync(DDIR, { recursive: true });
// the steps end on the final class-style text (later reference-agreement edits otherwise leave the last step behind genC)
for (const r of RES) if (r.genC && r.steps && r.steps.length && r.steps[r.steps.length - 1].now !== r.genC && !r.steps.some(x => x.fin && x.now === r.genC)) r.steps.push({ pids: [], what: 'final text (after the reference-agreement edits above)', now: r.genC });
const byPada = {};
for (const r of RES) (byPada[padaOf(r)] = byPada[padaOf(r)] || []).push(r);
const enc = o => JSON.stringify(o).replace(/</g, '\\u003c');
for (const [pd, rs] of Object.entries(byPada)) {
  fs.writeFileSync(path.join(DDIR, `r-${pd}.js`), `(window.VR=window.VR||{})[${JSON.stringify(pd)}]=${enc(rs)};`);
  // commentaries: one small file per sūtra (c-<id>.js, ~10–30 KB), fetched when its “commentaries” box is opened
  for (const r of rs) fs.writeFileSync(path.join(DDIR, `c-${r.id}.js`), `(window.VC=window.VC||{})[${JSON.stringify(r.id)}]=${enc(Object.fromEntries(Object.keys(COMM).map(c => [c, COMM[c][r.id] || '']).filter(x => x[1])))};`);
}
for (const f of fs.readdirSync(DDIR)) if (/^c-\d\.\d\.js$/.test(f)) fs.unlinkSync(path.join(DDIR, f));   // the old per-pāda commentary files
const LIST = RES.map(r => ({ n: r.n, id: r.id, s: r.s, pc: (r.words || []).flatMap(w => String(w.form || '').split('-')).filter(Boolean).join(' '), kind: r.kind, set: r.set, v: vOf(r), ov: r.overlap || 0, sa: r.sa ? 1 : '', osa: r.overlapSA || 0, opv: r.overlapPV != null ? r.overlapPV : '', ck: !!(r.ck && (r.ck.g.length + r.ck.b.length + r.ck.e.length)), gap: (r.pbGap || []).map(x => x.pid), err: r.error || '', pn: (r.pbNeed || []).length, pg: (r.pbGap || []).length, gen: r.gen || '', p: [...new Set(r.P.map(x => x.pid))], pa: [...new Set(r.P.filter(x => x.status === '✔' && x.layer !== 1).map(x => x.pid))], nd: Object.fromEntries((r.pbNeed || []).map(x => [x.pid, x.from])), pn2: [...new Set(r.P.filter(x => x.status !== '✔' && x.layer !== 1).map(x => x.pid))] }));   // our steps only (layer 1 = a commentary naming it)
// the site's own sandhi-tolerant search engine, next to the page data (sūtra search box; Harsha 2026-11-17)
fs.copyFileSync(path.join(__dirname, 'lib/sanskrit-search.js'), path.join(DDIR, 'sanskrit-search.js'));
// every Paribhāṣenduśekhara entry carries Nāgeśa's own text (vendored ashtadhyayi-data), shown on our paribhāṣā page
{ const PISF = Object.fromEntries(J('paribhashendushekhar/data.txt').data.map(p => [p.num, p]));
  for (const [id, B] of Object.entries(PB)) { const m = /^PIS (\d+)$/.exec(id); if (m && PISF[m[1]]) B.sk = { prelude: PISF[m[1]].prelude || '', text: PISF[m[1]].text || '' }; } }
const DATA = { range: [num(String(FROM)), num(String(TO))], built: new Date().toISOString().slice(0, 10), PB, IDX, CNAME, LIST };
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'vrtti.html'), tpl.replace('/*__DATA__*/null', JSON.stringify(DATA).replace(/</g, '\\u003c')));
console.log('wrote', path.join(__dirname, 'vrtti.html'));
require('./tools/build-stamp.js').write();   // LAST step: the build finished (readers refuse data without it)
