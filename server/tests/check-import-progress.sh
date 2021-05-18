#!/usr/bin/env bash

QUALTRICS_BASE_URL='https://taylorcfse.ca1.qualtrics.com/API/v3'
QUALTRICS_API_TOKEN='NxUnm3Bd9ohFKd6PA4t1AxTu2L63PgbRRLuzktv7'
QUALTRICS_SURVEY_ID='SV_0NyRAwZoSOSKPoW'
QUALTRICS_PROGRESS_ID="bogus-value"

if (( $# != 1 ))
then
  echo "usage: $0 <qualtrics-progress-id>"
  exit 1
else
  QUALTRICS_PROGRESS_ID=$1
fi

curl \
 --silent \
 --header "X-API-TOKEN: $QUALTRICS_API_TOKEN" \
 "$QUALTRICS_BASE_URL/surveys/$QUALTRICS_SURVEY_ID/import-responses/$QUALTRICS_PROGRESS_ID" | jq
