# From other plugins

DreamTags detects supported plugins at startup and enables the matching
integration. Nothing is required — a missing plugin is simply skipped, and its
classes are never loaded.

The console tells you what happened:

```
[DreamTags] MythicMobs support enabled.
[DreamTags] MMOCore support enabled.
```

If an integration fails because of an incompatible version, you get a warning
and the server keeps running on the vanilla fallback.

## What each one adds

| Plugin | What it enables |
| --- | --- |
| **MythicMobs** | `{mob_id}`, `{mob_level}`, `{is_mythic_mob}`, and `for: mythicmobs:<id>` selectors |
| **MMOCore** | Mana, `{player_level}` as class level, and the `party` scope |
| **AuraSkills** | Mana |
| **MythicLib** | The `mythiclib_damage` and `mythiclib_crit_damage` triggers |
| **ModelEngine** | Tag height from the model's tallest bone |
| **BetterModel** | Height **and** anchoring to a tagged bone, following animations |
| **LuckPerms** | `ranks:` on nametags and `rank-decoration` icons |
| **PlaceholderAPI** | `%papi%` in patterns, plus `%dreamtags_*%` for other plugins |
| **CraftEngine** | Hands the generated pack to CraftEngine |
| **Nexo** | Hands the generated pack to Nexo |

---

## MythicMobs

Registers a mob provider, which feeds the mob placeholders and enables
provider-based [tag selectors](/tags#for-choosing-the-entities).

```yaml
# Every MythicMobs mob
mythic_tag:
  for: mythicmobs
  layouts: [default_layout]

# One specific boss
boss_tag:
  for: mythicmobs:skeletalboss
  layouts: [boss_layout]
```

```yaml
texts:
  name:
    pattern: "<gold>{mob_id}</gold> <yellow>Lv.{mob_level}</yellow>"
    condition: "{mob_level} > 0"
```

## MMOCore

Three things: mana (from the `MAX_MANA` stat), `{player_level}` as the class
level rather than the vanilla XP level, and a **`party` scope** so players can
share nametags or damage numbers with their party only.

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

Mana. With both installed, MMOCore wins under
[`resources.source: auto`](/config#resources); pin one explicitly if you want the
other.

## MythicLib

Adds `mythiclib_damage` and `mythiclib_crit_damage`, which report the real
post-mitigation RPG damage rather than the vanilla number.

::: danger It switches the vanilla triggers off
Under [`popups.builtin-damage-triggers: auto`](/config#popups) — the default —
installing MythicLib **disables** the vanilla `damage` and `crit` triggers,
because it fires its own for the same hit and you would get two numbers per
swing.

List all four ids so one file works either way:

```yaml
triggers: [damage, crit, mythiclib_damage, mythiclib_crit_damage]
```
:::

## ModelEngine and BetterModel

Both make a tag sit above a **custom model** rather than above the vanilla
hitbox, which otherwise leaves tags floating inside or below large models.

- **ModelEngine** computes the height from the blueprint's tallest bone.
- **BetterModel** does that too, and additionally anchors the tag to a bone
  named `TAG`, `MOB_TAG` or `PLAYER_TAG` — falling back to the top of the
  `hitbox` bone. That anchor follows animations, so a tag rides the model as it
  moves.

No configuration and no placeholders: it just applies. With both installed,
ModelEngine's height resolver is consulted first.

## LuckPerms

Enables two features:

**Rank-gated nametags** — a different design per group, choosing the player's
highest-weight one:

```yaml
staff_nametag:
  for: players
  ranks: [admin, moderator]
  layouts: [staff_layout]
```

**Rank icons** beside the name plate:

```yaml
texts:
  name:
    pattern: "<white>{entity_name}</white>"
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

Works in both directions.

**Reading PAPI** in any pattern, condition or listener:

```yaml
pattern: "<gray>%vault_eco_balance%</gray>"
condition: "%mmocore_class% == 'Mage'"
listener:
  type: placeholder
  value: "%mmocore_stamina%"
  max: "%mmocore_max_stamina%"
```

`{papi:expr}` is the same thing written differently.

**Context:** the expression resolves against the **target** when the target is a
player. On a mob tag, where the target is not a player, it resolves against the
**viewer** instead.

Without PAPI installed, `%…%` returns an empty string in text, `0.0` in a
listener and `false` in a condition — so a layout using it degrades rather than
breaking.

::: warning PAPI costs a shared render
`%papi%` may read the viewer, so DreamTags cannot prove the tag is the same for
everyone. Any layout using one is rendered **per viewer** instead of once.

Use [built-ins](/placeholders/built-in) where an equivalent exists — `{health}`
rather than `%player_health%`.
:::

**Exposing to PAPI:** `%dreamtags_scope%` and `%dreamtags_hidden%` are readable
from any other plugin. See
[built-in placeholders](/placeholders/built-in#what-dreamtags-exposes-to-other-plugins).

## CraftEngine and Nexo

Both solve the same problem: only one resource pack can be sent to a player.

Instead of competing, DreamTags hands its generated content to whichever of them
is installed, so the server still sends a single file. This is automatic under
[`pack.merge-into-external-pack: auto`](/config#pack).

## Adding your own

The plugin exposes an API for registering placeholders, listeners, scopes, mob
providers and triggers from your own plugin.

::: tip Declare target-only placeholders
When registering a placeholder that reads only the tag's entity and never the
viewer, register it as **target-only**. That lets layouts using it keep the
shared render instead of falling back to per-viewer.

A placeholder registered without that promise is assumed to depend on the viewer
— safe, but slower for everyone using it.
:::
