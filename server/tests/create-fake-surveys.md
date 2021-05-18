# Create Fake Surveys

To create fake surveys:

1. Run 
   ```bash
   create-test-responses.ts 10 foo.csv
   ```
    to output 10 responses to the file `foo.csv`
1. Run
    ```bash
   import-responses-to-qualtrics.sh foo.csv
    ```
   to import `foo.csv` into Qualtrics.
1. Run
    ```bash
   check-import-progress.sh <qualtrics-progress-id>
    ```
   to check on the import status.
   The `<qualtrics-progress-id>` is output by the import utility.