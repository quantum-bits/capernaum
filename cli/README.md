cap-cli
=======

Capernaum CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cap-cli.svg)](https://npmjs.org/package/cap-cli)
[![Downloads/week](https://img.shields.io/npm/dw/cap-cli.svg)](https://npmjs.org/package/cap-cli)
[![License](https://img.shields.io/npm/l/cap-cli.svg)](https://github.com/quantum-bits/capernaum/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cap-cli
$ cap-cli COMMAND
running command...
$ cap-cli (-v|--version|version)
cap-cli/0.0.0 darwin-x64 node-v14.15.3
$ cap-cli --help [COMMAND]
USAGE
  $ cap-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cap-cli help [COMMAND]`](#cap-cli-help-command)
* [`cap-cli org:show [FILE]`](#cap-cli-orgshow-file)
* [`cap-cli query`](#cap-cli-query)

## `cap-cli help [COMMAND]`

display help for cap-cli

```
USAGE
  $ cap-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `cap-cli org:show [FILE]`

describe the command here

```
USAGE
  $ cap-cli org:show [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/org/show.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/org/show.ts)_

## `cap-cli query`

run a GraphQL query

```
USAGE
  $ cap-cli query
```

_See code: [src/commands/query.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/query.ts)_
<!-- commandsstop -->
