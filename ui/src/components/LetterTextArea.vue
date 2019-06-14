<template>
  <div>
    <!--Use the component in the right place of the template-->
    <tiptap-vuetify 
        v-model="content" 
        :extensions="extensions" 
        :toolbar-attributes="{ color: 'yellow' }"
    >
    
    </tiptap-vuetify>

    <!--Here's how to make a preview (optional)-->
    <h1>Preview</h1>
    <hr>

    <div
      class="tiptap-vuetify-editor__content"
      v-html="content"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, CodeBlock, Paragraph, BulletList, OrderedList,
  ListItem, Link, Blockquote, HardBreak, HorizontalRule, History
} from 'tiptap-vuetify';

@Component({
    components: {
        TiptapVuetify
    }
})
export default class LetterTextArea extends Vue {
  /** Item to display */
  @Prop() id!: Number;
  @Prop() order!: Number;
  @Prop() textArea!: any;

  extensions: any = [
      // you can specify options for extension
      new Heading({
        levels: [1, 2, 3]
      }),
      new Bold({}),
      new Italic({}),
      new Strike({}),
      new Underline({}),
      new Code({}),
      new CodeBlock({}),
      new Paragraph({}),
      new BulletList({}),
      new OrderedList({}),
      new ListItem({}),
      new Link({}),
      new Blockquote({}),
      new HardBreak({}),
      new HorizontalRule({}),
      new History({})
    ];

    // starting content for the editor
    content: any = `
      <h1>Yay Headlines!</h1>
      <p>All these <strong>cool tags</strong> are working now.</p>
    `



}
</script>
