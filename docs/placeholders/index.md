# Placeholders

Values you drop into text, conditions and listeners.

```yaml
text-content: "<red>{health}</red> / <gray>{max_health}</gray>"
condition: "{health_percentage} <= 0.2"
listener:
  type: placeholder
  value: "{mana}"
  max: "{max_mana}"
```

There are three sources: [built-in](/placeholders/built-in),
[from other plugins](/placeholders/hooks), and popup variables such as
`{damage}` and `{buff_name}`, which exist only inside the popup providing them.

## Syntax

| Form | Meaning |
| --- | --- |
| `{id}` | A DreamTags placeholder |
| `{id:arg}` | With an argument. Several: `{id:a:b}` |
| `%expr%` | A PlaceholderAPI expression |
| `{papi:expr}` | The same thing |

Braces are optional in a listener's `value:` / `max:`, in a numeric comparison
and in the operator-less boolean form of `condition:`, so `health` and
`{health}` both work.

Braces are **required** on a string-compared side. `contains` and a string `==`
or `!=` resolve only `{...}` and `%...%`; any other text on that side is treated
as a literal string.

An unrecognised placeholder is printed literally, so `{helth}` appears verbatim
over the mob. Nothing is logged, because DreamTags cannot distinguish a typo
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
    text-content: "{health} / {max_health}"
    number-format: "#"        # 19 instead of 19.0

  percent:
    text-content: "{health_percentage}"
    number-format: "0.00"     # 0.73
```

Formatting always uses a neutral locale, so `1.5` never becomes `1,5`.
[Conditions](/layouts/conditions) compare this output. An invalid pattern fails
when the pack loads rather than at render time.

`number-format` only affects numbers. Strings and booleans pass through.

## Where each type works

| Type | Text | Conditions | Listeners |
| --- | --- | --- | --- |
| Number | yes | any operator | `value:` / `max:` |
| String | yes | `==` `!=` `contains` | no |
| Boolean | prints `true`/`false` | on its own, no operator | no |

A boolean with no operator forms the condition on its own:

```yaml
condition: "is_player"
condition: "has_potion_effect:poison"
```

## Performance

A nametag's content belongs to the entity wearing it, so DreamTags normally
renders it once and sends it to every viewer. A `%papi%` expression may read the
viewer, so a layout using one is rendered per viewer instead.

The result is correct either way, but the per-viewer path costs more with many
players nearby. Use a [built-in](/placeholders/built-in) where one exists:

```yaml
text-content: "{health}"              # shared render
text-content: "%player_health%"       # per viewer
```

The startup log names any tag on the slower path.
