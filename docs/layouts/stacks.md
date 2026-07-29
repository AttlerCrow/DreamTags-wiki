# Layout: stacks

A stack draws several images into **one** display, overprinted at the same
position and the same depth.

```yaml
stacks:
  healthbar:
    x: -1
    y: 1
    layer: 1
    layers:
      frame:
        image: bar_frame
        background: true
      fill:
        image: health_fill
        listener: health
```

## Why stacks exist

Separate slots on different layers are separated in depth so they do not
z-fight. That gap is real distance, and at a distance it shows: two textures of
the same width project at very slightly different sizes, so a bar fill can bleed
a sub-pixel past its frame.

A stack puts every piece in a single display at a single depth. No z-fighting,
no perspective bleed, at any distance.

Use a stack when pieces must line up **exactly** — a fill inside its frame, a
gauge with an overlay. Use ordinary [image slots](/layouts/images) when the
pieces are just near each other.

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `layers` | section | — **required** | The images to overprint, in order. Empty fails to load |
| `x` | **whole** pixels | `0` | Shared horizontal offset |
| `y` | pixels (decimal ok) | `0` | Shared vertical offset |
| `scale` | number | `1.0` | Shared size multiplier |
| `layer` | int | `1` | Draw order of the whole stack |
| `align` / `anchor` | `left` · `center` · `right` | `center` | Which edge sits at `x` |
| `component` | string | — | Attach to a [component](/layouts/components) row |

## layers

Each entry under `layers:` accepts the same keys as an
[image slot](/layouts/images) — `image`, `condition`, `listener`, `background`,
`align` and so on. They are drawn in the order written, so later entries appear
on top.

A stack itself does not read `condition:`. Put it on each entry inside `layers:`.

```yaml
stacks:
  healthbar:
    x: -1
    layer: 1
    layers:
      frame:
        image: bar_frame
        y: 3
        background: true

      trail:
        image: trail_damage
        listener:
          type: trailing
          of: health
          on: decrease

      fill_normal:
        image: health_fill
        condition: "{health_percentage} > 0.5"
        listener: health

      fill_low:
        image: health_fill_low
        condition: "{health_percentage} <= 0.5"
        listener: health
```

## Centring

Every layer is centred against the widest visible one, so a 77 px fill sits
correctly inside a 79 px frame without any manual offset.
