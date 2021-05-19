#!/usr/bin/env bash

# Create and upload response files with various numbers of responses
# (given by the values in the `for N` loop).

# Pull in non-public configuration info. If there is a file `./.env`,
# source it into the shell. If it contains shell variable definitions,
# they will available later.
#
# In particular, if there is an EMAIL variable defined, include the
# `--email` flag when creating responses. This lets you force the email
# to be a particular value instead of a random one.
unset EMAIL
source ./.env
if [[ -v EMAIL ]]
then
  EMAIL_FLAG="--email $EMAIL"
else
  EMAIL_FLAG=""
fi

for N in 01 07 17
do
  figlet $N responses
  echo "== Create file with $N responses"
  FILE=foo.$N.csv
  yarn create-responses -n $N --gid GROUP$N $EMAIL_FLAG $FILE

  # Import the response file into Qualtrics, returning the progress ID from the returned JSON.
  echo "== Import $FILE into Qualtrics"
  Q_PROGRESS_ID=$(./import-responses-to-qualtrics.sh $FILE | jq --raw-output '.result.progressId')

  # Wait for the import to complete.
  until [[ $IMPORT_STATUS == "complete" ]]
  do
    echo "== Awaiting completion ($Q_PROGRESS_ID)"
    IMPORT_STATUS=$(./check-import-progress.sh $Q_PROGRESS_ID | jq --raw-output '.result.status')
  done
  echo == "Import of $FILE complete"
done
