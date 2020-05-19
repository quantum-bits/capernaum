#!/usr/bin/env bash

# Should already be running an SSH session to galilee-port-forward.

ansible-playbook \
  --ask-become-pass \
  --limit production \
  provision.yaml
