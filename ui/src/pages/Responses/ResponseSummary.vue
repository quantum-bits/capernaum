<template>
  <v-row>
    <v-col>
      <ol>
        <li>
          Survey ({{ responseSummary.responseSummary.surveySummary.id }} -
          {{ responseSummary.responseSummary.surveySummary.qualtricsId }})
          <ul>
            <li>
              Title {{ responseSummary.responseSummary.surveySummary.title }}
            </li>
            <li>
              Q Name
              {{ responseSummary.responseSummary.surveySummary.qualtricsName }}
            </li>
          </ul>
        </li>
        <li>
          Response ({{ responseSummary.responseSummary.id }} -
          {{ responseSummary.responseSummary.qualtricsResponseId }})
          <ul>
            <li>Status {{ responseSummary.ok ? "OK" : "FAILED" }}</li>
            <li>Date {{ responseSummary.responseSummary.date }}</li>
            <li>Email {{ responseSummary.responseSummary.email }}</li>
            <li>
              <a :href="responseSummary.pdfFilePath" target="_blank"
                >PDF File
              </a>
            </li>
          </ul>
        </li>
        <li>
          Dimensions
          <ol>
            <li
              v-for="dim in responseSummary.responseSummary.dimensionSummaries"
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
              v-for="prediction in responseSummary.responseSummary
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
import { WriteLetter_writeLetter } from "@/graphql/types/WriteLetter";

export default Vue.extend({
  name: "ResponseSummary",

  props: {
    responseSummary: Object as () => WriteLetter_writeLetter
  }
});
</script>
