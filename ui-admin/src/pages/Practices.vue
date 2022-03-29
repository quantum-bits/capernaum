<template>
  <v-container>
    <page-header title="Scripture Engagement Practices">
      <v-btn color="primary" @click="newSEPractice"> New Practice </v-btn>
    </page-header>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="scriptureEngagementPractices"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-xs-right">{{ item.title }}</td>
              <td class="text-xs-right">
                {{ item.description | truncate(80) }}
              </td>
              <td>
                <v-icon color="success" v-if="item.forPredictionCounts">
                  mdi-check-circle
                </v-icon>
                <v-icon color="error" v-else>mdi-close-circle</v-icon>
              </td>
              <td class="text-xs-right">
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
                    >This SE Practice cannot be deleted because it h
                    associations</span
                  >
                </v-tooltip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="showPracticeDialog" persistent max-width="800">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-card>
          <v-card-title class="headline">
            Scripture Engagement Practice
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="dialogData.title"
              label="Title"
              :rules="titleRules"
              :counter="50"
              outlined
              required
              persistent-hint
            />
            <v-textarea
              v-model="dialogData.description"
              label="Description"
              :rules="descriptionRules"
              outlined
              required
              persistent-hint
            />
            <v-text-field
              v-model="dialogData.url"
              label="Scripture Engagement Website URL"
              :rules="urlRules"
              hint="e.g., https://www.biblegateway.com/resources/scripture-engagement/journaling-scripture/home"
              outlined
              required
              persistent-hint
            />
            <v-switch
              color="success"
              v-model="dialogData.forCounts"
              label="Use for Prediction Counts"
            />
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="cancel" text @click="cancelDialog()"> Cancel </v-btn>
            <v-btn
              color="warning"
              :disabled="!valid"
              text
              @click="submitSEPractice()"
              >Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
  ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
  DELETE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
  UPDATE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
} from "@/graphql/scripture-engagement-practices.graphql";
import {
  ScriptureEngagementPractices,
  ScriptureEngagementPractices_scriptureEngagementPractices as SEPractice,
} from "@/graphql/types/ScriptureEngagementPractices";
import PageHeader from "@/pages/PageHeader.vue";

export default Vue.extend({
  /** page to create/update survey dimensions and indexes */
  name: "Practices",

  components: {
    PageHeader,
  },

  data() {
    return {
      headers: [
        {
          text: "Scripture Engagement Practice",
          value: "title",
          sortable: true,
        },
        {
          text: "Description",
          value: "description",
          sortable: false,
        },
        {
          text: "Counts?",
          value: "forPredictionCounts",
          sortable: false,
        },
        { text: "Actions", sortable: false },
      ],

      dialogData: {
        id: -Infinity,
        title: "",
        description: "",
        url: "",
        forCounts: true,
      },

      scriptureEngagementPracticeData: [] as SEPractice[],
      showPracticeDialog: false,
      valid: true,
      editOn: false, //true when editing an existing SE practice (as opposed to creating a new one)

      titleRules: [
        (v: string) => !!v || "Title is required",
        (v: string) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters",
      ],
      descriptionRules: [(v: string) => !!v || "Description is required"],
      urlRules: [(v: string) => !!v || "A URL is required"],
    };
  },

  methods: {
    resetForm() {
      this.dialogData = {
        id: -Infinity,
        title: "",
        description: "",
        url: "",
        forCounts: true,
      };
      this.editOn = false;
    },

    newSEPractice() {
      console.log("new SE practice!");
      if (this.$refs.form) {
        (
          this.$refs.form as Vue & {
            resetValidation: () => boolean;
          }
        ).resetValidation();
      }
      this.resetForm();
      this.showPracticeDialog = true;
    },

    editSEPractice(practice: SEPractice): void {
      console.log("edit SE practice!", practice);
      this.dialogData = {
        id: practice.id,
        title: practice.title,
        description: practice.description,
        url: practice.moreInfoUrl,
        forCounts: practice.forPredictionCounts,
      };

      this.editOn = true;
      this.showPracticeDialog = true;
    },

    deleteSEPractice(practice: SEPractice): void {
      console.log("delete practice: ", practice);
      this.$apollo
        .mutate({
          mutation: DELETE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
          variables: {
            id: practice.id,
          },
        })
        .then(({ data }) => {
          console.log("done!", data);
          this.refetchSEPracticeData();
        })
        .catch((error) => {
          console.log("there appears to have been an error: ", error);
        });
    },

    cancelDialog(): void {
      if (this.$refs.form) {
        (
          this.$refs.form as Vue & {
            resetValidation: () => boolean;
          }
        ).resetValidation();
      }
      this.resetForm();
      this.showPracticeDialog = false;
    },

    refetchSEPracticeData(): void {
      this.$apollo.queries.scriptureEngagementPracticeData
        .refetch()
        .then(({ data }) => {
          console.log("survey data refetched! ", data);
        });
    },

    submitSEPractice(): void {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        console.log("save info");
        if (!this.editOn) {
          // Create new SE practice
          this.$apollo
            .mutate({
              mutation: ADD_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
              variables: {
                createInput: {
                  title: this.dialogData.title,
                  description: this.dialogData.description,
                  moreInfoUrl: this.dialogData.url,
                  forPredictionCounts: this.dialogData.forCounts,
                },
              },
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDialog();
              this.refetchSEPracticeData();
            })
            .catch((error) => {
              console.log("there appears to have been an error: ", error);
              (
                this.$refs.form as Vue & {
                  resetValidation: () => boolean;
                }
              ).resetValidation();
            });
        } else {
          // update existing SE practice
          this.$apollo
            .mutate({
              mutation: UPDATE_SCRIPTURE_ENGAGEMENT_PRACTICE_MUTATION,
              variables: {
                updateData: {
                  id: this.dialogData.id,
                  title: this.dialogData.title,
                  description: this.dialogData.description,
                  moreInfoUrl: this.dialogData.url,
                  forPredictionCounts: this.dialogData.forCounts,
                },
              },
            })
            .then(({ data }) => {
              console.log("done!", data);
              this.cancelDialog();
              this.refetchSEPracticeData();
            })
            .catch((error) => {
              console.log("there appears to have been an error: ", error);
              (
                this.$refs.form as Vue & {
                  resetValidation: () => boolean;
                }
              ).resetValidation();
            });
        }
      }
    },
  },

  apollo: {
    scriptureEngagementPracticeData: {
      query: ALL_SCRIPTURE_ENGAGEMENT_PRACTICES,
      update(
        scriptureEngagementPractices: ScriptureEngagementPractices
      ): SEPractice[] {
        console.log(
          "letter data: ",
          scriptureEngagementPractices.scriptureEngagementPractices
        );

        return scriptureEngagementPractices.scriptureEngagementPractices;
      },
      fetchPolicy: "network-only",
    },
  },

  computed: {
    scriptureEngagementPractices(): Array<Partial<SEPractice>> {
      return this.scriptureEngagementPracticeData.map(
        (practice: SEPractice) => ({
          id: practice.id,
          title: practice.title,
          description: practice.description,
          moreInfoUrl: practice.moreInfoUrl,
          forPredictionCounts: practice.forPredictionCounts,
          canDelete: practice.surveyIndices.length === 0,
        })
      );
    },
  },
});

// Credits:
//   https://stackoverflow.com/questions/40899532/how-to-pass-a-value-from-vue-data-to-href
</script>

<style scoped>
.no-underline {
  text-decoration: none;
}
</style>
