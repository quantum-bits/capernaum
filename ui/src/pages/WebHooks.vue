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
        <v-data-iterator :items="qualtricsSubscriptions">
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card>
                  <v-toolbar>
                    <v-toolbar-title>
                      {{ item.subscriptionType }}
                    </v-toolbar-title>
                    <v-spacer />
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="removeSubscription(item.id)">
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-toolbar>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>Hostname</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.url.hostname }}
                      </v-list-item-content>
                    </v-list-item>
                    <template v-if="item.surveyId">
                      <v-list-item>
                        <v-list-item-content>Survey ID</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.surveyId }}
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Survey Name</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ surveyNameById.get(item.surveyId) }}
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <v-list-item>
                      <v-list-item-content>
                        Successful Calls
                      </v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.successfulCalls }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item>
                      <v-list-item-content>Subscription ID</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.id }}
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
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
import { QualtricsListSubscriptions_qualtricsListSubscriptions } from "@/graphql/types/QualtricsListSubscriptions";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";

type CategoryType = "controlpanel" | "surveyengine";
type SubscriptionType =
  | "activateSurvey"
  | "deactivateSurvey"
  | "completedResponse";

interface QualtricsSubscription
  extends QualtricsListSubscriptions_qualtricsListSubscriptions {
  categoryType: CategoryType;
  subscriptionType: SubscriptionType;
  surveyId?: string;
  url: {
    protocol: string;
    hostname: string;
    path: string;
  };
}

type StringToStringMap = Map<string, string>;

export default Vue.extend({
  name: "WebHooks",

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
