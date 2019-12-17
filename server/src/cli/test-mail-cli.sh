#!/usr/bin/env bash -x

DEBUG=* DEBUG_DEPTH=4 \
	ts-node \
	./mail-cli.ts \
	--from="tom@nurknet.com" \
	--to="tom.nurkkala@gmail.com" \
	--subject="Hello" \
	--message="Hello, world"
