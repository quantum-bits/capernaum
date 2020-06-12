<template>
  <v-dialog persistent v-model="visible" max-width="600">
    <v-card>
      <v-card-title>Send Results by Email</v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="recipients.admin"
          :label="`Survey administrator (${adminEmail})`"
        />
        <v-checkbox
          v-model="recipients.respondent"
          :label="`Survey respondent (${respondentEmail})`"
        />
        <v-row align="center">
          <v-checkbox
            class="ml-2 mt-0 shrink"
            hide-details
            v-model="recipients.other"
          />
          <v-text-field
            class="mr-2"
            v-model="otherEmail"
            :disabled="!recipients.other"
            label="Other email address"
          />
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="success" @click="onCancel">
          Cancel
        </v-btn>
        <v-btn text color="success" :disabled="!formValid" @click="onSend">
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { SEND_LETTER_MUTATION } from "@/graphql/letters.graphql";
import { SendLetter, SendLetterVariables } from "@/graphql/types/SendLetter";

export default Vue.extend({
  name: "MailDialog",

  model: {
    prop: "visible",
    event: "action",
  },

  props: {
    visible: { type: Boolean, required: true },
    respondentEmail: { type: String, required: true },
    adminEmail: { type: String, required: true },
    attachmentPath: { type: String, required: true },
    textContent: { type: String, required: true },
    htmlContent: { type: String, required: true },
  },

  data() {
    return {
      recipients: {
        respondent: false,
        admin: false,
        other: false,
      },
      otherEmail: "",
    };
  },

  computed: {
    formValid(): boolean {
      return (
        this.recipients.respondent ||
        this.recipients.admin ||
        this.otherEmail.length > 0
      );
    },
  },

  methods: {
    onCancel() {
      this.$emit("action", false);
    },

    sendHelper: function (to: string, subject: string) {
      return this.$apollo.mutate<SendLetter, SendLetterVariables>({
        mutation: SEND_LETTER_MUTATION,
        variables: {
          mailInput: {
            to,
            subject,
            textContent: this.textContent,
            htmlContent: this.htmlContent,
            attachmentPath: this.attachmentPath,
          },
        },
      });
    },

    onSend() {
      if (this.recipients.respondent) {
        this.sendHelper(this.respondentEmail, "Your CLS results");
      }

      if (this.recipients.admin) {
        this.sendHelper(
          this.adminEmail,
          `CLS results for ${this.respondentEmail}`
        );
      }

      if (this.recipients.other) {
        this.sendHelper(
          this.otherEmail,
          `CLS results for ${this.respondentEmail}`
        );
      }

      this.$emit("action", false);
    },
  },

  watch: {
    visible: {
      handler: function (newValue) {
        if (newValue) {
          this.recipients.respondent = false;
          this.recipients.admin = false;
          this.recipients.other = false;
          this.otherEmail = "";

          if (this.$refs.dimensionForm) {
            (this.$refs.form as Vue & {
              resetValidation: () => boolean;
            }).resetValidation();
          }
        }
      },
      immediate: true,
    },
  },
});
</script>
