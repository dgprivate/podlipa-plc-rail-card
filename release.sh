#!/usr/bin/env bash
# Build, release, install and make every open browser pick it up on a PLAIN
# reload -- no Ctrl+Shift+R.
#
# A new version of a Lovelace card is new JavaScript, so the page has to be
# loaded again; that part is physics. What this removes is the HARD part: the
# resource URL gets a fresh ?v= stamp, so neither the HTTP cache nor the
# frontend's service worker has anything to serve from, and an ordinary reload
# fetches the new file.
set -euo pipefail
cd "$(dirname "$0")"

VER="${1:?usage: ./release.sh v1.0.3 [notes]}"
NOTES="${2:-}"

python3 build.py
node -e "global.window={};global.customElements={define(){}};global.HTMLElement=class{};
         console.info=()=>{};require('./dist/podlipa-plc-rail-card.js')" \
  && echo "card parses"

git add -A
git diff --cached --quiet || git commit -q -m "release ${VER}${NOTES:+: $NOTES}"
git tag -f "$VER" >/dev/null
git push -q origin master
git push -qf origin "$VER"
gh release delete "$VER" -y >/dev/null 2>&1 || true
gh release create "$VER" dist/podlipa-plc-rail-card.js --title "$VER" \
    --notes "${NOTES:-$VER}" >/dev/null
echo "released $VER"

# Rebuild the file into the stamp: build.py reads the version from git describe,
# so it has to run again now that the tag exists.
python3 build.py >/dev/null
gh release upload "$VER" dist/podlipa-plc-rail-card.js --clobber >/dev/null
"${PYTHON:-$HOME/projects/podlipa-plc/.venv/bin/python}" ha_install.py
