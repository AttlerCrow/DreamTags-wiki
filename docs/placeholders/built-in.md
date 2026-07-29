# Built-in placeholders

Always available, no other plugin required. They read the entity the tag is on —
its target — which is what lets DreamTags
[render a tag once for every viewer](/placeholders/#a-note-on-performance).

## Numbers

Usable in text, in any [condition](/layouts/conditions) operator, and as a
listener's `value:` or `max:`.

| Placeholder | Returns |
| --- | --- |
| `{health}` | Current health |
| `{max_health}` | Max health attribute. Falls back to current health if absent |
| `{health_percentage}` | `health / max_health`, **0.0 – 1.0** |
| `{absorption}` | Absorption hearts |
| `{mana}` | Current mana |
| `{max_mana}` | Maximum mana |
| `{mana_percentage}` | `mana / max_mana`, **0.0 – 1.0** |
| `{mob_level}` | Mob level from the provider. `0` if not a provider mob |
| `{player_level}` | RPG level — MMOCore's class level if installed, otherwise vanilla. `0` for non-players |
| `{xp_level}` | Vanilla XP level, always. Ignores RPG hooks |
| `{xp_progress}` | Vanilla XP bar progress, 0.0 – 1.0 |

::: danger Percentages are 0 to 1
`{health_percentage}` at half health is `0.5`, not `50`. Writing
`"{health_percentage} <= 50"` is always true, and it is the single most common
mistake in a first layout.
:::

Mana comes from MMOCore or AuraSkills according to
[`resources.source`](/config#resources), or from a plugin that registered its own
provider. Without any of them it reads `0` — which is useful, because a mana bar
gated on `"{max_mana} > 0"` then hides itself automatically.

```yaml
texts:
  health:
    pattern: "<red>{health}</red>/<gray>{max_health}</gray>"
    number-format: "#"

images:
  mana_bar:
    image: mana_fill
    condition: "{max_mana} > 0"
    listener:
      type: placeholder
      value: "{mana}"
      max: "{max_mana}"
```

## Strings

| Placeholder | Returns |
| --- | --- |
| `{entity_name}` | The entity's name. A player's username, or a mob's custom name |
| `{entity_type}` | Type in lowercase: `zombie`, `player`, `wither_skeleton` |
| `{mob_id}` | Provider mob id. `<none>` when there is no provider mob |

```yaml
pattern: "<white>{entity_name}</white>"
condition: "{entity_type} == 'player'"
condition: "{entity_name} contains Boss"
```

## Booleans

Used on their own in a condition, with no operator:

| Placeholder | Args | True when |
| --- | --- | --- |
| `{is_player}` | — | The target is a player |
| `{is_mythic_mob}` | — | The mob comes from MythicMobs |
| `{has_potion_effect:TYPE}` | **1** | The target has that potion effect |

`has_potion_effect` takes the vanilla effect name, case-insensitive. An unknown
name returns `false` rather than failing:

```yaml
condition: "has_potion_effect:poison"
condition: "has_potion_effect:fire_resistance"
```

::: warning The argument is mandatory
`{has_potion_effect}` with no argument does not resolve and prints literally.
:::

In text a boolean prints as `true` or `false`.

## Popup variables

Only available inside the [popup](/popups) or
[damage indicator](/damage-indicators) that provides them.

| Context | Variables |
| --- | --- |
| Damage | `{damage}` `{damage_rounded}` `{damage_cause}` `{damage_type}` `{critical}` `{damager_name}` |
| Healing | `{heal}` `{heal_rounded}` `{heal_reason}` |
| Buff | `{buff_name}` `{buff_level}` `{buff_duration}` |

`{buff_name}` is lowercase with spaces: `wind charged`, `hero of the village`.

## Death animation variables

Published by a tag with [`death.linger`](/tags#death-linger) while the animation
plays:

| Variable | Value |
| --- | --- |
| `{dying}` | `true` for the whole linger |
| `{death_progress}` | `0` → `1` across it |

```yaml
health_break:
  image: bar_break
  condition: "{dying}"
  listener:
    type: placeholder
    value: "{death_progress}"
    max: 1
```

## What DreamTags exposes to other plugins

Two placeholders, readable from any plugin that supports PlaceholderAPI —
scoreboards, TAB, chat formatters:

| Placeholder | Returns |
| --- | --- |
| `%dreamtags_scope%` | The player's nametag scope: `global`, `party`, `solo`, `none` |
| `%dreamtags_hidden%` | `true` / `false` — whether they have nametags hidden |

```yaml
# In a scoreboard plugin
- "Nametags: %dreamtags_hidden%"
- "Visible to: %dreamtags_scope%"
```

The expansion survives `/papi reload`.
