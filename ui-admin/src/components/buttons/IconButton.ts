import { VBtn, VIcon, VTooltip } from "vuetify/lib/components";
import Vue, { VNode } from "vue";
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
      return this.canClick
        ? this.toolTip
        : this.disabledToolTip || "Function disabled";
    },
  },

  methods: {
    onClicked() {
      this.$emit("click");
    },
  },

  render(h): VNode {
    return h(
      VTooltip,
      {
        props: { top: true },
        scopedSlots: {
          // Pass scoped slots to child component.
          activator: ({ on }) =>
            // The `<span>` element serves up the tooltip, even when the button is disabled.
            // Vuetify switches off all the button's mouse events when it is disabled.
            h("span", { on }, [
              h(
                VBtn,
                {
                  attrs: {
                    icon: true,
                    disabled: !this.canClick,
                  },
                  on: {
                    click: this.onClicked,
                  },
                },
                [h(VIcon, this.iconName)]
              ),
            ]),
        },
      },
      [h("span", this.activeToolTip)]
    );
  },
});

// Credits:
//   https://dev.to/sgtino/how-to-use-scoped-slot-inside-vue-s-render-function-vuetify-206c
