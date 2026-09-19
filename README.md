# Podlipa PLC Rail Card

The EtherCAT rail of the Podlipa PLC as a native Lovelace card: every terminal
in the cabinet, in order, with a live cell per channel.

![rail](docs/rail.png)

## Why a card and not a markdown card

Home Assistant's markdown card allows inline styles and nothing else -- no
stylesheet, no `:hover`, no click handler. The rail can be *drawn* there but not
*used*. Here a cell hovers, and clicking one opens Home Assistant's own
more-info dialog, with history, for that exact channel.

## What it draws

| position | terminal | |
|---|---|---|
| #1 | EK1200 | coupler, drawn as `sistemski` |
| #2-12 | EL2008 | 80 outputs (#7 is an EL9410 feed) |
| #14-46 | EL1008 | 248 inputs (#33 a feed) |
| #44 | EL1489 | 16 channels, not 8 -- drawn four across |
| #47 | EL6821 | 54 DALI lights, with their level |
| #48 | EL3443 | three phases and the frequency |
| #49-50 | EL3208 | temperature |
| #51 | EL9011 | end cap |

The passive terminals are drawn rather than skipped. A rail with holes where the
feeds are is not the rail in the cabinet, and the position numbers stop matching
what is screwed to it.

## Installation

HACS -> three dots -> Custom repositories -> this repository, category
**Dashboard**. Then add the card:

```yaml
type: custom:podlipa-plc-rail-card
```

Every entity is found automatically. The digital prefixes are **searched for in
`hass.states`**, never predicted: Home Assistant puts the area in front of an
entity_id when the device has one, and guessing that cost two rounds of a view
that rendered empty.

### Options

| option | default | |
|---|---|---|
| `name` | `Virtualni PLC` | card title |
| `prefix_in` / `prefix_out` | auto | override the digital entity prefixes |
| `voltage` / `current` | `sensor.electrical_*` | three phases |
| `frequency` | `sensor.electrical_frequency` | |
| `show_electricity` | `true` | the bar above the rail |

## The layout is generated, not typed

`build.py` reads, out of the `podlipa-plc` repository:

- the terminal list from `Podlipa2026.1.tsproj`
- the index-to-channel binding from `MAIN`'s `TcLinkTo` attributes
- the channel names from `GVL_DirectReactiveMap`, `GVL_HaEntityMap` and
  `GVL_LegacyTopicMap`

**Re-run it after any change to the I/O map.** The EL1489 at position 44 is why
this is worth deriving: it is the one terminal that breaks the
eight-channels-per-row assumption, and a hand-drawn rail would have had it wrong
and looked right.

## Where the names are, and why they are not here

The card carries hardware topology only: terminal models and channel counts.
Which room a button lights, where a leak sensor sits and whose bedroom is whose
is a floor plan, so it is not in this repository.

A cell labels itself from, in order:

1. the `names:` map in the card's own config -- which lives in the dashboard,
   inside Home Assistant
2. the entity's `friendly_name`, for the channels that have a named entity
3. the signal on the terminal, `DI-24-3`

`build.py` writes the map to `names.json` beside itself, which is gitignored.
Paste it into the card config, or leave it out and take what Home Assistant
already knows.
