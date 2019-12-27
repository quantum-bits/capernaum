<template>
  <v-row>
    <v-col>
      <ol>
        <li>
          Survey ({{ writeLetter.responseSummary.surveySummary.id }} -
          {{ writeLetter.responseSummary.surveySummary.qualtricsId }})
          <ul>
            <li>Title {{ writeLetter.responseSummary.surveySummary.title }}</li>
            <li>
              Q Name
              {{ writeLetter.responseSummary.surveySummary.qualtricsName }}
            </li>
          </ul>
        </li>
        <li>
          Response ({{ writeLetter.responseSummary.id }} -
          {{ writeLetter.responseSummary.qualtricsResponseId }})
          <ul>
            <li>Status {{ writeLetter.ok ? "OK" : "FAILED" }}</li>
            <li>Date {{ writeLetter.responseSummary.date }}</li>
            <li>Email {{ writeLetter.responseSummary.email }}</li>
            <li>
              <a :href="writeLetter.pdfFilePath" target="_blank">PDF File </a>
            </li>
          </ul>
        </li>
        <li>
          Dimensions
          <ol>
            <li
              v-for="dim in writeLetter.responseSummary.dimensionSummaries"
              :key="dim.id"
            >
              (ID {{ dim.id }}) {{ dim.title }}
              <ol>
                <li v-for="index in dim.indexSummaries" :key="index.id">
                  ({{ index.id }} - {{ index.abbreviation }})
                  {{ index.title }} =
                  {{ index.meanResponse }}
                  <ol>
                    <li v-for="item in index.itemSummaries" :key="item.id">
                      ({{ item.id }} {{ item.qualtricsId }})
                      {{ item.qualtricsText }} ({{ item.responseId }}) =
                      {{ item.responseValue }} - {{ item.responseLabel }}
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </li>
        <li>
          Predictions
          <ol>
            <li
              v-for="prediction in writeLetter.responseSummary
                .predictionSummaries"
              :key="prediction.practiceSummary.id"
            >
              ({{ prediction.practiceSummary.id }})
              {{ prediction.practiceSummary.title }}
              {{ prediction.predict ? "PREDICT" : "DON'T PREDICT" }}
              <ol>
                <li
                  v-for="details in prediction.predictionDetails"
                  :key="details.abbreviation"
                >
                  {{ details.title }}
                  ({{ details.abbreviation }})
                  {{ details.meanResponse }}
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { WriteLetter_writeLetter as LetterWriterOutput } from "@/graphql/types/WriteLetter";

export default Vue.extend({
  name: "ResponseSummary",

  props: {
    writeLetter: Object as () => LetterWriterOutput
  }
});
</script>
