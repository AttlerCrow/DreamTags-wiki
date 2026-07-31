# How it works

## Tags are packets

A tag is a text display sent as packets to the players who should see it. No
entity is spawned and nothing is saved to the chunk, so `/kill @e` does not
affect it and other plugins cannot clear it.

Because packets are per-player, two players can be shown different things. This
is what allows per-player damage numbers and hidden nametags.

Tags follow their entity by riding it as a passenger. The client moves them every
frame, so the server sends no position packets.

## Bars are images

A bar is a PNG cut into frames rather than a row of `■` characters.

```
default_healthbar_fill.png   77 x 6 px
        ↓  type: progress, anchor: left, frames: 77
frame 0 (empty)  ...  frame 38 (half)  ...  frame 77 (full)
```

A health bar displays the frame matching the current value.

## The image says how it is cut, the layout says what fills it

`type:` in `images/*.yml` only describes how frames are produced from the PNG.
The value comes from `listener:` on the slot in the layout.

```yaml
# images/*.yml
health_fill:
  file: default_healthbar_fill.png
  type: progress      # cut into frames
  anchor: left        # left edge stays put, drains from the right
  frames: 77
```

```yaml
# layouts/*.yml
health_bar:
  image: health_fill
  listener: health

mana_bar:
  image: health_fill   # same texture
  listener: mana       # different value
```

There is one exception: `type: frame-sequence` animates on a clock and ignores
`listener:`.

## Ids are global

Everything you define gets an id, and ids are shared across all packs. This is
what allows one pack to build on another: `soulmates_pack` defines its own
images but uses `font: pixel` and `background: name_plate` from `default`.

```
assets/*.png          textures
    ↓
images/*.yml          PNG → frames         id: health_fill
fonts/*.yml           PNG grid → font      id: pixel
backgrounds/*.yml     PNG pieces → plate   id: name_plate
    ↓
layouts/*.yml         the design           id: player_layout
    ↓
tags/*.yml            who wears it         id: my_nametag
```

## Layers

Each slot has a `layer:`. Higher draws in front. The health bar in
`default_layout` is five slots:

| layer | slot | what |
| --- | --- | --- |
| 1 | `health_frame` | border, marked `background: true` |
| 2 | `health_trail_damage` | red ghost bar left by a hit |
| 3 | `health_heal_incoming` | green heal preview |
| 4 | `health_fill_*` | the live bar, three colour variants |
| 6 | `active_buffs` | potion effect row |
| 10 | `title` | name on its plate |

Layer 4 holds three slots with conditions that cannot overlap, so exactly one
shows:

```yaml
health_fill_normal:
  condition: "{health_percentage} > 0.5"
health_fill_mid:
  condition:
    - "{health_percentage} <= 0.5"
    - "{health_percentage} > 0.2"
health_fill_low:
  condition: "{health_percentage} <= 0.2"
```

## Rendering cost

A nametag's content depends on the entity wearing it rather than on the viewer.
When DreamTags can establish that at load time, it renders the tag once and
sends the same packets to everyone.

`%papi%` placeholders can read the viewer, so a layout using one is rendered
separately for each viewer instead. Use a [built-in](/placeholders/built-in)
where one exists. The startup log names any tag on the per-viewer path.

## Next

- [Images](/images)
- [Layouts](/layouts/)
- [Tags](/tags)
