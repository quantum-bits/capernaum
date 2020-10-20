#!/usr/bin/env bash

SURVEY_ID='SV_xxx'
RESPONSE_ID='R_xxx'

curl \
  --location \
  --request POST 'https://galilee.cse.taylor.edu/qualtrics/completed-response' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode "SurveyID=$SURVEY_ID" \
  --data-urlencode "ResponseID=$RESPONSE_ID"

echo "Requested response '$RESPONSE_ID' for survey '$SURVEY_ID'"
