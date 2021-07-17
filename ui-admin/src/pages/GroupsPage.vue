<template>
  <v-container>
    <page-header title="Groups" />
    <v-row>
      <v-col>
        <v-data-table class="elevation-1" :headers="headers" :items="groups">
          <template v-slot:item.name="{ item }">
            <router-link
              :to="{
                name: 'responses',
                params: {
                  surveyId: item.survey.id,
                  groupId: item.id,
                },
              }"
            >
              {{ item.name }}
            </router-link>
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
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="confirmDelete(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:item.closedAfter="{ item }">
            {{ item.closedAfter | standardDate }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-chip
              small
              :color="isClosed(item.closedAfter) ? 'primary' : 'success'"
            >
              {{ isClosed(item.closedAfter) ? "Closed" : "Open" }}
            </v-chip>
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

<script lang="ts">
import Vue from "vue";
import { ALL_GROUPS, DELETE_GROUP } from "@/graphql/groups.graphql";
import { DateTime } from "luxon";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import PageHeader from "@/pages/PageHeader.vue";
import { AllGroups, AllGroups_groups } from "@/graphql/types/AllGroups";

export default Vue.extend({
  name: "GroupsPage",

  components: { ConfirmDialog, PageHeader },

  data() {
    return {
      groups: [] as AllGroups_groups[],

      headers: [
        { text: "Group Name", value: "name" },
        { text: "Group Code", value: "codeWord" },
        { text: "Admin", value: "adminFullName" },
        { text: "Email", value: "adminEmail" },
        { text: "Status", value: "status" },
        { text: "Responses", value: "responses", align: "end" },
        { text: "Closed After", value: "closedAfter" },
        { text: "Actions", value: "actions", sortable: false },
      ],

      deleteDialog: {
        group: null as unknown as AllGroups_groups,
        visible: false,
      },
    };
  },

  computed: {
    deleteDialogText(): string {
      return `Delete group '${this.deleteDialog.group?.name}'?  This can't be undone!`;
    },
  },

  apollo: {
    groups: {
      query: ALL_GROUPS,
    },
  },

  methods: {
    groupTypeName(group: AllGroups_groups) {
      return group.type.code === "OTHER"
        ? `Other (${group.otherTypeName})`
        : group.type.name;
    },

    isClosed(closedAfterDate: string): boolean {
      const now = DateTime.now();
      const closedAfter = DateTime.fromISO(closedAfterDate);
      return closedAfter < now;
    },

    confirmDelete(group: AllGroups_groups) {
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