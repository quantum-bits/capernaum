#!/usr/bin/env bash

# Create and upload response files with various numbers of responses
# (given by the values in the `for N` loop).

for N in 01 07 17
do
  figlet $N responses
  echo "== Create file with $N responses"
  FILE=foo.$N.csv
  yarn create-responses -n $N --gid GROUP$N $FILE

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
