<template>
  <v-simple-table>
    <thead>
      <tr>
        <th
          class="text-center"
          v-for="(header, idx) in associationTable.headers"
          :key="idx"
        >
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in associationTable.rows" :key="idx">
        <td>{{ row.title }}</td>
        <td class="text-center" v-for="(column, idx) in row.columns" :key="idx">
          <v-icon color="success" v-if="column.predict">
            mdi-check-circle
          </v-icon>
          <v-icon disabled v-else> mdi-close-circle </v-icon>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
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
