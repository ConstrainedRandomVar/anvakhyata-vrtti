// Build stamp (2026-11-20, after a crashed build was diffed as if current): build.js writes data/.build-ok as its LAST step, recording the
// mtimes of what it read; readers (recs.js, snap.js, publish-app.js) call check() and refuse a missing, failed or stale build.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), STAMP = path.join(ROOT, 'data', '.build-ok');
const INPUTS = ['build.js', 'template.html', 'handwritten.json', 'rolepilot/roles.json', 'rolepilot/hand-roles.json', 'audit/verdicts.json', 'audit/overrides.json', 'tools/pbneed-reviewed.json'];
const mtime = f => { try { return fs.statSync(path.join(ROOT, f)).mtimeMs; } catch (e) { return 0; } };
exports.write = () => fs.writeFileSync(STAMP, JSON.stringify({ at: new Date().toISOString(), inputs: Object.fromEntries(INPUTS.map(f => [f, mtime(f)])) }));
exports.check = (who) => {
  if (process.env.VG_ALLOW_STALE) return;
  let s; try { s = JSON.parse(fs.readFileSync(STAMP, 'utf8')); } catch (e) { console.error(`✗ ${who}: no build stamp (data/.build-ok) — the last build did not finish. Run node build.js.`); process.exit(2); }
  const newer = INPUTS.filter(f => mtime(f) > (s.inputs[f] || 0) + 1);
  if (newer.length) { console.error(`✗ ${who}: data/ is stale — changed since the last successful build: ${newer.join(', ')}. Run node build.js (or VG_ALLOW_STALE=1).`); process.exit(2); }
};
