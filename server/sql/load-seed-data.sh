#!/usr/bin/env bash

# Load seed data into the database.

psql --file=seed-data.sql capernaum 
