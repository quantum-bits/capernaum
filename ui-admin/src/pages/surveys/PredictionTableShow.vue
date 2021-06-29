<template>
  <v-data-table :headers="headers" :items="tableData" class="elevation-1">
    <template v-slot:item="{ item, headers }">
      <tr>
        <td v-for="header in headers" :key="header.value">
          <span v-if="header.value === 'practice'">
            {{ item[header.value] }}
          </span>
          <span v-else>
            <v-icon
              v-if="item.spiritualFocusOrientationIdDict[header.value]"
              color="success"
            >
              mdi-check-circle
            </v-icon>
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { AssociationTableContent } from "@/pages/surveys/PredictionTableTab.vue";

export default Vue.extend({
  name: "PredictionTableShow",

  props: {
    associationTable: {
      type: Object as () => AssociationTableContent,
      required: true,
    },
  },
});
</script>
