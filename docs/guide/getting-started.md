# Getting started

## Requirements

| | |
| --- | --- |
| Server | Paper (or a fork). Folia is supported. |
| Java | 21 or newer |
| Optional | MythicMobs, MMOCore, AuraSkills, MythicLib, ModelEngine, BetterModel, LuckPerms, PlaceholderAPI, CraftEngine, Nexo — see [placeholders from other plugins](/placeholders/hooks) |

None of the optional plugins are required. DreamTags checks for each one at
startup and simply skips the ones that are missing.

## Install

1. Drop `DreamTags.jar` into `plugins/`.
2. Start the server once. The plugin writes its default files and generates a
   resource pack at `plugins/DreamTags/build/DreamTags.zip`.
3. Apply that resource pack to your server (or let [CraftEngine or Nexo](/config#pack)
   merge it into theirs).

## A fresh install shows nothing — on purpose

::: warning This is not a broken install
Out of the box DreamTags draws **no tags at all**. That is deliberate, not a bug.
:::

Three things are switched off in a clean install:

- **No tags are defined.** `Packs/default/tags/default_tags.yml` contains only
  comments. The `default` pack exists to supply shared *ingredients* — fonts,
  health bar fills, the name plate, the potion icons — that a commercial pack
  builds on top of.
- **Damage indicators are off.** `systems.damage-indicators` is `false`, because
  floating combat numbers are a strong stylistic choice.
- **Only one popup is active**, the healing number.

So the first thing to do is decide which of these you want.

## Show something

The `default` pack already ships a finished player layout called
`player_layout` — a health bar with trailing damage, a heal preview, the buff
row, the XP level badge and the name on its plate. Nothing points at it yet.

Create `plugins/DreamTags/Packs/default/tags/my_tags.yml`:

```yaml
my_nametag:
  for: players
  offset: 0.9
  layouts: [player_layout]
```

Then run:

```
/dreamtags reload
```

Every player now wears the default nametag. To give mobs a health bar as well,
add a second entry to the same file:

```yaml
my_mob_tag:
  for: mobs
  show-on: [damage, look]
  keep-for: 60
  offset: 0.4
  layouts: [default_layout]
```

`show-on: [damage, look]` means the bar appears when the mob is hit or when a
player looks at it, and `keep-for: 60` keeps it up for three seconds after the
last of those. See [Tags](/tags) for every trigger and selector.

## Turning on damage numbers

In `plugins/DreamTags/config.yml`:

```yaml
systems:
  damage-indicators: true
```

Reload, and the `damage` and `crit` indicators from
`Packs/default/damage-indicators/default.yml` start firing. By default **only
the player who dealt the hit sees their own numbers**; players can widen that
themselves with `/dreamtags indicators <solo|party|global>`.

## Editing the defaults is safe

DreamTags never overwrites a file that already exists. Once a default file has
been written to disk, it belongs to you — restarts and updates leave your edits
alone. If you want a fresh copy of one, delete it and restart.

## Where to go next

- [How it works](/guide/how-it-works) — the model behind images, layouts and tags
- [config.yml](/config) — every global option
- [Packs](/packs/) — how to organise your own content instead of editing `default`
