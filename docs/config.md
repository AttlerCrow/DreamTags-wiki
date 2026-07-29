# config.yml

`plugins/DreamTags/config.yml`. Everything applies on `/dreamtags reload`.

## systems

```yaml
systems:
  tags: true
  damage-indicators: false
```

| Key | Default | What it does |
| --- | --- | --- |
| `tags` | `true` | Mob tags and player nametags |
| `damage-indicators` | `false` | Floating combat numbers |

Damage indicators are off because floating numbers are a strong stylistic
choice. Turning this on only loads the folder — to stop DreamTags listening to
damage events entirely, use `popups.builtin-damage-triggers: never`.

## Timing and range

```yaml
update-interval: 2
view-distance: 15
view-angle: 20
keep-for: 60
```

| Key | Default | What it does |
| --- | --- | --- |
| `update-interval` | `2` | Ticks between update passes. `2` = 10 per second |
| `view-distance` | `15` | Blocks at which mob tags appear. Also used by the `look` trigger |
| `view-angle` | `20` | Max angle in degrees for `look` |
| `keep-for` | `60` | Ticks a tag stays after its last trigger. Tags can override it |

`update-interval` is how quickly a bar reflects a change, not an animation rate.
At `2` a health change shows within 100 ms.

Player nametags use `view-distance × 2` — 30 blocks by default.

## ignored-entities

```yaml
ignored-entities:
  - ARMOR_STAND
  - TEXT_DISPLAY
  - ITEM_DISPLAY
  - BLOCK_DISPLAY
```

Never get a tag, whatever the tag definitions say. The display types are listed
so tags do not end up labelling other tags.

## tags

```yaml
tags:
  default-attach: passenger
```

| Value | Behaviour |
| --- | --- |
| `passenger` | Mounted on the entity. The client moves it every frame; the server sends no position packets |
| `follow` | Teleports itself every pass — one packet per tag, per viewer, per pass |

Use `follow` only when a tag must sit somewhere the mount point cannot reach. A
`motion:` equation forces it automatically.

## nametags

```yaml
nametags:
  show-self: true
```

Whether players see their own nametag.

## resources

```yaml
resources:
  source: auto # auto | mmocore | auraskills
```

Where player mana comes from. `auto` prefers MMOCore and falls back to
AuraSkills. Naming one that is not installed makes mana read `0`, with a warning
at startup.

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
| `max-active` | `512` | Server-wide cap. Spawns past it are dropped silently |
| `max-per-entity` | `8` | Per style, per entity, per viewer |
| `min-interval` | `0` | Minimum ticks between two popups of the same style on the same entity for one viewer |
| `builtin-damage-triggers` | `auto` | Whether the vanilla `damage`/`crit` triggers are registered |

`min-interval` is what tames damage-over-time and multi-hit AoE.

On `auto`, installing MythicLib switches the vanilla `damage` and `crit`
triggers off — MythicLib fires its own for the same hit, and you would get two
numbers per swing. The `mythiclib_damage` and `mythiclib_crit_damage` ids arrive
instead, which is why the shipped indicators list all four. See
[damage indicators](/damage-indicators).

## pack

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
| `type` | `zip` | `zip` → `build/DreamTags.zip`, `folder` → `build/`, `none` → skip |
| `merge-external-folders` | `[]` | Pack folders to merge in. Relative to `plugins/DreamTags/` |
| `merge-external-zip-files` | `[]` | Pack zips to merge in. Relative to `plugins/` |
| `merge-into-external-pack` | `auto` | Push ours into CraftEngine's or Nexo's instead |
| `skip-initial-generation` | `true` | Skip generating at startup when the host plugin builds it anyway |

```yaml
pack:
  merge-external-folders:
    - "ModelEngine/resource pack"
  merge-external-zip-files:
    - "BetterModel/build.zip"
    - "CustomNameplates/resourcepack.zip"
```

Use `merge-external-*` **or** `merge-into-external-pack` for a given pack, never
both. Merged from both sides the content lands in the output twice, and whichever
side reads a file the other has not written yet merges a stale copy.

DreamTags only writes under `assets/dreamtags`, so it never fights another
pack's content.

## debug

```yaml
debug: false
```

Extra logging when diagnosing a pack that will not load.
