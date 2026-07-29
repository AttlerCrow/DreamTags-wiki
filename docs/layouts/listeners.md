# Listeners

A `listener:` tells a bar what to follow. It produces a value and a maximum; the
bar shows the frame at `value / max`.

```yaml
health_bar:
  image: health_fill      # sliced with type: progress
  listener: health
```

Listeners belong on [image slots](/layouts/images) and on
[stack layers](/layouts/stacks). Text does not need one — it reads
[placeholders](/placeholders/) directly.

## Two ways to write it

**Short form** — just the type. Extra options go on the slot itself:

```yaml
mana_bar:
  image: mana_fill
  listener: placeholder
  value: "%mmocore_stamina%"
  max: "%mmocore_max_stamina%"
```

**Section form** — options live inside, under `type:`:

```yaml
mana_bar:
  image: mana_fill
  listener:
    type: placeholder
    value: "%mmocore_stamina%"
    max: "%mmocore_max_stamina%"
```

The section form is clearer once there is more than one option. A section
without `type:` fails with `listener: missing 'type'`.

## Types

### health

Current health over max health. No options.

```yaml
listener: health
```

### absorption

Absorption hearts. The maximum is the entity's **max health**, not a separate
absorption cap — so a full absorption bar is proportional to the health bar
beside it.

```yaml
listener: absorption
```

### mana

Player mana, from MMOCore or AuraSkills according to
[`resources.source`](/config#resources), or from a plugin that registered its own
provider through the API. Non-players read `0`.

```yaml
listener: mana
```

### placeholder

The general case: any numeric expression.

| Key | Default | Accepts |
| --- | --- | --- |
| `value` | `"0"` | A numeric [placeholder](/placeholders/), a literal number, a popup variable, or `%papi%` |
| `max` | `"1"` | The same |

```yaml
listener:
  type: placeholder
  value: "{mana}"
  max: "{max_mana}"
```

Braces are optional in `value` and `max` — `health` and `{health}` are both
accepted.

### trailing

Wraps **another** listener and chases it smoothly. This is the lagging damage
bar, and mirrored, the heal preview.

| Key | Required | Default | What it does |
| --- | --- | --- | --- |
| `of` | **yes** | — | The listener to follow. Cannot be `trailing` |
| `on` | no | `decrease` | Which direction to chase: `decrease`, `increase`, `both`. The other snaps instantly |
| `delay` | no | `8` | Ticks to hold still after a change before moving |
| `time` | no | `14` | Approximate ticks to close the gap |

```yaml
health_trail_damage:
  image: trail_damage
  layer: 2
  listener:
    type: trailing
    of: health
    on: decrease
```

**How `on` works.** With `on: decrease` the bar snaps up instantly when health
rises, but lags on the way down — the ghost bar left behind by a hit. With
`on: increase` it does the opposite: it drops instantly with damage and eases
upward when healing, which reads as a heal preview.

Every change re-arms `delay`, so a burst of hits holds the trail until the combo
ends and then drains once.

If `of: placeholder`, put `value:` and `max:` in the same section as the
trailing options:

```yaml
listener:
  type: trailing
  of: placeholder
  on: both
  value: "%mmocore_stellium%"
  max: "%mmocore_max_stellium%"
```

## Putting it together

The shipped health bar uses three listeners on one value to get its whole
behaviour:

```yaml
health_trail_damage:      # red ghost, lags on the way down
  image: trail_damage
  layer: 2
  listener: { type: trailing, of: health, on: decrease }

health_heal_incoming:     # green preview, tracks live health exactly
  image: heal_incoming
  layer: 3
  listener: health

health_fill_normal:       # the bar itself: instant on damage, eased on heal
  image: health_fill
  layer: 4
  condition: "{health_percentage} > 0.5"
  listener: { type: trailing, of: health, on: increase, delay: 2, time: 10 }
```

Take a hit and the red trail is briefly visible behind the bar. Get healed and
the green preview jumps ahead while the bar eases up to meet it.

## Animations ignore listeners

An image with `type: frame-sequence` plays on time. Putting a listener on it
does nothing and logs a warning — gate it with
[`condition:`](/layouts/conditions) instead.

## Unknown types

A type that does not exist fails the load with the available ones listed:
`absorption`, `health`, `mana`, `placeholder`, `trailing`. Plugins can register
more through the API.
