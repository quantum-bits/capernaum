<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="headline">Groups</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table class="elevation-1" :headers="headers" :items="groups">
          <template v-slot:item.groupType="{ item }">
            {{ groupTypeName(item) }}
          </template>
          <template v-slot:item.responses="{ item }">
            {{ item.surveyResponses.length }}
          </template>
          <template v-slot:item.adminFullName="{ item }">
            {{ item.adminFirstName }} {{ item.adminLastName }}
          </template>
          <template v-slot:item.codeWord="{ item }">
            <samp>{{ item.codeWord }}</samp>
          </template>
          <template v-slot:item.created="{ item }">
            {{ item.created | epochToISO }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="confirmDelete(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <confirm-dialog
      v-model="deleteDialog.visible"
      dialog-title="Delete group?"
      :dialog-text="deleteDialogText"
      button-label="Delete"
      @confirmed="deleteGroup()"
    />
  </v-container>
</template>

<script>
import Vue from "vue";
import { ALL_GROUPS, DELETE_GROUP } from "@/graphql/groups.graphql";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

export default Vue.extend({
  name: "Groups",

  components: { ConfirmDialog },

  data() {
    return {
      groups: [],

      headers: [
        { text: "Group Name", value: "name" },
        { text: "Group Type", value: "groupType" },
        { text: "Group Code", value: "codeWord" },
        { text: "Responses", value: "responses" },
        { text: "Admin", value: "adminFullName" },
        { text: "Email", value: "adminEmail" },
        { text: "Survey", value: "survey.qualtricsName" },
        { text: "Created", value: "created" },
        { text: "Closed", value: "closedAfter" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      deleteDialog: {
        group: null,
        visible: false,
      },
    };
  },

  computed: {
    deleteDialogText() {
      return `Delete group '${this.deleteDialog.group?.name}'?  This can't be undone!`;
    },
  },

  apollo: {
    groups: {
      query: ALL_GROUPS,
      update: (data) => {
        return data.allGroups;
      },
    },
  },

  methods: {
    groupTypeName(group) {
      return group.type.code === "OTHER"
        ? `Other (${group.otherTypeName})`
        : group.type.name;
    },

    confirmDelete(group) {
      this.deleteDialog.group = group;
      this.deleteDialog.visible = true;
    },

    deleteGroup() {
      const id = this.deleteDialog.group.id;

      this.$apollo.mutate({
        mutation: DELETE_GROUP,
        variables: {
          groupId: id,
        },
      });

      this.groups = this.groups.filter((grp) => grp.id !== id);
    },
  },
});
</script>
