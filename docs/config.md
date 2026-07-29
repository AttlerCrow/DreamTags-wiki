# config.yml

Lives at `plugins/DreamTags/config.yml`. Everything here applies on
`/dreamtags reload` — no restart needed.

## systems

Master switches.

```yaml
systems:
  tags: true
  damage-indicators: false
```

| Key | Default | What it does |
| --- | --- | --- |
| `tags` | `true` | Mob tags and player nametags from `Packs/<pack>/tags/*.yml` |
| `damage-indicators` | `false` | Floating combat numbers from `damage-indicators/*.yml` |

Turning a system off loads it from an empty source rather than skipping the
reload, which is what makes switching one off at runtime actually remove what is
already on screen.

::: tip Damage indicators are off by default
Floating numbers are a strong stylistic choice, so DreamTags makes you opt in.
Note that this only skips loading the folder — to stop the plugin listening to
damage events at all, use `popups.builtin-damage-triggers: never`.
:::

## Timing and range

```yaml
update-interval: 2
view-distance: 15
view-angle: 20
keep-for: 60
```

| Key | Default | What it does |
| --- | --- | --- |
| `update-interval` | `2` | Ticks between update passes. `2` = 10 passes per second |
| `view-distance` | `15` | Blocks at which mob tags appear. The `look` trigger uses it too |
| `view-angle` | `20` | Maximum angle in degrees for the `look` trigger |
| `keep-for` | `60` | Ticks a tag stays after its last trigger. Individual tags can override it |

`update-interval` is the latency with which a bar reflects a change, not an
animation rate. At `2` a health change shows up within 100 ms.

::: warning Nametags use double the view distance
Player nametags appear at `view-distance × 2` — 30 blocks with the default.
Lowering this key shortens both.
:::

## ignored-entities

```yaml
ignored-entities:
  - ARMOR_STAND
  - TEXT_DISPLAY
  - ITEM_DISPLAY
  - BLOCK_DISPLAY
```

Entity types that never get a tag, whatever the tag definitions say. The display
types are listed so tags never end up labelling other tags.

## tags

```yaml
tags:
  default-attach: passenger
```

How a tag rides its entity, unless a `tags/*.yml` entry overrides it.

| Value | Behaviour |
| --- | --- |
| `passenger` | The tag is mounted on the entity. The client moves it every frame and the server sends **no position packets at all**. Cheapest by a wide margin |
| `follow` | The tag teleports itself on every pass — one packet per tag, per viewer, per pass |

Only use `follow` when a tag must sit somewhere the mount point cannot reach. A
`motion:` equation on a tag forces it automatically.

## nametags

```yaml
nametags:
  show-self: true
```

Whether players see their own nametag. The shipped `player_layout` includes your
health bar, XP level and name, so seeing it is useful.

## resources

```yaml
resources:
  source: auto # auto | mmocore | auraskills
```

Where player mana comes from.

| Value | Behaviour |
| --- | --- |
| `auto` | MMOCore first, AuraSkills only if MMOCore is absent |
| `mmocore` / `auraskills` | Force one. If it is not installed, mana reads `0` and a warning is logged at startup |

MythicLib is consumed by MMOCore and is deliberately not a separate source.

## popups

```yaml
popups:
  max-active: 512
  max-per-entity: 8
  min-interval: 0
  builtin-damage-triggers: auto
```

| Key | Default | What it does |
| --- | --- | --- |
| `max-active` | `512` | Server-wide ceiling on live popups. Spawns past it are dropped silently — a safety valve, not a tuning knob |
| `max-per-entity` | `8` | Live popups of one style, on one entity, for one viewer |
| `min-interval` | `0` | Minimum ticks between two popups of the same style on the same entity for the same viewer. Tames damage-over-time and multi-hit AoE |
| `builtin-damage-triggers` | `auto` | Whether the vanilla `damage`/`crit` triggers are registered |

::: warning MythicLib changes which triggers fire
On `auto`, installing MythicLib **switches the vanilla `damage` and `crit`
triggers off**, because MythicLib fires its own for the same hit and you would
get two numbers per swing. The `mythiclib_damage` and `mythiclib_crit_damage`
ids arrive instead.

This is why the shipped indicators list all four ids — the same file then works
on an RPG server and a vanilla one. See [damage indicators](/damage-indicators).
:::

## pack

Controls the generated resource pack.

```yaml
pack:
  type: zip
  merge-external-folders: []
  merge-external-zip-files: []
  merge-into-external-pack: auto
  skip-initial-generation: true
```

| Key | Default | What it does |
| --- | --- | --- |
| `type` | `zip` | `zip` → `build/DreamTags.zip`, `folder` → `build/`, `none` → do not generate |
| `merge-external-folders` | `[]` | Other pack **folders** to merge into ours. Relative to `plugins/DreamTags/` |
| `merge-external-zip-files` | `[]` | Other pack **zips** to merge in. Relative to `plugins/` |
| `merge-into-external-pack` | `auto` | Push our pack into CraftEngine's or Nexo's instead. `auto` = on when one of them is installed |
| `skip-initial-generation` | `true` | Skip generating at startup when the host plugin will build it anyway |

DreamTags only ever writes under `assets/dreamtags`, so it stacks safely with
other packs rather than fighting them.

```yaml
pack:
  merge-external-folders:
    - "ModelEngine/resource pack"
  merge-external-zip-files:
    - "BetterModel/build.zip"
    - "CustomNameplates/resourcepack.zip"
```

::: danger Do not merge from both sides
Use `merge-external-*` **or** `merge-into-external-pack` for a given pack, never
both. Merged from both directions the content lands in the output twice, and
whichever side reads a file the other has not written yet silently merges a
stale copy.
:::

## debug

```yaml
debug: false
```

Extra logging while diagnosing a pack that will not load.

## Full reference

The shipped file is commented throughout; this page mirrors it. If you have
deleted a section, delete the whole `config.yml` and restart to get a fresh copy
— DreamTags only writes files that do not already exist.
