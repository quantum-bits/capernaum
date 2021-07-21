<template>
  <v-container>
    <v-card>
      <v-card-title>Letter Details</v-card-title>
      <static-info-list :info="staticInfo" />

      <v-card-text>
        <v-form ref="form" v-model="valid" :disabled="!inEditMode">
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
        <edit-save-delete-cancel-buttons
          :is-data-dirty="isDataDirty"
          :is-data-valid="valid"
          @enter-edit-mode="inEditMode = true"
          @leave-edit-mode="inEditMode = false"
          @backup-data="backupFormFields"
          @restore-data="restoreFormFields"
          @persist-data="persistFormFields"
        />
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
import * as _ from "lodash";
import EditSaveDeleteCancelButtons from "@/components/buttons/EditSaveCancelButtons.vue";

interface LetterDetailsForm {
  title: string;
  description: string;
}

type VueExt = Vue & {
  $refs: {
    snackbar: { trigger: (s: string) => void };
    form: { validate: () => boolean };
  };
};

export default (Vue as VueConstructor<VueExt>).extend({
  name: "LetterDetailsForm",

  components: {
    EditSaveDeleteCancelButtons,
    StaticInfoList,
    Snackbar,
  },

  props: {
    surveyLetter: {
      type: Object as () => SurveyLetters_surveyLetters,
      required: true,
    },
  },

  data() {
    return {
      valid: true,

      inEditMode: false,

      formFields: {
        title: this.surveyLetter.letter.title,
        description: this.surveyLetter.letter.description,
      } as LetterDetailsForm,

      formFieldsBackup: {} as LetterDetailsForm,

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

    isDataDirty(): boolean {
      return !_.isEqual(this.formFields, this.formFieldsBackup);
    },
  },

  methods: {
    backupFormFields() {
      this.formFieldsBackup = _.cloneDeep(this.formFields);
    },

    restoreFormFields() {
      this.formFields = _.cloneDeep(this.formFieldsBackup);
    },

    validateForm() {
      return this.$refs.form.validate();
    },

    triggerSnackbar(content: string) {
      this.$refs.snackbar.trigger(content);
    },

    persistFormFields(): void {
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
