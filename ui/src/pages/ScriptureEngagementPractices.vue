<template>
  <v-container>
    <v-layout row wrap>
      <v-dialog
        v-model="createUpdateSEPracticeDialog"
        persistent
        max-width="800"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title class="headline"
              >Scripture Engagement Practice
            </v-card-title>
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
              <v-textarea
                v-model="scriptureEngagementPracticeDescription"
                label="Description"
                :rules="descriptionRules"
                outlined
                required
                persistent-hint
              ></v-textarea>
              <v-text-field
                v-model="moreInfoUrl"
                label="Scripture Engagement Website URL"
                :rules="urlRules"
                hint="e.g., https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home"
                outlined
                required
                persistent-hint
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="green darken-1" text @click="cancelDialog()"
                >Cancel
              </v-btn>
              <v-btn
                color="green darken-1"
                :disabled="!valid"
                text
                @click="submitSEPractice()"
                >Submit
              </v-btn>
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
                <!-- https://stackoverflow.com/questions/40899532/how-to-pass-a-value-from-vue-data-to-href -->
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a
                      class="no-underline"
                      :href="item.moreInfoUrl"
                      target="_blank"
                      v-on="on"
                    >
                      <v-icon>
                        {{ "mdi-link-variant" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>Check the linked page for this SE Practice.</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <a @click="editSEPractice(item)" v-on="on">
                      <v-icon>
                        {{ "mdi-pencil" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>Edit this SE Practice.</span>
                </v-tooltip>
                <v-tooltip v-if="item.canDelete" top>
                  <template v-slot:activator="{ on }">
                    <a @click="deleteSEPractice(item)" v-on="on">
                      <v-icon>
                        {{ "mdi-close-circle" }}
                      </v-icon>
                    </a>
                  </template>
                  <span>Delete this SE Practice.</span>
                </v-tooltip>
                <v-tooltip v-else top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="grey--text text--lighten-1">
                      {{ "mdi-close-circle" }}
                    </v-icon>
                  </template>
                  <span
                    >This SE Practice cannot be deleted because it has boolean
                    associations</span
                  >
                </v-tooltip>
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
import {
  ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
  ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY,
  DELETE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
  UPDATE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION
} from "@/graphql/scripture-engagement-practices.graphql";
import {
  ScriptureEngagementPractices,
  ScriptureEngagementPractices_scriptureEngagementPractices
} from "@/graphql/types/ScriptureEngagementPractices";

//import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog.vue";

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
        { text: "Actions", sortable: false }
      ],
      scriptureEngagementPracticeData: [] as ScriptureEngagementPractices_scriptureEngagementPractices[],
      createUpdateSEPracticeDialog: false as boolean,
      valid: true as boolean,
      scriptureEngagementPracticeTitle: "" as string,
      scriptureEngagementPracticeDescription: "" as string,
      moreInfoUrl: "" as string,
      scriptureEngagementPracticeSequence: 0 as number, // only used when updating a current SE practice
      scriptureEngagementPracticeId: -1 as number, // only used when updating a current SE practice
      editOn: false as boolean, //true when editing an existing SE practice (as opposed to creating a new one)
      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters"
      ],
      descriptionRules: [(v: any) => !!v || "Description is required"],
      urlRules: [(v: any) => !!v || "A URL is required"]
    };
  },

  methods: {
    resetForm() {
      this.scriptureEngagementPracticeTitle = "";
      this.scriptureEngagementPracticeDescription = "";
      this.moreInfoUrl = "";
      this.scriptureEngagementPracticeSequence = 0;
      this.scriptureEngagementPracticeId = -1;
      this.editOn = false;
    },
    newSEPractice() {
      console.log("new SE practice!");
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
      this.resetForm();
      this.createUpdateSEPracticeDialog = true;
    },
    editSEPractice(
      practice: any // not really of type ScriptureEngagementPractices_scriptureEngagementPractices anymore, since it is a computed property that is passed in
    ) {
      console.log("edit SE practice!", practice);
      this.scriptureEngagementPracticeTitle = practice.title;
      this.scriptureEngagementPracticeDescription = practice.description;
      this.moreInfoUrl = practice.moreInfoUrl;
      this.scriptureEngagementPracticeSequence = practice.sequence;
      this.scriptureEngagementPracticeId = practice.id;
      this.editOn = true;
      this.createUpdateSEPracticeDialog = true;
    },

    deleteSEPractice(
      practice: any // not really of type ScriptureEngagementPractices_scriptureEngagementPractices anymore, since it is a computed property that is passed in
    ) {
      console.log("delete practice: ", practice);
      this.$apollo
        .mutate({
          mutation: DELETE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
          variables: {
            id: practice.id
          }
        })
        .then(({ data }) => {
          console.log("done!", data);
          this.refetchSEPracticeData();
          //this.cancelIndexDialog();
        })
        .catch(error => {
          console.log("there appears to have been an error: ", error);
          //this.serverError = true;
          //this.serverError = true
        });
    },

    cancelDialog() {
      if (this.$refs.form) {
        // FIXME: Replace the `as any` hack.
        (this.$refs.form as any).resetValidation();
      }
      this.resetForm();
      this.createUpdateSEPracticeDialog = false;
    },
    refetchSEPracticeData() {
      this.$apollo.queries.scriptureEngagementPracticeData
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
          this.scriptureEngagementPracticeData.forEach(
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
                  description: this.scriptureEngagementPracticeDescription,
                  moreInfoUrl: this.moreInfoUrl
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
          this.$apollo
            .mutate({
              mutation: UPDATE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
              variables: {
                updateData: {
                  id: this.scriptureEngagementPracticeId,
                  sequence: this.scriptureEngagementPracticeSequence,
                  title: this.scriptureEngagementPracticeTitle,
                  description: this.scriptureEngagementPracticeDescription,
                  moreInfoUrl: this.moreInfoUrl
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
        }
      }
    }
  },

  apollo: {
    scriptureEngagementPracticeData: {
      query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES_QUERY,
      update(scriptureEngagementPractices: ScriptureEngagementPractices) {
        console.log(
          "letter data: ",
          scriptureEngagementPractices.scriptureEngagementPractices
        );

        return scriptureEngagementPractices.scriptureEngagementPractices;
      },
      fetchPolicy: "network-only"
    }
  },

  computed: {
    scriptureEngagementPractices(): object {
      return this.scriptureEngagementPracticeData.map(
        (
          practice: ScriptureEngagementPractices_scriptureEngagementPractices
        ) => ({
          id: practice.id,
          title: practice.title,
          description: practice.description,
          sequence: practice.sequence,
          moreInfoUrl: practice.moreInfoUrl,
          canDelete: practice.predictionTableEntries.length === 0
        })
      );
    }
  },

  mounted() {
    console.log("mounted....");
    //this.refetchSEPracticeData();
  }
});
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
