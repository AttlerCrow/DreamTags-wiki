---
layout: home

hero:
  name: DreamTags
  text: Nametags and health bars, drawn with packets
  tagline: Layered bitmap bars, buff rows, damage indicators and rank plates, built from YAML, with no entities on the server.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: How it works
      link: /guide/how-it-works

features:
  - title: No server-side entities
    details: Tags are text displays sent as packets. Nothing is spawned, nothing is saved to a chunk, and /kill @e does not affect them.
  - title: Bars are images
    details: A PNG cut into frames rather than a row of characters. A slot points at the image and declares the value it follows.
  - title: Built from YAML
    details: Images, fonts and plates become layouts. Layouts become tags. Every id is reusable across packs.
  - title: Generated resource pack
    details: Add a PNG to assets/ and give it an id. Merges with CraftEngine, Nexo, ModelEngine and BetterModel.
---

## Where to start

For a new install, read [Getting started](/guide/getting-started). A fresh
install shows nothing until a tag is defined.

For the underlying model, read [How it works](/guide/how-it-works).

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
