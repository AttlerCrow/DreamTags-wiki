# Damage indicators

Floating combat numbers. One entry is a complete indicator — no layout needed.

```yaml
damage:
  triggers: [damage, mythiclib_damage]
  text: "{damage}"
  font: damage_digits
  number-format: "#"
  duration: 16
  motion:
    y: "0.9 * t"
  fade: "255 * (1 - t * t)"
```

Set `systems.damage-indicators: true` in [config.yml](/config#systems) first —
they are off by default.

## Where they live

| Location | Loaded |
| --- | --- |
| `plugins/DreamTags/damage-indicators/` | last, so it wins |
| `Packs/<pack>/damage-indicators/` | with that pack, alphabetically |

The root folder is created empty on first start.

## Triggers

| Trigger | Fires on |
| --- | --- |
| `damage` | Vanilla melee damage |
| `crit` | Vanilla criticals — Paper's own signal, so a hit never fires both |
| `damage_environment` | Damage with no attacking entity |
| `damage_<cause>` | `damage_fall`, `damage_lava`, `damage_poison`, `damage_magic`, … |
| `heal` | Healing |
| `buff` | A potion effect applied |
| `api` | Another plugin |
| `mythiclib_damage` / `mythiclib_crit_damage` | With MythicLib installed |

With [`popups.builtin-damage-triggers: auto`](/config#popups), installing
MythicLib switches off vanilla `damage` and `crit` — it fires its own for the
same hit, and you would get two numbers per swing. That is why the shipped file
lists all four ids: the ones that do not apply simply never arrive.

## Audience

| `show-to` | Who sees it |
| --- | --- |
| `scope` | **Default.** The dealer, widened by their `/dreamtags indicators` setting |
| `attacker` | Whoever dealt the damage |
| `victim` | Whoever took it |
| `attacker_or_victim` | Both |
| `nearby` | Everyone in range |
| `self` | The player it is anchored to |

Left alone, a player only sees numbers they caused. Set `show-to` explicitly for
environmental damage, where nobody dealt the hit:

```yaml
fall:
  triggers: [damage_fall, damage_lava, damage_fire]
  show-to: victim
  text: "{damage}"
```

## Text

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `text` | string | `{damage}` | MiniMessage + [placeholders](/placeholders/) |
| `color` | string | — | Wraps `text` in `<color:…>` |
| `font` | string | — | Bitmap font from `fonts/*.yml` |
| `number-format` | string | — | `DecimalFormat` pattern. `"#"` for whole numbers |
| `letter-spacing` | int | `0` | Pixels between glyphs |
| `scale` | number | `1.0` | Base size, multiplied by `sizing` |
| `x` / `y` | number | `0` | Offset |
| `layer` | int | `10` | Draw order |
| `enabled` | boolean | `true` | `false` skips the entry |

Variables: `{damage}`, `{damage_rounded}`, `{damage_cause}`, `{damage_type}`,
`{critical}`, `{damager_name}`, and for healing `{heal}` and `{heal_rounded}`.

`damage_digits` is a fixed-width cell strip, so without `letter-spacing: -2` the
numbers sit in visible gutters. It only ships `0`–`9`, so a `number-format` with
a comma would draw a missing glyph.

## Background

| Value | Result |
| --- | --- |
| `none` | Only the glyphs |
| `default` | Vanilla's translucent plate |
| `#RRGGBB` | Opaque colour |
| `#AARRGGBB` | Colour with alpha |

```yaml
background: none
text-shadow: false
see-through: false
```

The key is `text-shadow`, not `shadow`.

## Movement

| Key | Default | What it does |
| --- | --- | --- |
| `anchor` | `model-top` | Where it is born: `model-top`, `eyes`, `feet` |
| `y-offset` | `0.3` | Blocks above the anchor |
| `space` | `camera` | `world` rotates the offset into the target's facing; `camera` is relative to the screen |
| `duration` | `20` | Lifetime in ticks — the basis of `t` |
| `min-value` | `0.0` | Hide numbers below this |
| `stack-offset` | `0.25` | Separation between stacked numbers |
| `motion` | — | `x` / `y` / `z` equations |

`anchor: model-top` follows the BetterModel or ModelEngine silhouette rather
than the vanilla hitbox. `space: world` is what lets simultaneous hits scatter
instead of stacking into one column.

## Equations

`motion`, `sizing` and `fade` take expressions:

| Variable | Meaning |
| --- | --- |
| `t` | `0` → `1` across `duration` |
| `ticks` | Absolute elapsed ticks |
| `r` | Random `0`–`1`, fixed for the whole number — the scatter knob |
| `c` | How many of this style are already stacked on the target |

Plus `min`, `max`, `clamp` on top of `sin`, `cos`, `sqrt`, `pi`, `e`.

```yaml
motion:
  x: "0.45 * (r - 0.5)"     # each number drifts differently
  y: "0.9 * t"
  z: "0.45 * (r - 0.5)"
sizing: "1.5 - 0.6 * t"
fade: "255 * (1 - t * t)"
```

`sizing` can be per axis for a squash-and-stretch pop:

```yaml
sizing:
  x: "2.4 - 1.3 * t"
  y: "2.0 - 0.9 * t"
  z: "1"
```

Shorthands, if you would rather not write equations:

```yaml
sizing: {from: 1.5, to: 0.9}    # linear ramp
fade: {in: 1, out: 8}           # envelope in ticks
```

## The shipped indicators

```yaml
damage:
  triggers:
    - damage
    - mythiclib_damage
  text: "{damage}"
  # damage_digits.png is white, so the hex colour tints it.
  color: "#FFFFFF"
  font: damage_digits
  letter-spacing: -2
  number-format: "#"
  background: none
  text-shadow: false
  anchor: model-top
  y-offset: 0.3
  space: world
  duration: 16
  min-value: 0.05
  stack-offset: 0.25
  motion:
    x: "0.45 * (r - 0.5)"
    y: "0.9 * t"
    z: "0.45 * (r - 0.5)"
  sizing: "1.5 - 0.6 * t"
  fade: "255 * (1 - t * t)"

crit:
  triggers:
    - crit
    - mythiclib_crit_damage
  text: "{damage}"
  color: "#FFD800"        # same white PNG, tinted yellow
  font: damage_digits
  letter-spacing: -2
  number-format: "#"
  background: none
  anchor: model-top
  y-offset: 0.3
  space: world
  duration: 20
  min-value: 0.05
  stack-offset: 0.3
  motion:
    x: "0.6 * (r - 0.5)"
    y: "1.15 * t"
    z: "0.6 * (r - 0.5)"
  # Enters with a pop: wider than tall, then evens out.
  sizing:
    x: "2.4 - 1.3 * t"
    y: "2.0 - 0.9 * t"
    z: "1"
  fade: "255 * (1 - t * t * t)"
```

Both use the same white PNG tinted by `color`, so recolouring never needs a new
texture.

## Recipes

Environmental damage, off by default because a number on every poison tick is a
lot of noise:

```yaml
fall:
  triggers: [damage_fall, damage_lava, damage_fire]
  show-to: victim
  text: "{damage}"
  color: "#AAAAAA"
  font: damage_digits
  letter-spacing: -2
  number-format: "#"
  background: none
  space: world
  duration: 16
  min-value: 0.5
  motion:
    y: "0.7 * t"
  fade: "255 * (1 - t * t)"
```

Vanilla text with the plate kept, no bitmap font:

```yaml
magic:
  trigger: damage_magic
  text: "<light_purple>{damage}</light_purple>"
  number-format: "#"
  background: default
  text-shadow: true
  space: world
  duration: 20
  motion:
    y: "0.9 * t"
  fade: "220 * (1 - t * t)"
```

## Volume

Three knobs for damage-over-time and multi-hit AoE: `min-value` on the
indicator, and [`popups.min-interval`](/config#popups) and
[`popups.max-per-entity`](/config#popups) globally.

If a [popup](/popups) listens to the same trigger you get two numbers per hit;
DreamTags warns about that at load.
