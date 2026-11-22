// Which paribhāṣā-sūtras went into each REFERENCE vṛtti (prathamāvṛtti, Nilesh Ji's sūtrārtha, Kāśikā, SK, LSK)?
// Goal (Harsha 2026-11-15): the references may add nuances we skip, but every paribhāṣā that goes into any of them must be covered by our steps.
// Evidence = (1) explicit citations (sūtrārtha [[x.y.z]], a paribhāṣā's own text quoted), (2) wording that only a paribhāṣā licenses.
'use strict';
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
// cue → paribhāṣā. `re` runs on the reference text; `unless` = the sūtra's own text already has it (then no paribhāṣā is needed to supply it).
const CUES = [
  { pid: '1.1.49', re: /(?<![ऀ-ॿ-])(?:स्थाने(?!ऽन्तरतम)|स्थानी)|षष्ठीनिर्दिष्ट/, why: 'स्थाने — the 6th case names what is replaced' },
  { pid: '1.1.66', re: /परतः|परत\s|परतो|(^|\s|[िीुूेैोौ])परे(\s|$)|(^|\s)(?:अनयोः\s)?परयोः|(^|\s)परेषु|(^|\s)परस्मिन्/, why: 'परतः — the 7th case names what follows' },
  { pid: '1.1.66', re: /(^|\s)पूर्वस्य(ैव)?(\s|$)/, why: 'पूर्वस्य — the operation falls on what precedes the 7th-case word', unless: /पूर्वस्य/ },
  { pid: '1.1.67', re: /[उु]त्तरस्य|(^|\s)परस्य(?!ैपद)/, why: 'उत्तरस्य — the 5th case: the operation falls on what follows', unless: /परस्य|उत्तरस्य|(^|[\s-])पर(वत्|वल्|ादि|ाङ्ग|ाव)|आदिवत्/ },
  { pid: '1.1.52', re: /अन्त्यस्य|अन्त्यस्याल|अन्त्यस्य\s*अलः|अलोऽन्त्य/, why: 'अन्त्यस्य — on the last sound' },
  { pid: '1.1.53', re: /ङिद्(?!व[त्द्])|ङित्\s*आदेश/, why: 'ङित् replacement on the last sound' },
  { pid: '1.1.54', re: /(^|\s)आदेः\s|(^|\s)आदेरलः|आदेः परस्य/, why: 'आदेः — on the first sound of what follows' },
  { pid: '1.1.55', re: /सर्वस्य(?!\s*नाम)|सर्वादेश/, why: 'सर्वस्य — the replacement takes the whole', unless: /सर्व/ },
  { pid: '1.1.72', re: /(?:[^\s]{1,}न्ता[त्द्]|न्तस्य|न्तानां|न्तानाम्|न्ते(?!ऽपि)\s|न्तात्|न्ताद्|न्ताच्|न्ताज्|न्तेभ्यः|न्तम्|न्तौ|न्ताः)/, why: '-अन्त — the property defines words ending in it (tadanta)', notWords: /^(कान्त[ौि]|भवन्त|आद्यन्त|समानकालावाद्यन्त|दृश्यन्ते|हेमन्त|अनन्तर|अन्तर|अन्त[ःर]|अत्यन्त|पर्यन्त|सामन्त|वेदान्त|अन्ते|अन्तः|अनन्त|दन्त|वसन्त)/ },
  { pid: 'PIS 33', re: /(?:अजादौ|हलादौ|झलादौ|वलादौ|यकारादौ|अजादि|हलादि|झलादि|वलादि|यकारादि|सकारादि|तकारादि)/, why: 'X-आदौ — a sound-property defines what begins with it (tadādi)' },
  { pid: '1.1.46', re: /आद्यवयव|अन्तावयव|आदिरवयव|अन्तोऽवयव/, why: 'आदि/अन्त अवयव — placement of a ṭit/kit āgama' },
  { pid: '1.1.47', re: /अन्त्यादचः परः|अन्त्यादचः\s*परो|अचोऽन्त्यात्/, why: 'after the last vowel — mit āgama' },
  { pid: '1.1.51', re: /रपरः|रपरो|रपरत्व/, why: 'रपर — the replacement of ऋ comes with r' },
  { pid: '1.1.50', re: /अन्तरतम|आन्तरतम्य|स्थानेऽन्तरतम/, why: 'the nearest replacement' },
  { pid: '1.1.56', re: /स्थानिवद्|स्थानिवत्/, why: 'स्थानिवत् — the replacement acts like the original', unless: /स्थानिव/ },
  { pid: '1.1.62', re: /प्रत्ययलक्षण/, why: 'प्रत्ययलक्षणम्' },
  { pid: '1.3.10', re: /यथासङ्ख्य|यथासंख्य|क्रमेण/, why: 'यथासङ्ख्यम् — members paired in order' },
  { pid: '3.1.92', re: /पपदे|पपदयोः|पपदेषु/, why: 'उपपदे — the 7th-case word is the upapada', unless: /[उु]पपद/ },
  { pid: '1.1.44', re: /विकल्पेन|विकल्पः|(^|\s)वा(\s|$)/, why: 'विकल्पेन — विभाषा means optional', needSutra: /विभाषा/ },
  { pid: '1.1.3', re: /(^|\s)इकः|इगन्त|इक्\s/, why: 'इकः — supplied for guṇa/vṛddhi', unless: /इ[कग]/ },
  { pid: '1.4.13', re: /(?<!न्तर|अन्तर)(अ|ा|[क-ह])ङ्ग(स्य|ानाम्|ात्)(?![ऀ-ॿ])/, why: 'अङ्गस्य — what precedes the suffix is the aṅga', unless: /ङ्ग/ },
  { pid: '4.1.82', re: /समर्था[त्द्]|समर्थेभ्यः|समर्थाभ्याम्/, why: 'X-समर्थात् — the first word in the case named' },
  { pid: '1.1.68', re: /स्वं रूपम्|(?<![ऀ-ॿ])स्वरूपस्य|(?<![ऀ-ॿ])स्वरूपम्/,   // not “औपदेशिकस्वरूपस्य / शब्दस्वरूपम्” = the taught / word form (audit 2026-11-17)
  why: 'the word itself is meant' },
];
// paribhāṣā sūtras quoted by their own text (first words) — e.g. "तस्मिन्निति निर्दिष्टे पूर्वस्य"
function quoteCues(SLIST, isPar) {
  return SLIST.filter(x => isPar(x.n) && x.s.replace(/\s+/g, '').length >= 8).map(x => ({ pid: x.n, text: x.s.replace(/\s+/g, '').slice(0, Math.min(14, x.s.length)) }));
}
function refTexts(r) {
  const first = t => (t || '').replace(/<<[^>]*>>/g, ' ').split(/[।॥]/)[0];
  const T = [];
  if (r.pv && r.pv.artha) T.push(['प्रथमावृत्तिः', r.pv.artha]);
  if (r.sa) T.push(['नैलेश-वृत्तिः', r.sa]);
  if (r.kv) T.push(['काशिका', (r.kv || '').replace(/<<[^>]*>>/g, ' ')]);
  if (r.sk) T.push(['सि०कौ०', first(r.sk)]);
  if (r.lsk && r.lsk !== r.sk) T.push(['ल०कौ०', first(r.lsk)]);
  return T;
}
function need(r, ctx) {
  const out = {};
  const add = (pid, src, why, hit) => { (out[pid] = out[pid] || { pid, from: [], why: new Set(), hit: new Set() }); if (hit) out[pid].hit.add(src + ':' + hit); if (!out[pid].from.includes(src)) out[pid].from.push(src); out[pid].why.add(why); };
  const own = (r.s || '') + ' ' + (r.carried || []).map(c => c.w || c).join(' ');
  for (const [src, t] of refTexts(r)) {
    for (const c of CUES) {
      if (c.needSutra && !c.needSutra.test(own)) continue;
      if (c.unless && (c.unless.test(r.s || '') || (['1.1.3', '3.1.92', '1.1.55', '1.1.56'].includes(c.pid) && c.unless.test(own)))) continue;   // a carried इकः already says it (1.2.10–11)
      let m = t.match(c.re); if (!m) continue;
      if (c.pid === '1.1.66') {
        const toks = t.split(/\s+/), ok = toks.some((x, i) => {
          if (/^(परतः|परतो|परत|परयोः|परेषु|परस्मिन्)/.test(x.replace(/^.*?(?=पर)/, '')) && /पर(तः|तो|त$)/.test(x)) return toks[i - 1] !== 'न';   // “न परतः” = not after
          if (/(^|[िीुूेैोौ])परे$|^परे[,।]?$/.test(x) || /परे$/.test(x)) { const prev = (toks[i - 1] || ''); return !/(भ्यः|भ्याम्|स्मात्|ात्|ाद्|तः|त्|द्)$/.test(prev) && prev !== 'धातोः'; }   // “धातोः परे स्युः” = after the dhātu (5th sense)   // “धातुभ्यः परे ये” = following X (5th), not a 7th-case nimitta
          if (/^परस्मिन्न?(हनि|ह्नि|अहनि|काले|वर्षे)/.test(x + (toks[i + 1] || ''))) return false;   // “परस्मिन्नहनि” = on the next day
          if (/^(अनयोः\s)?परयोः|^परेषु|^परस्मिन्/.test(x)) { const prev = toks[i - 1] || ''; return !/(भ्यः|भ्याम्|स्मात्|ात्|ाद्|दः)$/.test(prev); }   // “पञ्चभ्यः परयोः”, “उदः परयोः” = following a 5th (1.1.67)
          if (/(^|\s)पूर्वस्य/.test(' ' + x)) { const prev = toks[i - 1] || ''; return !/पूर्वस्य/.test(own) && x.startsWith('पूर्वस्य') && !/^(परा|प्र|अभि|नि|अनु|प्रति|आङ्|उप|अधि|सम्|वि|अप)$/.test(prev); }
          return false; });
        if (!ok) continue;
      }
      // स्थाने as an ordinary noun (“समाने स्थाने”, “यस्मिन् स्थाने”): the word before it is a 7th/4th-case form, not the 6th of what is replaced
      if (c.pid === '1.1.49' && !/षष्ठीनिर्दिष्ट|(?<![ऀ-ॿ-])स्थानी/.test(t)) { const toks = t.split(/\s+/); if (!toks.some((x, i) => /^स्थाने/.test(x) && !/(े|स्मिन्|ाय)$/.test(toks[i - 1] || ''))) continue; }
      // “पूर्वस्यान्तवत् परस्यादिवत्” (6.1.85) and “अचः परस्य द्वितीयस्य” glossing अजादेर्द्वितीयस्य explain the sūtra's own words, not a 5th case
      if (c.pid === '1.1.67' && !/उत्तरस्य/.test(t) && /परस्य\s?(च\s?)?(ा|आ)दिव[त्द्]|परस्यादिव[त्द्]|[अद]चः परस्य/.test(t)) continue;
      if (c.notWords) {
        const sut = (r.s || '').replace(/[\s-]/g, '');
        const cand = t.split(/\s+/).filter(x => c.re.test(x) && !c.notWords.test(x) && !/न्तादेश|न्तोदात्त|न्तस्वरित|न्तानुदात्त|पर्यन्त|दन्तादि|पदान्त|पादान्त|ध्यायान्त|चतुरर्थ्यन्त|न्तर्भाव|न्तरङ्ग|सिद्धान्त|दृष्टान्त|प्रान्त|वृत्तान्त|एकान्त/.test(x))
          // the sūtra itself already says “-अन्त” (काण्डान्तात्, जात्यन्तात्): nothing for a paribhāṣā to supply
          .filter(x => { const core = (x.match(/^(\S*?[ािीुूृेैोौ्]?न्त)/) || [])[1] || ''; return !(core.length > 3 && sut.includes(core.replace(/शब्दान्त$/, 'ान्त'))); });
        if (!cand.length) continue;
        // the sūtra (or a word it carries) itself says “-अन्त” (हलदन्तात्, नान्तात्, वर्गान्तात्): the refs just restate it
        if (c.pid === '1.1.72' && /न्ता[त्द्च्ज्]|न्तस्य|न्तानाम्|न्तयोः|न्ते(\s|$)|[क-हा्]न्ता(ः|\s|$)|न्त-|[क-ह]न्त[क-ह]/.test(own.replace(/समासान्त|नन्तर|अनन्त|न्तिक/g, '').replace(/(वेदान्त|अन्तर|पर्यन्त|अन्तः|न्तोदात्त)/g, ''))) continue;
        // a case ending / suffix group / named suffix + अन्त (सप्तम्यन्तात्, सुबन्त, तिङन्त, क्तप्रत्ययान्त) = PIS 23, not 1.1.72
        const isSfx = x => /^(प्रथम|द्वितीय|तृतीय|चतुर्थ्य|पञ्चम्य|षष्ठ्य|सप्तम्य|सुब|तिङ|विभक्त्य)|प्रत्ययान्त|सप्तम्यन्त|विभक्त्यन्त|(प्रथम|द्वित[ीा]य|तृतीय|चतु्?र्थ्य|पञ्चम्य|षष्?ठ्य|सप्तम्य|सुब|तिङ)ा?न्त/.test(x);   // SK runs words together (अस्माद्द्वितीयान्तात्), misprints (द्वितायान्त, षठ्यन्त)
        if (c.pid === '1.1.72' && cand.every(isSfx)) { add('PIS 23', src, 'X-अन्त of a suffix / case ending — what ends in it (PIS 23)', cand.join(',')); continue; }
        m = [cand.join(',')];
      }
      // 3.1.92 defines “upapada” for the dhātu section only (3.1.91–3.4.117); elsewhere (1.4.105 युष्मद्युपपदे, 5.4.5) the word is used in its general sense
      if (c.pid === '3.1.92' && !(cmp(r.n, '3.1.91') >= 0 && cmp(r.n, '3.4.117') <= 0)) continue;
      if (c.pid === r.n) continue;
      // the sūtra (or a word it carries) itself says “X-आदि” (वलादेः, हलादेः): nothing for PIS 33 to supply
      if (c.pid === 'PIS 33') { const stems = [...t.matchAll(/(\S+?)(ादौ|ादि|ादेः)/g)].map(x => x[1].replace(/^.*?(अज|हल|झल|वल|यकार|सकार|तकार|अच्|हल्|झल्|वल्)$/, '$1')); if (stems.length && stems.every(x => own.replace(/[-\s]/g, '').includes(x.replace(/्$/, '') ) && /ाद/.test(own))) continue; }
      // outside the taddhita section a "X-समर्थात्" is the general samartha rule (2.1.1), not 4.1.82
      // 4.1.82 runs 4.1.82–5.2.140 (Kāśikā: “प्राग्दिशो विभक्तिः इति यावत्”); in the samāsa section a “समर्थ” is 2.1.1; elsewhere neither is eligible
      if (c.pid === '4.1.82' && !(cmp(r.n, '4.1.82') >= 0 && cmp(r.n, '5.2.140') <= 0)) { if (cmp(r.n, '2.1.1') >= 0 && cmp(r.n, '2.2.38') <= 0) add('2.1.1', src, 'X-समर्थात् — the word must be semantically connected (samartha)'); continue; }
      add(c.pid, src, c.why, m[0]);
    }
    const flat = t.replace(/\s+/g, '');
    // the quote must start a word: Kāśikā “धातोर्हलन्ताच्च” contains हलन्ताच्च (1.2.10) without quoting it
    for (const q of ctx.quotes) if (q.pid !== r.n && !(r.carried || []).some(c => c.from === q.pid) && flat.includes(q.text) && new RegExp('(?<![ऀ-ॿ])' + [...q.text].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*')).test(t)) add(q.pid, src, 'quotes the paribhāṣā', q.text);
  }
  for (const n of r.pbCited || []) add(n, 'नैलेश-वृत्तिः', 'cited [[…]] in the explanation');
  // a paribhāṣā is only a need where it is eligible at all: 3.1.92 / 3.1.94 in the dhātu adhikāra, 4.1.82 in its own adhikāra
  const DOM = { '3.1.92': ['3.1.91', '3.4.117'], '3.1.94': ['3.1.91', '3.4.117'], '4.1.82': ['4.1.82', '5.2.140'] };
  return Object.values(out).filter(x => !DOM[x.pid] || (cmp(r.n, DOM[x.pid][0]) >= 0 && cmp(r.n, DOM[x.pid][1]) <= 0)).map(x => ({ pid: x.pid, from: x.from, why: [...x.why], hit: [...(x.hit || [])] }));
}
// a need is met by the paribhāṣā itself or by an equivalent we record under another id
const EQUIV = { '1.1.72': ['1.1.72', 'PIS 23', '1.1.72 vt.1', '1.1.72 vt.2'], 'PIS 23': ['PIS 23', '1.1.72', '4.1.82'] };
const met = (pid, fired) => (EQUIV[pid] || [pid]).some(p => fired.has(p));
module.exports = { need, quoteCues, CUES, met };
