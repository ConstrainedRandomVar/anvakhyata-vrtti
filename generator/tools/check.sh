#!/bin/sh
# rebuild + coverage + regression checks (tools/check-run.sh), then ONE verdict line — read the verdict, never a filtered tail (2026-11-20:
# a crashed build was missed because the output was filtered and the stale data was diffed as if current)
sh "$(dirname "$0")/check-run.sh" "$@" > /tmp/vg-check.out 2>&1; rc=$?
cat /tmp/vg-check.out
if [ $rc -eq 0 ] && grep -q "baseline changes 0" /tmp/vg-check.out && grep -q "errors 0" /tmp/vg-check.out && ! grep -qE "BUILD FAILED|PAGE BROKEN|UNAUDITED credits [1-9]" /tmp/vg-check.out; then echo "CHECK: PASS"; else echo "CHECK: FAIL (exit $rc) — see above"; exit 1; fi
