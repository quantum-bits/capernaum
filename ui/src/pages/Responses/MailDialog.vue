<template>
  <v-dialog persistent v-model="visible" max-width="600">
    <v-card>
      <v-card-title>Send Results by Email</v-card-title>
      <v-card-text>
        <v-checkbox
          v-model="recipients.respondent"
          :label="`Survey administrator (${adminEmail})`"
        />
        <v-checkbox
          v-model="recipients.admin"
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
import { SendLetter } from "@/graphql/types/SendLetter";

export default Vue.extend({
  name: "MailDialog",

  model: {
    prop: "visible",
    event: "action"
  },

  props: {
    visible: { type: Boolean, required: true },
    respondentEmail: { type: String, required: true },
    adminEmail: { type: String, required: true },
    attachmentPath: { type: String, required: true }
  },

  data() {
    return {
      recipients: {
        respondent: false,
        admin: false,
        other: false
      },
      otherEmail: ""
    };
  },

  computed: {
    formValid(): boolean {
      return (
        this.recipients.respondent ||
        this.recipients.admin ||
        this.otherEmail.length > 0
      );
    }
  },

  methods: {
    onCancel() {
      this.$emit("action", false);
    },

    onSend() {
      // if (this.recipients.respondent) {
      this.$apollo
        .mutate<SendLetter>({
          mutation: SEND_LETTER_MUTATION,
          variables: {
            mailInput: {
              to: this.respondentEmail,
              subject: "Your CLS results",
              textContent: "Here are your CLS results",
              attachmentPath: this.attachmentPath
            }
          }
        })
        .then(result => console.log("RESULT", result))
        .catch(error => console.error("ERROR", error));

      // }
      //
      // if (this.recipients.admin) {
      //   this.$apollo.mutate<SendLetter>({
      //     mutation: SEND_LETTER_MUTATION,
      //     variables: {
      //       mailInput: {
      //         to: this.adminEmail,
      //         subject: `CLS results for ${this.respondentEmail}`,
      //         textContent: `CLS results for ${this.respondentEmail}`,
      //         attachmentPath: this.attachmentPath
      //       }
      //     }
      //   });
      // }

      // if (this.recipients.other) {
      // }
      this.$emit("action", false);
    }
  }
});
</script>
