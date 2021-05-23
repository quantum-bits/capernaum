<template>
  <v-card elevation="2" outlined shaped tile>
    <v-card-title> Take Group Survey </v-card-title>
    <v-card-text class="text-sm-left">
      Take the Christian Life Survey as part of a group. Select this option if
      you are part of a group, and your group leader has provided you with a
      code.

      <v-text-field
        class="mt-4"
        color="#4e2b4d"
        v-model="codeWord"
        label="Your Group Code"
        hint="Provided to you by your leader"
        persistent-hint
        required
        outlined
      />
    </v-card-text>

    <v-alert
      v-if="alert.visible"
      v-html="alert.text"
      class="mx-4"
      :type="alert.type"
    />

    <v-divider class="mx-4" />

    <v-card-actions>
      <v-btn
        class="button-colour"
        text
        :disabled="!codeWordValid"
        :href="groupSurveyUrl"
      >
        Go to survey
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FIND_GROUP } from "@/graphql/groups.graphql";
// eslint-disable-next-line no-unused-vars
import { debounce } from "lodash";
// eslint-disable-next-line no-unused-vars
import { FindGroup, FindGroupVariables } from "@/graphql/types/FindGroup";

export default Vue.extend({
  name: "GroupSurveyCard",

  data() {
    return {
      codeWord: "",
      codeWordValid: false,

      alert: {
        visible: false,
        type: "warning",
        text: "",
      },
    };
  },

  watch: {
    async codeWord() {
      this.findGroupByCodeWord();
    },
  },

  created() {
    this.findGroupByCodeWord = debounce(this.findGroupByCodeWord, 500);
  },

  methods: {
    findGroupByCodeWord: function () {
      console.log(`Search for '${this.codeWord}'`);

      this.$apollo
        .query<FindGroup, FindGroupVariables>({
          query: FIND_GROUP,
          variables: { codeWord: this.codeWord },
        })
        .then((result) => {
          const group = result.data.findGroupByCodeWord;
          console.log("GROUP", group);

          if (group) {
            this.alert.type = "success";
            this.alert.text = `That's the code for: <strong>${group.name}</strong>.`;
            this.codeWordValid = true;
          } else {
            this.alert.type = "warning";
            this.alert.text = "That code doesn't match any group.";
            this.codeWordValid = false;
          }

          this.alert.visible = this.codeWord.length > 0;
        });
    },
  },

  computed: {
    groupSurveyUrl(): string {
      const survey_url = process.env.SURVEY_URL;
      if (!survey_url) {
        console.error("No URL configured for group survey");
        return "";
      }

      const group_survey_url = new URL(survey_url);
      group_survey_url.searchParams.append("GROUP_CODE_WORD", this.codeWord);
      return group_survey_url.toString();
    },
  },
});
</script>

<style scoped>
.button-colour {
  color: #4e2b4d;
}
</style>
