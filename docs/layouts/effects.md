# Layout: effects

`effects:` draws the target's active potion effects as a grid of icons that
appears and disappears on its own.

```yaml
effects:
  active_buffs:
    type: active-potion-effects
    background-image: effect_plate_bg
    icon-prefix: effect_
    columns: 9
    max-rows: 6
```

Unlike every other section, you do not list the icons. You declare a grid and a
naming convention, and DreamTags fills as many slots as the entity has effects.

## How icons are matched

`icon-prefix` maps an effect to an image id: with the default `effect_`, an
entity under Speed looks for an image called `effect_speed`.

The `default` pack ships all 41 vanilla icons already named that way
(`effect_speed`, `effect_poison`, `effect_wither`, …), so the default
`icon-prefix` just works. To restyle them, declare the same ids in a pack that
[sorts later](/packs/#load-order-and-overriding).

An effect with no matching image is skipped — the grid closes up around it.

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `type` | string | `active-potion-effects` | The only valid value |
| `background-image` | string | — **required** | Image id for each slot's backing plate |
| `icon-prefix` | string | `effect_` | Prefix for icon image ids. No image matches it → load error |
| `x` | **whole** px | `0` | Position of the first slot |
| `y` | number | `0` | Position of the first slot |
| `icon-x` | **whole** px | `0` | Offset of the icon inside its slot |
| `icon-y` | number | `0` | Offset of the icon inside its slot |
| `spacing-x` | **whole** px | `5` | Horizontal gap between slots |
| `spacing-y` | number | `5` | Vertical gap between rows. Rows go **upward** |
| `scale` | number | `1.0` | Icon scale |
| `background-scale` | number | `1.0` | Extra multiplier for the plate (plate = `scale × background-scale`) |
| `layer` | int | `0` | Plate layer. Icons draw on `layer + 1` |
| `columns` | int, min 1 | `9` | Slots per row |
| `max-rows` | int, min 1 | `2` | Maximum rows |
| `max-slots` | int, min 1 | `columns × max-rows` | Total slots |
| `fade-start` | ticks, min 1 | `40` | Remaining duration at which an icon starts fading |
| `fade-min-opacity` | 0–255 | `56` | Opacity floor of that fade |
| `tag-lift-per-row` | number ≥ 0 | `0` | Pixels the **whole tag** rises per occupied row |
| `align` / `anchor` | `left` · `center` · `right` | `center` | Anchoring |
| `condition` | see [Conditions](/layouts/conditions) | — | Whether the grid draws at all |

Unlike images, stacks and texts, an effects grid cannot be placed in a
[component](/layouts/components) row. Position it with `x` and `y`.

## The expiry fade

`fade-start` and `fade-min-opacity` make an icon dim as it runs out, so players
can see a buff is about to expire without reading a number.

With the defaults, an icon is solid until 2 seconds remain, then fades toward
22% opacity. Infinite effects never fade.

## tag-lift-per-row

Rows stack **upward** from the first slot, which would push them into the name
above. `tag-lift-per-row` raises the entire tag to make room:

```yaml
tag-lift-per-row: 10    # the tag rises 10 px for each extra row of buffs
```

With `0` the rows simply grow up into whatever is above them.

## The shipped example

From `default_layout`:

```yaml
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
```

A 9-wide grid up to 6 rows: 54 slots, enough for any realistic number of
effects. Icons at half size on plates at double that, starting 41 px to the left
so the row is centred.

## Cost

Slots are only drawn for effects that actually exist, so a large `max-rows`
costs nothing when players have two buffs. Size the grid for your worst case
without worrying about the common one.
