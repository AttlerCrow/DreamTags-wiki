# Placeholders

Placeholders are the values you drop into text, conditions and listeners.

```yaml
pattern: "<red>{health}</red> / <gray>{max_health}</gray>"
condition: "{health_percentage} <= 0.2"
listener:
  type: placeholder
  value: "{mana}"
  max: "{max_mana}"
```

Three kinds of source:

- [Built-in](/placeholders/built-in) — health, mana, level, name, effects
- [From other plugins](/placeholders/hooks) — MythicMobs, MMOCore, PlaceholderAPI…
- **Popup variables** — `{damage}`, `{heal}`, `{buff_name}`, only inside the
  popup that provides them

## Syntax

| Form | Meaning |
| --- | --- |
| `{id}` | A DreamTags placeholder |
| `{id:arg}` | With an argument. Several: `{id:a:b}` |
| `%expr%` | A PlaceholderAPI expression |
| `{papi:expr}` | The same thing, written the other way |

In `condition:` and in a listener's `value:` / `max:`, the braces are optional —
`health` and `{health}` are both accepted.

::: tip A typo shows up on screen
An unrecognised placeholder is rendered **literally**. If you see `{helth}`
floating over a mob, that is your answer. Nothing is logged, because DreamTags
cannot tell a typo from a variable another plugin might provide.
:::

### Arguments are counted exactly

A placeholder that takes one argument must be given exactly one:

| Written | Result |
| --- | --- |
| `{has_potion_effect:speed}` | ✅ works |
| `{has_potion_effect}` | ❌ prints literally — no argument |
| `{health:something}` | ❌ prints literally — `health` takes none |

### Percent signs in text

`%…%` is only treated as PlaceholderAPI when the content has no spaces, no
`%`, no `{` and no `}`. So ordinary text survives untouched:

```yaml
pattern: "50% health"     # stays as written
pattern: "% off"          # stays as written
```

## Number formatting

Numeric placeholders print whole numbers as-is and everything else with one
decimal. Change that per text slot with `number-format`, a
`java.text.DecimalFormat` pattern:

```yaml
texts:
  health:
    pattern: "{health} / {max_health}"
    number-format: "#"        # 19 instead of 19.0

  percent:
    pattern: "{health_percentage}"
    number-format: "0.00"     # 0.73
```

Two things worth knowing:

- Formatting always uses a **neutral locale**, so `1.5` never becomes `1,5`.
  That matters because [conditions](/layouts/conditions) compare this output.
- An invalid pattern fails **when the pack loads**, not silently at render time.

`number-format` only affects numeric values. Strings and booleans pass through
untouched.

## Where each type can be used

| Type | Text | Conditions | Listeners |
| --- | --- | --- | --- |
| Number | ✅ | ✅ any operator | ✅ `value:` / `max:` |
| String | ✅ | ✅ `==` `!=` `contains` | ❌ |
| Boolean | ✅ prints `true`/`false` | ✅ on its own, no operator | ❌ |

A boolean used without an operator is the condition:

```yaml
condition: "is_player"
condition: "has_potion_effect:poison"
```

## A note on performance

A nametag's content belongs to the entity wearing it, so DreamTags can normally
render it once and send it to every viewer. **PlaceholderAPI expressions break
that** — `%papi%` may read the viewer, so any layout using one falls back to
rendering separately for each observer.

It still works; it just costs more with many players nearby. Prefer a
[built-in](/placeholders/built-in) when an equivalent exists:

```yaml
pattern: "{health}"              # shared render
pattern: "%player_health%"       # per viewer
```

The startup log names any tag that ended up on the slower path, and why.
