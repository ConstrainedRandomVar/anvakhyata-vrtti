#!/bin/sh
# rebuild + coverage + regression check (baseline100 must stay 0 changes)
cd "$(dirname "$0")/.." && { node build.js > /tmp/vg-build.log 2>&1 || { echo "BUILD FAILED:"; grep -m3 -E "Error|at " /tmp/vg-build.log; exit 1; }; } && grep -E "behind the references|most missed|paribhāṣā audit" /tmp/vg-build.log && ! grep -E "UNAUDITED credits [1-9]" /tmp/vg-build.log && node -e '
const R=require("./tools/recs.js")();const a=Object.values(R);console.log("errors",a.filter(r=>r.error).length,"· ? slots",a.filter(r=>/\?/.test(r.genC||"")).length);const B=require("./tools/baseline100.json");let ch=0;for(const [k,v] of Object.entries(B)){if(k[0]==="_")continue;const r=R[k];if(!r||r.gen!==v.gen||r.genC!==v.genC||r.genK!==v.genK){ch++;console.log("CHANGED",k,"|",r&&r.genC,"| WAS",v.genC)}}console.log("baseline changes",ch);for(const n of process.argv.slice(1))console.log(n,R[n].kind,"|",R[n].genC,"| PV:",R[n].pv?R[n].pv.artha:"")' "$@"
# real-browser load test: the list view and three sūtra pages must render with no console error
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ -x "$CH" ]; then fail=0; for h in "" "#1.1.1" "#3.1.44" "#7.1.17"; do
  "$CH" --headless=new --disable-gpu --allow-file-access-from-files --enable-logging=stderr --v=0 --virtual-time-budget=6000 --dump-dom "file://$PWD/vrtti.html$h" 2>/tmp/vg-chrome.err >/tmp/vg-dom.html
  if grep -q "CONSOLE" /tmp/vg-chrome.err || ! grep -q 'class="lst"\|class="gen"' /tmp/vg-dom.html; then echo "PAGE BROKEN at vrtti.html$h:"; grep CONSOLE /tmp/vg-chrome.err | head -3; fail=1; fi
done; [ $fail = 0 ] && echo "page loads (list + 3 sūtras) — no console errors"; fi
