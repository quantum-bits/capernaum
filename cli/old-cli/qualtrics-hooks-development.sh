#!/usr/bin/env bash -x

BASE_URL="http://295ab2dc.ngrok.io"
SURVEY_ID="SV_eVEifZuD4I9u80l"

CMD="ts-node ./qualtrics-cli.ts create-subscription"
CONTROLLER="qualtrics"

$CMD $BASE_URL/$CONTROLLER/activate-survey activate-survey
$CMD $BASE_URL/$CONTROLLER/deactivate-survey deactivate-survey

$CMD $BASE_URL/$CONTROLLER/completed-response completed-response $SURVEY_ID
