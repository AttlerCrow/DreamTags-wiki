# Commands & permissions

All commands are subcommands of `/dreamtags`.

## For everyone

| Command | Permission | What it does |
| --- | --- | --- |
| `/dreamtags` | — | Status: platform, NMS version, number of health bars and layouts loaded |
| `/dreamtags hide` | `dreamtags.toggle` | Hides other players' nametags **for you**. Nobody else is affected |
| `/dreamtags show` | `dreamtags.toggle` | Shows them again |
| `/dreamtags scope <scope>` | `dreamtags.scope` | Who can see **your** nametag |
| `/dreamtags indicators` | `dreamtags.indicators` | Shows your current damage-number audience and the available options |
| `/dreamtags indicators <scope>` | `dreamtags.indicators` | Changes who sees the damage numbers **you** deal |

`hide`, `scope`, `indicators` and the two test commands are player-only.

### hide vs scope

These two are easy to mix up because both sound like "turn off my nametags".

| I want to… | Command | Decided by |
| --- | --- | --- |
| stop **seeing** other people's nametags | `/dreamtags hide` | the person looking |
| control who sees **my** nametag | `/dreamtags scope <scope>` | the person wearing it |

`/dreamtags hide` affects only you; everyone else keeps seeing each other
normally.

::: tip
With `nametags.show-self: true`, hiding nametags does **not** hide your own —
`hide` only suppresses other people's.
:::

### Scopes

| Scope | Meaning |
| --- | --- |
| `global` | Everyone nearby can see you. Default for nametags |
| `solo` | Only you. Default for damage indicators |
| `none` | Nobody, not even you |
| `party` | Your party — requires MMOCore |

Other plugins can register their own scopes, and they appear in the tab
completion automatically.

## For administrators

| Command | Permission | What it does |
| --- | --- | --- |
| `/dreamtags reload` | `dreamtags.admin` | Reloads `config.yml` and every pack, reporting the result in chat |
| `/dreamtags pack` | `dreamtags.admin` | Rebuilds the resource pack (asynchronously) and reports the file count and destination |
| `/dreamtags debug` | `dreamtags.admin` | Spawns a packet-only text display 3 blocks away for 5 seconds |
| `/dreamtags testeffects` | `dreamtags.admin` | Spawns a test pig and applies every vanilla potion effect to it, one every 0.3 s, then removes them |
| `/dreamtags testeffectsplayer` | `dreamtags.admin` | The same, on yourself. You are made temporarily invulnerable; invisibility is applied last |

The two `testeffects` commands are for checking a buff row design without
hunting for potions.

## Permission defaults

| Permission | Default |
| --- | --- |
| `dreamtags.admin` | operators |
| `dreamtags.toggle` | everyone |
| `dreamtags.scope` | everyone |
| `dreamtags.indicators` | everyone |

## Reloading

`/dreamtags reload` re-reads `config.yml` and every pack without a restart,
including the master switches in `systems:`. If a file has an error, that entry
is skipped with a warning in the console and the rest keeps working — so a typo
in one layout never takes the whole plugin down.

The resource pack is rebuilt as part of the reload. Players need to re-download
it to see new or changed textures; `/dreamtags pack` alone only regenerates the
file on disk.
