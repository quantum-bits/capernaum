<template>
  <v-container>
    <v-layout row wrap>
      <v-dialog
        v-model="createUpdateSEPracticeDialog"
        persistent
        max-width="600"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title class="headline"
              >Scripture Engagement Practice</v-card-title
            >
            <v-card-text>
              <v-text-field
                v-model="scriptureEngagementPracticeTitle"
                label="Title"
                :rules="titleRules"
                :counter="50"
                outlined
                required
                persistent-hint
              ></v-text-field>
              <v-text-field
                v-model="scriptureEngagementPracticeDescription"
                label="Description"
                :rules="descriptionRules"
                :counter="120"
                outlined
                required
                persistent-hint
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="green darken-1" text @click="cancelDialog()"
                >Cancel</v-btn
              >
              <v-btn
                color="green darken-1"
                :disabled="!valid"
                text
                @click="submitSEPractice()"
                >Submit</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-flex xs9>
        <h1 class="headline mb-5">Scripture Engagement Practices</h1>
      </v-flex>
      <v-flex xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="newSEPractice">
          New SE Practice
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="scriptureEngagementPractices"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <!--<td class="text-xs-right">{{ item.description }}</td>-->
              <td class="text-xs-right">{{ item.title }}</td>
              <td class="text-xs-right">{{ item.description }}</td>
              <td class="text-xs-right">
                <v-btn text v-on:click="editSEPractice(item)">
                  Edit
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

//import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue";

import {
  ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY,
  ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION
} from "@/graphql/scripture-engagement-practices.graphql";
import {
  ScriptureEngagementPractices,
  ScriptureEngagementPractices_scriptureEngagementPractices
} from "@/graphql/types/ScriptureEngagementPractices";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "ScriptureEngagementPractices",

  props: {},
  components: {
    //ConfirmDeleteDialog
  },
  data() {
    return {
      headers: [
        {
          text: "Scripture Engagement Practice",
          align: "left",
          sortable: true,
          value: "title"
        },
        {
          text: "Description",
          align: "left",
          sortable: false,
          value: "description"
        },
        { text: "Action", sortable: false }
      ],
      scriptureEngagementPractices: [] as ScriptureEngagementPractices_scriptureEngagementPractices[],
      createUpdateSEPracticeDialog: false,
      valid: true,
      scriptureEngagementPracticeTitle: "",
      scriptureEngagementPracticeDescription: "",
      editOn: false, //true when editing an existing SE practice (as opposed to creating a new one)
      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters"
      ],
      descriptionRules: [
        (v: any) => !!v || "Description is required",
        (v: any) =>
          (v && v.length <= 120) ||
          "Description must be fewer than 120 characters"
      ]
    };
  },

  methods: {
    newSEPractice() {
      console.log("new SE practice!");
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
      this.scriptureEngagementPracticeTitle = "";
      this.scriptureEngagementPracticeDescription = "";
      this.editOn = false;
      this.createUpdateSEPracticeDialog = true;
    },
    editSEPractice(
      practice: ScriptureEngagementPractices_scriptureEngagementPractices
    ) {
      console.log("edit SE practice!");
      this.editOn = true;
      this.scriptureEngagementPracticeTitle = practice.title;
      this.scriptureEngagementPracticeDescription = practice.description;
      this.createUpdateSEPracticeDialog = true;
    },
    cancelDialog() {
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
      this.scriptureEngagementPracticeTitle = "";
      this.scriptureEngagementPracticeDescription = "";
      this.editOn = false;
      this.createUpdateSEPracticeDialog = false;
    },
    refetchSEPracticeData() {
      this.$apollo.queries.scriptureEngagementPractices
        .refetch()
        .then(({ data }) => {
          console.log("survey data refetched! ", data);
        });
    },
    submitSEPractice() {
      if ((this.$refs.form as any).validate()) {
        console.log("save info");
        if (!this.editOn) {
          // create new SE practice
          let maxSequence = 0;
          this.scriptureEngagementPractices.forEach(
            (
              practice: ScriptureEngagementPractices_scriptureEngagementPractices
            ) => {
              if (practice.sequence > maxSequence) {
                maxSequence = practice.sequence;
              }
            }
          );
          let newSequence = maxSequence + 1;
          this.$apollo
            .mutate({
              mutation: ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
              variables: {
                createInput: {
                  sequence: newSequence,
                  title: this.scriptureEngagementPracticeTitle,
                  description: this.scriptureEngagementPracticeDescription
                }
              }
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDialog();
              this.refetchSEPracticeData();
              //this.cancelIndexDialog();
            })
            .catch(error => {
              console.log("there appears to have been an error: ", error);
              (this.$refs.form as any).resetValidation();
              //this.serverError = true;
              //this.serverError = true
            });
        } else {
          // update existing SE practice
        }
      }
    }
  },

  apollo: {
    scriptureEngagementPractices: {
      query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY,
      update(scriptureEngagementPractices: ScriptureEngagementPractices) {
        console.log(
          "letter data: ",
          scriptureEngagementPractices.scriptureEngagementPractices
        );

        return scriptureEngagementPractices.scriptureEngagementPractices;
      }
    }
  },

  computed: {},

  mounted() {
    console.log("mounted....");
  }
});
</script>
