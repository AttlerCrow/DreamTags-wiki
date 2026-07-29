# Layout: images

`images:` places an [image](/images) in the layout. Each key is a slot name —
yours to choose, it only has to be unique within the layout.

```yaml
images:
  health_frame:
    image: bar_frame
    y: 1
    layer: 1
    background: true
```

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `image` | string | — **required** | Image id from `images/*.yml`. Unknown id fails the layout |
| `x` | **whole** pixels | `0` | Horizontal offset. A decimal is rejected |
| `y` | pixels (decimal ok) | `0` | Vertical offset. Positive is up |
| `scale` | number | `1.0` | Size multiplier |
| `layer` | int | `0` | Draw order. Higher is in front |
| `background` | boolean | `layer == 0` | Marks this as the backdrop: it sets the reference width and is never merged |
| `merge` | boolean | `!background` | Whether this may share a display with coplanar neighbours |
| `align` / `anchor` | `left` · `center` · `right` | `center` | Which edge of the image sits at `x` |
| `condition` | see [Conditions](/layouts/conditions) | — | Whether it draws |
| `listener` | see [Listeners](/layouts/listeners) | — | What fills it, for `progress` and `frame-defined` images |
| `component` | string | — | Attach to a [component](/layouts/components) row |

## background and reference width

One slot per layout should be the backdrop, marked `background: true`. It
defines the **reference width** everything else aligns against — the frame of a
health bar, typically.

`background` defaults to `true` for `layer: 0`, so a single-image layout works
without saying anything. Once you use layers, mark it explicitly:

```yaml
health_frame:
  image: bar_frame
  layer: 1
  background: true    # needed, because layer != 0
```

## Filling a bar

An image sliced with `type: progress` needs a `listener:` to know how full it is:

```yaml
health_bar:
  image: health_fill
  layer: 4
  listener: health
```

Anything measurable works — see [Listeners](/layouts/listeners) for `health`,
`absorption`, `mana`, arbitrary `placeholder` values, and the `trailing` wrapper
that produces lagging damage bars.

## Showing an image conditionally

```yaml
poison_icon:
  image: skull_icon
  layer: 5
  condition: "has_potion_effect:poison"
```

The classic use is swapping a bar's colour: several slots on the same layer with
conditions that cannot both be true. See the
[example in the layouts overview](/layouts/#a-complete-example).

## merge, and when to reach for a stack

Images that overlap perfectly and share `x`, `y`, `scale` and `component` can be
collapsed into a single display, which removes the tiny perspective gap between
layers. That is what `merge` allows.

If you are deliberately overprinting pieces that must line up to the pixel — a
fill inside its frame — prefer an explicit [stack](/layouts/stacks). It is
clearer to read and guarantees one shared depth.

## Alignment

`align` decides which edge of the image sits at `x`:

```yaml
mana_bar:
  image: mana_fill
  align: left     # the left edge is pinned at x
  x: -40
```

With `center` (the default) the image is centred on `x`, which is what you want
for a bar sitting under a name.
