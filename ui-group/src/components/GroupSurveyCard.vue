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
        :value="codeWord"
        @input="updateCodeWord"
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
        @click="takeGroupSurvey"
      >
        Go to survey
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FIND_GROUP } from "@/graphql/groups.graphql";
import { debounce } from "lodash";

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
    codeWord: async function (newValue) {
      this.codeWordValid = false;
      this.alert.visible = newValue.length > 0;

      const group = await this.findGroupByCodeWord();
      if (group) {
        this.alert.type = "success";
        this.alert.text = `That's the code for: <strong>${group.name}</strong>.`;
        this.codeWordValid = true;
      } else {
        this.alert.type = "warning";
        this.alert.text = "That code doesn't match any group.";
      }
    },
  },

  methods: {
    updateCodeWord: debounce(function (this: any, value: string) {
      this.codeWord = value;
    }, 500),

    takeGroupSurvey() {
      console.log("go to group survey");
    },

    findGroupByCodeWord() {
      console.log(`Search for '${this.codeWord}'`);
      return this.$apollo
        .query({
          query: FIND_GROUP,
          variables: { codeWord: this.codeWord },
        })
        .then((result) => result.data.findGroupByCodeWord);
    },
  },
});
</script>

<style scoped>
.button-colour {
  color: #4e2b4d;
}
</style>
