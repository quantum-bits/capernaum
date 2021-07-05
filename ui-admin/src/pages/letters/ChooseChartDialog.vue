<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="600">
    <v-form ref="chartForm" v-model="selectionValid" lazy-validation>
      <v-card>
        <v-card-title class="headline">Chart Letter Element</v-card-title>
        <v-card-text>
          Choose the dimension for the chart
          <v-select
            v-model="selectedSurveyDimension"
            :items="chartElements"
            :rules="[(v) => !!v || 'Chart type is required']"
            label="Type of Chart"
            return-object
            required
            persistent-hint
            single-line
          />
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="cancelChartSelection()"
            >Cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            :disabled="!selectionValid"
            text
            @click="submitChartSelection()"
            >Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { SelectedItem } from "@/pages/letters/Compose.vue";
import {
  SurveyLetters_surveyLetters,
  SurveyLetters_surveyLetters_survey_surveyDimensions,
} from "@/graphql/types/SurveyLetters";
import { CREATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";

export default Vue.extend({
  name: "ChooseChartDialog",

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      selectionValid: false,
      selectedSurveyDimension: null as null | SelectedItem,
      chartTypeElementId: -Infinity, //used when creating a chart type of letter element
    };
  },

  computed: {
    isDialogVisible(): boolean {
      return this.visible;
    },

    chartElements(): SelectedItem[] {
      // FIXME - Refactor to remove this check.
      if (!this?.surveyLetter?.survey) {
        return [];
      }
      return this.surveyLetter.survey.surveyDimensions.map(
        (
          surveyDimension: SurveyLetters_surveyLetters_survey_surveyDimensions
        ) => ({
          text: surveyDimension.title,
          value: surveyDimension.id,
        })
      );
    },
  },

  methods: {
    addChartElement(): void {
      //console.log("survey dimension id: ", this.selectedSurveyDimension.value);
      if (this.selectedSurveyDimension !== null) {
        // this object should not be null, since it is required in the form in order for it to be valid,
        // but typescript was giving an error
        const letterElements = this.surveyLetter.letter.letterElements;
        let maxSequence = -1; //assuming the max sequence will be 0 or greater....
        letterElements.forEach((letterElement) => {
          if (maxSequence < letterElement.sequence) {
            maxSequence = letterElement.sequence;
          }
        });
        let newSequence: number = maxSequence + 1;
        this.$apollo
          .mutate({
            mutation: CREATE_LETTER_ELEMENT_MUTATION,
            variables: {
              createInput: {
                sequence: newSequence,
                letterId: this.surveyLetter.letter.id,
                letterElementTypeId: this.chartTypeElementId,
                surveyDimensionId: this.selectedSurveyDimension.value,
              },
            },
          })
          .then(({ data }) => {
            console.log("done!", data);
            this.cancelChartSelection();
            //////////// FIXME this.refreshPage();
          })
          .catch((error) => {
            console.log("there appears to have been an error: ", error);
          });
      }
    },

    cancelChartSelection(): void {
      if (this.$refs.chartForm) {
        console.log("canceling chart selection....");
        (
          this.$refs.chartForm as Vue & {
            resetValidation: () => boolean;
          }
        ).resetValidation();
        (
          this.$refs.chartForm as Vue & {
            reset: () => boolean;
          }
        ).reset();
      } else {
        console.log("no form! ", this.$refs.chartForm);
      }
      this.selectionValid = true;
      this.selectedSurveyDimension = null;
      this.isDialogVisible = false;
      this.chartTypeElementId = -Infinity;
    },

    submitChartSelection(): void {
      //console.log("selected survey dimension: ", this.selectedSurveyDimension);
      console.log("chart form: ", this.$refs.chartForm);
      if (
        (this.$refs.chartForm as Vue & { validate: () => boolean }).validate()
      ) {
        console.log("chart form is valid!");
        this.addChartElement();
      } else {
        console.log("form is not valid!");
      }
    },
  },
});
</script>
