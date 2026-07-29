# Images

`Packs/<pack>/images/*.yml` turns PNGs into frames. Each top-level key is an
image id.

```yaml
bar_frame:
  file: default_background_healthbar.png
  type: static
```

`type` describes how frames are cut from the PNG. What fills a bar is
`listener:` on the slot in the [layout](/layouts/images) — so the same image can
be a health bar in one layout and a mana bar in another.

## Common keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `type` | `static` · `progress` · `frame-defined` · `frame-sequence` | `static` | How frames are produced |
| `file` | string | — | PNG path inside `assets/`. Required for `static` and `progress` |
| `tint` | `#RRGGBB` | — | Recolours the PNG at load. Alpha untouched. Exactly six hex digits |
| `tint-mode` | `multiply` · `solid` · `recolor` | `multiply` | How the tint applies |

`file:` is looked up in the pack's `assets/` first, then the shared one.

### Tint modes

| Mode | Effect |
| --- | --- |
| `multiply` | Darkens. Cannot brighten — a red bar never becomes white |
| `solid` | Flat colour replace |
| `recolor` | Keeps shading: pixel brightness × colour |

Saves shipping four near-identical PNGs for four bar colours.

## static

One frame. Frames, icons, badges, plate bodies.

```yaml
bar_frame:
  file: default_background_healthbar.png
  type: static
```

## progress

One PNG cut into steps, driven by a `listener:`.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `anchor` | `left` · `right` · `top` · `bottom` | `left` | The side that stays fixed |
| `frames` | int, min 2 | `20` | Number of steps |

```yaml
health_fill:
  file: default_healthbar_fill.png
  type: progress
  anchor: left
  frames: 77
```

`anchor: left` pins the left edge, so the bar drains from the right.
`anchor: bottom` gives a vertical gauge.

The smoothest useful value for `frames` is one per pixel of width. The shipped
fills are 77 px wide, so they use `frames: 77`. More adds file size and no
visible steps.

`frames: 77` produces 78 images — index 0 is empty.

## frame-defined

Every frame is its own PNG, stepped by a `listener:` like `progress`. List order
runs 0.0 → 1.0. Use it when frames are not a simple slice — a bar that cracks
apart, a gauge with distinct states.

Frames come from either `files:` or `sheet:`.

## frame-sequence

A time-based animation on the tag's clock. Needs no listener.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `interval` | ticks, min 1 | `2` | Ticks per frame, for frames without their own `duration` |
| `loop` | boolean | `true` | `false` stops on the last frame |

```yaml
flame_ring:
  type: frame-sequence
  interval: 2
  loop: true
  sheet:
    file: flame_strip.png
    rows: 40
```

A `listener:` on one of these is ignored and logged as a warning. Gate it with
`condition:` instead.

## files vs sheet

`frame-defined` and `frame-sequence` need exactly one of these. Both, or
neither, is an error.

### files

```yaml
bar_break:
  type: frame-defined
  files:
    - break_0.png
    - break_1.png
    - break_2.png
```

An entry can be a map to give one frame its own duration:

```yaml
fire:
  type: frame-sequence
  interval: 2
  files:
    - fire_0.png
    - file: fire_1.png
      duration: 6      # holds 6 ticks instead of 2
    - fire_2.png
```

### sheet

A grid of equal cells, read left to right then top to bottom.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `file` | string | — required | The sheet PNG |
| `rows` | int ≥ 1 | — required | Rows |
| `columns` | int, min 1 | `1` | Columns. `1` = vertical strip |
| `frames` | int | `rows × columns` | Use only the first N cells |

```yaml
spinner:
  type: frame-sequence
  sheet:
    file: spinner_sheet.png
    rows: 4
    columns: 8
    frames: 30      # last two cells are padding
```

The PNG must divide exactly into `columns × rows`, or the load fails with the
dimensions it found.

## Example

From `Packs/default/images/default_images.yml` — a bar frame and the fills it
swaps between:

```yaml
# 79x8 frame around 77x6 fills
bar_frame:
  file: default_background_healthbar.png
  type: static

health_fill:
  file: default_healthbar_fill.png
  type: progress
  anchor: left
  frames: 77

health_fill_mid:
  file: healthbar_yellow_fill.png
  type: progress
  anchor: left
  frames: 77

health_fill_low:
  file: default_lowhealth_fill.png
  type: progress
  anchor: left
  frames: 77

trail_damage:
  file: default_trailing_damage.png
  type: progress
  anchor: left
  frames: 77

heal_incoming:
  file: default_trailing_green.png
  type: progress
  anchor: left
  frames: 77
```

Which one shows, and how full, is decided in the [layout](/layouts/images).

## Duplicate ids

The pack that loads later wins, with a warning. See
[load order](/packs/#load-order).
