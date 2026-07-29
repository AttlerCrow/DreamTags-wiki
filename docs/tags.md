# Tags

A tag connects a [layout](/layouts/) to the entities that should wear it, and
says when it appears. `Packs/<pack>/tags/*.yml`, one top-level key per tag id.

```yaml
my_mob_tag:
  for: mobs
  show-on: [damage, look]
  keep-for: 60
  offset: 0.4
  layouts: [default_layout]
```

There are two kinds, and `for:` decides which: **mob tags** and **player
nametags** (`for: players`).

::: warning The default pack defines no tags
`Packs/default/tags/default_tags.yml` is entirely comments. You have to define
at least one tag, or install a pack that does. See
[Getting started](/guide/getting-started#show-something).
:::

## for: — choosing the entities

`for:` accepts a string or a list, and defaults to `mobs`. When several tags
match the same entity, **the most specific wins**:

| Form | Specificity | Matches |
| --- | --- | --- |
| `for: mythicmobs:skeletalboss` | 500 | One specific mob from a provider |
| `mob-ids: [skeletalboss]` | 400 | A list of ids (legacy form) |
| `for: mythicmobs` | 300 | Every mob from that provider |
| `entity-types: [ZOMBIE, SKELETON]` | 200 | Vanilla entity types |
| `for: mobs` | 100 | Everything — the catch-all |

```yaml
# Every MythicMobs mob gets the standard RPG bar…
mythic_tag:
  for: mythicmobs
  layouts: [default_layout]

# …except this boss, which gets its own.
boss_tag:
  for: mythicmobs:skeletalboss
  layouts: [boss_layout]
```

Providers come from plugins: `mythicmobs` with MythicMobs installed, plus any
registered through the API.

You can combine forms — `for: [mythicmobs, mobs]` covers that provider at 300
and everything else at 100.

::: danger players cannot be mixed
`for: players` is exclusive. Mixing it with mob selectors fails to load with
`'for' cannot mix players and mob selectors`.
:::

**Ties.** Two definitions with identical criteria and triggers produce a console
warning, and the one loaded later wins (packs alphabetically, then files).

## Mob tag keys

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `for` | string or list | `mobs` | Selector, above |
| `entity-types` | string or list | `[]` | Vanilla types (specificity 200) |
| `mob-ids` | string or list | `[]` | Provider ids (specificity 400) |
| `show-on` | string or list | `[damage, look]` | Triggers that make it appear |
| `keep-for` | ticks | [`keep-for`](/config#timing-and-range) (60) | How long it stays after the last trigger |
| `offset` | blocks | `0.4` | Height above the anchor point |
| `scale` | number | `1.0` | Overall scale |
| `x` / `y` | number | `0` | Offset of the whole tag |
| `attach` | `passenger` · `follow` | [`tags.default-attach`](/config#tags) | How it rides the entity |
| `motion` | section `x`/`y`/`z` | — | Movement equations |
| `death.linger` | ticks ≥ 0 | `0` | How long the tag survives the mob's death |
| `layouts` | list | — **required** | Which layouts to draw |

### Triggers

| Trigger | Fires when |
| --- | --- |
| `damage` | The entity takes damage |
| `heal` | The entity is healed |
| `look` | A player looks at it, within [`view-angle`](/config#timing-and-range) |
| `move` | The entity moves |
| `spawn` | The entity spawns |
| `tick` | Continuously |
| `api` | Another plugin asks for it |

Plugins can add their own — `soulmates:combat` in the shipped example pack.

::: tip `api` always matches
The `api` trigger works even if it is not listed in `show-on`, so another plugin
can always show a tag on demand.
:::

`damage` deserves a note: the damage packet is broadcast by the server to
everyone tracking the entity, so **every nearby player** sees the bar appear,
not just the attacker.

### attach

`passenger` mounts the tag on the entity — the client moves it every frame and
the server sends no position packets. `follow` teleports it every pass.

Prefer `passenger`. It is dramatically cheaper and is the default.

::: warning motion forces follow
A non-zero `motion:` makes the tag move independently of the mount point, so it
switches to `follow` automatically.
:::

### death.linger

Kill a chicken in one hit and the tag normally vanishes mid-frame, so a trailing
fill never gets to drain. Lingering keeps the tag on screen with the mob's health
at 0 so the animation finishes.

```yaml
my_mob_tag:
  for: mobs
  death:
    linger: 20      # ticks
  layouts: [default_layout]
```

The tag switches to `follow` on its own when linger is set — a mounted display
is a passenger of the mob, so the client would drop it the instant the mob
despawns. The tag finishes where the mob died.

Two variables are published while it plays:

| Variable | Value |
| --- | --- |
| `{dying}` | `true` for the whole linger |
| `{death_progress}` | `0` → `1` across it |

Which means a "bar shatters" animation needs no new feature — a
[`frame-defined`](/images#type-frame-defined) image stepped by the progress:

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

`for: players` selects the nametag branch, which accepts a different set of keys.

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `permission` | string | — | Only applies to players who have it |
| `ranks` | list | `[]` | LuckPerms groups this nametag is for |
| `offset` | blocks | `0.9` | Height |
| `scale` | number | `1.0` | Overall scale |
| `x` / `y` | number | `0` | Offset |
| `layouts` | list | — **required** | Which layouts to draw |

Nametags do **not** accept `show-on`, `keep-for`, `attach`, `motion` or
`death.linger`. They are always visible, within
[`view-distance × 2`](/config#timing-and-range).

### Which nametag a player gets

When several definitions could apply, the order is:

1. Any whose `permission:` the player lacks is discarded.
2. A `ranks:` definition wins, choosing the player's **highest-weight** LuckPerms
   group.
3. Otherwise a `permission:` definition.
4. Otherwise the one with neither — the default nametag.

```yaml
# Everyone
default_nametag:
  for: players
  layouts: [player_layout]

# Staff, by rank
staff_nametag:
  for: players
  ranks: [admin, moderator]
  layouts: [staff_layout]

# Anyone with the permission
donor_nametag:
  for: players
  permission: dreamtags.nametag.donor
  layouts: [donor_layout]
```

`ranks:` needs LuckPerms. Without it, the definition is skipped and a warning is
logged at startup.

## layouts:

Every tag needs at least one. Entries can be a plain id, or a map to offset that
layout within the tag:

```yaml
layouts:
  - default_layout
  - id: extra_layout
    x: 0
    y: 20
    align: center
```

An unknown layout id fails the tag with `unknown layout '<id>'`.

## A complete example

The only real tag in the shipped packs, from `soulmates_pack`:

```yaml
soulmates_pet_tag:
  for: soulmates
  show-on: [look, damage, soulmates:combat]
  keep-for: 60
  offset: 0.0
  scale: 1.0
  layouts: [soulmates_pet_layout]
```

Every pet from the `soulmates` provider, shown when looked at, hit, or when that
plugin fires its own combat trigger.
