#!/usr/bin/env bash

QUALTRICS_BASE_URL='https://taylorcfse.ca1.qualtrics.com/API/v3'
QUALTRICS_API_TOKEN='NxUnm3Bd9ohFKd6PA4t1AxTu2L63PgbRRLuzktv7'
QUALTRICS_SURVEY_ID='SV_0NyRAwZoSOSKPoW'
FILE_NAME=bogus-file.csv

if (( $# != 1 ))
then
  echo "usage: $0 <csv-file-name>"
  exit 1
else
  FILE_NAME=$1
fi

curl \
 --silent \
 --request POST \
 --header "X-API-TOKEN: $QUALTRICS_API_TOKEN" \
 --header 'Content-Type: text/csv; charset=UTF-8' \
 --data-binary @"$FILE_NAME" \
 "$QUALTRICS_BASE_URL/surveys/$QUALTRICS_SURVEY_ID/import-responses" | jq
