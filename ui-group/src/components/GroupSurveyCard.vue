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
    // Watch for changes to the code word field and check for a matching group.
    codeWord() {
      this.findGroupByCodeWord();
    },
  },

  created() {
    // In principle, we should be able to debounce a method or watcher,
    // but doing it directly causes problems for TypeScript's idea of `this`.
    // The approach here (from https://vuejs.org/v2/guide/computed.html#Watchers)
    // keeps the method clean and clarifies how it's being debounced.
    this.findGroupByCodeWord = debounce(this.findGroupByCodeWord, 500);
  },

  methods: {
    // Look for a group with the given code word. As with the example from
    // https://vuejs.org/v2/guide/computed.html#Watchers, do all the actions
    // inside this function. The initial version of this function just returned
    // a group or `null`, but the combination of async and debouncing proved
    // problematic to get right. It may be possible, but this works and is
    // reasonably clean.
    findGroupByCodeWord() {
      // console.log(`Search for '${this.codeWord}'`);
      this.$apollo
        .query<FindGroup, FindGroupVariables>({
          query: FIND_GROUP,
          variables: { codeWord: this.codeWord.trim() },
        })
        .then((result) => {
          const group = result.data.findGroupByCodeWord;
          // console.log("GROUP", group);

          if (group) {
            this.alert.type = "success";
            this.alert.text = `That's the code for: <strong>${group.name}</strong>.`;
            this.codeWordValid = true;
          } else {
            this.alert.type = "warning";
            this.alert.text = "That code doesn't match any group.";
            this.codeWordValid = false;
          }

          this.alert.visible = this.codeWord.trim().length > 0;
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
      group_survey_url.searchParams.append("GROUP_CODE_WORD", this.codeWord.trim());
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
