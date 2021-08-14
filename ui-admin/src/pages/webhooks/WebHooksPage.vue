<template>
  <v-container>
    <page-header title="Web Hooks">
      <v-col>
        {{ organization.name }}
      </v-col>
    </page-header>

    <v-row class="align-baseline">
      <v-col>
        <h1 class="title">Machines</h1>
      </v-col>
      <v-col>
        <v-btn color="primary" @click="machineDialog.visible = true">
          Add Machine
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <machine-cards :machines="machines" @deleteMachine="deleteMachine" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h1 class="title">Subscriptions</h1>
      </v-col>
      <v-col>
        <v-btn color="primary" @click="subscriptionDialog.visible = true">
          Add Subscription
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <web-hook-cards
          :qualtrics-subscriptions="subscriptions"
          :survey-name-by-id="surveyNameById"
          @delete="deleteSubscription"
        />
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>

    <machine-dialog
      v-model="machineDialog.visible"
      dialog-title="Add a Machine"
      :machine-name="machineDialog.name"
      :host-name="machineDialog.hostName"
      :is-active="machineDialog.isActive"
      @ready="createMachine"
    />

    <subscription-dialog
      v-model="subscriptionDialog.visible"
      dialog-title="Add a Subscription"
      :host-name="subscriptionDialog.hostName"
      :subscription-type="subscriptionDialog.subscriptionType"
      :survey-id="subscriptionDialog.surveyId"
      @ready="createSubscription"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  QUALTRICS_CREATE_SUBSCRIPTION,
  QUALTRICS_LIST_SUBSCRIPTIONS,
  QUALTRICS_ORG_QUERY,
  QUALTRICS_REMOVE_SUBSCRIPTION,
} from "@/graphql/qualtrics.graphql";

import URLParse from "url-parse";
import { ALL_CAPERNAUM_SURVEYS } from "@/graphql/surveys.graphql";
import WebHookCards from "@/pages/webhooks/WebHookCards.vue";
import {
  CategoryType,
  EnhancedSubscription,
  SubscriptionType,
} from "@/types/qualtrics.types";
import MachineCards from "@/pages/webhooks/MachineCards.vue";
import {
  ALL_MACHINES,
  CREATE_MACHINE,
  DELETE_MACHINE,
} from "@/graphql/machine.graphql";
import MachineDialog from "@/pages/webhooks/MachineDialog.vue";
import { MachineCreateInput } from "@/graphql/types/globalTypes";
import { AllMachines_machines as Machine } from "@/graphql/types/AllMachines";
import { CreateMachine } from "@/graphql/types/CreateMachine";
import { DeleteMachine } from "@/graphql/types/DeleteMachine";
import SubscriptionDialog from "@/pages/webhooks/SubscriptionDialog.vue";
import { SubscriptionDialogResponse } from "@/components/dialogs/dialog.types";
import { CreateSubscription } from "@/graphql/types/CreateSubscription";
import { QualtricsListSubscriptions_subscriptions as QualtricsSubscription } from "@/graphql/types/QualtricsListSubscriptions";
import PageHeader from "@/pages/PageHeader.vue";
import { AllCapernaumSurveys } from "@/graphql/types/AllCapernaumSurveys";

type StringToStringMap = Map<string, string>;

export default Vue.extend({
  name: "WebHooksPage",

  components: {
    WebHookCards,
    MachineCards,
    MachineDialog,
    SubscriptionDialog,
    PageHeader,
  },

  apollo: {
    organization: {
      query: QUALTRICS_ORG_QUERY,
    },

    machines: {
      query: ALL_MACHINES,
    },

    surveyNameById: {
      query: ALL_CAPERNAUM_SURVEYS,
      update: (data: AllCapernaumSurveys) => {
        const nameById: StringToStringMap = new Map();
        data.surveys.forEach((survey) =>
          nameById.set(survey.qualtricsId, survey.qualtricsName)
        );
        return nameById;
      },
    },

    subscriptions: {
      query: QUALTRICS_LIST_SUBSCRIPTIONS,
      update: function (data) {
        return data.subscriptions.map((subscription: QualtricsSubscription) =>
          this.enhanceSubscription(subscription)
        );
      },
    },
  },

  data() {
    return {
      organization: {},
      subscriptions: [] as EnhancedSubscription[],
      surveyNameById: {} as StringToStringMap,
      machines: [] as Machine[],

      machineDialog: {
        name: "",
        hostName: "",
        isActive: true,
        visible: false,
      },

      subscriptionDialog: {
        hostName: "",
        subscriptionType: "completed-response",
        surveyId: "",
        visible: false,
      },

      snackbar: {
        text: "",
        visible: false,
      },
    };
  },

  methods: {
    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    createMachine(machine: MachineCreateInput) {
      this.$apollo
        .mutate<CreateMachine>({
          mutation: CREATE_MACHINE,
          variables: {
            createInput: machine,
          },
        })
        .then(({ data }) => {
          console.log("RESULT", data);
          if (data) {
            this.machines.push(data.createMachine);
            this.showSnackbar("Machine added");
          }
        })
        .catch((error) => this.showSnackbar(error));
    },

    deleteMachine(machineId: number) {
      this.$apollo
        .mutate<DeleteMachine>({
          mutation: DELETE_MACHINE,
          variables: {
            machineId,
          },
        })
        .then((result) => {
          console.log("RESULT", result);
          this.machines = this.machines.filter(
            (machine) => machine.id !== machineId
          );
          this.showSnackbar("Machine deleted");
        })
        .catch((error) => this.showSnackbar(error));
    },

    enhanceSubscription(
      subscription: QualtricsSubscription
    ): EnhancedSubscription {
      const enhancedSubscription = { ...subscription } as EnhancedSubscription;

      const [catType, subType, surveyId] = subscription.topics.split(".");
      enhancedSubscription.categoryType = catType as CategoryType;
      enhancedSubscription.subscriptionType = subType as SubscriptionType;
      if (enhancedSubscription.categoryType === "surveyengine") {
        enhancedSubscription.surveyId = surveyId;
      }

      const url = new URLParse(subscription.publicationUrl);
      enhancedSubscription.url = {
        protocol: url.protocol,
        hostname: url.hostname,
        path: url.pathname,
      };

      return enhancedSubscription;
    },

    createSubscription(dialogResponse: SubscriptionDialogResponse) {
      console.log("RESPONSE", dialogResponse);
      this.$apollo
        .mutate<CreateSubscription>({
          mutation: QUALTRICS_CREATE_SUBSCRIPTION,
          variables: {
            createInput: dialogResponse,
          },
        })
        .then(({ data }) => {
          if (data) {
            console.log("RESULT", data);
            this.subscriptions.push(
              this.enhanceSubscription(data.createSubscription)
            );
            this.showSnackbar("Subscription created");
          }
        });
    },

    deleteSubscription(subscriptionId: string) {
      console.log("SUB ID", subscriptionId);
      this.$apollo
        .mutate({
          mutation: QUALTRICS_REMOVE_SUBSCRIPTION,
          variables: {
            subscriptionId,
          },
        })
        .then((httpStatus) => {
          console.log("STATUS", httpStatus);
          this.subscriptions = this.subscriptions.filter(
            (subscription) => subscription.id !== subscriptionId
          );
          this.showSnackbar("Subscription removed");
        })
        .catch((error) => this.showSnackbar(error));
    },
  },
});
</script>
