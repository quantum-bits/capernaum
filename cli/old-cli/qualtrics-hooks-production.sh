#!/usr/bin/env bash -x

BASE_URL="https://galilee.cse.taylor.edu"

CMD="ts-node ./qualtrics-cli.ts create-subscription"
CONTROLLER="qualtrics"

$CMD $BASE_URL/$CONTROLLER/activate-survey activate-survey
$CMD $BASE_URL/$CONTROLLER/deactivate-survey deactivate-survey

PROTO_CLS_V3="SV_8BxiCgiYGfWY2Xz"

$CMD $BASE_URL/$CONTROLLER/completed-response completed-response $PROTO_CLS_V3
