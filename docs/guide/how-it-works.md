# How it works

Four ideas explain almost everything in DreamTags. Once they click, the YAML
reads itself.

## 1. Nothing is really there

A tag is a **text display sent as packets** to the players who should see it. No
entity is spawned, nothing is saved to the chunk, and `/kill @e` cannot touch it.

The practical consequences:

- Tags cannot be destroyed by other plugins, world resets or entity clearing.
- Two players can be shown different things at the same time, which is what
  makes per-player damage numbers and hidden nametags possible.
- Tags follow their entity by **riding it as a passenger**, so the client moves
  them every frame and the server sends no position packets at all.

## 2. A bar is an image, not a string of characters

Most nametag plugins draw bars with characters (`■■■□□`). DreamTags slices a PNG
into frames instead, so a bar is a real texture that can be any shape.

```
default_healthbar_fill.png   77 x 6 px
        ↓  type: progress, anchor: left, frames: 77
frame 0  (empty)  ...  frame 38 (half)  ...  frame 77 (full)
```

Pick the frame to show and you have a bar. That is all a "health bar" is.

## 3. The image says *how it is cut*, the layout says *what drives it*

::: tip The single most common confusion
`type:` in `images/*.yml` describes **how the frames are produced from the PNG**.
It does **not** say where the value comes from.

What fills the bar is `listener:` on the slot in the **layout**.
:::

That separation is why the same image can be a health bar in one layout and a
mana bar in another:

```yaml
# images/*.yml — how to cut it
health_fill:
  file: default_healthbar_fill.png
  type: progress      # slice into frames
  anchor: left        # the left edge stays put; it drains from the right
  frames: 77
```

```yaml
# layouts/*.yml — what fills it
health_bar:
  image: health_fill
  listener: health    # ← the value source

mana_bar:
  image: health_fill  # same texture
  listener: mana      # different value
```

The one exception is `type: frame-sequence`, a time-based animation that plays
on its own clock and ignores `listener:` entirely.

## 4. Ids are global, and content is assembled in layers

Everything you define gets an **id**, and ids are shared across every pack — not
scoped to the pack that declared them. That is what lets packs build on each
other.

```
assets/*.png          raw textures
    ↓
images/*.yml          PNG → frames               id: health_fill
fonts/*.yml           PNG grid → a font          id: pixel
backgrounds/*.yml     PNG pieces → a plate       id: name_plate
    ↓
layouts/*.yml         arrange them into a design id: player_layout
    ↓
tags/*.yml            who wears it, and when     id: my_nametag
```

The `soulmates_pack` that ships with the plugin is the proof: it defines its own
images, but its layout uses `font: pixel` and `background: name_plate` from the
`default` pack.

## Layers and stacking

Inside a layout, each slot has a `layer:`. Higher numbers draw in front. The
health bar in `default_layout` is five slots on five layers:

| layer | slot | what it is |
| --- | --- | --- |
| 1 | `health_frame` | the border, marked `background: true` |
| 2 | `health_trail_damage` | the red ghost bar left behind by a hit |
| 3 | `health_heal_incoming` | the green heal preview |
| 4 | `health_fill_*` | the live bar — three variants gated by health |
| 6 | `active_buffs` | the potion effect row |
| 10 | `title` | the name, on its plate |

Layers 4 shows one of three images depending on how hurt the entity is, using
[conditions](/layouts/conditions):

```yaml
health_fill_normal:
  condition: "{health_percentage} > 0.5"      # green
health_fill_mid:
  condition:
    - "{health_percentage} <= 0.5"            # yellow
    - "{health_percentage} > 0.2"
health_fill_low:
  condition: "{health_percentage} <= 0.2"     # red
```

## Rendering cost

Two details worth knowing before you design something heavy:

- **A nametag's content belongs to the entity wearing it**, not to the viewer.
  When DreamTags can prove that at load time, it renders the tag once and sends
  the same packets to everyone — instead of rebuilding it for every observer.
- **PlaceholderAPI expressions break that.** A `%papi%` placeholder can read the
  viewer, so any layout using one falls back to rendering per viewer. Prefer the
  [built-in placeholders](/placeholders/built-in) when an equivalent exists.

The startup log tells you when a tag ended up on the slower path, and why.

## Next

- [Images](/images) — the four `type` values in detail
- [Layouts](/layouts/) — every section and key
- [Tags](/tags) — selectors, triggers and priority
