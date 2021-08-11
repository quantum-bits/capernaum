# Create Fake Surveys

To create fake surveys:

1. ```bash
   create-test-responses.ts 10 foo.csv
   ```
    to output 10 responses to the file `foo.csv`
1. ```bash
   import-responses-to-qualtrics.sh foo.csv
    ```
   to import `foo.csv` into Qualtrics.
1. ```bash
   check-import-progress.sh <qualtrics-progress-id>
    ```
   to check on the import status.
   The `<qualtrics-progress-id>` is output by the import program.
   
# Automate the Process

To automate the process run
```bash
multiple-groups.sh
```
This program will create and import multiple group responses
into Qualtrics
based on the values in the `for` loop at the top.
It also illustrates how to use `jq`
to extract values from JSON responses returned by Qualtrics
and use those values later.
