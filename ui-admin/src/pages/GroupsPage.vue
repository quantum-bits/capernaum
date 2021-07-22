<template>
  <v-container>
    <page-header title="Group Responses">
      <v-col cols="1">
        <v-progress-circular v-if="spinnerVisible" indeterminate />
      </v-col>
    </page-header>
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
            <icon-button
              icon-name="mdi-adobe-acrobat"
              tool-tip="Create group PDF report"
              @click="generatePDF(item)"
            />
            <icon-button
              icon-name="mdi-delete"
              tool-tip="Delete group"
              @click="confirmDelete(item)"
            />
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

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.visible = false"
          >Close</v-btn
        >
      </template>
    </v-snackbar>

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
import { AllGroups_groups } from "@/graphql/types/AllGroups";
import IconButton from "@/components/buttons/IconButton";
import * as _ from "lodash";
import {
  WriteLetter,
  WriteLetter_writeLetter as LetterWriterOutput,
  WriteLetterVariables,
} from "@/graphql/types/WriteLetter";
import { WRITE_LETTER_MUTATION } from "@/graphql/letters.graphql";

export default Vue.extend({
  name: "GroupsPage",

  components: { IconButton, ConfirmDialog, PageHeader },

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

      letterWriterOutput: {} as LetterWriterOutput,

      deleteDialog: {
        group: null as unknown as AllGroups_groups,
        visible: false,
      },

      snackbar: {
        visible: false,
        text: "",
      },

      spinnerVisible: false,
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

    showSpinner() {
      this.spinnerVisible = true;
    },

    hideSpinner() {
      this.spinnerVisible = false;
    },

    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    generatePDF(group: AllGroups_groups) {
      const surveyLetter = _.find(
        group.survey.surveyLetters,
        (surveyLetter) => surveyLetter.letterType.key === "group"
      );
      if (!surveyLetter) {
        this.showSnackbar("No group letter for this survey");
        return;
      }

      this.showSpinner();
      this.$apollo
        .mutate<WriteLetter, WriteLetterVariables>({
          mutation: WRITE_LETTER_MUTATION,
          variables: {
            writerInput: {
              letterId: surveyLetter.letter.id,
              responseOrGroupId: group.id,
            },
          },
        })
        .then((response) => {
          if (response.data) {
            const writeLetter = response.data.writeLetter;
            this.showSnackbar(writeLetter.message);
            if (writeLetter.responseSummary) {
              this.letterWriterOutput = writeLetter;
            }
          }
        })
        .catch((error) => {
          console.error("generatePDF error", error);
        })
        .finally(() => {
          this.hideSpinner();
        });
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
