# Built-in placeholders

These placeholders are always registered and always resolve. They read the
entity the tag is on. Where a value comes from an optional plugin, the
placeholder still resolves without it and returns the fallback listed below.

## Numbers

Usable in text, in any [condition](/layouts/conditions) operator, and as a
listener's `value:` or `max:`.

| Placeholder | Returns |
| --- | --- |
| `{health}` | Current health |
| `{max_health}` | Max health attribute, or current health if absent |
| `{health_percentage}` | `health / max_health`, **0.0 – 1.0** |
| `{absorption}` | Absorption hearts |
| `{mana}` | Current mana |
| `{max_mana}` | Maximum mana |
| `{mana_percentage}` | `mana / max_mana`, **0.0 – 1.0** |
| `{mob_level}` | Mob level from the provider. `0` if not a provider mob |
| `{player_level}` | RPG level — MMOCore's class level if installed, else vanilla. `0` for non-players |
| `{xp_level}` | Vanilla XP level, always |
| `{xp_progress}` | Vanilla XP bar progress, 0.0 – 1.0 |

Percentages run **0 to 1**, not 0 to 100. Half health is `0.5`, so
`"{health_percentage} <= 50"` is always true.

Mana comes from MMOCore or AuraSkills per [`resources.source`](/config#resources),
or from a plugin that registered its own provider. Without any of them it reads
`0`, so a mana bar gated on `"{max_mana} > 0"` is hidden.

`{mob_level}` returns `0` and `{mob_id}` returns `<none>` when no mob provider
supplies a value, for example with MythicMobs absent.

```yaml
texts:
  health:
    text-content: "<red>{health}</red>/<gray>{max_health}</gray>"
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
| `{entity_name}` | Player username, or a mob's custom name |
| `{entity_type}` | Lowercase type: `zombie`, `player`, `wither_skeleton` |
| `{mob_id}` | Provider mob id. `<none>` when there is none |

```yaml
text-content: "<white>{entity_name}</white>"
condition: "{entity_type} == 'player'"
condition: "{entity_name} contains Boss"
```

## Booleans

Used in a condition with no operator.

| Placeholder | Args | True when |
| --- | --- | --- |
| `{is_player}` | — | The target is a player |
| `{is_mythic_mob}` | — | The mob comes from MythicMobs |
| `{has_potion_effect:TYPE}` | 1 | The target has that effect |

The effect name is case-insensitive, and an unknown one returns `false` rather
than failing. The argument is mandatory: `{has_potion_effect}` without one is
printed literally.

```yaml
condition: "has_potion_effect:poison"
condition: "has_potion_effect:fire_resistance"
```

## Popup variables

Available only inside the [popup](/popups) or
[damage indicator](/damage-indicators) providing them.

| Context | Variables |
| --- | --- |
| Damage | `{damage}` `{damage_rounded}` `{damage_cause}` `{damage_type}` `{critical}` `{damager_name}` |
| Healing | `{heal}` `{heal_rounded}` `{heal_reason}` |
| Buff | `{buff_name}` `{buff_level}` `{buff_duration}` |

`{buff_name}` is lowercase with spaces: `wind charged`, `hero of the village`.

## Death animation

Always published on a mob tag, and meaningful during
[`death.linger`](/tags#death-linger):

| Variable | Value |
| --- | --- |
| `{dying}` | `true` for the whole linger, `false` otherwise |
| `{death_progress}` | `0` → `1` across it, `0` otherwise |

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

Readable from any plugin that supports PlaceholderAPI, such as scoreboards, TAB
and chat plugins.

| Placeholder | Returns |
| --- | --- |
| `%dreamtags_scope%` | The player's nametag scope: `global`, `party`, `solo`, `none` |
| `%dreamtags_hidden%` | Whether they have nametags hidden |

```yaml
- "Nametags: %dreamtags_hidden%"
- "Visible to: %dreamtags_scope%"
```

The expansion survives `/papi reload`.
