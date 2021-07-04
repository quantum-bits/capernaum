<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="formFields.title"
      :rules="rules.required"
      label="Title"
    />

    <v-text-field
      v-model="formFields.description"
      :rules="rules.required"
      label="Description"
    />

    <slot v-bind:knobs="{ valid, submit }">
      <v-btn disabled="true">THIS WON'T WORK</v-btn>
    </slot>

    <snackbar :content="snackbarContent" />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ADD_LETTER_MUTATION,
  UPDATE_LETTER_MUTATION,
} from "@/graphql/letters.graphql";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import Snackbar from "@/components/Snackbar.vue";
import { AddLetter, AddLetterVariables } from "@/graphql/types/AddLetter";
import {
  UpdateLetter,
  UpdateLetterVariables,
} from "@/graphql/types/UpdateLetter";

export default Vue.extend({
  name: "LetterDetailsForm",

  components: { Snackbar },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      valid: true,
      isNew: false,

      formFields: {
        title: this.surveyLetter.letter.title,
        description: this.surveyLetter.letter.description,
      },

      rules: {
        required: [(v: string) => !!v || "Required"],
      },

      snackbarContent: "",
    };
  },

  methods: {
    validateForm() {
      return (this.$refs.form as Vue & { validate: () => boolean }).validate();
    },

    submit(): void {
      if (this.validateForm()) {
        if (this.isNew) {
          this.addLetter();
        } else {
          this.updateLetter();
        }
      } else {
        this.snackbarContent = "Your entry has problems.";
      }
    },

    addLetter(): void {
      this.$apollo
        .mutate<AddLetter, AddLetterVariables>({
          mutation: ADD_LETTER_MUTATION,
          variables: {
            createInput: {
              title: this.formFields.title,
              description: this.formFields.description,
              surveyId: this.surveyLetter.survey.id,
              letterTypeId: this.surveyLetter.letterType.id,
              emailMessage: JSON.stringify({
                ops: [],
              }),
            },
          },
        })
        .then((result) => {
          this.$emit("letter-created", result.data?.createLetter.id);
        })
        .catch((error) => {
          this.snackbarContent = `Sorry, there was error (${error})`;
        });
    },

    updateLetter() {
      this.$apollo
        .mutate<UpdateLetter, UpdateLetterVariables>({
          mutation: UPDATE_LETTER_MUTATION,
          variables: {
            letterData: {
              id: this.surveyLetter.letter.id,
              title: this.formFields.title,
              description: this.formFields.description,
            },
          },
        })
        .then((result) => {
          this.$emit("letter-info-updated", result.data?.updateLetter.id);
        })
        .catch((error) => {
          this.snackbarContent = `Sorry, there was error (${error})`;
        });
    },
  },

  // Credits:
  //   https://www.geeksforgeeks.org/what-is-negative-infinity-in-javascript/
  //   https://github.com/kaorun343/vue-property-decorator/issues/85
  //   https://stackoverflow.com/questions/34398279/map-and-filter-an-array-at-the-same-time
});
</script>
