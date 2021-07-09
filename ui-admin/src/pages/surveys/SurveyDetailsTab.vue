<template>
  <v-card>
    <v-row>
      <v-col>
        <v-card-title>Qualtrics Information</v-card-title>
        <static-info-list :info="staticInfo" />
      </v-col>
      <v-col>
        <v-card-title>Group Settings</v-card-title>
        <v-card-text>
          <v-form
            v-model="formValid"
            ref="groupDetailForm"
            :disabled="!inEditMode"
          >
            <v-checkbox
              v-model="groupDetails.okayForGroup"
              label="Okay for group?"
              @change="resetValidation"
            />
            <v-text-field
              v-model="groupDetails.publicName"
              label="Public name"
              :rules="[requiredForGroup]"
            />
            <v-text-field
              v-model="groupDetails.detailedDescription"
              label="Detailed description"
              :rules="[requiredForGroup]"
            />
          </v-form>
        </v-card-text>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer />
      <edit-save-cancel-buttons
        :is-data-dirty="isDataDirty"
        :is-data-valid="formValid"
        @enterEditMode="inEditMode = true"
        @leaveEditMode="inEditMode = false"
        @backupData="saveUndoDetails"
        @restoreData="restoreUndoDetails"
        @persistData="saveDetails"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import StaticInfoList, {
  StaticInfoItem,
} from "@/components/lists/StaticInfoList.vue";
import {
  UpdateSurvey,
  UpdateSurveyVariables,
} from "@/graphql/types/UpdateSurvey";
import { UPDATE_SURVEY } from "@/graphql/surveys.graphql";
import * as _ from "lodash";
import EditSaveCancelButtons from "@/components/buttons/EditSaveDeleteCancelButtons.vue";

interface GroupDetails {
  okayForGroup: boolean;
  publicName: string;
  detailedDescription: string;
}

export default Vue.extend({
  name: "SurveyDetailsTab",

  components: { StaticInfoList, EditSaveCancelButtons },

  props: {
    survey: {
      type: Object as () => AllCapernaumSurveys_surveys,
      required: true,
    },
  },

  data() {
    return {
      formValid: false,
      inEditMode: false,

      groupDetails: {
        okayForGroup: this.survey.okayForGroup,
        publicName: this.survey.publicName,
        detailedDescription: this.survey.detailedDescription,
      } as GroupDetails,

      undoDetails: {} as GroupDetails,
    };
  },

  computed: {
    staticInfo(): StaticInfoItem[] {
      return [
        { name: "Qualtrics Name", value: this.survey.qualtricsName },
        { name: "Qualtrics ID", value: this.survey.qualtricsId },
        { name: "Qualtrics Mod Date", value: this.survey.qualtricsModDate },
      ];
    },

    isDataDirty(): boolean {
      return !_.isEqual(this.undoDetails, this.groupDetails);
    },

    saveButtonEnabled(): boolean {
      return this.formValid && this.groupDetails.okayForGroup;
    },
  },

  methods: {
    requiredForGroup(v: string) {
      if (this.groupDetails.okayForGroup) {
        return !!v || "Required for a group";
      } else {
        return true;
      }
    },

    // TODO: Man, is this ever ugly.
    resetValidation() {
      (
        this.$refs.groupDetailForm as Vue & {
          resetValidation: () => boolean;
        }
      ).resetValidation();
    },

    saveUndoDetails() {
      this.undoDetails = _.cloneDeep(this.groupDetails);
    },

    restoreUndoDetails() {
      this.groupDetails = _.cloneDeep(this.undoDetails);
    },

    saveDetails() {
      this.$apollo
        .mutate<UpdateSurvey, UpdateSurveyVariables>({
          mutation: UPDATE_SURVEY,
          variables: {
            updateInput: {
              id: this.survey.id,
              okayForGroup: this.groupDetails.okayForGroup,
              publicName: this.groupDetails.publicName,
              detailedDescription: this.groupDetails.detailedDescription,
            },
          },
        })
        .then((result) => console.log(result));
    },
  },
});
</script>
