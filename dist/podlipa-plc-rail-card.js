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

const VERSION = "v1.0.2";
const RAIL = [[1,"EK1200","passive",[]],[2,"EL2008","do",[[1,"DO-1-1",1],[2,"DO-1-2",2],[3,"DO-1-3",3],[4,"DO-1-4",4],[5,"DO-1-5",5],[6,"DO-1-6",6],[7,"DO-1-7",7],[8,"DO-1-8",8]]],[3,"EL2008","do",[[1,"DO-2-1",9],[2,"DO-2-2",10],[3,"DO-2-3",11],[4,"DO-2-4",12],[5,"DO-2-5",13],[6,"DO-2-6",14],[7,"DO-2-7",15],[8,"DO-2-8",16]]],[4,"EL2008","do",[[1,"DO-3-1",17],[2,"DO-3-2",18],[3,"DO-3-3",19],[4,"DO-3-4",20],[5,"DO-3-5",21],[6,"DO-3-6",22],[7,"DO-3-7",23],[8,"DO-3-8",24]]],[5,"EL2008","do",[[1,"DO-4-1",25],[2,"DO-4-2",26],[3,"DO-4-3",27],[4,"DO-4-4",28],[5,"DO-4-5",29],[6,"DO-4-6",30],[7,"DO-4-7",31],[8,"DO-4-8",32]]],[6,"EL2008","do",[[1,"DO-5-1",33],[2,"DO-5-2",34],[3,"DO-5-3",35],[4,"DO-5-4",36],[5,"DO-5-5",37],[6,"DO-5-6",38],[7,"DO-5-7",39],[8,"DO-5-8",40]]],[7,"EL9410","passive",[]],[8,"EL2008","do",[[1,"DO-6-1",41],[2,"DO-6-2",42],[3,"DO-6-3",43],[4,"DO-6-4",44],[5,"DO-6-5",45],[6,"DO-6-6",46],[7,"DO-6-7",47],[8,"DO-6-8",48]]],[9,"EL2008","do",[[1,"DO-7-1",49],[2,"DO-7-2",50],[3,"DO-7-3",51],[4,"DO-7-4",52],[5,"DO-7-5",53],[6,"DO-7-6",54],[7,"DO-7-7",55],[8,"DO-7-8",56]]],[10,"EL2008","do",[[1,"DO-8-1",57],[2,"DO-8-2",58],[3,"DO-8-3",59],[4,"DO-8-4",60],[5,"DO-8-5",61],[6,"DO-8-6",62],[7,"DO-8-7",63],[8,"DO-8-8",64]]],[11,"EL2008","do",[[1,"DO-9-1",65],[2,"DO-9-2",66],[3,"DO-9-3",67],[4,"DO-9-4",68],[5,"DO-9-5",69],[6,"DO-9-6",70],[7,"DO-9-7",71],[8,"DO-9-8",72]]],[12,"EL2008","do",[[1,"DO-10-1",73],[2,"DO-10-2",74],[3,"DO-10-3",75],[4,"DO-10-4",76],[5,"DO-10-5",77],[6,"DO-10-6",78],[7,"DO-10-7",79],[8,"DO-10-8",80]]],[13,"EL9410","passive",[]],[14,"EL1008","di",[[1,"DI-1-1",1],[2,"DI-1-2",2],[3,"DI-1-3",3],[4,"DI-1-4",4],[5,"DI-1-5",5],[6,"DI-1-6",6],[7,"DI-1-7",7],[8,"DI-1-8",8]]],[15,"EL1008","di",[[1,"DI-2-1",9],[2,"DI-2-2",10],[3,"DI-2-3",11],[4,"DI-2-4",12],[5,"DI-2-5",13],[6,"DI-2-6",14],[7,"DI-2-7",15],[8,"DI-2-8",16]]],[16,"EL1008","di",[[1,"DI-3-1",17],[2,"DI-3-2",18],[3,"DI-3-3",19],[4,"DI-3-4",20],[5,"DI-3-5",21],[6,"DI-3-6",22],[7,"DI-3-7",23],[8,"DI-3-8",24]]],[17,"EL1008","di",[[1,"DI-4-1",25],[2,"DI-4-2",26],[3,"DI-4-3",27],[4,"DI-4-4",28],[5,"DI-4-5",29],[6,"DI-4-6",30],[7,"DI-4-7",31],[8,"DI-4-8",32]]],[18,"EL1008","di",[[1,"DI-5-1",33],[2,"DI-5-2",34],[3,"DI-5-3",35],[4,"DI-5-4",36],[5,"DI-5-5",37],[6,"DI-5-6",38],[7,"DI-5-7",39],[8,"DI-5-8",40]]],[19,"EL1008","di",[[1,"DI-6-1",41],[2,"DI-6-2",42],[3,"DI-6-3",43],[4,"DI-6-4",44],[5,"DI-6-5",45],[6,"DI-6-6",46],[7,"DI-6-7",47],[8,"DI-6-8",48]]],[20,"EL1008","di",[[1,"DI-7-1",49],[2,"DI-7-2",50],[3,"DI-7-3",51],[4,"DI-7-4",52],[5,"DI-7-5",53],[6,"DI-7-6",54],[7,"DI-7-7",55],[8,"DI-7-8",56]]],[21,"EL1008","di",[[1,"DI-8-1",57],[2,"DI-8-2",58],[3,"DI-8-3",59],[4,"DI-8-4",60],[5,"DI-8-5",61],[6,"DI-8-6",62],[7,"DI-8-7",63],[8,"DI-8-8",64]]],[22,"EL1008","di",[[1,"DI-9-1",65],[2,"DI-9-2",66],[3,"DI-9-3",67],[4,"DI-9-4",68],[5,"DI-9-5",69],[6,"DI-9-6",70],[7,"DI-9-7",71],[8,"DI-9-8",72]]],[23,"EL1008","di",[[1,"DI-10-1",73],[2,"DI-10-2",74],[3,"DI-10-3",75],[4,"DI-10-4",76],[5,"DI-10-5",77],[6,"DI-10-6",78],[7,"DI-10-7",79],[8,"DI-10-8",80]]],[24,"EL1008","di",[[1,"DI-11-1",81],[2,"DI-11-2",82],[3,"DI-11-3",83],[4,"DI-11-4",84],[5,"DI-11-5",85],[6,"DI-11-6",86],[7,"DI-11-7",87],[8,"DI-11-8",88]]],[25,"EL1008","di",[[1,"DI-12-1",89],[2,"DI-12-2",90],[3,"DI-12-3",91],[4,"DI-12-4",92],[5,"DI-12-5",93],[6,"DI-12-6",94],[7,"DI-12-7",95],[8,"DI-12-8",96]]],[26,"EL1008","di",[[1,"DI-13-1",97],[2,"DI-13-2",98],[3,"DI-13-3",99],[4,"DI-13-4",100],[5,"DI-13-5",101],[6,"DI-13-6",102],[7,"DI-13-7",103],[8,"DI-13-8",104]]],[27,"EL1008","di",[[1,"DI-14-1",105],[2,"DI-14-2",106],[3,"DI-14-3",107],[4,"DI-14-4",108],[5,"DI-14-5",109],[6,"DI-14-6",110],[7,"DI-14-7",111],[8,"DI-14-8",112]]],[28,"EL1008","di",[[1,"DI-15-1",113],[2,"DI-15-2",114],[3,"DI-15-3",115],[4,"DI-15-4",116],[5,"DI-15-5",117],[6,"DI-15-6",118],[7,"DI-15-7",119],[8,"DI-15-8",120]]],[29,"EL1008","di",[[1,"DI-16-1",121],[2,"DI-16-2",122],[3,"DI-16-3",123],[4,"DI-16-4",124],[5,"DI-16-5",125],[6,"DI-16-6",126],[7,"DI-16-7",127],[8,"DI-16-8",128]]],[30,"EL1008","di",[[1,"DI-17-1",129],[2,"DI-17-2",130],[3,"DI-17-3",131],[4,"DI-17-4",132],[5,"DI-17-5",133],[6,"DI-17-6",134],[7,"DI-17-7",135],[8,"DI-17-8",136]]],[31,"EL1008","di",[[1,"DI-18-1",137],[2,"DI-18-2",138],[3,"DI-18-3",139],[4,"DI-18-4",140],[5,"DI-18-5",141],[6,"DI-18-6",142],[7,"DI-18-7",143],[8,"DI-18-8",144]]],[32,"EL1008","di",[[1,"DI-19-1",145],[2,"DI-19-2",146],[3,"DI-19-3",147],[4,"DI-19-4",148],[5,"DI-19-5",149],[6,"DI-19-6",150],[7,"DI-19-7",151],[8,"DI-19-8",152]]],[33,"EL9410","passive",[]],[34,"EL1008","di",[[1,"DI-20-1",153],[2,"DI-20-2",154],[3,"DI-20-3",155],[4,"DI-20-4",156],[5,"DI-20-5",157],[6,"DI-20-6",158],[7,"DI-20-7",159],[8,"DI-20-8",160]]],[35,"EL1008","di",[[1,"DI-21-1",161],[2,"DI-21-2",162],[3,"DI-21-3",163],[4,"DI-21-4",164],[5,"DI-21-5",165],[6,"DI-21-6",166],[7,"DI-21-7",167],[8,"DI-21-8",168]]],[36,"EL1008","di",[[1,"DI-22-1",169],[2,"DI-22-2",170],[3,"DI-22-3",171],[4,"DI-22-4",172],[5,"DI-22-5",173],[6,"DI-22-6",174],[7,"DI-22-7",175],[8,"DI-22-8",176]]],[37,"EL1008","di",[[1,"DI-23-1",177],[2,"DI-23-2",178],[3,"DI-23-3",179],[4,"DI-23-4",180],[5,"DI-23-5",181],[6,"DI-23-6",182],[7,"DI-23-7",183],[8,"DI-23-8",184]]],[38,"EL1008","di",[[1,"DI-24-1",185],[2,"DI-24-2",186],[3,"DI-24-3",187],[4,"DI-24-4",188],[5,"DI-24-5",189],[6,"DI-24-6",190],[7,"DI-24-7",191],[8,"DI-24-8",192]]],[39,"EL1008","di",[[1,"DI-25-1",193],[2,"DI-25-2",194],[3,"DI-25-3",195],[4,"DI-25-4",196],[5,"DI-25-5",197],[6,"DI-25-6",198],[7,"DI-25-7",199],[8,"DI-25-8",200]]],[40,"EL1008","di",[[1,"DI-26-1",201],[2,"DI-26-2",202],[3,"DI-26-3",203],[4,"DI-26-4",204],[5,"DI-26-5",205],[6,"DI-26-6",206],[7,"DI-26-7",207],[8,"DI-26-8",208]]],[41,"EL1008","di",[[1,"DI-27-1",209],[2,"DI-27-2",210],[3,"DI-27-3",211],[4,"DI-27-4",212],[5,"DI-27-5",213],[6,"DI-27-6",214],[7,"DI-27-7",215],[8,"DI-27-8",216]]],[42,"EL1008","di",[[1,"DI-28-1",217],[2,"DI-28-2",218],[3,"DI-28-3",219],[4,"DI-28-4",220],[5,"DI-28-5",221],[6,"DI-28-6",222],[7,"DI-28-7",223],[8,"DI-28-8",224]]],[43,"EL1008","di",[[1,"DI-29-1",225],[2,"DI-29-2",226],[3,"DI-29-3",227],[4,"DI-29-4",228],[5,"DI-29-5",229],[6,"DI-29-6",230],[7,"DI-29-7",231],[8,"DI-29-8",232]]],[44,"EL1489","di",[[1,"DI-30-1",233],[2,"DI-30-2",234],[3,"DI-30-3",235],[4,"DI-30-4",236],[5,"DI-30-5",237],[6,"DI-30-6",238],[7,"DI-30-7",239],[8,"DI-30-8",240],[9,"DI-31-1",241],[10,"DI-31-2",242],[11,"DI-31-3",243],[12,"DI-31-4",244],[13,"DI-31-5",245],[14,"DI-31-6",246],[15,"DI-31-7",247],[16,"DI-31-8",248]]],[45,"EL1008","di",[[1,"DI-32-1",249],[2,"DI-32-2",250],[3,"DI-32-3",251],[4,"DI-32-4",252],[5,"DI-32-5",253],[6,"DI-32-6",254],[7,"DI-32-7",255],[8,"DI-32-8",256]]],[46,"EL1008","di",[[1,"DI-33-1",257],[2,"DI-33-2",258],[3,"DI-33-3",259],[4,"DI-33-4",260],[5,"DI-33-5",261],[6,"DI-33-6",262],[7,"DI-33-7",263],[8,"DI-33-8",264]]],[47,"EL6821","dali",[[1,"LI-1",1],[2,"LI-2",2],[3,"LI-3",3],[4,"LI-4",4],[5,"LI-5",5],[6,"LI-6",6],[7,"LI-7",7],[8,"LI-8",8],[9,"LI-9",9],[10,"LI-10",10],[11,"LI-11",11],[12,"LI-12",12],[13,"LI-13",13],[14,"LI-14",14],[15,"LI-15",15],[16,"LI-16",16],[17,"LI-17",17],[18,"LI-18",18],[19,"LI-19",19],[20,"LI-20",20],[21,"LI-21",21],[22,"LI-22",22],[23,"LI-23",23],[24,"LI-24",24],[25,"LI-25",25],[26,"LI-26",26],[27,"LI-27",27],[28,"LI-28",28],[29,"LI-29",29],[32,"LI-32",32],[33,"LI-33",33],[34,"LI-34",34],[35,"LI-35",35],[36,"LI-36",36],[37,"LI-37",37],[38,"LI-38",38],[39,"LI-39",39],[40,"LI-40",40],[41,"LI-41",41],[42,"LI-42",42],[43,"LI-43",43],[44,"LI-44",44],[45,"LI-45",45],[46,"LI-46",46],[47,"LI-47",47],[48,"LI-48",48],[49,"LI-49",49],[50,"LI-50",50],[51,"LI-51",51],[52,"LI-52",52],[53,"LI-53",53],[54,"LI-54",54],[55,"LI-55",55],[56,"LI-56",56]]],[48,"EL3443","num",[[1,"L1 U","sensor.electrical_voltage_l1"],[2,"L2 U","sensor.electrical_voltage_l2"],[3,"L3 U","sensor.electrical_voltage_l3"],[4,"L1 I","sensor.electrical_current_l1"],[5,"L2 I","sensor.electrical_current_l2"],[6,"L3 I","sensor.electrical_current_l3"],[7,"f","sensor.electrical_frequency"]]],[49,"EL3208-0010","num",[[1,"T-1",""],[2,"T-2",""],[3,"T-3",""],[4,"T-4",""],[5,"T-5",""],[6,"T-6",""],[7,"T-7",""],[8,"T-8","sensor.temperature_t_2_0"]]],[50,"EL3208-0010","num",[[1,"T-9","sensor.temperature_t_2_1"],[2,"T-10","sensor.temperature_t_2_2"],[3,"T-11","sensor.temperature_t_2_3"],[4,"T-12",""],[5,"T-13",""],[6,"T-14",""],[7,"T-15",""],[8,"T-16",""]]],[51,"EL9011","passive",[]]];
const COUNTS = {"terminals":51,"digital":344,"cells":421};

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
            &middot; ${COUNTS.cells} kanalov &middot; <span title="razlicica kartice"
            >${VERSION}</span></div>
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
  `%c PODLIPA-PLC-RAIL-CARD %c ${VERSION} `,
  "background:#0f7a3d;color:#fff", "background:#333;color:#fff");
