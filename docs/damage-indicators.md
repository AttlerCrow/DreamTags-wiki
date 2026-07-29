# Damage indicators

Floating combat numbers. One entry is a complete indicator — no layout, no popup
definition needed.

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

::: warning Off by default
Set `systems.damage-indicators: true` in [config.yml](/config#systems) first.
Floating numbers are a strong stylistic choice, so DreamTags makes you opt in.
:::

## Where they live

| Location | Loaded |
| --- | --- |
| `plugins/DreamTags/damage-indicators/` | **last**, so it wins |
| `Packs/<pack>/damage-indicators/` | with that pack, alphabetically |

The root folder is created empty on first start and is where your own
server-wide indicators belong.

## Triggers

| Trigger | Fires on |
| --- | --- |
| `damage` | Vanilla melee damage |
| `crit` | Vanilla critical hits — Paper's own signal, so a hit never fires both |
| `damage_environment` | Damage with no attacking entity |
| `damage_<cause>` | `damage_fall`, `damage_lava`, `damage_poison`, `damage_magic`, … |
| `heal` | Healing |
| `buff` | A potion effect applied |
| `api` | Another plugin |
| `mythiclib_damage` / `mythiclib_crit_damage` | With MythicLib installed |

::: danger MythicLib swaps the triggers out
With [`popups.builtin-damage-triggers: auto`](/config#popups) (the default),
installing MythicLib **switches off** vanilla `damage` and `crit` — it fires its
own for the same hit, and you would otherwise get two numbers per swing.

This is why the shipped file lists all four ids. The same file then works
whether or not MythicLib is present: the ids that do not apply simply never
arrive.
:::

## Audience

`show-to` decides who sees a number.

| Value | Who |
| --- | --- |
| `scope` | **Default.** The dealer, widened by their own `/dreamtags indicators` setting |
| `attacker` | Whoever dealt the damage |
| `victim` | Whoever took it |
| `attacker_or_victim` | Both |
| `nearby` | Everyone in range |
| `self` | The player the popup is anchored to |

Left alone, a player only sees numbers they caused. They can widen that
themselves with `/dreamtags indicators <solo|party|global>`. Setting `show-to`
explicitly overrides that per indicator — which is what you want for
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
| `color` | string | — | Shortcut: wraps `text` in `<color:…>`. Omit if you colour inside `text` |
| `font` | string | — | Bitmap font from `fonts/*.yml`. Omit for vanilla text |
| `number-format` | string | — | `DecimalFormat` pattern. `"#"` for whole numbers |
| `letter-spacing` | int | `0` | Pixels between glyphs. Negative tightens |
| `scale` | number | `1.0` | Base size, multiplied by `sizing` |
| `x` / `y` | number | `0` | Offset |
| `layer` | int | `10` | Draw order |
| `enabled` | boolean | `true` | `false` skips the entry |

Available variables: `{damage}`, `{damage_rounded}`, `{damage_cause}`,
`{damage_type}`, `{critical}`, `{damager_name}` — and for healing,
`{heal}` and `{heal_rounded}`.

::: tip Bitmap digits need letter-spacing
`damage_digits` is a fixed-width cell strip, so without `letter-spacing: -2` the
numbers sit in visible gutters. Also note it only ships glyphs `0`–`9`: a
`number-format` with a comma (`"#,##0"`) would draw a missing character.
:::

## Background

This is what removes vanilla's black plate behind the text.

| Value | Result |
| --- | --- |
| `none` | Only the glyphs are visible |
| `default` | Vanilla's translucent plate |
| `#RRGGBB` | Opaque colour |
| `#AARRGGBB` | Colour with alpha |

```yaml
background: none
text-shadow: false
see-through: false
```

`text-shadow` (note the name — not `shadow`) and `see-through` are booleans,
both `false` by default.

## Movement

| Key | Default | What it does |
| --- | --- | --- |
| `anchor` | `model-top` | Where it is born: `model-top`, `eyes`, `feet` |
| `y-offset` | `0.3` | Blocks above the anchor |
| `space` | `camera` | `world` rotates the offset into the target's facing; `camera` is relative to the viewer's screen |
| `duration` | `20` | Lifetime in ticks — the basis of `t` |
| `min-value` | `0.0` | Hide numbers below this |
| `stack-offset` | `0.25` | Separation between stacked numbers |
| `motion` | — | `x` / `y` / `z` equations |

`anchor: model-top` follows the real BetterModel or ModelEngine silhouette, so
numbers appear above a custom model rather than above its vanilla hitbox.

`space: world` is what lets simultaneous hits scatter instead of stacking into
one unreadable column.

## Equations

`motion`, `sizing` and `fade` are expressions with these variables:

| Variable | Meaning |
| --- | --- |
| `t` | `0` → `1` across `duration` |
| `ticks` | Absolute elapsed ticks |
| `r` | Random `0`–`1`, **fixed for the whole number** — the scatter knob |
| `c` | How many of this style are already stacked on the target |

Plus `min`, `max`, `clamp` on top of the usual `sin`, `cos`, `sqrt`, `pi`, `e`.

```yaml
motion:
  x: "0.45 * (r - 0.5)"     # each number drifts a different way
  y: "0.9 * t"              # rises over its lifetime
  z: "0.45 * (r - 0.5)"
sizing: "1.5 - 0.6 * t"     # starts big, settles
fade: "255 * (1 - t * t)"   # fades out, slowly at first
```

`sizing` can also be per axis, for a squash-and-stretch pop:

```yaml
sizing:
  x: "2.4 - 1.3 * t"
  y: "2.0 - 0.9 * t"
  z: "1"
```

If you would rather not write equations, both accept shorthands:

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
  # damage_digits.png is white, so the hex colour tints it: Minecraft
  # multiplies the glyph by the text colour.
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
  # The crit enters with a "pop": wider than tall, then it evens out.
  sizing:
    x: "2.4 - 1.3 * t"
    y: "2.0 - 0.9 * t"
    z: "1"
  fade: "255 * (1 - t * t * t)"
```

Both use the same white PNG, tinted by `color`. Recolouring a number never needs
a new texture.

## Recipes

**Environmental damage**, off by default because a number on every poison tick
is a lot of noise:

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

**Vanilla text, keeping the plate** — no bitmap font at all:

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

## Taming the volume

Damage-over-time and multi-hit AoE can flood the screen. Three knobs:

- `min-value` on the indicator — hide small ticks entirely.
- [`popups.min-interval`](/config#popups) — minimum ticks between two numbers of
  the same style on the same entity for the same viewer.
- [`popups.max-per-entity`](/config#popups) — a ceiling per entity.

## Overlap with popups

If a [popup](/popups) listens to the same trigger as an indicator, you get two
numbers per hit. DreamTags warns about this at load.
