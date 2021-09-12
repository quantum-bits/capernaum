#!/usr/bin/env bash

SQL_FILE="cap-db-$(date --iso-8601=seconds).sql"

echo Dump to $SQL_FILE
pg_dump capernaum > $SQL_FILE

echo Compress
gzip $SQL_FILE
