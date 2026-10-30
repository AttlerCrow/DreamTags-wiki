# Tags

A tag connects a [layout](/layouts/) to the entities that wear it, and says when
it appears. `Packs/<pack>/tags/*.yml`, one key per tag id.

```yaml
my_mob_tag:
  for: mobs
  show-on: [damage, look]
  keep-for: 60
  offset: 0.4
  layouts: [default_layout]
```

`for:` decides the kind: **mob tags**, or **player nametags** with
`for: players`.

The `default` pack defines no tags; `default_tags.yml` is all comments. See
[Getting started](/guide/getting-started#show-something).

## for:

Accepts a string or a list, defaults to `mobs`. When several tags match the same
entity, the most specific one applies:

| Form | Specificity | Matches |
| --- | --- | --- |
| `for: mythicmobs:skeletalboss` | 500 | One mob from a provider |
| `mob-ids: [skeletalboss]` | 400 | A list of ids (legacy) |
| `for: mythicmobs` | 300 | Every mob from that provider |
| `entity-types: [ZOMBIE, SKELETON]` | 200 | Vanilla entity types |
| `for: mobs` | 100 | Everything |

```yaml
# Every MythicMobs mob
mythic_tag:
  for: mythicmobs
  layouts: [default_layout]

# Except this boss
boss_tag:
  for: mythicmobs:skeletalboss
  layouts: [boss_layout]
```

Providers come from plugins: `mythicmobs` with MythicMobs installed, plus any
registered through the API.

Forms combine: `for: [mythicmobs, mobs]` covers that provider at 300 and
everything else at 100.

`for: players` cannot be mixed with mob selectors; doing so fails to load.

Two definitions with identical criteria and triggers produce a warning, and the
one loaded later takes precedence.

## Mob tag keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `for` | string or list | `mobs` | Selector |
| `entity-types` | string or list | `[]` | Vanilla types |
| `mob-ids` | string or list | `[]` | Provider ids |
| `show-on` | string or list | `[damage, look]` | Triggers |
| `keep-for` | ticks | [`keep-for`](/config#timing-and-range) | How long it stays after the last trigger |
| `offset` | blocks | `0.4` | Height above the anchor |
| `scale` | number | `1.0` | Overall scale |
| `x` / `y` | number | `0` | Offset of the whole tag |
| `death.linger` | ticks ≥ 0 | `0` | How long it survives the mob's death |
| `bounce` | boolean | `false` | The tag pops in, squashes when hit and hops when healed. See [Bounce](#bounce) |
| `layouts` | list | — required | What to draw |

### Triggers

| Trigger | Fires when |
| --- | --- |
| `damage` | The entity takes damage |
| `heal` | The entity is healed |
| `look` | A player looks at it, within [`view-angle`](/config#timing-and-range) |
| `move` | The entity moves |
| `spawn` | The entity spawns |
| `tick` | Continuously |
| `api` | Another plugin asks |

Plugins can add their own, like `soulmates:combat` in the example pack.

`api` works even when it is not listed in `show-on`.

The damage packet is broadcast to everyone tracking the entity, so **every
nearby player** sees the bar appear, including players who did not attack it.

### How a tag rides

Every tag is mounted on its entity as a passenger, so the client moves it every
frame and the server sends no position packets.

### death.linger

When an entity dies in one hit the tag normally disappears mid-animation, so a
trailing fill never drains. Lingering keeps the tag on screen at 0 health until
the animation finishes.

```yaml
my_mob_tag:
  for: mobs
  death:
    linger: 20
  layouts: [default_layout]
```

When the mob despawns, the tag is moved once to where it died and finishes the
animation there.

Two variables are always published, and take these values during the linger:

| Variable | Value |
| --- | --- |
| `{dying}` | `true` for the whole linger, `false` otherwise |
| `{death_progress}` | `0` → `1` across it, `0` otherwise |

Because both are always present, they can be compared in any condition. A
"bar shatters" animation is built from them directly, using a
[`frame-defined`](/images#frame-defined) image stepped by the progress:

```yaml
images:
  health_break:
    image: bar_break
    condition: "{dying}"
    layer: 5
    listener:
      type: placeholder
      value: "{death_progress}"
      max: 1
  health_fill_normal:
    condition: "{dying} == false"     # hide the live bar meanwhile
```

## Player nametags

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `permission` | string | — | Only applies to players who have it |
| `ranks` | list | `[]` | LuckPerms groups |
| `offset` | blocks | `0.9` | Height |
| `scale` | number | `1.0` | Scale |
| `x` / `y` | number | `0` | Offset |
| `layouts` | list | — required | What to draw |

Nametags do not accept `show-on`, `keep-for`, `bounce` or `death.linger`. They are visible within
[`view-distance × 2`](/config#timing-and-range).

### Which one a player gets

1. Definitions whose `permission:` the player lacks are discarded.
2. A `ranks:` definition takes precedence, using the player's highest-weight
   LuckPerms group.
3. Otherwise a `permission:` definition.
4. Otherwise the one with neither.

```yaml
default_nametag:
  for: players
  layouts: [player_layout]

staff_nametag:
  for: players
  ranks: [admin, moderator]
  layouts: [staff_layout]

donor_nametag:
  for: players
  permission: dreamtags.nametag.donor
  layouts: [donor_layout]
```

`ranks:` needs LuckPerms. Without it the definition is skipped with a warning.

## layouts:

Every tag needs at least one. Entries are an id, or a map to offset that layout
within the tag:

```yaml
layouts:
  - default_layout
  - id: extra_layout
    x: 0
    y: 20
    align: center
```

## Example

From `soulmates_pack`:

```yaml
soulmates_pet_tag:
  for: soulmates
  show-on: [look, damage, soulmates:combat]
  keep-for: 60
  offset: 0.0
  scale: 1.0
  layouts: [soulmates_pet_layout]
```

## Bounce

`bounce: true` gives the whole tag a bit of life:

- it **pops in** with a small overshoot when it appears
- it **squashes and springs back** when the mob is hit, harder for a bigger hit
- it **hops up** when the mob is healed

```yaml
my_mob_tag:
  for: mobs
  bounce: true
  layouts: [default_layout]
```

It pairs well with [smooth bars](/layouts/images#smooth-bars). The tag only
sends anything while it is moving; a mob that isn't being hit costs nothing
extra.
