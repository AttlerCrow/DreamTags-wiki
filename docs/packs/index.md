# Packs

A pack is a folder of content under `plugins/DreamTags/Packs/`.

```
plugins/DreamTags/
├── config.yml
├── assets/                      shared PNGs, available to every pack
│   ├── pixel.png
│   ├── name_plate/{left,body,right}.png
│   └── vanilla_effects/*.png    40 potion icons
├── damage-indicators/           server-wide indicators
├── Packs/
│   ├── default/
│   │   ├── assets/              this pack's own PNGs
│   │   ├── images/*.yml         PNG → frames
│   │   ├── fonts/*.yml          PNG grid → bitmap font
│   │   ├── backgrounds/*.yml    stretchable plates
│   │   ├── layouts/*.yml        the designs
│   │   ├── tags/*.yml           who wears what
│   │   ├── popups/*.yml
│   │   └── damage-indicators/*.yml
│   └── your_pack/
└── build/
    └── DreamTags.zip            generated resource pack
```

Every subfolder is optional.

## Ids are global

Ids are shared across all packs, not scoped to the one that declared them. An
image defined in `default` can be used by a layout in your pack.

```yaml
# Packs/soulmates_pack/layouts/soulmates_layouts.yml
texts:
  name:
    text-content: "<white>{soulmates_display_name}</white>"
    font: pixel              # from Packs/default/fonts/
    background: name_plate   # from Packs/default/backgrounds/
```

## Load order

Packs load alphabetically. A later pack overrides an id declared earlier, with a
warning in the console.

```
Packs/default/        first
Packs/soulmates_pack/
Packs/v2/
Packs/zz_overrides/   last, wins every clash
```

To restyle something from `default` without editing it, declare the same id in a
pack that sorts later:

```yaml
# Packs/zz_overrides/images/my_images.yml
health_fill:
  file: my_prettier_fill.png
  type: progress
  anchor: left
  frames: 77
```

Every layout using `health_fill` now uses your texture, and a plugin update will
not undo it.

## Where PNGs are looked up

`file:` is resolved in two places, in order:

1. `Packs/<this pack>/assets/`
2. the shared `plugins/DreamTags/assets/`

The pack wins. If the same filename exists in both, a warning is logged.

Paths can include subfolders (`vanilla_effects/poison.png`) but cannot escape
`assets/` — `../` is rejected.

Two packs can ship the same *filename* without colliding, since textures are
namespaced per pack in the generated resource pack. Only ids collide.

## damage-indicators is in two places

| Location | Loaded |
| --- | --- |
| `Packs/<pack>/damage-indicators/` | with that pack, alphabetically |
| `plugins/DreamTags/damage-indicators/` | last, so it wins |

The root folder is created empty on first start. Server-wide indicators go there.

## Making your own

1. Create `plugins/DreamTags/Packs/my_pack/`.
2. Add the subfolders you need.
3. Put PNGs in `my_pack/assets/`.
4. `/dreamtags reload`.

Your own pack survives plugin updates and can be handed to someone else as one
folder.

## Errors

A file that fails to parse is skipped with a warning naming the pack, file and
reason. Everything else still loads, so one typo never takes down every tag.
Check the console after a reload.

## The generated pack

Fonts, image glyphs and `pack.mcmeta` are compiled into `build/DreamTags.zip`.
DreamTags only writes under `assets/dreamtags`, so it can be merged with other
packs in either direction — see [`pack`](/config#pack).
