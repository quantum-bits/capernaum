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
          <v-form>
            <v-checkbox v-model="okayForGroup" label="Okay for group?" />
            <v-text-field
              v-model="publicName"
              label="Public name (for group use)"
            />
            <v-text-field
              v-model="detailedDescription"
              label="Detailed description (for group use)"
            />
          </v-form>
        </v-card-text>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary">Update</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { AllCapernaumSurveys_surveys } from "@/graphql/types/AllCapernaumSurveys";
import StaticInfoList, {
  StaticInfoItem,
} from "@/components/lists/StaticInfoList.vue";

export default Vue.extend({
  name: "SurveyDetailTab",

  components: { StaticInfoList },

  props: {
    survey: {
      type: Object as () => AllCapernaumSurveys_surveys,
      required: true,
    },
  },

  data() {
    return {
      okayForGroup: this.survey.okayForGroup,
      publicName: this.survey.publicName,
      detailedDescription: this.survey.detailedDescription,
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
  },
});
</script>
