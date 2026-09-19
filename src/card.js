/*
 * podlipa-plc-rail-card
 * -----------------------------------------------------------------------------
 * The EtherCAT rail of the Podlipa PLC as a native Lovelace card: every
 * terminal in the cabinet, in order, with a live cell per channel.
 *
 * Native on purpose. Home Assistant's markdown card allows inline styles and
 * nothing else -- no stylesheet, no :hover, no click handler -- so the rail
 * could be drawn there but not used. Here a cell hovers, and clicking one opens
 * Home Assistant's own more-info dialog, with history, for that exact channel.
 *
 * NO NAMES LIVE IN THIS FILE. The rail carries hardware topology only --
 * terminal models and channel counts. Which room a button lights, where a leak
 * sensor sits and whose bedroom is whose is a floor plan, and this repository
 * is public. A cell takes its label from Home Assistant's own friendly_name at
 * runtime, or from an optional `names:` map in the card's config, which lives
 * in the dashboard rather than here.
 *
 * THE LAYOUT IS GENERATED, NOT TYPED. build.py reads the terminal list out of
 * Podlipa2026.1.tsproj, the index-to-channel binding out of MAIN's TcLinkTo
 * attributes, and the channel names out of GVL_DirectReactiveMap,
 * GVL_HaEntityMap and GVL_LegacyTopicMap. Re-run it after any change to the
 * I/O map; the EL1489 at position 44 is the reason it is worth deriving --
 * it is the one terminal with sixteen channels instead of eight.
 *
 * Install via HACS as a custom repository (category: Dashboard).
 *
 * Usage:
 *   type: custom:podlipa-plc-rail-card
 *   (every entity is found automatically; see README for the overrides)
 */

const RAIL = /*__RAIL__*/[];
const COUNTS = /*__COUNTS__*/{};

const DEFAULTS = {
  name: "Virtualni PLC",
  // Left empty: the card finds the prefixes in hass.states rather than
  // predicting them. Home Assistant puts the AREA in front of an entity_id when
  // the device has one, which is not knowable from here -- and guessing it cost
  // two rounds of a view that rendered empty.
  prefix_in: "",
  prefix_out: "",
  voltage: ["sensor.electrical_voltage_l1", "sensor.electrical_voltage_l2",
            "sensor.electrical_voltage_l3"],
  current: ["sensor.electrical_current_l1", "sensor.electrical_current_l2",
            "sensor.electrical_current_l3"],
  frequency: "sensor.electrical_frequency",
  show_electricity: true,
  // Optional { "DI-24-3": "a room name" }. Lives in the dashboard, not in
  // this repository -- see the note at the top.
  names: {},
};

const STYLES = `
  :host { display: block; }
  ha-card { padding: 12px; }
  .head { display: flex; justify-content: space-between; align-items: flex-end;
          gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
  .title { font-size: 18px; font-weight: 500; }
  .sub { font-size: 12px; color: var(--secondary-text-color); }
  .elec { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .ecell { display: flex; gap: 8px; align-items: baseline; padding: 5px 10px;
           border: 1px solid var(--divider-color); border-radius: 6px;
           font-family: var(--code-font-family, monospace); font-size: 12px; }
  .ecell b { color: var(--secondary-text-color); font-weight: 700; }
  .ecell .i { color: var(--info-color, #58a6ff); }

  .rail { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px;
          border: 1px solid var(--divider-color); border-radius: 8px; }
  .term { display: flex; flex-direction: column; min-width: 84px; padding: 4px;
          border: 1px solid var(--divider-color); border-radius: 4px;
          background: var(--secondary-background-color); }
  /* The feeds and the end cap carry nothing, so they take the width of what
     they are rather than the width of a terminal with eight channels on it. */
  .term.passive { opacity: .5; min-width: 46px; }
  .term.passive .strip { flex-direction: column; gap: 0; align-items: center; }
  .strip { display: flex; justify-content: space-between; align-items: center;
           margin-bottom: 4px; padding: 2px 4px; font-size: 11px;
           color: var(--secondary-text-color); }
  .strip .pos { font-weight: 700; }
  .strip .model { font-family: var(--code-font-family, monospace); }
  .cells { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px; }
  .cells.wide { grid-template-columns: repeat(4, 1fr); }
  .cells.empty { font-size: 10px; padding: 6px 2px; text-align: center;
                 line-height: 1.25; word-break: break-word;
                 color: var(--secondary-text-color); }
  .cell { display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-width: 32px; min-height: 32px;
          padding: 3px 2px; border: 1px solid var(--divider-color);
          border-radius: 3px; background: rgba(127,127,127,.12);
          color: var(--primary-text-color); font: inherit; font-size: 11px;
          cursor: pointer; }
  .cell:hover { border-color: var(--primary-color); }
  .cell:active { transform: translateY(1px); }
  .cell:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
  .cell .no { font-size: 9px; color: var(--secondary-text-color); }
  .cell .val { font-size: 14px; font-weight: 700; line-height: 1.1; }
  .cell.di.on { background: rgba(63,185,80,.40); color: #3fb950; border-color: #3fb950; }
  .cell.do.on { background: rgba(255,165,0,.50); color: #ffa657; border-color: #ffa657; }
  .cell.dali.on { background: rgba(252,211,77,.90); color: #1a1a1a; border-color: #fcd34d; }
  .cell.dali.off { color: #fcd34d; border-color: rgba(252,211,77,.3); }
  .cell.num { min-width: 46px; background: rgba(88,166,255,.18);
              color: var(--info-color, #58a6ff); }
  .cell.gone { background: none; border-style: dashed; color: #8a6d3b; cursor: default; }
  .legend { margin-top: 8px; font-size: 11px; color: var(--secondary-text-color); }
  .warn { padding: 10px; font-size: 13px; color: var(--error-color, #f85149); }
  @media (max-width: 600px) { .term { min-width: 76px; } }
`;

class PodlipaPlcRailCard extends HTMLElement {
  static getStubConfig() {
    return { type: "custom:podlipa-plc-rail-card" };
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
    this._root = null;
    this._cells = null;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._root) this._build();
    this._update();
  }

  getCardSize() {
    return 14;
  }

  /* ------------------------------------------------------------- internals */

  /** The digital prefixes, FOUND in hass rather than assumed. */
  _prefixes() {
    if (this._pfx) return this._pfx;
    const c = this._config;
    const find = (tail) => {
      if (!this._hass) return "";
      const re = new RegExp(`^binary_sensor\\..*plc_digital_${tail}$`);
      const hit = Object.keys(this._hass.states).find((k) => re.test(k));
      return hit ? hit.slice(0, hit.length - "1_1".length) : "";
    };
    this._pfx = {
      di: c.prefix_in || find("inputs_di_1_1"),
      do: c.prefix_out || find("outputs_do_1_1"),
    };
    return this._pfx;
  }

  _entity(kind, sig, idx) {
    if (kind === "num") return idx;                       // already an entity id
    if (kind === "dali") return `light.li_${idx}_li_${idx}`;
    const p = this._prefixes()[kind];
    if (!p) return "";
    const m = /^(?:DI|DO)-(\d+)-(\d+)$/.exec(sig);
    return m ? `${p}${m[1]}_${m[2]}` : "";
  }

  /** A cell's tooltip: the config's name, else Home Assistant's own, else the
   *  signal on the terminal. Never anything baked into this file. */
  _label(sig, id) {
    const given = this._config.names && this._config.names[sig];
    if (given) return `${sig}: ${given}`;
    const s = this._st(id);
    const fn = s && s.attributes && s.attributes.friendly_name;
    return fn && fn !== sig ? `${sig}: ${fn}` : sig;
  }

  _st(id) {
    return this._hass && id ? this._hass.states[id] : undefined;
  }

  _moreInfo(id) {
    if (!id) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId: id };
    this.dispatchEvent(ev);
  }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = STYLES;

    const card = document.createElement("ha-card");
    card.innerHTML = `
      <div class="head">
        <div>
          <div class="title">${this._config.name}</div>
          <div class="sub">CX8290 EtherCAT chain &middot; ${COUNTS.terminals} terminalov
            &middot; ${COUNTS.cells} kanalov</div>
        </div>
      </div>
      <div class="elec" id="elec"></div>
      <div class="rail" id="rail"></div>
      <div class="legend">Zeleno vhod visoko &middot; oranzno izhod vklopljen
        &middot; rumeno DALI &middot; modro meritev &middot; crtkano ni entitete</div>`;

    const rail = card.querySelector("#rail");
    this._cells = [];

    for (const [pos, model, kind, cells] of RAIL) {
      const box = document.createElement("div");
      box.className = "term" + (kind === "passive" ? " passive" : "");
      box.innerHTML = `<div class="strip"><span class="pos">#${pos}</span>` +
                      `<span class="model">${model}</span></div>`;
      if (!cells.length) {
        const e = document.createElement("div");
        e.className = "cells empty";
        e.textContent = kind === "passive" ? "sys" : "ni vezan";
        box.appendChild(e);
      } else {
        const grid = document.createElement("div");
        grid.className = "cells" + (cells.length > 8 ? " wide" : "");
        for (const [no, sig, idx] of cells) {
          const b = document.createElement("button");
          b.className = "cell " + kind;
          b.innerHTML = `<span class="no">${no}</span><span class="val">&middot;</span>`;
          const id = this._entity(kind, sig, idx);
          b.title = this._label(sig, id);
          b.addEventListener("click", () => this._moreInfo(id));
          grid.appendChild(b);
          this._cells.push({ el: b, val: b.querySelector(".val"), kind, id, sig });
        }
        box.appendChild(grid);
      }
      rail.appendChild(box);
    }

    this.shadowRoot.append(style, card);
    this._root = card;
  }

  _update() {
    if (!this._root) return;
    for (const c of this._cells) {
      const s = this._st(c.id);
      const known = s && s.state !== "unavailable" && s.state !== "unknown";
      c.el.className = "cell " + c.kind + (known ? "" : " gone");
      if (!known) {
        c.val.textContent = c.kind === "num" ? "–" : "?";
        continue;
      }
      c.el.title = this._label(c.sig, c.id);
      if (c.kind === "dali") {
        c.el.classList.add(s.state === "on" ? "on" : "off");
        c.val.textContent = s.state === "on"
          ? Math.round(((s.attributes.brightness || 0) * 100) / 255) + "%"
          : "OFF";
      } else if (c.kind === "num") {
        c.val.textContent = s.state;
      } else {
        c.el.classList.add(s.state === "on" ? "on" : "off");
        c.val.textContent = s.state === "on" ? "●" : "○";
      }
    }

    const bar = this._root.querySelector("#elec");
    if (!this._config.show_electricity) { bar.innerHTML = ""; return; }
    const v = (id) => {
      const s = this._st(id);
      return s && s.state !== "unknown" ? s.state : "–";
    };
    const c = this._config;
    bar.innerHTML = ["L1", "L2", "L3"].map((lbl, i) =>
      `<div class="ecell"><b>${lbl}</b><span>${v(c.voltage[i])} V</span>` +
      `<span class="i">${v(c.current[i])} A</span></div>`).join("") +
      `<div class="ecell"><b>f</b><span>${v(c.frequency)} Hz</span></div>`;
  }
}

customElements.define("podlipa-plc-rail-card", PodlipaPlcRailCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "podlipa-plc-rail-card",
  name: "Podlipa PLC Rail",
  description: "EtherCAT letvica: vsi terminali, vhodi, izhodi, DALI in meritve v zivo",
  preview: false,
});

console.info(
  "%c PODLIPA-PLC-RAIL-CARD %c v1.0.2 ",
  "background:#0f7a3d;color:#fff", "background:#333;color:#fff");
