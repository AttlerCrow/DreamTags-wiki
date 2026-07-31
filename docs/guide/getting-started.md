# Getting started

## Requirements

| | |
| --- | --- |
| Server | Paper 1.21.11, 26.1.x or 26.2.x. Folia works |
| Java | 25 |
| Optional | MythicMobs, MMOCore, AuraSkills, MythicLib, ModelEngine, BetterModel, LuckPerms, PlaceholderAPI, CraftEngine, Nexo |

Optional plugins are detected at startup. Missing ones are skipped.

## Install

1. Drop `DreamTags.jar` into `plugins/`.
2. Start the server. It writes its default files and generates a resource pack at
   `plugins/DreamTags/build/DreamTags.zip`.
3. Apply that pack, or let [CraftEngine or Nexo](/config#pack) merge it into
   theirs.

## A fresh install shows nothing

This is deliberate. Three things are off:

- **No tags are defined.** `Packs/default/tags/default_tags.yml` is all comments.
  The `default` pack ships components for other packs to use: fonts, bar fills,
  the name plate and potion icons.
- **Damage indicators are off** (`systems.damage-indicators: false`).
- **Only the healing popup is active.**

## Show something

`default` ships a complete player design called `player_layout`: health bar with
trailing damage, heal preview, buff row, XP level and the name on its plate. No
tag points at it yet.

Create `plugins/DreamTags/Packs/default/tags/my_tags.yml`:

```yaml
my_nametag:
  for: players
  offset: 0.9
  layouts: [player_layout]
```

Then `/dreamtags reload`. Every player now has a nametag.

For mob health bars, add:

```yaml
my_mob_tag:
  for: mobs
  show-on: [damage, look]
  keep-for: 60
  offset: 0.4
  layouts: [default_layout]
```

The bar appears when the mob is hit or looked at, and stays for 3 seconds
afterwards. See [Tags](/tags) for every trigger and selector.

## Damage numbers

In `config.yml`:

```yaml
systems:
  damage-indicators: true
```

After a reload the `damage` and `crit` indicators start firing. By default a
player only sees numbers they dealt; this can be widened with
`/dreamtags indicators <solo|party|global>`.

## Editing the defaults

DreamTags never overwrites a file that already exists, so edits survive restarts
and updates. Delete a file and restart to get a fresh copy.

## Next

- [How it works](/guide/how-it-works)
- [config.yml](/config)
- [Packs](/packs/): how to keep your content out of `default`
