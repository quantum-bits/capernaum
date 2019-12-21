<template>
  <v-dialog persistent v-model="value" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
      <v-form ref="dimensionForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dimensionTitle"
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
    value: { type: Boolean, required: true, default: false },

    initialTitle: { type: String }
  },

  data() {
    return {
      dimensionTitle: this.initialTitle,

      valid: false,

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    onCancel() {
      this.$emit("input", false);
    },

    onSubmit() {
      this.$emit("dimension-ready", {
        dimensionTitle: this.dimensionTitle
      });
      this.$emit("input", false);
    }
  }

  // watch: {
  //   value: {
  //     handler: function(newValue) {
  //       if (newValue) {
  //         // FIXME: Replace the `as any` hack.
  //         (this.$refs.dimensionForm as any).resetValidation();
  //       }
  //     },
  //     immediate: true
  //   }
  // }
});
</script>
