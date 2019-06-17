<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card v-if="editModeOn">
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Paragraph &#35;{{order}}:</h3>
            <vue-editor v-model="textArea" :editorToolbar="customToolbar"></vue-editor>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toggleEditMode">Save</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Paragraph &#35;{{order}}:</h3>
            <div v-html="textArea"></div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="orange" @click="toggleEditMode">Edit</v-btn>
          <v-btn v-if="order > 0" flat color="orange" @click="moveUp"><v-icon>arrow_upward</v-icon></v-btn>
          <v-btn v-if="showMoveDown" flat color="orange" @click="moveDown"><v-icon>arrow_downward</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

  

</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { VueEditor } from "vue2-editor";

@Component({
    components: {
      VueEditor
    }
})
export default class LetterTextArea extends Vue {
  /** Item to display */
  @Prop() id!: number;
  @Prop() order!: number;
  @Prop() numItems!: number;
  @Prop({ default: "" }) initialTextArea!: string;
  @Prop({ default: false }) initialEditModeOn!: boolean;

  @Emit('move-up')
  moveUp() {
  }

  @Emit('move-down')
  moveDown() {
  }

  editModeOn: boolean = this.initialEditModeOn;
  textArea: string = this.initialTextArea;
  // https://quilljs.com/docs/modules/toolbar/
  customToolbar: any = [
          ["bold", "italic", "underline", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          [{'align': []}],
          ['clean']   
  ];

  get showMoveDown() {
    return this.order < this.numItems - 1;
  }

  toggleEditMode() {
    this.editModeOn = !this.editModeOn;
  }

}
</script>
