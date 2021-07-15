<template>
  <element-card :title="title" :card-data="cardData">
    <v-select
      :disabled="!inEditMode"
      label="Select a survey dimension"
      :items="dimensionSelections"
      v-model="selectedDimension"
    />

    <template v-slot:actions>
      <v-spacer />
      <edit-save-delete-cancel-buttons
        @enter-edit-mode="inEditMode = true"
        @leave-edit-mode="inEditMode = false"
        :is-data-valid="selectedDimension !== null"
        :is-data-dirty="selectedDimension !== savedDimension"
        @backup-data="savedDimension = selectedDimension"
        @restore-data="selectedDimension = savedDimension"
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
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";
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
      selectedDimension:
        (this.element.surveyDimension
          ?.id as SurveyLetters_surveyLetters_survey_surveyDimensions) || null,
      savedDimension: null,
    };
  },

  computed: {
    title(): string {
      const dimension = _.find(
        this.cardData.surveyLetter.survey.surveyDimensions,
        (dim) => dim.id === this.selectedDimension
      );
      const dimensionTitle = dimension ? dimension.title : "none";
      return `Dimension Chart (${dimensionTitle})`;
    },

    dimensionSelections(): Selection[] {
      return this.cardData.surveyLetter.survey.surveyDimensions.map((dim) => ({
        text: dim.title,
        value: dim.id,
      }));
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
              surveyDimensionId: this.selectedDimension,
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
