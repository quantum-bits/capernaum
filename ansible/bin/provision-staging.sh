#!/usr/bin/env bash

ansible-playbook \
  --ask-become-pass \
  --limit staging \
  provision.yaml
