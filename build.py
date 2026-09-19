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
        cells = []
        for c in t["cells"]:
            if t["kind"] == "num":
                cells.append([c["no"], c["sig"], c["entity"], c["name"]])
            elif t["kind"] == "dali":
                cells.append([c["no"], c["sig"], c["idx"], c["name"]])
            else:
                cells.append([c["no"], c["sig"], c["idx"], c["name"]])
        rail.append([t["pos"], t["model"], t["kind"], cells])

    src = open(os.path.join(HERE, "src/card.js"), encoding="utf-8").read()
    payload = json.dumps(rail, ensure_ascii=False, separators=(",", ":"))
    out = src.replace("/*__RAIL__*/[]", payload)
    digital = doc["digital"]
    cells = sum(len(t["cells"]) for t in doc["terminals"])
    out = out.replace("/*__COUNTS__*/{}",
                      json.dumps({"terminals": len(rail), "digital": digital,
                                  "cells": cells}, separators=(",", ":")))
    os.makedirs(os.path.dirname(CARD), exist_ok=True)
    open(CARD, "w", encoding="utf-8").write(out)
    print(f"{CARD}: {len(out)} bytes, {len(rail)} terminals, {cells} cells")


if __name__ == "__main__":
    main()
