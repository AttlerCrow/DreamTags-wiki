---
layout: home

hero:
  name: DreamTags
  text: Nametags and health bars, drawn with packets
  tagline: Layered bitmap health bars, buff rows, floating damage numbers and rank plates — built from YAML, with no armor stands and no entities on the server.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: How it works
      link: /guide/how-it-works

features:
  - title: Nothing really exists
    details: Every tag is a text display sent as packets to the players who should see it. Nothing is spawned in the world, so /kill @e cannot touch it and no entity ever ends up in a chunk.
  - title: Bars are images, not characters
    details: A health bar is a PNG sliced into frames. Point a slot at an image, tell it what to follow with listener, and it fills. Trailing damage and heal previews come from the same piece.
  - title: Assembled from YAML
    details: Images, fonts and plates become layouts; layouts become tags. Every id is reusable, so one bar design can serve mobs, players and pets without being copied.
  - title: The resource pack builds itself
    details: Drop a PNG in assets/, give it an id, and the generated pack picks it up. It can also merge with CraftEngine, Nexo, ModelEngine or BetterModel so the server still sends a single file.
---

## What this documentation covers

Start with [Getting started](/guide/getting-started) if you have just installed the plugin — the first thing worth knowing is that **a fresh install deliberately shows nothing**, and why.

If you want to understand the model before touching YAML, read [How it works](/guide/how-it-works). Everything else is reference:

| Section | What lives there |
| --- | --- |
| [config.yml](/config) | Global switches: update rate, view distance, resource pack output |
| [Packs](/packs/) | Folder layout, how ids resolve across packs, where PNGs are looked up |
| [Images](/images) | Turning PNGs into static frames, progress bars or animations |
| [Layouts](/layouts/) | Composing images, text, buff grids and plates into a tag |
| [Tags](/tags) | Which entities get which layout, and when it appears |
| [Damage indicators](/damage-indicators) | Floating combat numbers |
| [Placeholders](/placeholders/) | Every value you can put in a pattern or a condition |

Examples throughout are taken from the `default` pack that ships with the plugin, so you can open the same file on your own server and compare.
