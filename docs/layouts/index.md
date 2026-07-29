# Layouts

A layout is a design: images, bars, text and buff icons arranged into the thing
that floats over an entity. `Packs/<pack>/layouts/*.yml`, one top-level key per
layout id.

```yaml
my_layout:
  images:
    frame:
      image: bar_frame
      layer: 1
      background: true
  texts:
    name:
      pattern: "<white>{entity_name}</white>"
      layer: 10
```

A layout does not decide *who* wears it — that is a [tag](/tags).

## Sections

All optional, and they load in this order:

| Section | What it holds | Page |
| --- | --- | --- |
| `components:` | Named vertical rows that collapse when empty | [Components](/layouts/components) |
| `images:` | Image slots: frames, bars, icons | [Images](/layouts/images) |
| `stacks:` | Several images overprinted into one display | [Stacks](/layouts/stacks) |
| `effects:` | The active potion effect grid | [Effects](/layouts/effects) |
| `texts:` | Text, with optional plate, font and rank icon | [Texts](/layouts/texts) |

Two keys appear in almost every slot and have their own pages:

- [`listener:`](/layouts/listeners) — what value fills a bar
- [`condition:`](/layouts/conditions) — whether the slot draws at all

## Coordinates

- **x** is in whole texture pixels and **must be an integer**. A decimal is
  rejected at load with `must be a whole texture pixel`.
- **y** is in pixels and **may be decimal**. Positive is up.
- `scale` multiplies the slot's size.
- `layer` decides draw order — higher numbers are in front.

One texture pixel is 1/40 of a block, so `y: 12` is about a third of a block
above the anchor.

## Layers and z-fighting

Each layer gets a small depth offset so overlapping slots do not fight. That
offset is real distance, though, so two textures of the same size on different
layers project at very slightly different scales up close.

When you are overprinting pieces that must line up **exactly** — a bar fill on
top of its frame — use a [stack](/layouts/stacks) instead. A stack puts every
piece in one display at one depth, so there is no gap at all.

## A complete example

`default_layout`, the mob health bar shipped with the plugin, trimmed to its
shape:

```yaml
default_layout:
  images:
    health_frame:
      image: bar_frame
      x: -1
      y: 1
      layer: 1
      background: true          # defines the reference width

    health_trail_damage:        # red ghost bar, lags behind a hit
      image: trail_damage
      x: -1
      y: 2
      layer: 2
      listener:
        type: trailing
        of: health
        on: decrease

    health_heal_incoming:       # green preview of incoming healing
      image: heal_incoming
      x: -1
      y: 2
      layer: 3
      listener: health

    health_fill_normal:         # the live bar, above 50%
      image: health_fill
      x: -1
      y: 2
      layer: 4
      condition: "{health_percentage} > 0.5"
      listener:
        type: trailing
        of: health
        on: increase
        delay: 2
        time: 10

    health_fill_mid:            # 20% - 50%
      image: health_fill_mid
      x: -1
      y: 2
      layer: 4
      condition:
        - "{health_percentage} <= 0.5"
        - "{health_percentage} > 0.2"
      listener:
        type: trailing
        of: health
        on: increase
        delay: 2
        time: 10

    health_fill_low:            # below 20%
      image: health_fill_low
      x: -1
      y: 2
      layer: 4
      condition: "{health_percentage} <= 0.2"
      listener:
        type: trailing
        of: health
        on: increase
        delay: 2
        time: 10

  effects:
    active_buffs:
      type: active-potion-effects
      background-image: effect_plate_bg
      icon-prefix: effect_
      x: -41
      y: -8
      scale: 0.5
      background-scale: 2.0
      layer: 6
      columns: 9
      max-rows: 6
      spacing-x: 10
      spacing-y: 10
      icon-x: 1
      tag-lift-per-row: 10
      fade-start: 40
      fade-min-opacity: 48

  texts:
    title:
      pattern: "<white>{entity_name}</white>"
      font: pixel
      background: name_plate
      layer: 10
      y: 12
      scale: 1

    level:
      align: right
      pattern: "<yellow>{mob_level}</yellow>"
      font: pixel
      background: level_plate
      layer: 11
      x: -46
      scale: 1
      condition: "{mob_level} > 0"
```

Three things worth noticing:

- The three `health_fill_*` slots all sit on **layer 4** with mutually exclusive
  conditions, so exactly one is ever visible. That is how a bar changes colour.
- `trail_damage` and `heal_incoming` use the same `health` value through
  different [trailing listeners](/layouts/listeners#trailing) — one lags on the
  way down, the other on the way up.
- The level badge is hidden entirely on non-RPG mobs by `{mob_level} > 0`.

## Duplicate ids

Two packs declaring the same layout id: the later one wins, with a warning. A
layout that fails to parse is skipped and the rest keep loading.
