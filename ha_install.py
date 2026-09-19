#!/usr/bin/env python3
"""Pull the current release through HACS and freshen the Lovelace resource URL.

The URL stamp is the point. HACS already varies its own ?hacstag= per version,
but the frontend's service worker and the HTTP cache both key on the whole URL,
and a stamp that changes on every install is what makes a PLAIN reload enough.
"""
import json
import os
import time

import websocket

HA = os.environ.get("HA_URL", "ws://homeassistant-local.black.si:8123/api/websocket")
REPO_ID = "1377026132"
NAME = "podlipa-plc-rail-card"


def main():
    tok = open(os.path.expanduser("~/.config/ha-token")).read().strip()
    ws = websocket.create_connection(HA, timeout=120)
    ws.recv()
    ws.send(json.dumps({"type": "auth", "access_token": tok}))
    if json.loads(ws.recv())["type"] != "auth_ok":
        raise SystemExit("auth failed")

    n = [0]

    def call(t, **kw):
        n[0] += 1
        ws.send(json.dumps({"id": n[0] + 1, "type": t, **kw}))
        return json.loads(ws.recv())

    print("download:", call("hacs/repository/download", repository=REPO_ID).get("success"))
    for _ in range(12):
        time.sleep(4)
        rows = [x for x in call("hacs/repositories/list")["result"] if x.get("id") == REPO_ID]
        if rows and rows[0].get("installed_version") == rows[0].get("available_version"):
            print("installed:", rows[0]["installed_version"])
            break

    res = call("lovelace/resources")["result"]
    mine = [r for r in res if NAME in r.get("url", "")]
    if not mine:
        raise SystemExit("the resource is not registered -- is HACS done?")
    base = mine[0]["url"].split("&v=")[0]
    fresh = f"{base}&v={int(time.time())}"
    r = call("lovelace/resources/update", resource_id=mine[0]["id"],
             res_type="module", url=fresh)
    print("resource:", "ok" if r.get("success") else r.get("error"), fresh)
    ws.close()


if __name__ == "__main__":
    main()
