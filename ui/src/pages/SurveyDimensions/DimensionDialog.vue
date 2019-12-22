<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="dimensionForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dimension.title"
            label="Survey Dimension"
            :hint="dialogHint"
            :rules="rules.required"
            outlined
            persistent-hint
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="success" text @click="onCancel">
            Cancel
          </v-btn>

          <v-btn :disabled="!valid" color="success" text @click="onSubmit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DimensionDialog",

  props: {
    dialogTitle: { type: String, required: true },
    dialogHint: { type: String, required: true },
    visible: { type: Boolean, required: true, default: false },

    dimensionTitle: { type: String }
  },

  model: {
    prop: "visible",
    event: "submit"
  },

  data() {
    return {
      dimension: {
        title: this.dimensionTitle
      },

      valid: false,

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    onCancel() {
      this.$emit("submmit", false);
    },

    onSubmit() {
      this.$emit("dimension-ready", {
        dimensionTitle: this.dimension.title
      });
      this.$emit("submit", false);
    }
  },

  watch: {
    visible: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.dimension.title = this.dimensionTitle;
          if (this.$refs.dimensionForm && newValue) {
            // FIXME: Replace the `as any` hack.
            (this.$refs.dimensionForm as any).resetValidation();
          }
        }
      },
      immediate: true
    }
  }
});
</script>
