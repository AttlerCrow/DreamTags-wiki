# Layout: components

A component is a named horizontal row with a height. Slots attached to it move
together, and when a component is hidden it collapses to zero height and
everything below **moves up**.

Without components, everything is positioned with absolute `y` values, so hiding
one bar leaves a gap.

```yaml
components:
  health:
    height: 10
    vertical-gap: 1
  energy:
    place-below: health
    height: 7
    vertical-gap: 1
    condition: "{soulmates_max_energy} > 0"
```

## Keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `height` | number ≥ 0 | `0` | Pixels the row occupies when visible |
| `vertical-gap` | number ≥ 0 | `0` | Air after the row |
| `gap` | number | — | Legacy alias for `vertical-gap` |
| `place-below` | string | — | Id of the component this one sits under |
| `below` | list | `[]` | Legacy form: sums the heights of everything listed |
| `condition` | see [Conditions](/layouts/conditions) | — | When false the row takes **0 px** and the rest close up |

`place-below` cannot be blank and cannot be combined with `below`. Unknown ids
and circular chains are rejected when the pack loads.

## Attaching slots

Reference a component from any `images:`, `stacks:` or `texts:` entry:

```yaml
images:
  energy_fill:
    component: energy      # follows the energy row
    image: soulmates_energy_fill
    layer: 3
```

The slot's own `y` is then relative to its row rather than to the entity.

An `effects:` grid cannot be attached to a component. Position it with `x` and
`y`.

## The example that ships

`soulmates_pack` is the only default content that uses components. It defines a
pet tag with a health bar and an energy bar, where **the energy bar only exists
for pets that have energy**:

```yaml
soulmates_pet_layout:
  components:
    health:
      height: 10
      vertical-gap: 1
    energy:
      place-below: health
      height: 7
      vertical-gap: 1
      condition: "{soulmates_max_energy} > 0"

  images:
    health_frame:
      component: health
      align: center
      image: soulmates_health_frame
      y: 3
      layer: 1
      background: true
    health_fill:
      component: health
      align: center
      image: soulmates_health_fill
      layer: 3
      listener:
        type: placeholder
        value: "{soulmates_health}"
        max: "{soulmates_max_health}"

    energy_background:
      component: energy
      align: center
      image: soulmates_energy_background
      x: -9
      y: 4
      layer: 1
      background: true
    energy_fill:
      component: energy
      align: center
      image: soulmates_energy_fill
      x: -10
      y: 2
      layer: 3
      listener:
        type: placeholder
        value: "{soulmates_energy}"
        max: "{soulmates_max_energy}"

  texts:
    name:
      align: center
      text-content: "<white>{soulmates_display_name}</white>"
      font: pixel
      background: name_plate
      layer: 10
      y: 11
      scale: 1
```

For a pet with no energy stat, both energy slots are hidden and the name drops
down to sit directly above the health bar. This uses one layout rather than a
duplicate for the "no energy" case.

## When you do not need them

For a fixed design where everything is always visible, plain `y` offsets are
simpler. Components are only needed when a section is **optional**.
