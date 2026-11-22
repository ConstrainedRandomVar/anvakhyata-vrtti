// prathamāvṛtti printed numbers: fix OCR digit misreads. The offset (our number − printed number) only changes where the
// edition really differs from ashtadhyayi.com (an omitted or combined sūtra) and then stays; a misread is a blip — a run whose
// offset differs while the entries just before and after have the SAME offset. Such a run gets that offset back.
// node tools/pvnum.js [--write]   → prathama-printed.json { num: printed number } (build.js uses it)
const fs = require('fs'), path = require('path');
const P = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prathama.json'), 'utf8'));
const c = x => x.split('.').map(Number), cmp = (a, b) => { const x = c(a), y = c(b); return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; };
const S = Object.values(P).filter(e => /^\d+\.\d+\.\d+$/.test(e.raw || e.num)).sort((a, b) => cmp(a.num, b.num));
const pd = e => c(e.num).slice(0, 2).join('.');
const off = e => { const r = c(e.raw || e.num); return r[0] + '.' + r[1] === pd(e) ? c(e.num)[2] - r[2] : 'X'; };   // X = another pāda read
const fix = {}, odd = [];
const byPada = {}; S.forEach(e => (byPada[pd(e)] = byPada[pd(e)] || []).push(e));
for (const L of Object.values(byPada)) {
  const O = L.map(off);
  for (let i = 1; i < L.length; i++) {
    if (O[i] === O[i - 1]) continue;
    let j = i; while (j < L.length && O[j] !== O[i - 1] && j - i < 8) j++;   // a blip of ≤ 8 entries that comes back to the same offset
    // …and only if the run breaks the ORDER of printed numbers (goes backwards, jumps ahead, or names another pāda):
    // a run that keeps rising one by one is a real shift in the edition's numbering, not a misread
    const pn = e => off(e) === 'X' ? NaN : c(e.raw || e.num)[2];
    const run = L.slice(i, j), A = L[i - 1], B = L[j];
    const broken = run.some(e => isNaN(pn(e))) || !(pn(A) < pn(run[0])) || (B && !(pn(run[run.length - 1]) < pn(B))) || run.some((e, k) => k && pn(e) - pn(run[k - 1]) !== 1 && !e.combinedWith);
    if (j < L.length && O[j] === O[i - 1] && j - i <= 8 && broken) {
      // a misread changes a whole digit (९→५ is 40 off) or the pāda; a difference of 1–3 can be a real shift, so it is left alone
      const d = O[i - 1]; const far = run.filter(e => { const v = c(e.num)[2] - d; return isNaN(pn(e)) || Math.abs(pn(e) - v) >= 4; });
      // ९ read as ६ at the start of the run, the rest numbered on from it (1.3.69–70 read 66–67; Harsha checked the book 2026-11-15)
      const nine6 = String(c(run[0].num)[2] - d).endsWith('9') && String(pn(run[0])).endsWith('6') && run.every(e => c(e.num)[2] - d - pn(e) === 3);
      if (far.length === run.length || nine6) run.forEach(e => { const v = `${pd(e)}.${c(e.num)[2] - d}`; if ((e.raw || e.num) !== v) fix[e.num] = v; });
      i = j;
    }
  }
}
// numbers read off the book itself (Harsha, 2026-11-15): these win over any inference
const CONFIRMED = { '1.3.69': '1.3.69', '1.3.70': '1.3.70', '2.3.59': '2.3.59', '2.3.60': '2.3.60', '2.3.61': '2.3.61', '3.1.29': '3.1.29', '3.3.160': '3.3.160', '3.3.161': '3.3.161', '3.2.94': '3.2.94' };
Object.assign(fix, CONFIRMED);
if (process.argv.includes('--write')) fs.writeFileSync(path.join(__dirname, '..', 'prathama-printed.json'), JSON.stringify(fix, null, 1));
console.log('corrected', Object.keys(fix).length); for (const [k, v] of Object.entries(fix)) console.log(' ', k, P[k].sutra, '| read', P[k].raw || P[k].num, '→', v);
