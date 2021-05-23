<template>
  <v-card elevation="2" outlined shaped tile>
    <v-card-title> Register Your Group </v-card-title>
    <v-card-text class="text-sm-left">
      Register your group to take the Christian Life Survey. You will receive
      summary data about your group after they have completed the survey.
    </v-card-text>
    <v-divider class="mx-4" />
    <v-card-actions>
      <v-btn class="button-colour" text @click="registerGroup">
        Register Group
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "RegisterGroupCard",

  methods: {
    registerGroup() {
      this.$router.push({ name: "group-sign-up" });
    },
  },
});
</script>

<style scoped>
.button-colour {
  color: #4e2b4d;
}
</style>
