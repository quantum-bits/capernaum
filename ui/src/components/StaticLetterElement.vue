<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card>
        <v-card-title primary-title>
            <div>
                <h3 class="title font-weight-regular mb-2">{{description}}</h3>
                <!-- https://github.com/vuetifyjs/vuetify-loader/issues/12 -->
                <v-img v-if = "displaySpiritualFoci"
                :src="require('@/images/spiritual-foci.png')"
                :width="400"
                ></v-img>
                <v-img v-if = "displaySpiritualOrientations"
                :src="require('@/images/spiritual-orientations.png')"
                :width="400"
                ></v-img>
                <span v-if = "displaySEStrategies">
                    Auto-generated list of Scripture Engagement strategies that the user may find to be helpful.
                </span>
            </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="deleteElement">Delete</v-btn>
          <v-btn v-if="order > 0" flat color="orange" @click="moveUp">
            <v-icon>arrow_upward</v-icon>
          </v-btn>
          <v-btn v-if="showMoveDown" flat color="orange" @click="moveDown">
            <v-icon>arrow_downward</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

import axios from "axios";
import { AxiosResponse } from "axios";

import { LetterElementMenuItemType, LetterElementEnum } from "../pages/letter-element.types";

@Component({})
export default class StaticLetterElement extends Vue {
  /** Non-boilerplate letter element */
  @Prop() id!: number;
  @Prop() order!: number;
  @Prop() numItems!: number;
  @Prop({ default: "" }) initialTextArea!: string; // not actually used in this component, but need to mirror the props of  LetterTextArea.vue
  @Prop({ default: false }) initialEditModeOn!: boolean; // not actually used in this component
  @Prop() letterElementKey!: string;
  @Prop() parentIsFrozen!: boolean;

  letterElements: LetterElementMenuItemType[] = [];
  description: string = "";

  @Emit("move-up")
  moveUp() {}

  @Emit("move-down")
  moveDown() {}

  @Emit("delete-element")
  deleteElement() {}

  get showMoveDown() {
    return this.order < this.numItems - 1;
  }

  get displaySpiritualFoci() {
      return this.letterElementKey === LetterElementEnum.SPIRITUAL_FOCUS_CHART;
  }

  get displaySpiritualOrientations() {
      return this.letterElementKey === LetterElementEnum.SPIRITUAL_ORIENTATIONS_CHART;
  }

  get displaySEStrategies() {
      return this.letterElementKey === LetterElementEnum.BOOLEAN_CALCULATION_RESULTS;
  }

  mounted() {
    axios
        .get("http://localhost:3000/letter-elements/")
        .then((response: AxiosResponse) => {
          console.log(response);
          this.letterElements = response.data;
          for (let letterElement of this.letterElements) {
              if (letterElement.key === this.letterElementKey) {
                  this.description = letterElement.description;
              }
          }
        });
  }

}
</script>
