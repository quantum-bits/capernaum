<template>
  <v-data-iterator :items="machines">
    <template v-slot:default="props">
      <v-row>
        <v-col
          v-for="item in props.items"
          :key="item.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card>
            <v-toolbar>
              <v-toolbar-title>
                {{ item.name }}
              </v-toolbar-title>
              <v-spacer />
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="$emit('deleteMachine', item.id)">
                    <v-list-item-title>Remove</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>Host name</v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ item.hostName }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>Active</v-list-item-content>
                <v-list-item-content class="align-end">
                  {{ item.active }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import Vue from "vue";
import { AllMachines_machines as Machine } from "@/graphql/types/AllMachines";

export default Vue.extend({
  name: "MachineCards",

  props: {
    machines: {
      type: Array as () => Machine[],
      required: true,
    },
  },
});
</script>
