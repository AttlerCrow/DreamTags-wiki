# Layout: texts

`texts:` draws a line of text — a name, a level, a number. It can carry a
stretchable plate behind it, a bitmap font, and a rank icon.

```yaml
texts:
  name:
    text-content: "<white>{entity_name}</white>"
    font: pixel
    background: name_plate
    layer: 10
    y: 12
```

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `text-content` | string | — **required** | The text. MiniMessage + `{placeholders}` + `%papi%` |
| `font` | string | — | Bitmap font id from `fonts/*.yml`. Omit for vanilla text |
| `background` | string | — | Plate id from `backgrounds/*.yml` |
| `x` | **whole** pixels | `0` | Horizontal offset of the whole slot (plate included) |
| `y` | pixels (decimal ok) | `0` | Vertical offset of the whole slot |
| `text-x` | number | `0` | Nudges **only the text**, leaving the plate put |
| `text-y` | number | `0` | Same, vertically |
| `scale` | number | `1.0` | Size multiplier |
| `layer` | int | `10` | Draw order. The plate goes on `layer - 1` |
| `align` / `anchor` | `left` · `center` · `right` | `center` | Which edge sits at `x` |
| `letter-spacing` | int | `0` | Pixels between glyphs. Negative tightens |
| `number-format` | string | — | `DecimalFormat` pattern for numeric placeholders |
| `condition` | see [Conditions](/layouts/conditions) | — | Whether it draws |
| `component` | string | — | Attach to a [component](/layouts/components) row |
| `rank-decoration` | section | — | Rank icon beside the plate (see below) |

## text-content

Accepts [MiniMessage](https://docs.advntr.dev/minimessage/format) for colour and
styling, plus [placeholders](/placeholders/):

```yaml
text-content: "<white>{entity_name}</white>"
text-content: "<red>{health}</red>/<gray>{max_health}</gray>"
text-content: "<gold>{mob_id}</gold> <yellow>Lv.{mob_level}</yellow>"
```

A misspelled placeholder is printed **literally** — seeing `{helth}` floating
over a mob is how you find the typo.

### number-format

Numeric placeholders otherwise show whole numbers as-is and everything else with
one decimal. Override per text slot:

```yaml
health_text:
  text-content: "{health} / {max_health}"
  number-format: "#"        # 19 instead of 19.0

percent:
  text-content: "{health_percentage}"
  number-format: "0.00"     # 0.73
```

Formatting always uses a neutral locale, so `1.5` never becomes `1,5`. That
matters because [conditions](/layouts/conditions) compare against this output.

An invalid `number-format` pattern fails when the pack loads, not at render time.

## Fonts

`fonts/*.yml` maps a PNG grid of glyphs to characters:

```yaml
pixel:
  file: pixel.png
  height: 8
  ascent: 6
  rows:
    - " !\"#$%&'()"
    - "*+,-./0123"
    - "456789:;<="
    # ...
```

`rows` lists the characters in reading order across the texture grid. `height`
and `ascent` control how the glyphs sit on the baseline.

Glyphs in a bitmap font sit in fixed-width cells, so without `letter-spacing`
they float apart with visible gutters. The shipped damage numbers use
`letter-spacing: -2`.

```yaml
damage_text:
  text-content: "{damage}"
  font: damage_digits
  letter-spacing: -2
  number-format: "#"
```

## Backgrounds (plates)

A plate is a stretchable panel drawn behind variable-width text. It resizes to
the text on every render, so a long name and a short one both look right.

Defined in `backgrounds/*.yml`:

```yaml
name_plate:
  left: name_plate/left.png
  body: name_plate/body.png
  right: name_plate/right.png
  padding: 3
```

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `body` | path | — **required** | Tiled to fill the middle |
| `left` / `right` | path | — | Optional end caps |
| `folder` | name | — | Legacy shorthand for `<name>/{left,body,right}.png` |
| `padding` | px | `2` | Air between the caps and the text |
| `x` | px | `0` | Horizontal offset of the plate only |
| `y` | px | `0` | Vertical fine-tune. Positive is up |
| `align` | `left` · `center` · `right` | `center` | Which plate edge is fixed at `x` |
| `min-width` | px | `0` | Inner width the plate never shrinks below |
| `text-align` | `left` · `center` · `right` | `center` | Where the text sits when the plate is wider than it |

Attach one with `background:`:

```yaml
texts:
  name:
    text-content: "<white>{entity_name}</white>"
    background: name_plate
```

Paths are looked up in the pack's `assets/` first, then the shared one — so two
backgrounds can point at the same PNGs with different metrics. That is exactly
what `level_plate` does in the default pack:

```yaml
# Same textures as name_plate, different metrics — which is why the pieces
# are named by path instead of by folder.
level_plate:
  left: name_plate/left.png
  body: name_plate/body.png
  right: name_plate/right.png
  padding: 0
  min-width: 1
```

### text-x / text-y

`x` and `y` move the text and its plate together. To nudge the text *within* the
plate, use `text-x` and `text-y`:

```yaml
level:
  text-content: "<yellow>{mob_level}</yellow>"
  background: level_plate
  x: -46          # moves plate + text
  text-y: 1       # moves only the text, 1 px up inside the plate
```

## rank-decoration

Pins an icon to the left of the plate, chosen by the player's LuckPerms group.

`rank-decoration` is only built when the text slot also has `background:`.
Without a plate it is ignored silently. It also needs LuckPerms.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `icons` | section | — **required** | Map of `group: image-id`. Group names are matched case-insensitively |
| `x` | **whole** px | `0` | Added to the text's `x` |
| `y` | number | `0` | Added to the text's `y` |
| `gap` | number, min 0 | `1.0` | Air between the icon and the plate's left edge |
| `scale` | number | `1.0` | Multiplied by the text's `scale` |
| `layer` | int | text `layer` + 2 | Draw order |

```yaml
texts:
  name:
    text-content: "<white>{entity_name}</white>"
    font: pixel
    background: name_plate
    layer: 10
    rank-decoration:
      gap: 2
      icons:
        admin: rank_admin_icon
        vip: rank_vip_icon
        default: rank_default_icon
```

The icon repositions itself every render as the plate grows and shrinks with the
name, so it never overlaps.
