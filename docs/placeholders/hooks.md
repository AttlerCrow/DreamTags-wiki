# From other plugins

DreamTags detects supported plugins at startup. None is required; a missing
plugin is skipped and its classes are never loaded.

```
[DreamTags] MythicMobs support enabled.
[DreamTags] MMOCore support enabled.
```

An incompatible version logs a warning and the server continues on the vanilla
fallback.

The placeholders listed below are always registered; a hook supplies their
values. See [built-in placeholders](/placeholders/built-in) for what each one
returns when the plugin is absent.

| Plugin | What it supplies |
| --- | --- |
| **MythicMobs** | Values for `{mob_id}`, `{mob_level}`, `{is_mythic_mob}`, and `for: mythicmobs:<id>` selectors |
| **MMOCore** | Mana, `{player_level}` as class level, the `party` scope |
| **AuraSkills** | Mana |
| **MythicLib** | The `mythiclib_damage` and `mythiclib_crit_damage` triggers |
| **ModelEngine** | Tag height from the model's tallest bone |
| **BetterModel** | Height, plus anchoring to a tagged bone that follows animations |
| **LuckPerms** | `ranks:` on nametags, and `rank-decoration` icons |
| **PlaceholderAPI** | `%papi%` in any text, plus `%dreamtags_*%` for other plugins |
| **CraftEngine** / **Nexo** | Hands them the generated resource pack |

## MythicMobs

Registers a mob provider, which supplies the mob placeholder values and enables
provider-based [selectors](/tags#for).

```yaml
mythic_tag:
  for: mythicmobs
  layouts: [default_layout]

boss_tag:
  for: mythicmobs:skeletalboss
  layouts: [boss_layout]
```

```yaml
texts:
  name:
    text-content: "<gold>{mob_id}</gold> <yellow>Lv.{mob_level}</yellow>"
    condition: "{mob_level} > 0"
```

## MMOCore

Mana from the `MAX_MANA` stat, `{player_level}` as the class level rather than
vanilla XP, and a `party` scope.

```yaml
images:
  mana_bar:
    image: mana_fill
    condition: "{max_mana} > 0"
    listener: mana
```

```
/dreamtags scope party
/dreamtags indicators party
```

## AuraSkills

Supplies mana. With both installed, MMOCore takes precedence under
[`resources.source: auto`](/config#resources).

## MythicLib

Adds `mythiclib_damage` and `mythiclib_crit_damage`, which report post-mitigation
RPG damage rather than the vanilla number.

Under [`popups.builtin-damage-triggers: auto`](/config#popups) it also **disables
the vanilla `damage` and `crit` triggers**, because MythicLib fires its own for
the same hit. Listing all four ids makes one file work in either case:

```yaml
triggers: [damage, crit, mythiclib_damage, mythiclib_crit_damage]
```

## ModelEngine and BetterModel

Both position the tag above a custom model rather than above the vanilla hitbox,
which would otherwise leave tags inside large models.

ModelEngine computes height from the blueprint's tallest bone. BetterModel also
computes height, and in addition anchors the tag to a bone named `TAG`,
`MOB_TAG` or `PLAYER_TAG`, falling back to the top of the `hitbox` bone. That
anchor follows animations.

Neither requires configuration or placeholders. Both apply to
`anchor: model-top` only.

With both installed, BetterModel's bone anchor is resolved first and is used
whenever it binds, which is the case for any entity BetterModel tracks.
ModelEngine's height resolver is consulted only for entities BetterModel does
not track; within that height fallback, ModelEngine is tried before
BetterModel's own height resolver.

## LuckPerms

Rank-gated nametags, picking the player's highest-weight group:

```yaml
staff_nametag:
  for: players
  ranks: [admin, moderator]
  layouts: [staff_layout]
```

And rank icons beside the name plate:

```yaml
texts:
  name:
    text-content: "<white>{entity_name}</white>"
    background: name_plate
    rank-decoration:
      gap: 2
      icons:
        admin: rank_admin_icon
        vip: rank_vip_icon
```

Without LuckPerms, `ranks:` definitions are skipped with a warning and
`rank-decoration` resolves no icon. See
[texts](/layouts/texts#rank-decoration).

## PlaceholderAPI

Reading PAPI in any text, condition or listener:

```yaml
text-content: "<gray>%vault_eco_balance%</gray>"
condition: "%mmocore_class% == 'Mage'"
listener:
  type: placeholder
  value: "%mmocore_stamina%"
  max: "%mmocore_max_stamina%"
```

`{papi:expr}` is an equivalent form.

The expression resolves against the **target** when the target is a player. On a
mob tag it resolves against the **viewer**.

Without PAPI installed, `%…%` returns an empty string in text, `0.0` in a
listener and `false` in a condition.

Because a PAPI expression can read the viewer, a layout using one is rendered
separately for each viewer rather than once for all of them. Use a
[built-in](/placeholders/built-in) where one exists, such as `{health}` in place
of `%player_health%`.

DreamTags also exposes `%dreamtags_scope%` and `%dreamtags_hidden%` to other
plugins. See
[built-in placeholders](/placeholders/built-in#what-dreamtags-exposes-to-other-plugins).

## CraftEngine and Nexo

Only one resource pack can be sent to a player, so DreamTags passes its content
to whichever of the two is installed and the server sends a single file. This is
automatic under [`pack.merge-into-external-pack: auto`](/config#pack).

## Adding your own

The API lets your plugin register placeholders, listeners, scopes, mob providers
and triggers.

Register a placeholder as **target-only** when it reads the tag's entity and
never the viewer, which keeps layouts using it on the shared render. A
placeholder registered without that declaration is assumed to depend on the
viewer. That assumption is correct in all cases but renders per viewer, which
costs more.

### Mana and level

A plugin that keeps its own mana or levels registers a provider, and every tag
reads it: `{mana}`, `{max_mana}`, `{mob_level}`, `{player_level}` and the
client mod's mana bar and level badge. Providers are asked before the bundled
hooks, first one that owns the entity wins. They are read from DreamTags'
async render pass, so answer from memory only.

```java
ResourceManager resources = DreamTags.inst().resourceManager();
Registration mana = resources.registerManaProvider(entity ->
        entity instanceof Player p ? new ManaResource(myMana(p), myMaxMana(p)) : null);
Registration level = resources.registerLevelProvider(entity ->
        entity instanceof Player p ? OptionalInt.of(myLevel(p)) : OptionalInt.empty());
// close both when your plugin disables
```

A mob provider can say a mob already shows its health its own way - a boss
bar - by overriding `TagMob#hasOwnHealthDisplay()`. That mob then gets no
health bar; its damage numbers still show.

### Custom effects

A plugin that runs its own statuses - a bleed, a burn - registers an effect
provider, and tags show them next to the vanilla potion effects. Every
provider is asked and their effects are shown together. Like the others it is
read from the async render pass.

```java
Registration effects = resources.registerEffectProvider(entity ->
        isBleeding(entity)
                ? List.of(new TagEffect("myplugin:bleed", 0, ticksLeft(entity), true))
                : List.of());
```

`TagEffect(key, amplifier, durationTicks, harmful)`: `durationTicks` is `-1`
for an effect with no end, and `harmful` picks the red or blue plate.

The icon is found by the key:

- **Packet tags**: the effect grid shows the image `<icon-prefix><path>` -
  `effect_bleed` for `myplugin:bleed`. The default pack ships `effect_bleed`
  and `effect_burn`; add an image with that id for any other key.
- **[Client mod](/guide/client-mod)**: the texture
  `<namespace>:textures/mob_effect/<path>.png` from the resource pack, so a
  server pack can add its own. Without one, the mod's built-in icon of that
  name (`bleed`, `burn`), and failing that a question mark. The name shown on
  the effect's popup is the translation `effect.<namespace>.<path>`, or the
  path.

### Hit kinds

A trigger can say what kind of hit it reports, whichever trigger id it uses:

```java
PopupTriggerInfo.builder(target)
        .amount(damage)
        .kind(HitKind.MAGIC)      // damage, critical, magic, true, hybrid, dot, heal, buff
        .color(0x6BBF3A)          // optional: the number's colour, e.g. a poison tick
        .build();
```

The kind is readable in layouts as `{hit_kind}`, and the
[client mod](/guide/client-mod) styles numbers by it. Kinds are open strings:
one DreamTags does not know is shown with its rendered text.
