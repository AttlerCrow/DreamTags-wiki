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
