<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Events</h2>
        <v-data-table :headers="headers" :items="allEvents" class="elevation-1">
          <template v-slot:item.date="{ item }">
            {{ item.date | formatDate }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL_EVENTS_QUERY,
  NEW_EVENTS_SUBSCRIPTION
} from "@/graphql/events.graphql";
import { DateTime } from "luxon";

export default Vue.extend({
  name: "Events",

  apollo: {
    allEvents: {
      query: ALL_EVENTS_QUERY,
      update: data => data.events,
      subscribeToMore: {
        document: NEW_EVENTS_SUBSCRIPTION,
        updateQuery: (previousQueryResult, { subscriptionData }) => {
          console.log("PREVIOUS", previousQueryResult);
          console.log("SUB DATA", subscriptionData);
        }
      }
    }
  },

  data() {
    return {
      allEvents: [],

      headers: [
        { text: "Date", value: "date" },
        { text: "Type", value: "type" },
        { text: "Details", value: "details" }
      ]
    };
  },

  filters: {
    formatDate(epochSeconds: string) {
      return DateTime.fromMillis(parseInt(epochSeconds)).toFormat("y-M-d tt");
    }
  }
});
</script>
