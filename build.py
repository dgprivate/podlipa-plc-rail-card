#!/usr/bin/env python3
"""Generates the card's RAIL constant from the podlipa-plc sources.

Run after any change to the I/O map. Everything the card draws is derived here
and nothing is typed by hand -- the terminal list from the system project, the
index-to-channel binding from MAIN's TcLinkTo attributes, and the channel names
from the GVLs.
"""
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
VIEW = os.path.expanduser("~/projects/podlipa-plcview")
CARD = os.path.join(HERE, "dist/podlipa-plc-rail-card.js")


def main():
    subprocess.run([os.path.join(VIEW, ".venv/bin/python"),
                    os.path.join(VIEW, "build_layout.py")], check=True)
    doc = json.load(open(os.path.join(VIEW, "layout.json")))

    rail = []
    for t in doc["terminals"]:
        # NO NAMES. The rail in a public repository carries topology only; the
        # labels go into the card's config in the dashboard, which lives in Home
        # Assistant. names.json is written beside this and is NOT committed.
        cells = []
        for c in t["cells"]:
            ref = c["entity"] if t["kind"] == "num" else c["idx"]
            cells.append([c["no"], c["sig"], ref])
        rail.append([t["pos"], t["model"], t["kind"], cells])

    version = (subprocess.run(["git", "describe", "--tags", "--always"], cwd=HERE,
                              capture_output=True, text=True).stdout.strip() or "dev")
    src = open(os.path.join(HERE, "src/card.js"), encoding="utf-8").read()
    src = src.replace("/*__VERSION__*/dev", version)
    payload = json.dumps(rail, ensure_ascii=False, separators=(",", ":"))
    out = src.replace("/*__RAIL__*/[]", payload)
    digital = doc["digital"]
    cells = sum(len(t["cells"]) for t in doc["terminals"])
    out = out.replace("/*__COUNTS__*/{}",
                      json.dumps({"terminals": len(rail), "digital": digital,
                                  "cells": cells}, separators=(",", ":")))
    os.makedirs(os.path.dirname(CARD), exist_ok=True)
    open(CARD, "w", encoding="utf-8").write(out)

    labels = {c["sig"]: c["name"]
              for t in doc["terminals"] for c in t["cells"] if c.get("name")}
    json.dump(labels, open(os.path.join(HERE, "names.json"), "w"),
              ensure_ascii=False, indent=1)
    print(f"names.json: {len(labels)} labels (gitignored -- this is the floor plan)")
    print(f"{CARD}: {len(out)} bytes, {len(rail)} terminals, {cells} cells")


if __name__ == "__main__":
    main()
