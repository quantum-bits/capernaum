#!/usr/bin/env bash -x

#BASE_URL="https://galilee.cse.taylor.edu"
BASE_URL="http://295ab2dc.ngrok.io"

CMD="ts-node ./qualtrics-cli.ts create-subscription"
CONTROLLER="qualtrics"

#$CMD $BASE_URL/$CONTROLLER/activate-survey activate-survey
#$CMD $BASE_URL/$CONTROLLER/deactivate-survey deactivate-survey

TEST_TEST_TEST_ID="SV_eVEifZuD4I9u80l"
PROTO_CLS_V3="SV_8BxiCgiYGfWY2Xz"

# $CMD $BASE_URL/$CONTROLLER/started-session started-session $TEST_SURVEY_ID
# $CMD $BASE_URL/$CONTROLLER/partial-response partial-response $TEST_SURVEY_ID
$CMD $BASE_URL/$CONTROLLER/completed-response completed-response $PROTO_CLS_V3
