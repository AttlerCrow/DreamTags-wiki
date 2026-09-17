# Client mod

DreamTags ships an optional Fabric mod for **Minecraft 26.2**. A player who
installs it gets tags drawn by their own client; everyone else keeps the packet
tags, and nothing changes for them.

## What changes for the player

- Health bars, player nametags, effect icons and damage numbers are drawn by
  the client, in a toon style: thick outlines, flat colours, and motion that
  overshoots.
- The bar moves every frame: damage drains it with a lingering ghost, a heal
  eases it up behind a green preview.
- A hit shakes the bar, squashes it and flashes it white; a heal gives it a
  soft bump and a green glow.
- A new effect on a mob announces itself with a popup: red for harmful, blue
  for beneficial.
- Critical, magic, true, hybrid and damage-over-time numbers each have their
  own look; a status tick uses its status's colour.
- A key (unbound by default, under *DreamTags* in Controls) hides every tag.

The mod draws only through the game's own render pipeline, so it runs on the
Vulkan backend as well as OpenGL.

## What changes for the server

Nothing to configure. The mod announces itself on the `dreamtags:v1` channel;
for that player the server stops building text displays and sends only the
values a tag shows, when they change. Tag definitions, `for:` selectors,
ignored entities, scopes, hidden nametags and popup audiences all still apply.
The look trigger and its entity scan are skipped entirely for modded players.

When a tag shows follows its definition: `show-on` (look, damage, move) and
`keep-for` are applied by the client. Player nametags are always shown, as on
the packet path.

## Building

```bash
./gradlew dreamTagsFabricJar   # -> platform/fabric/build/libs/
```

The server and the mod speak one protocol version, carried in the channel
name. A client whose version does not match simply gets packet tags.
