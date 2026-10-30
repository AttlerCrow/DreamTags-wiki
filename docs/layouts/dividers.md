# Layout: dividers

`dividers:` draws thin marks across a bar, one every so much health, so the bar
reads as an amount and not only as a fraction.

```yaml
dividers:
  health_dividers:
    image: bar_divider     # the mark: a static image, usually 1 pixel wide
    bar: health_fill       # the bar it divides: the marks span its width
    listener: health       # where the maximum comes from
    every: 10              # a mark every 10 health
    x: -1
    y: 2
    layer: 5
```

Use the same `x`, `y` and `align` as the fill it sits on, and a `layer` above
it.

## It adapts to big mobs

A mark every 10 is right for a zombie and a stripe on a boss. When the marks
would sit closer than 6 pixels, they spread out on their own, to every 20, 50,
100, 200, 500 and so on. Set `every` once and every size of mob stays readable:

| Max health | Marks |
| --- | --- |
| 20 | one, at 10 |
| 40 | at 10, 20 and 30 |
| 1000 | every 100 |
| 5000 | every 500 |

There is never a mark on either end of the bar.

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `image` | string | — **required** | The mark, from `images/*.yml` |
| `bar` | string | — **required** | The image the marks divide; only its width is used |
| `listener` | see [Listeners](/layouts/listeners) | — **required** | Gives the maximum |
| `every` | number | `10` | Health per mark, before spreading out |
| `x` | **whole** pixels | `0` | Horizontal offset |
| `y` | pixels (decimal ok) | `0` | Vertical offset |
| `scale` | number | `1.0` | Size multiplier |
| `layer` | int | `5` | Draw order |
| `align` | `left` · `center` · `right` | `center` | Which edge sits at `x` |
| `condition` | see [Conditions](/layouts/conditions) | — | Whether it draws |
| `component` | string | — | Attach to a [component](/layouts/components) row |

The marks are redrawn only when the maximum changes, never while the bar
drains.
