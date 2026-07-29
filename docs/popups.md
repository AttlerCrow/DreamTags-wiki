# Popups

A popup is a one-shot floating element: it spawns on a trigger, plays a short
animation and disappears. `Packs/<pack>/popups/*.yml`.

```yaml
heal_popup:
  trigger: heal
  show-to: nearby
  duration: 16
  motion:
    y: "0.7 * t"
  layouts: [heal_popup_layout]
```

## Popups vs damage indicators

They share the same engine. The difference is what they draw:

| | Popup | [Damage indicator](/damage-indicators) |
| --- | --- | --- |
| Content | A full [layout](/layouts/) — images, text, plates | A single line of text |
| Needs a layout | **Yes** | No, it is generated |
| Lives in | `popups/` | `damage-indicators/` |

If all you want is a number, use a damage indicator — it is far less to write.
Reach for a popup when it needs an icon, a plate, or several pieces.

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `trigger` / `triggers` | string or list | `[api]` | What spawns it. Both keys accumulate |
| `layouts` | list | — **required** | What to draw |
| `show-to` | enum | `nearby` | Audience, below |
| `duration` | ticks, min 1 | `20` | Lifetime — the basis of `t` |
| `min-value` | number | `0.0` | Minimum value to show at all |
| `anchor` | `model-top` · `eyes` · `feet` | `model-top` | Where it is born |
| `y-offset` | blocks | `0.3` | Height above the anchor |
| `space` | `camera` · `world` | `camera` | Movement space |
| `stack-offset` | number | `0.25` | Separation between stacked popups |
| `stack-mode` | `column` · `grid` | `column` | How simultaneous popups arrange |
| `motion` | `x` / `y` / `z` equations | `0` | Trajectory |
| `sizing` | equation, number or `{from,to}` | `1` | Scale over time |
| `fade` | equation or `{in,out}` | `255` | Opacity over time |
| `background` | `none` · `default` · hex | `none` | Plate behind the text |
| `text-shadow` | boolean | `false` | Drop shadow |
| `see-through` | boolean | `false` | Visible through blocks |

`show-to`, the equation variables (`t`, `ticks`, `r`, `c`) and the `sizing` /
`fade` shorthands work exactly as described in
[damage indicators](/damage-indicators#equations).

## Audience

| Value | Who sees it |
| --- | --- |
| `nearby` | Everyone in range — the default for popups |
| `attacker` | Whoever dealt the hit |
| `victim` | Whoever took it |
| `attacker_or_victim` | Both |
| `self` | The player it is anchored to |
| `scope` | The dealer, widened by their own `/dreamtags indicators` setting |

## Variables

What a popup can show depends on what triggered it:

| Trigger | Variables |
| --- | --- |
| damage | `{damage}` `{damage_rounded}` `{damage_cause}` `{damage_type}` `{critical}` `{damager_name}` |
| heal | `{heal}` `{heal_rounded}` `{heal_reason}` |
| buff | `{buff_name}` `{buff_level}` `{buff_duration}` |

`{buff_name}` is lowercase with spaces, not underscores — `wind charged`, not
`WIND_CHARGED`.

## The shipped example

```yaml
heal_popup:
  trigger: heal
  show-to: nearby
  duration: 16
  anchor: model-top
  y-offset: 0.3
  space: world
  stack-offset: 0.25
  min-value: 0.5
  motion:
    y: "0.7 * t"
  sizing: "1.1 - 0.3 * t"
  fade: "255 * (1 - t * t)"
  layouts:
    - heal_popup_layout
```

With a layout that is a single line:

```yaml
heal_popup_layout:
  texts:
    amount:
      text-content: "<green>+{heal_rounded}</green>"
      layer: 10
```

`min-value: 0.5` suppresses the constant trickle from natural regeneration.

## Limits

Three global ceilings in [config.yml](/config#popups) protect the server:

| Setting | Default | Effect |
| --- | --- | --- |
| `popups.max-active` | `512` | Server-wide cap. Spawns past it are dropped silently |
| `popups.max-per-entity` | `8` | Per style, per entity, per viewer |
| `popups.min-interval` | `0` | Minimum ticks between two of the same style on the same entity for one viewer |

`min-interval` is the one to reach for when damage-over-time or multi-hit AoE
floods the screen.

## Avoid doubling up

Buff icons are already drawn persistently by an
[`effects:` grid](/layouts/effects). Adding a buff popup on top makes every new
effect appear twice — once as a popup, once in the row. The shipped
`default_popups.yml` has the buff popups commented out for that reason.

The same applies between popups and [damage indicators](/damage-indicators) that
listen to the same trigger. DreamTags warns at load when it spots the overlap.
