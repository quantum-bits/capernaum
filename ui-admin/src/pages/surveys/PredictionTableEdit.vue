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
            <v-checkbox
              v-model="item.spiritualFocusOrientationIdDict[header.value]"
              color="primary"
              hide-details
            />
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { AssociationTableHeader, AssociationTableData } from "./prediction-table.types";

export default Vue.extend({
  name: "PredictionTableEdit",

  props: {
    headers: {
      type: Array as () => AssociationTableHeader[],
      required: true,
    },
    tableData: {
      type: Array as () => AssociationTableData[],
      required: true,
    },
  },
});
</script>
