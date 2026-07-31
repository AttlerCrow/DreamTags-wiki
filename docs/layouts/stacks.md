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

Separate slots on different layers are offset in depth to avoid z-fighting. That
offset is real distance, so two textures of the same width project at very
slightly different sizes and a bar fill can bleed a sub-pixel past its frame at
range.

A stack puts every piece in a single display at a single depth, which removes
both the z-fighting and the perspective difference.

Use a stack when pieces must line up **exactly**, such as a fill inside its
frame or a gauge with an overlay. Ordinary [image slots](/layouts/images) are
sufficient when the pieces only need to be near each other.

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
[image slot](/layouts/images): `image`, `condition`, `listener`, `align` and so
on. They are drawn in the order written, so later entries appear on top.

`background:` is accepted on a layer but has no effect inside a stack. It does
not set the stack's reference width, which is always taken from the widest
declared layer.

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

Every layer is centred against the widest layer **declared** in the stack, so a
77 px fill is positioned inside a 79 px frame with no manual offset.

The reference width is fixed when the pack loads and counts every declared
layer, including layers currently hidden by `condition:`. Hiding the widest
layer therefore does not re-centre the remaining ones.
