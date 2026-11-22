#!/usr/bin/env node
// Free local check: which generated vṛttis look structurally wrong? → /tmp/vg-suspects.json (input for the agent review)
// Signals: a "?" placeholder; the rule type disagrees with what the prathamāvṛtti/Kāśikā say the rule does; a content word of the
// sūtra that the gloss drops although a reference has it.
const R = require('./recs.js')(), out = [];
const SKIPW = /^(च|वा|न|अपि|एव|तु|इति|विभाषा|अन्यतरस्याम्|बहुलम्|नित्यम्|सुपि|सर्वत्र|उभयथा)$/;
for (const r of Object.values(R)) {
  if (!r.genC || /^(saṃjñā|saṃjñā\*|adhikāra|paribhāṣā)$/.test(r.kind)) continue;
  const ref = [(r.pv && r.pv.artha) || '', r.kv || ''].join(' '), why = [];
  if (/\?/.test(r.genC)) why.push('placeholder “?” in the gloss');
  const A = /आदेशो भवति|आदेशः भवति|ादेशो भवति|ादेशा भवन्ति|आदेशौ भवतः/.test(ref), Pr = /प्रत्ययो भवति|प्रत्ययः भवति|प्रत्ययौ भवतः|प्रत्यया भवन्ति/.test(ref), Ag = /आगमो भवति|आगमः भवति|ागमो भवति/.test(ref), Sv = /उदात्त|स्वरित|अनुदात्त/.test(ref);
  if (r.kind === 'vidhi' && A && !Pr) why.push('kind vidhi (suffix) but the reference says “आदेशो भवति”');
  if (r.kind === 'ādeśa' && Pr && !A) why.push('kind ādeśa but the reference says “प्रत्ययो भवति”');
  if (r.kind !== 'āgama' && Ag && !A && !Pr) why.push(`kind ${r.kind} but the reference says “आगमो भवति”`);
  if (r.kind !== 'svara' && Sv && /^6\.[12]\./.test(r.n) && +r.n.split('.')[1] >= 1 && (r.n.startsWith('6.2') || +r.n.split('.')[2] >= 158)) why.push(`kind ${r.kind} in the accent section`);
  const g = r.genC.replace(/[-\s]/g, '');
  const lost = (r.words || []).filter(w => !SKIPW.test(w.form) && w.form.replace(/-/g, '').length > 2).filter(w => {
    const f = w.form.replace(/-/g, ''), st = f.replace(/(ाभ्याम्|ेभ्यः|ानाम्|ायाः|ायाम्|ात्|ाद्|स्य|ेषु|योः|ोः|ेः|ौ|े|ः|म्|ि)$/, '');
    if (st.length < 3 || g.includes(st.slice(0, Math.max(3, st.length - 1)))) return false;
    return ref.replace(/-/g, '').includes(st.slice(0, Math.max(3, st.length - 1)));
  }).map(w => w.form);
  if (lost.length) why.push('drops ' + lost.join(', ') + ' (the reference has it)');
  if (why.length) out.push({ n: r.n, s: r.s, kind: r.kind, gen: r.genC, pv: (r.pv && r.pv.artha) || '', kv: r.kv || '', sa: r.sa || '', why });
}
require('fs').writeFileSync('/tmp/vg-suspects.json', JSON.stringify(out, null, 1));
const c = {}; out.forEach(x => x.why.forEach(w => { const k = w.replace(/ .*/, '').replace(/“.*/, ''); c[w.split(' ')[0]] = (c[w.split(' ')[0]] || 0) + 1; }));
console.log('suspects', out.length, 'of', Object.keys(R).length, c);
