<template>
  <element-card :title="title" :sub-title="element.id" :card-data="cardData">
    <v-select
      :disabled="!inEditMode"
      label="Select a survey dimension"
      :items="availableDimensions"
      v-model="selectedDimensionId"
    />

    <template v-slot:actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        @enter-edit-mode="inEditMode = true"
        @leave-edit-mode="inEditMode = false"
        :is-data-valid="selectedDimensionId !== null"
        :is-data-dirty="selectedDimensionId !== savedDimensionId"
        @backup-data="savedDimensionId = selectedDimensionId"
        @restore-data="selectedDimensionId = savedDimensionId"
        @persist-data="saveDimension"
      />
    </template>
  </element-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  SurveyLetters_surveyLetters_letter_letterElements,
  SurveyLetters_surveyLetters_survey_surveyDimensions,
} from "@/graphql/types/SurveyLetters";
import ElementCard from "@/pages/letters/elements/ElementCard.vue";
import { CardData } from "@/pages/letters/LetterContentTab.vue";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";
import {
  UpdateLetterElement,
  UpdateLetterElementVariables,
} from "@/graphql/types/UpdateLetterElement";
import { UPDATE_LETTER_ELEMENT_MUTATION } from "@/graphql/letters.graphql";
import * as _ from "lodash";

interface Selection {
  text: string;
  value: number;
}

export default Vue.extend({
  name: "DimensionChartElement",

  components: { EditSaveDeleteCancelButtons, ElementCard },

  props: {
    element: {
      type: Object as () => SurveyLetters_surveyLetters_letter_letterElements,
      required: true,
    },
    cardData: { type: Object as () => CardData, required: true },
  },

  data() {
    return {
      inEditMode: false,
      selectedDimensionId: this.element.surveyDimension?.id as number | null,
      savedDimensionId: null as number | null,
    };
  },

  computed: {
    availableDimensions(): Selection[] {
      return this.cardData.surveyLetter.survey.surveyDimensions.map((dim) => ({
        text: dim.title,
        value: dim.id,
      }));
    },

    selectedDimension():
      | SurveyLetters_surveyLetters_survey_surveyDimensions
      | undefined {
      if (this.selectedDimensionId) {
        return _.find(
          this.cardData.surveyLetter.survey.surveyDimensions,
          (dim) => dim.id === this.selectedDimensionId
        );
      }
      return undefined;
    },

    title(): string {
      return `Dimension Chart (${
        this.selectedDimension ? this.selectedDimension.title : "none"
      })`;
    },
  },

  methods: {
    saveDimension() {
      this.$apollo
        .mutate<UpdateLetterElement, UpdateLetterElementVariables>({
          mutation: UPDATE_LETTER_ELEMENT_MUTATION,
          variables: {
            updateInput: {
              id: this.element.id,
              surveyDimensionId: this.selectedDimensionId,
            },
          },
        })
        .then((result) => console.log(result))
        .catch((error) => {
          console.error(`Save failed: ${error}`);
          throw error;
        });
    },
  },
});
</script>
