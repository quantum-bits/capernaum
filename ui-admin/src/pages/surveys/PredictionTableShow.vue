<template>
  <v-data-table :headers="headers" :items="tableData" class="elevation-1">
    <template v-slot:item="{ item, headers }">
      <tr>
        <td
          v-for="header in headers"
          :key="header.value"
          class="text-xs-center"
        >
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
import { AssociationTableHeader, TableData } from "./prediction-table.types";

export default Vue.extend({
  name: "PredictionTableShow",

  props: {
    headers: {
      type: Array as () => AssociationTableHeader[],
      required: true,
    },
    tableData: {
      type: Array as () => TableData[],
      required: true,
    },
  },
});
</script>
