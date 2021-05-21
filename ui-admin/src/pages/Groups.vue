<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Groups</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="groups">
          <template v-slot:item.adminFullName="{ item }">
            {{ item.adminFirstName }} {{ item.adminLastName }}
          </template>
          <template v-slot:item.codeWord="{ item }">
            <samp>{{ item.codeWord }}</samp>
          </template>
          <template v-slot:item.created="{ item }">
            {{ item.created | epochToISO }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import { ALL_GROUPS } from "@/graphql/groups.graphql";

export default Vue.extend({
  name: "Groups",

  data() {
    return {
      groups: [],
      headers: [
        { text: "Group Name", value: "name" },
        { text: "Group Type", value: "groupType.name" },
        { text: "Group Code", value: "codeWord" },
        { text: "Admin", value: "adminFullName" },
        { text: "Email", value: "adminEmail" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Created", value: "created" },
        { text: "Closed", value: "closedAfter" },
      ],
    };
  },

  apollo: {
    groups: {
      query: ALL_GROUPS,
      update: (data) => {
        return data.allGroups;
      },
    },
  },
});
</script>
