# DreamTags

Simple, lightweight and feature-rich nametag and health bar plugin for
[Paper](https://papermc.io/software/paper) (and
[Folia](https://papermc.io/software/folia)) servers, drawn with
[text displays](https://minecraft.wiki/w/Display) and packets — nothing is
spawned on the server.

## Features

With this plugin you can build tags with customizable properties like:

* Health bars sliced from your own PNGs, with trailing damage and heal previews
* Backgrounds (plates) that stretch to fit whatever text sits on them
* Bitmap fonts built from your own glyph sheet
* Rank icons beside the name, chosen by the player's LuckPerms group
* Potion effect rows built from the entity's active effects
* Damage indicators and popups, with equation-driven motion and fade
* Animated images: frame sequences on a clock, or frames stepped by any value
* Per-slot conditions — a red bar under 20%, a level badge only on RPG mobs
* MiniMessage formatting and placeholders, including
  [PlaceholderAPI](https://github.com/PlaceholderAPI/PlaceholderAPI) support
* Targeting per entity: vanilla types, MythicMobs ids or every mob; players by
  permission or rank
* A resource pack generated on start, merged into CraftEngine, Nexo, ModelEngine
  or BetterModel
* ...and much more!

Works with MythicMobs, MMOCore, AuraSkills, MythicLib, ModelEngine, BetterModel,
LuckPerms, PlaceholderAPI, CraftEngine and Nexo. None are required — missing
plugins are detected at startup and skipped.

## Installation

Requires **Java 25** and Paper 1.21.11, 26.1.x or 26.2.x. Folia is supported.

Drop the jar into `plugins/` and restart. A fresh install deliberately shows
nothing until you define a tag, so start with
[Getting started](/guide/getting-started).

## Documentation

- [Getting started](/guide/getting-started) — install, then show something
- [How it works](/guide/how-it-works) — the model behind packets, images and ids

| Section | Contents |
| --- | --- |
| [config.yml](/config) | Update rate, view distance, resource pack output |
| [Packs](/packs/) | Folder layout, ids, where PNGs are looked up |
| [Images](/images) | Static frames, progress bars, animations |
| [Layouts](/layouts/) | Images, text, buff grids and plates |
| [Tags](/tags) | Which entities get which layout, and when |
| [Damage indicators](/damage-indicators) | Combat numbers over the entity that was hit |
| [Placeholders](/placeholders/) | Every available value |

Examples come from the `default` pack that ships with the plugin, so the same
file can be opened on your server.

## Images

<!-- Screenshots go here. Put the PNGs in docs/public/ and link them as /name.png -->
