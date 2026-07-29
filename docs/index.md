---
layout: home

hero:
  name: DreamTags
  text: Nametags and health bars, drawn with packets
  tagline: Layered bitmap bars, buff rows, floating damage numbers and rank plates — built from YAML, with no entities on the server.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: How it works
      link: /guide/how-it-works

features:
  - title: Nothing exists on the server
    details: Tags are text displays sent as packets. Nothing is spawned, nothing is saved to a chunk, and /kill @e cannot touch them.
  - title: Bars are images
    details: A PNG cut into frames, not a row of characters. Point a slot at it, say what it follows, and it fills.
  - title: Built from YAML
    details: Images, fonts and plates become layouts. Layouts become tags. Every id is reusable across packs.
  - title: The pack builds itself
    details: Drop a PNG in assets/, give it an id. Merges with CraftEngine, Nexo, ModelEngine and BetterModel.
---

## Where to start

New install? Read [Getting started](/guide/getting-started) — a fresh install
shows nothing until you define a tag.

Want the model first? [How it works](/guide/how-it-works).

| Section | Contents |
| --- | --- |
| [config.yml](/config) | Update rate, view distance, resource pack output |
| [Packs](/packs/) | Folder layout, ids, where PNGs are looked up |
| [Images](/images) | Static frames, progress bars, animations |
| [Layouts](/layouts/) | Images, text, buff grids and plates |
| [Tags](/tags) | Which entities get which layout, and when |
| [Damage indicators](/damage-indicators) | Floating combat numbers |
| [Placeholders](/placeholders/) | Every value you can use |

Examples come from the `default` pack that ships with the plugin, so you can open
the same file on your server.
