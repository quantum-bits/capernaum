<template>
  <v-container>
    <v-card>
      <v-card-title>Letter Details</v-card-title>
      <static-info-list :info="staticInfo" />

      <v-card-text>
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
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <edit-save-cancel-buttons />
      </v-card-actions>
    </v-card>

    <snackbar ref="snackbar" />
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { UPDATE_LETTER_MUTATION } from "@/graphql/letters.graphql";
import { SurveyLetters_surveyLetters } from "@/graphql/types/SurveyLetters";
import Snackbar from "@/components/Snackbar.vue";
import {
  UpdateLetter,
  UpdateLetterVariables,
} from "@/graphql/types/UpdateLetter";
import StaticInfoList, {
  StaticInfoItem,
} from "@/components/lists/StaticInfoList.vue";
import EditSaveCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";

type VueExt = Vue & {
  $refs: {
    snackbar: { trigger: (s: string) => void };
    form: { validate: () => boolean };
  };
};

export default (Vue as VueConstructor<VueExt>).extend({
  name: "LetterDetailsCard",

  components: { EditSaveCancelButtons, StaticInfoList, Snackbar },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      valid: true,

      formFields: {
        title: this.surveyLetter.letter.title,
        description: this.surveyLetter.letter.description,
      },

      rules: {
        required: [(v: string) => !!v || "Required"],
      },
    };
  },

  computed: {
    staticInfo(): StaticInfoItem[] {
      return [
        {
          name: "Survey",
          value: this.surveyLetter.survey.qualtricsName,
        },
        {
          name: "Letter Type",
          value: this.surveyLetter.letterType.description,
        },
      ];
    },
  },

  methods: {
    validateForm() {
      return this.$refs.form.validate();
    },

    triggerSnackbar(content: string) {
      this.$refs.snackbar.trigger(content);
    },

    submit(): void {
      if (this.validateForm()) {
        this.updateLetter();
      } else {
        this.triggerSnackbar("Your entry has problems.");
      }
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
          this.triggerSnackbar("Letter updated successfully");
          this.$emit("letter-info-updated", result.data?.updateLetter.id);
        })
        .catch((error) => {
          this.triggerSnackbar(`Sorry, there was error (${error})`);
        });
    },
  },

  // Credits:
  //   https://www.geeksforgeeks.org/what-is-negative-infinity-in-javascript/
  //   https://github.com/kaorun343/vue-property-decorator/issues/85
  //   https://stackoverflow.com/questions/34398279/map-and-filter-an-array-at-the-same-time
});
</script>
