<template>
  <v-container>
    <v-row class="align-baseline justify-space-between">
      <v-col>
        <h1 class="headline">Web Hooks</h1>
      </v-col>
      <v-col>
        <h4 class="subtitle-1">{{ qualtricsOrganization.name }}</h4>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <web-hook-cards :qualtrics-subscriptions="qualtricsSubscriptions" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h1 class="headline">Machines</h1>
        <machine-cards></machine-cards>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>

    <v-bottom-sheet v-model="bottomSheet.visible" inset>
      <v-sheet class="text-center" height="200px">
        <v-btn
          class="my-6"
          color="success"
          @click="bottomSheet.visible = false"
        >
          <v-icon left>mdi-close</v-icon>
          Close
        </v-btn>
        <div>{{ bottomSheet.content }}</div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  QUALTRICS_LIST_SUBSCRIPTIONS,
  QUALTRICS_ORG_QUERY,
  QUALTRICS_REMOVE_SUBSCRIPTION
} from "@/graphql/qualtrics.graphql";

import URLParse from "url-parse";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import WebHookCards from "@/components/WebHookCards.vue";
import {
  CategoryType,
  QualtricsSubscription,
  SubscriptionType
} from "@/types/qualtrics.types";
import MachineCards from "@/components/MachineCards.vue";

type StringToStringMap = Map<string, string>;

export default Vue.extend({
  name: "WebHooks",

  components: { WebHookCards, MachineCards },

  apollo: {
    qualtricsOrganization: {
      query: QUALTRICS_ORG_QUERY
    },

    surveyNameById: {
      query: ALL_SURVEYS_QUERY,
      update: data => {
        const nameById: StringToStringMap = new Map();
        data.surveys.forEach((survey: Survey) =>
          nameById.set(survey.qualtricsId, survey.qualtricsName)
        );
        return nameById;
      }
    },

    qualtricsSubscriptions: {
      query: QUALTRICS_LIST_SUBSCRIPTIONS,
      update: data => {
        const subscriptions: QualtricsSubscription[] =
          data.qualtricsListSubscriptions;

        for (const subscription of subscriptions) {
          const [catType, subType, surveyId] = subscription.topics.split(".");
          subscription.categoryType = catType as CategoryType;
          subscription.subscriptionType = subType as SubscriptionType;
          if (subscription.categoryType === "surveyengine") {
            subscription.surveyId = surveyId;
          }

          const url = new URLParse(subscription.publicationUrl);
          subscription.url = {
            protocol: url.protocol,
            hostname: url.hostname,
            path: url.pathname
          };
        }
        console.log("UPDATE", subscriptions);
        return subscriptions;
      }
    }
  },

  data() {
    return {
      qualtricsOrganization: {},
      qualtricsSubscriptions: [] as QualtricsSubscription[],
      surveyNameById: {} as StringToStringMap,

      snackbar: {
        text: "",
        visible: false
      },

      bottomSheet: {
        content: "",
        visible: false
      }
    };
  },

  methods: {
    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    showBottomSheet(content: string) {
      this.bottomSheet.content = content;
      this.bottomSheet.visible = true;
    },

    removeSubscription(subscriptionId: string) {
      this.$apollo
        .mutate({
          mutation: QUALTRICS_REMOVE_SUBSCRIPTION,
          variables: {
            subscriptionId
          }
        })
        .then(httpStatus => {
          console.log("STATUS", httpStatus);
          this.qualtricsSubscriptions = this.qualtricsSubscriptions.filter(
            subscription => subscription.id !== subscriptionId
          );
          this.showSnackbar("Subscription removed");
        })
        .catch(error => this.showSnackbar(error));
    }
  }
});
</script>
