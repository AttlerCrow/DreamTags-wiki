# Conditions

`condition:` decides whether a slot draws. It works on
[images](/layouts/images), [texts](/layouts/texts),
[stack layers](/layouts/stacks), [effects](/layouts/effects) grids and
[components](/layouts/components).

```yaml
health_fill_low:
  image: health_fill_low
  condition: "{health_percentage} <= 0.2"
```

::: tip `condition` and `conditions` are the same key
`conditions:` is an accepted plural alias. If you write **both** on one slot,
they are combined and **all** must pass.
:::

## Four ways to write it

### 1. A single expression

```yaml
condition: "{health_percentage} <= 0.2"
condition: "is_player"
condition: "{entity_name} contains Boss"
condition: "%mmocore_class% == 'Mage'"
```

### 2. A list — all must pass

```yaml
condition:
  - "{health_percentage} <= 0.5"
  - "{health_percentage} > 0.2"
```

This is the usual way to express a range.

### 3. Named entries

Names are labels for your own benefit; evaluation follows YAML order.

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

### 4. Mixed

```yaml
condition:
  - "{mob_level} >= 10"
  - value: "{entity_name}"
    operation: "!="
    compare-to: "'Dummy'"
```

## Structured entry keys

| Key | Required | Default | Notes |
| --- | --- | --- | --- |
| `value` | **yes** | — | The left side |
| `compare-to` | no | — | The right side. Omit it and `value` is evaluated as a boolean |
| `operation` | no | `==` | Needs `compare-to`. Using it without one is an error |
| `logic` | no | `and` | `and` or `or`. Ignored on the first entry |

## Operators

`==` · `!=` · `>=` · `<=` · `>` · `<` · `contains`

In an inline expression `contains` must be written **with spaces around it**:

```yaml
condition: "{entity_name} contains Boss"
```

Operators inside `{...}` are ignored when parsing, so a `<` in a placeholder
argument will not break the expression.

## Numbers vs text

| Operator | Comparison |
| --- | --- |
| `>` `<` `>=` `<=` | **Always numeric.** Non-numeric sides count as 0 |
| `==` `!=` | Numeric **only if both sides** are numeric placeholders or literals. Otherwise string |
| `contains` | Always string |

Quote string literals so the intent is unambiguous:

```yaml
condition: "{entity_type} == 'zombie'"
condition: "{buff_name} == 'wind charged'"
```

::: warning Percentages run 0 to 1
`{health_percentage}` and `{mana_percentage}` are **0.0–1.0**, not 0–100.
Half health is `0.5`. Writing `{health_percentage} <= 50` is always true and is
the most common mistake in a first layout.
:::

## Boolean conditions

Leave out the operator and the whole expression is evaluated as a boolean —
a boolean placeholder, a `true`/`false` literal, or a boolean popup variable:

```yaml
condition: "is_player"
condition: "has_potion_effect:poison"
condition: "{dying}"
```

This is also how other plugins extend conditions: anything they register as a
boolean placeholder can be used here.

## Chaining

Entries evaluate **top to bottom with no precedence**:

```
a OR b AND c   =>   (a OR b) AND c
```

Not the usual maths precedence, so order the entries to read the way you want
them applied.

## Real examples

Swapping a bar's colour by health — three slots on the same layer, mutually
exclusive:

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
  pattern: "<yellow>{mob_level}</yellow>"
  background: level_plate
  condition: "{mob_level} > 0"
```

Showing a break overlay only during the death animation:

```yaml
health_break:
  image: bar_break
  condition: "{dying}"
  listener:
    type: placeholder
    value: "{death_progress}"
    max: 1
```

And hiding the live bar while that plays:

```yaml
health_fill_normal:
  condition: "{dying} == false"
```

## Errors

- An empty `condition:` fails with `condition: no entries`.
- An entry without `value` fails with a message naming the missing key.
- `operation` without `compare-to` fails.
- `logic` other than `and`/`or` fails.

All of these are load-time errors: the slot is reported in the console and the
rest of the pack keeps loading.
