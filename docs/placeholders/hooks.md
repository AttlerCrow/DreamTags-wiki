# From other plugins

DreamTags detects supported plugins at startup. Nothing is required — a missing
plugin is skipped and its classes are never loaded.

```
[DreamTags] MythicMobs support enabled.
[DreamTags] MMOCore support enabled.
```

An incompatible version logs a warning and the server keeps running on the
vanilla fallback.

| Plugin | What it adds |
| --- | --- |
| **MythicMobs** | `{mob_id}`, `{mob_level}`, `{is_mythic_mob}`, and `for: mythicmobs:<id>` selectors |
| **MMOCore** | Mana, `{player_level}` as class level, the `party` scope |
| **AuraSkills** | Mana |
| **MythicLib** | The `mythiclib_damage` and `mythiclib_crit_damage` triggers |
| **ModelEngine** | Tag height from the model's tallest bone |
| **BetterModel** | Height, plus anchoring to a tagged bone that follows animations |
| **LuckPerms** | `ranks:` on nametags, and `rank-decoration` icons |
| **PlaceholderAPI** | `%papi%` in any text, plus `%dreamtags_*%` for other plugins |
| **CraftEngine** / **Nexo** | Hands them the generated resource pack |

## MythicMobs

Registers a mob provider, which feeds the mob placeholders and enables
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

Mana. With both installed MMOCore wins under
[`resources.source: auto`](/config#resources).

## MythicLib

Adds `mythiclib_damage` and `mythiclib_crit_damage`, which report post-mitigation
RPG damage instead of the vanilla number.

Under [`popups.builtin-damage-triggers: auto`](/config#popups) it also **disables
the vanilla `damage` and `crit` triggers**, since it fires its own for the same
hit. List all four ids so one file works either way:

```yaml
triggers: [damage, crit, mythiclib_damage, mythiclib_crit_damage]
```

## ModelEngine and BetterModel

Both put the tag above a custom model instead of above the vanilla hitbox, which
otherwise leaves tags floating inside large models.

ModelEngine computes height from the blueprint's tallest bone. BetterModel does
that too, and anchors the tag to a bone named `TAG`, `MOB_TAG` or `PLAYER_TAG`,
falling back to the top of the `hitbox` bone. That anchor follows animations.

No configuration and no placeholders. With both installed, ModelEngine's height
resolver is consulted first.

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
`rank-decoration` never resolves an icon. See
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

`{papi:expr}` is the same thing.

The expression resolves against the **target** when the target is a player. On a
mob tag it resolves against the **viewer**.

Without PAPI installed, `%…%` returns an empty string in text, `0.0` in a
listener and `false` in a condition.

Because a PAPI expression can read the viewer, a layout using one is rendered
separately for each viewer instead of once for everybody. Use a
[built-in](/placeholders/built-in) where one exists — `{health}` rather than
`%player_health%`.

DreamTags also exposes `%dreamtags_scope%` and `%dreamtags_hidden%` to other
plugins. See
[built-in placeholders](/placeholders/built-in#what-dreamtags-exposes-to-other-plugins).

## CraftEngine and Nexo

Only one resource pack can be sent to a player. Instead of competing, DreamTags
hands its content to whichever is installed, so the server still sends one file.
Automatic under [`pack.merge-into-external-pack: auto`](/config#pack).

## Adding your own

The API lets your plugin register placeholders, listeners, scopes, mob providers
and triggers.

Register a placeholder as **target-only** when it reads the tag's entity and
never the viewer. That keeps layouts using it on the shared render. A placeholder
registered without that promise is assumed to depend on the viewer — safe, but
slower for everyone using it.
