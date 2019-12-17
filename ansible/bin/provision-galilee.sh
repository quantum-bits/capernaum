#!/usr/bin/env bash

ansible-playbook \
  --ask-become-pass \
  --limit galilee-via-tunnel \
  provision.yaml
