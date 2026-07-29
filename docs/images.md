# Images

`Packs/<pack>/images/*.yml` turns PNGs into frames that layouts can draw. Each
top-level key is an **image id**.

```yaml
bar_frame:
  file: default_background_healthbar.png
  type: static
```

::: warning `type` is not the value source
`type` describes **how the frames are produced from the PNG**. It does not say
what fills the bar — that is `listener:` on the slot in the
[layout](/layouts/images).

This separation is the point: the same image can be a health bar in one layout
and a mana bar in another.
:::

## Common keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `type` | `static` · `progress` · `frame-defined` · `frame-sequence` | `static` | How frames are produced |
| `file` | string | — | PNG path inside `assets/`. Required for `static` and `progress` |
| `tint` | `#RRGGBB` | — | Recolours the PNG at load. Alpha is untouched. Exactly six hex digits |
| `tint-mode` | `multiply` · `solid` · `recolor` | `multiply` | How the tint is applied |

`file:` is resolved in the pack's own `assets/` first, then the shared
`plugins/DreamTags/assets/` — see [Packs](/packs/#where-pngs-are-looked-up).

### Tint modes

| Mode | Effect |
| --- | --- |
| `multiply` | Darkens with the colour. **Cannot brighten** — a red bar can never become white |
| `solid` | Flat colour replace. Use this to turn a red bar white |
| `recolor` | Keeps the shading: pixel brightness × the colour |

Tinting saves shipping four near-identical PNGs for four bar colours.

## type: static

One fixed frame. Frames, icons, badges, plate bodies.

```yaml
bar_frame:
  file: default_background_healthbar.png
  type: static
```

## type: progress

One PNG sliced into steps, driven by a `listener:` in the layout. This is what a
health or mana bar is made of.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `anchor` | `left` · `right` · `top` · `bottom` | `left` | The side that stays **fixed** |
| `frames` | int, min 2 | `20` | Number of steps |

```yaml
health_fill:
  file: default_healthbar_fill.png
  type: progress
  anchor: left
  frames: 77
```

`anchor: left` means the left edge is pinned and the bar drains from the right —
the classic health bar. `anchor: bottom` gives you a vertical gauge that fills
upward.

::: tip Choosing `frames`
The smoothest a bar can get is **one frame per pixel of width**. The shipped
fills are 77 px wide, so they use `frames: 77`. More than that adds file size
without adding a single visible step.
:::

Internally `frames: 77` produces 78 images — index 0 is the empty frame.

## type: frame-defined

Every frame is its own image, stepped by a `listener:` exactly like `progress`.
List order runs from 0.0 to 1.0. Use it when the frames are not a simple slice —
a bar that cracks apart, a gauge with distinct states.

Frames come from **either** `files:` or `sheet:`, never both.

## type: frame-sequence

A time-based animation. It plays on the tag's own clock and needs **no
listener**.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `interval` | int ticks, min 1 | `2` | Ticks per frame, for frames without their own `duration` |
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

::: warning A listener on an animation is ignored
If you put `listener:` on a slot whose image is a `frame-sequence`, it is
ignored and a warning is logged. The animation runs on time, not on a value.
Gate it with `condition:` instead if you only want it sometimes.
:::

## Supplying frames: files vs sheet

`frame-defined` and `frame-sequence` need exactly one of these. Both → error.
Neither → error.

### files

A list of PNG paths, in order.

```yaml
bar_break:
  type: frame-defined
  files:
    - break_0.png
    - break_1.png
    - break_2.png
```

An entry can also be a map to give one frame its own duration — useful in a
`frame-sequence` to hold a pose:

```yaml
fire:
  type: frame-sequence
  interval: 2
  files:
    - fire_0.png
    - file: fire_1.png
      duration: 6      # this frame lasts 6 ticks instead of 2
    - fire_2.png
```

### sheet

One PNG holding a grid of equally sized cells, read left to right then top to
bottom.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `file` | string | — **required** | The sheet PNG |
| `rows` | int ≥ 1 | — **required** | Number of rows |
| `columns` | int, min 1 | `1` | Number of columns. `1` = a vertical strip |
| `frames` | int | `rows × columns` | Use only the first N cells |

```yaml
spinner:
  type: frame-sequence
  sheet:
    file: spinner_sheet.png
    rows: 4
    columns: 8
    frames: 30      # the last two cells are blank padding
```

The PNG must divide exactly into `columns × rows`; if it does not, the load
fails with the dimensions it found.

## A real example

From `Packs/default/images/default_images.yml` — a health bar frame and the
three fills it swaps between:

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

# ghost bar left behind on damage
trail_damage:
  file: default_trailing_damage.png
  type: progress
  anchor: left
  frames: 77

# incoming-heal preview
heal_incoming:
  file: default_trailing_green.png
  type: progress
  anchor: left
  frames: 77
```

Note that all six are just images. Which one shows, and how full it is, is
decided in the [layout](/layouts/images).

## Duplicate ids

If two packs declare the same image id, the one that loads later wins and a
warning is printed. See [load order](/packs/#load-order-and-overriding).
