#!/usr/bin/env bash

if [[ $# != 1 ]]
then
	echo "usage: $0 hostname"
	exit 1
fi

host=$1

ansible-playbook \
  --ask-become-pass \
  --limit $host \
  provision.yaml
