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
cap-cli/0.0.0 darwin-x64 node-v14.17.0
$ cap-cli --help [COMMAND]
USAGE
  $ cap-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cap-cli group:list [FILE]`](#cap-cli-grouplist-file)
* [`cap-cli help [COMMAND]`](#cap-cli-help-command)
* [`cap-cli org:show`](#cap-cli-orgshow)
* [`cap-cli query`](#cap-cli-query)
* [`cap-cli responses:get SURVEY-ID [RESPONSE-ID]`](#cap-cli-responsesget-survey-id-response-id)
* [`cap-cli subscription:create PUBLICATION-URL TOPICS SURVEY-ID`](#cap-cli-subscriptioncreate-publication-url-topics-survey-id)
* [`cap-cli subscription:delete ID`](#cap-cli-subscriptiondelete-id)
* [`cap-cli subscription:get ID`](#cap-cli-subscriptionget-id)
* [`cap-cli subscription:list`](#cap-cli-subscriptionlist)
* [`cap-cli survey:get SURVEYID`](#cap-cli-surveyget-surveyid)
* [`cap-cli survey:list`](#cap-cli-surveylist)

## `cap-cli group:list [FILE]`

describe the command here

```
USAGE
  $ cap-cli group:list [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/group/list.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/group/list.ts)_

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

## `cap-cli org:show`

show Qualtrics organization

```
USAGE
  $ cap-cli org:show
```

_See code: [src/commands/org/show.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/org/show.ts)_

## `cap-cli query`

run a GraphQL query

```
USAGE
  $ cap-cli query
```

_See code: [src/commands/query.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/query.ts)_

## `cap-cli responses:get SURVEY-ID [RESPONSE-ID]`

get responses

```
USAGE
  $ cap-cli responses:get SURVEY-ID [RESPONSE-ID]

ARGUMENTS
  SURVEY-ID
  RESPONSE-ID  Get only this response

OPTIONS
  --end-date=end-date      last date to fetch
  --start-date=start-date  first date to fetch
```

_See code: [src/commands/responses/get.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/responses/get.ts)_

## `cap-cli subscription:create PUBLICATION-URL TOPICS SURVEY-ID`

create a subscription

```
USAGE
  $ cap-cli subscription:create PUBLICATION-URL TOPICS SURVEY-ID

ARGUMENTS
  PUBLICATION-URL  Fully qualified URL; must accept POST request

  TOPICS           Subscribe to topics: activate-survey, deactivate-survey, started-session, partial-response,
                   completed-response

  SURVEY-ID
```

_See code: [src/commands/subscription/create.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/subscription/create.ts)_

## `cap-cli subscription:delete ID`

delete a subscription

```
USAGE
  $ cap-cli subscription:delete ID

ARGUMENTS
  ID  Subscription ID (SUB_...)
```

_See code: [src/commands/subscription/delete.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/subscription/delete.ts)_

## `cap-cli subscription:get ID`

get a single subscription

```
USAGE
  $ cap-cli subscription:get ID

ARGUMENTS
  ID  Subscription ID (SUB_...)
```

_See code: [src/commands/subscription/get.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/subscription/get.ts)_

## `cap-cli subscription:list`

list subscriptions

```
USAGE
  $ cap-cli subscription:list
```

_See code: [src/commands/subscription/list.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/subscription/list.ts)_

## `cap-cli survey:get SURVEYID`

get survey by ID

```
USAGE
  $ cap-cli survey:get SURVEYID

ARGUMENTS
  SURVEYID  survey ID (SV_...)

OPTIONS
  -v, --verbose  verbose output
```

_See code: [src/commands/survey/get.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/survey/get.ts)_

## `cap-cli survey:list`

describe the command here

```
USAGE
  $ cap-cli survey:list

OPTIONS
  --by-date
```

_See code: [src/commands/survey/list.ts](https://github.com/quantum-bits/capernaum/blob/v0.0.0/src/commands/survey/list.ts)_
<!-- commandsstop -->
