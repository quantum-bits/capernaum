<template>
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
                  <v-list-item @click="$emit('delete', item.id)">
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

              <v-list-item v-if="item.surveyId">
                <v-list-item-content>Survey Name</v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ surveyNameById.get(item.surveyId) }}
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content> Successful Calls </v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ item.successfulCalls }}
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list-item v-if="item.surveyId">
                <v-list-item-content>Survey ID</v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ item.surveyId }}
                </v-list-item-content>
              </v-list-item>

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
</template>

<script lang="ts">
import Vue from "vue";
import { EnhancedSubscription } from "@/types/qualtrics.types";

export default Vue.extend({
  name: "WebHookCards",

  props: {
    qualtricsSubscriptions: {
      type: Array as () => EnhancedSubscription[],
      required: true,
    },
    surveyNameById: {
      required: true,
    },
  },
});
</script>
