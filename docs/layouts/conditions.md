# Conditions

`condition:` controls whether a slot draws. It works on
[images](/layouts/images), [texts](/layouts/texts),
[stack layers](/layouts/stacks), [effects](/layouts/effects) grids and
[components](/layouts/components).

```yaml
health_fill_low:
  image: health_fill_low
  condition: "{health_percentage} <= 0.2"
```

`conditions:` is an accepted plural alias. Writing both on one slot combines
them, and all must pass.

## Four forms

### A single expression

```yaml
condition: "{health_percentage} <= 0.2"
condition: "is_player"
condition: "{entity_name} contains Boss"
condition: "%mmocore_class% == 'Mage'"
```

### A list, where all must pass

```yaml
condition:
  - "{health_percentage} <= 0.5"
  - "{health_percentage} > 0.2"
```

### Named entries

Names are labels only. Evaluation follows YAML order.

```yaml
condition:
  in_dungeon:
    value: "%player_world%"
    operation: "=="
    compare-to: "'dungeon'"
  or_is_admin:
    value: "%luckperms_primary_group_name% == 'admin'"
    logic: or
```

### Mixed

```yaml
condition:
  - "{mob_level} >= 10"
  - value: "{entity_name}"
    operation: "!="
    compare-to: "'Dummy'"
```

## Entry keys

| Key | Required | Default | Notes |
| --- | --- | --- | --- |
| `value` | yes | — | Left side |
| `compare-to` | no | — | Right side. Omit it and `value` is evaluated as a boolean |
| `operation` | no | `==` | Needs `compare-to` |
| `logic` | no | `and` | `and` or `or`. Ignored on the first entry |

## Operators

`==` · `!=` · `>=` · `<=` · `>` · `<` · `contains`

Inline, `contains` needs spaces around it:

```yaml
condition: "{entity_name} contains Boss"
```

Operators inside `{...}` are ignored when parsing, so a `<` in a placeholder
argument does not break the expression.

## Numbers vs text

| Operator | Comparison |
| --- | --- |
| `>` `<` `>=` `<=` | Always numeric. Non-numeric sides count as 0 |
| `==` `!=` | Numeric only if both sides are numeric placeholders or literals, otherwise string |
| `contains` | Always string |

Quote string literals. Both `'...'` and `"..."` are accepted:

```yaml
condition: "{entity_type} == 'zombie'"
condition: "{buff_name} == 'wind charged'"
```

On a string-compared side, a placeholder must be written with braces. `contains`
and a string `==` or `!=` resolve only `{...}` and `%...%`; any other text is
treated as a literal. Braces remain optional on numeric sides and in the boolean
form below.

`{health_percentage}` and `{mana_percentage}` run **0.0 to 1.0**, not 0 to 100.
Half health is `0.5`.

## Booleans

An entry with no `compare-to` is parsed as a complete expression. If it contains
no operator it is evaluated as a boolean, which may be a boolean placeholder, a
`true`/`false` literal, or a boolean popup variable:

```yaml
condition: "is_player"
condition: "has_potion_effect:poison"
condition: "{dying}"
```

If it does contain an operator, that operator is applied as normal. This is why
the named-entry example above can write a full comparison inside `value:`
without a separate `compare-to`.

Anything registered as a boolean placeholder by another plugin can be used here.

## Chaining

Entries evaluate top to bottom with no precedence:

```
a OR b AND c   =>   (a OR b) AND c
```

Order the entries in the sequence they should be applied.

## Examples

Swapping a bar's colour, using three mutually exclusive slots on one layer:

```yaml
health_fill_normal:
  image: health_fill
  layer: 4
  condition: "{health_percentage} > 0.5"

health_fill_mid:
  image: health_fill_mid
  layer: 4
  condition:
    - "{health_percentage} <= 0.5"
    - "{health_percentage} > 0.2"

health_fill_low:
  image: health_fill_low
  layer: 4
  condition: "{health_percentage} <= 0.2"
```

Hiding a level badge on ordinary mobs:

```yaml
level:
  text-content: "<yellow>{mob_level}</yellow>"
  background: level_plate
  condition: "{mob_level} > 0"
```

A break overlay only during the death animation, with the live bar hidden:

```yaml
health_break:
  image: bar_break
  condition: "{dying}"
  listener:
    type: placeholder
    value: "{death_progress}"
    max: 1

health_fill_normal:
  condition: "{dying} == false"
```

`== false` inverts a boolean variable. It is reliable here because `{dying}` is
published on every mob tag, not only during the linger.

## Errors

An empty `condition:`, an entry without `value`, `operation` without
`compare-to`, or a `logic` other than `and`/`or` all fail at load. The slot is
named in the console and the rest of the pack keeps loading.
