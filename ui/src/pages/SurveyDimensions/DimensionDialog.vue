<template>
  <v-dialog persistent v-model="visible" max-width="800">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-form ref="dimensionForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-text-field
            v-model="dimensionName"
            label="Survey Dimension"
            :hint="hint"
            :rules="rules.required"
            outlined
            persistent-hint
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="success" text @click="cancel">
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
    title: { type: String, required: true },
    hint: { type: String, required: true },
    visible: { type: Boolean, required: true }
  },

  data() {
    return {
      dimensionName: "",
      valid: false,

      rules: {
        required: [(v: any) => !!v || "Required field"]
      }
    };
  },

  methods: {
    cancel() {
      this.visible = false;
    },

    onSubmit() {
      this.$emit("dimension-ready", {
        dimensionName: this.dimensionName
      });
    }
  },

  watch: {
    visible: {
      handler: function(v) {
        if (v) {
          // FIXME: Replace the `as any` hack.
          (this.$refs.dimensionForm as any).resetValidation();
        }
      },
      immediate: true
    }
  }
});
</script>
