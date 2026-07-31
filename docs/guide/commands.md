# Commands & permissions

All subcommands of `/dreamtags`.

## For everyone

| Command | Permission | What it does |
| --- | --- | --- |
| `/dreamtags` | — | Status: platform, NMS version, health bars and layouts loaded |
| `/dreamtags hide` | `dreamtags.toggle` | Hides other players' nametags for you |
| `/dreamtags show` | `dreamtags.toggle` | Shows them again |
| `/dreamtags scope <scope>` | `dreamtags.scope` | Who can see your nametag |
| `/dreamtags indicators` | `dreamtags.indicators` | Your damage-number audience and the options |
| `/dreamtags indicators <scope>` | `dreamtags.indicators` | Changes it |

`hide`, `scope`, `indicators` and the test commands are player-only.

### hide vs scope

| I want to | Command | Decided by |
| --- | --- | --- |
| stop seeing other people's nametags | `/dreamtags hide` | the person looking |
| control who sees my nametag | `/dreamtags scope <scope>` | the person wearing it |

`hide` affects only you. With `nametags.show-self: true` it does not hide your
own nametag, only other people's.

### Scopes

| Scope | Meaning |
| --- | --- |
| `global` | Everyone nearby. The default for nametags |
| `solo` | Only you. The default for damage indicators |
| `none` | Nobody, not even you |
| `party` | Your party. Requires MMOCore |

Plugins can register their own; they appear in tab completion automatically.

## Admin

| Command | Permission | What it does |
| --- | --- | --- |
| `/dreamtags reload` | `dreamtags.admin` | Reloads config and packs |
| `/dreamtags pack` | `dreamtags.admin` | Rebuilds the resource pack |
| `/dreamtags debug` | `dreamtags.admin` | Spawns a packet-only display 3 blocks away for 5 seconds |
| `/dreamtags testeffects` | `dreamtags.admin` | Test pig with every vanilla potion effect applied one by one |
| `/dreamtags testeffectsplayer` | `dreamtags.admin` | The same on yourself |

The test commands apply the effects directly, for checking a buff row without
collecting potions.

## Permission defaults

| Permission | Default |
| --- | --- |
| `dreamtags.admin` | operators |
| `dreamtags.toggle` | everyone |
| `dreamtags.scope` | everyone |
| `dreamtags.indicators` | everyone |

## Reloading

`/dreamtags reload` re-reads `config.yml` and every pack without a restart,
including the `systems:` switches. A file with an error is skipped with a
warning and everything else continues to load.

The resource pack is rebuilt as part of the reload. Players need to re-download
it to see new textures; `/dreamtags pack` only regenerates the file on disk.
