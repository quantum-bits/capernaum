#!/usr/bin/env bash -x

DEBUG=* DEBUG_DEPTH=4 \
	ts-node \
	./mail-cli.ts \
	--from="tom@nurknet.com" \
	--to="tom.nurkkala@gmail.com" \
	--subject="Hello" \
	--text="Hello, world" \
	--html="<p><b>Hello</b>, <i>world</i>." \
	--attachment="$(PWD)/test-mail-cli.sh"

