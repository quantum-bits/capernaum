<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <h2>Take the Christian Life Survey</h2>
        <v-row>
          <v-col cols="12" md="6" lg="4">
            <individual-survey-card />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <group-survey-card />
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <register-group-card />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IndividualSurveyCard from "@/components/IndividualSurveyCard.vue";
import RegisterGroupCard from "@/components/RegisterGroupCard.vue";
import GroupSurveyCard from "@/components/GroupSurveyCard.vue";

export default Vue.extend({
  name: "LandingPage",

  components: {
    IndividualSurveyCard,
    GroupSurveyCard,
    RegisterGroupCard,
  },
});
</script>

<style scoped lang="scss">
.button-colour {
  color: #4e2b4d;
}

h3 {
  margin: 40px 0 0;
}

a {
  color: #42b983;
}
</style>
