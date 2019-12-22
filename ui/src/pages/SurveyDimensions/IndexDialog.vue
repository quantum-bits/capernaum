<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">
        {{ dialogTitle }}
      </v-card-title>
      <v-form ref="indexForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="index.title"
            label="Survey Index"
            :hint="dialogHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <v-text-field
            v-model="index.abbreviation"
            label="Survey Index Abbreviation"
            :hint="index.abbrevHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />

          <span v-if="canTurnOffPredictions">
            <v-switch
              v-model="index.useForPredictions"
              label="Use For Predictions in Boolean Association Table"
            ></v-switch>
          </span>
          <span v-else>
            <v-tooltip left max-width="300">
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-switch
                    v-model="index.useForPredictions"
                    disabled
                    label="Use for predictions in Boolean association table"
                  ></v-switch>
                </span>
              </template>
              <span>
                One or more survey indexes associated with this survey dimension
                have boolean associations, so this setting cannot be turned off.
              </span>
            </v-tooltip>
          </span>

          <template>
            <v-container fluid>
              <v-row align="center">
                <v-col cols="12" sm="12">
                  <v-select
                    v-model="selectedSurveyItems"
                    :items="surveyItems"
                    :item-text="'name'"
                    :item-value="'id'"
                    label="Choose Survey Items"
                    return-object
                    multiple
                    chips
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" text @click="cancelIndexDialog()">
            Cancel
          </v-btn>

          <v-btn :disabled="!valid" color="success" text @click="submitIndex()">
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { SurveyItemView } from "../survey.types";

export default Vue.extend({
  name: "IndexDialog",

  props: {
    dialogTitle: { type: String, required: true },
    dialogHint: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },

    indexTitle: String,
    indexAbbreviation: String,
    useForPredictions: Boolean
  },

  model: {
    prop: "visible",
    event: "submit"
  },

  data() {
    return {
      index: {
        title: this.indexTitle,
        abbreviation: this.indexAbbreviation,
        useForPrediction: this.useForPredictions
      },

      selectedSurveyItems: [] as SurveyItemView[],
      canTurnOffPredictions: true, // used to control whether the "turn off predictions slider" is disabled or not in the edit dimensions dialog

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    onCancel() {
      this.$emit("submit", false);
    },

    onSubmit() {
      this.$emit("index-ready", {
        indexTitle: this.index.title,
        indexAbbreviation: this.index.abbreviation,
        useForPrediction: this.index.useForPrediction
      });
      this.$emit("submit", false);
    }
  },

  computed: {
    visible: {
      handler: function(newValue) {
        if (newValue) {
          if (this.$refs.indexForm && newValue) {
            // FIXME: Replace the `as any` hack.
            (this.$refs.indexForm as any).resetValidation();
          }
        }
      },
      immediate: true
    }
  }
});
</script>
