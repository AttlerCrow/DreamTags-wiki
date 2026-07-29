# Placeholders

Values you drop into text, conditions and listeners.

```yaml
pattern: "<red>{health}</red> / <gray>{max_health}</gray>"
condition: "{health_percentage} <= 0.2"
listener:
  type: placeholder
  value: "{mana}"
  max: "{max_mana}"
```

Three sources: [built-in](/placeholders/built-in),
[from other plugins](/placeholders/hooks), and popup variables like `{damage}`
and `{buff_name}` that only exist inside the popup providing them.

## Syntax

| Form | Meaning |
| --- | --- |
| `{id}` | A DreamTags placeholder |
| `{id:arg}` | With an argument. Several: `{id:a:b}` |
| `%expr%` | A PlaceholderAPI expression |
| `{papi:expr}` | The same thing |

In `condition:` and in a listener's `value:` / `max:`, braces are optional —
`health` and `{health}` both work.

An unrecognised placeholder is printed literally. Seeing `{helth}` over a mob is
how you find the typo; nothing is logged, because DreamTags cannot tell a typo
from a variable another plugin might provide.

### Arguments are counted exactly

| Written | Result |
| --- | --- |
| `{has_potion_effect:speed}` | works |
| `{has_potion_effect}` | prints literally — no argument |
| `{health:something}` | prints literally — takes none |

### Percent signs

`%…%` is only treated as PlaceholderAPI when the content has no spaces, no `%`,
no `{` and no `}`. So `"50% health"` and `"% off"` stay as written.

## Number formatting

Numeric placeholders print whole numbers as-is and everything else with one
decimal. Override per text slot with a `java.text.DecimalFormat` pattern:

```yaml
texts:
  health:
    pattern: "{health} / {max_health}"
    number-format: "#"        # 19 instead of 19.0

  percent:
    pattern: "{health_percentage}"
    number-format: "0.00"     # 0.73
```

Formatting always uses a neutral locale, so `1.5` never becomes `1,5` — which
matters because [conditions](/layouts/conditions) compare this output. An
invalid pattern fails when the pack loads, not at render time.

`number-format` only affects numbers. Strings and booleans pass through.

## Where each type works

| Type | Text | Conditions | Listeners |
| --- | --- | --- | --- |
| Number | yes | any operator | `value:` / `max:` |
| String | yes | `==` `!=` `contains` | no |
| Boolean | prints `true`/`false` | on its own, no operator | no |

A boolean with no operator is the condition:

```yaml
condition: "is_player"
condition: "has_potion_effect:poison"
```

## Performance

A nametag's content belongs to the entity wearing it, so DreamTags normally
renders it once and sends it to every viewer. A `%papi%` expression may read the
viewer, so a layout using one is rendered per viewer instead.

It still works, it just costs more with many players nearby. Prefer a
[built-in](/placeholders/built-in) when one exists:

```yaml
pattern: "{health}"              # shared render
pattern: "%player_health%"       # per viewer
```

The startup log names any tag on the slower path.
