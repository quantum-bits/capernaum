<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Thank you for registering your group!</h2>
        <v-row>
          <v-col>
            <v-card elevation="2" outlined shaped tile>
              <v-card-title>
                What's next?
              </v-card-title>
              <v-card-text class="text-sm-left">
                <p>
                  You should shortly receive an email confirming your
                  registration. The email includes:
                </p>
                <ol>
                  <li>
                    The <strong>group code</strong> that your group members will
                    need to take the survey.
                  </li>
                  <li>
                    <strong>Instructions</strong> that you can share with your
                    group members about how get started with the survey.
                  </li>
                </ol>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CompletePage",
});
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

a {
  color: #42b983;
}
</style>
