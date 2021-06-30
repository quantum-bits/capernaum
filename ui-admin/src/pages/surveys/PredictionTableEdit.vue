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
          <v-simple-checkbox v-model="column.predict" color="primary" />
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import { AssociationTableContent } from "@/pages/surveys/PredictionTableTab.vue";

export default Vue.extend({
  name: "PredictionTableEdit",

  props: {
    associationTable: {
      type: Object as () => AssociationTableContent,
      required: true,
    },
  },
});
</script>
