#!/usr/bin/env bash -x

QUALTRICS_BASE_URL='https://taylorcfse.ca1.qualtrics.com/API/v3'
QUALTRICS_API_TOKEN='NxUnm3Bd9ohFKd6PA4t1AxTu2L63PgbRRLuzktv7'
QUALTRICS_SURVEY_ID='SV_0NyRAwZoSOSKPoW'

curl \
 -X POST \
 -H "X-API-TOKEN: $QUALTRICS_API_TOKEN" \
 -H 'Content-Type: text/csv; charset=UTF-8' \
 --data-binary '@foo.csv' \
 "$QUALTRICS_BASE_URL/surveys/$QUALTRICS_SURVEY_ID/import-responses" | jq
