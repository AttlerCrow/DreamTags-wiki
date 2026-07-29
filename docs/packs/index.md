# Packs

A pack is a folder of content under `plugins/DreamTags/Packs/`. Everything the
plugin draws comes from one.

## Folder layout

```
plugins/DreamTags/
├── config.yml
├── assets/                      shared PNGs, available to every pack
│   ├── pixel.png
│   ├── name_plate/{left,body,right}.png
│   └── vanilla_effects/*.png    40 potion icons
├── damage-indicators/           server-wide indicators (loaded last, wins)
├── Packs/
│   ├── default/
│   │   ├── assets/              this pack's own PNGs (optional)
│   │   ├── images/*.yml         PNG → frames
│   │   ├── fonts/*.yml          PNG grid → bitmap font
│   │   ├── backgrounds/*.yml    stretchable plates
│   │   ├── layouts/*.yml        the designs
│   │   ├── tags/*.yml           who wears what
│   │   ├── popups/*.yml         floating one-shots
│   │   └── damage-indicators/*.yml
│   └── your_pack/
└── build/
    └── DreamTags.zip            generated resource pack
```

Every subfolder is optional. A pack that only adds one layout needs nothing but
`layouts/`.

## Ids are global

This is the most important rule, and the one that surprises people.

**Ids are shared across all packs.** An image called `health_fill` in one pack
can be used by a layout in another. Packs are not namespaces.

The `soulmates_pack` shipped with the plugin demonstrates it — it brings its own
PNGs and images, but its layout borrows from `default`:

```yaml
# Packs/soulmates_pack/layouts/soulmates_layouts.yml
texts:
  name:
    pattern: "<white>{soulmates_display_name}</white>"
    font: pixel              # ← defined in Packs/default/fonts/
    background: name_plate   # ← defined in Packs/default/backgrounds/
```

That is the intended way to build on a base pack: reuse the ingredients, define
only what is new.

## Load order and overriding

Packs load in **alphabetical order**, and a later pack **overrides** an id
declared by an earlier one — with a warning in the console.

```
Packs/default/        loads first
Packs/soulmates_pack/
Packs/v2/
Packs/zz_overrides/   loads last, wins every clash
```

So to restyle something from `default` without editing it, declare the same id
in a pack whose name sorts later:

```yaml
# Packs/zz_overrides/images/my_images.yml
health_fill:                          # same id as default's
  file: my_prettier_fill.png
  type: progress
  anchor: left
  frames: 77
```

Every layout pointing at `health_fill` now uses your texture, and updating the
plugin will not undo it.

## Where PNGs are looked up

`file:` in `images/*.yml` and the piece paths in `backgrounds/*.yml` are
resolved in two places, in order:

1. `Packs/<this pack>/assets/`
2. the shared `plugins/DreamTags/assets/`

The pack's own folder wins. If the same filename exists in both, DreamTags logs
a warning — that message exists precisely because "my PNG edit did nothing" is
otherwise a long afternoon.

Paths may include subfolders (`vanilla_effects/poison.png`), but cannot escape
`assets/`: `../` is rejected.

::: tip Two packs can ship the same filename
Textures are namespaced per pack in the generated resource pack, so two packs
can both have a `health_fill.png` without colliding. Only **ids** collide.
:::

## damage-indicators lives in two places

| Location | Loaded |
| --- | --- |
| `Packs/<pack>/damage-indicators/` | with that pack, in alphabetical order |
| `plugins/DreamTags/damage-indicators/` | **last**, so it wins |

The root folder is created empty on first start. It is where server-wide
indicators belong — the ones that are yours, not a pack's.

## Making your own pack

1. Create `plugins/DreamTags/Packs/my_pack/`.
2. Add only the subfolders you need.
3. Put PNGs in `my_pack/assets/`.
4. `/dreamtags reload`.

Keeping your work in its own pack means a plugin update never touches it, and
you can hand the folder to someone else as a unit.

## Errors are contained

A file that fails to parse is skipped with a warning naming the pack, the file
and the reason. The rest of that pack, and every other pack, still loads. You
will never lose every tag to one typo — but do read the console after a reload.

## The generated resource pack

Everything above is compiled into `build/DreamTags.zip`: fonts, image glyphs and
`pack.mcmeta`. DreamTags writes only under `assets/dreamtags`, so it can be
merged with other packs in either direction — see [`pack` in config.yml](/config#pack).
