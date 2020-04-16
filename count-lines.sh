#!/usr/bin/env bash

# Get a rough line count.

SOURCE_REGEX='\.vue$|\.ts$|\.sql$'
DIRECTORIES='server/src ui/src ansible server/fixtures'

for dir in $DIRECTORIES
do
	ag -g $SOURCE_REGEX $dir
done | grep -v 'ui/src/graphql/types'
