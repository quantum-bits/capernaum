<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" v-bind="attrs">
        <v-btn
          icon
          :disabled="!canClick"
          v-bind="attrs"
          v-on="on"
          @click="$emit('click')"
        >
          <v-icon>{{ iconName }}</v-icon>
        </v-btn>
      </span>
    </template>
    <span>{{ activeToolTip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "IconButton",

  props: {
    canClick: { type: Boolean, default: true },
    iconName: { type: String, required: true },
    toolTip: { type: String, required: true },
    disabledToolTip: { type: String },
  },

  computed: {
    activeToolTip(): string {
      return this.canClick ? this.toolTip : this.disabledToolTip;
    },
  },
});

// Credits:
//   https://stackoverflow.com/a/62702482/1477144
//   https://youtu.be/7lpemgMhi0k?t=1314
//   https://newbedev.com/display-vuetify-tooltip-on-disabled-button
</script>
