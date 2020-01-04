<template>
  <v-container>
    <v-row class="align-baseline justify-space-between">
      <v-col>
        <h1 class="headline">Web Hooks</h1>
      </v-col>
      <v-col>
        <h1 class="body-1">{{ organization.name }}</h1>
      </v-col>
    </v-row>

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
        <web-hook-cards :qualtrics-subscriptions="subscriptions" />
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
      :host-id="subscriptionDialog.hostId"
      :subscription-type="subscriptionDialog.subscriptionType"
      @ready="createSubscription"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  QUALTRICS_LIST_SUBSCRIPTIONS,
  QUALTRICS_ORG_QUERY,
  QUALTRICS_REMOVE_SUBSCRIPTION
} from "@/graphql/qualtrics.graphql";

import URLParse from "url-parse";
import { ALL_SURVEYS_QUERY } from "@/graphql/surveys.graphql";
import { AllSurveys_surveys as Survey } from "@/graphql/types/AllSurveys";
import WebHookCards from "@/components/WebHookCards.vue";
import {
  CategoryType,
  QualtricsSubscription,
  SubscriptionType
} from "@/types/qualtrics.types";
import MachineCards from "@/components/MachineCards.vue";
import {
  ALL_MACHINES,
  CREATE_MACHINE,
  DELETE_MACHINE
} from "@/graphql/machine.graphql";
import MachineDialog from "@/components/dialogs/MachineDialog.vue";
import { MachineCreateInput } from "@/graphql/types/globalTypes";
import { AllMachines_machines as Machine } from "@/graphql/types/AllMachines";
import { CreateMachine } from "@/graphql/types/CreateMachine";
import { DeleteMachine } from "@/graphql/types/DeleteMachine";
import SubscriptionDialog from "@/components/dialogs/SubscriptionDialog.vue";
import { SubscriptionDialogResponse } from "@/components/dialogs/dialog.types";

type StringToStringMap = Map<string, string>;

export default Vue.extend({
  name: "WebHooks",

  components: { WebHookCards, MachineCards, MachineDialog, SubscriptionDialog },

  apollo: {
    organization: {
      query: QUALTRICS_ORG_QUERY
    },

    machines: {
      query: ALL_MACHINES
    },

    surveyNameById: {
      query: ALL_SURVEYS_QUERY,
      update: data => {
        const nameById: StringToStringMap = new Map();
        data.surveys.forEach((survey: Survey) =>
          nameById.set(survey.qualtricsId, survey.qualtricsName)
        );
        return nameById;
      }
    },

    subscriptions: {
      query: QUALTRICS_LIST_SUBSCRIPTIONS,
      update: data => {
        const subscriptions: QualtricsSubscription[] = data.subscriptions;

        for (const subscription of subscriptions) {
          const [catType, subType, surveyId] = subscription.topics.split(".");
          subscription.categoryType = catType as CategoryType;
          subscription.subscriptionType = subType as SubscriptionType;
          if (subscription.categoryType === "surveyengine") {
            subscription.surveyId = surveyId;
          }

          const url = new URLParse(subscription.publicationUrl);
          subscription.url = {
            protocol: url.protocol,
            hostname: url.hostname,
            path: url.pathname
          };
        }
        return subscriptions;
      }
    }
  },

  data() {
    return {
      organization: {},
      subscriptions: [] as QualtricsSubscription[],
      surveyNameById: {} as StringToStringMap,
      machines: [] as Machine[],

      machineDialog: {
        name: "",
        hostName: "",
        isActive: true,
        visible: false
      },

      subscriptionDialog: {
        hostId: NaN,
        subscriptionType: "completedResponse",
        visible: false
      },

      snackbar: {
        text: "",
        visible: false
      }
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
            createInput: machine
          }
        })
        .then(({ data }) => {
          console.log("RESULT", data);
          this.machines.push(data!.createMachine);
          this.showSnackbar("Machine added");
        })
        .catch(error => this.showSnackbar(error));
    },

    deleteMachine(machineId: number) {
      this.$apollo
        .mutate<DeleteMachine>({
          mutation: DELETE_MACHINE,
          variables: {
            machineId
          }
        })
        .then(result => {
          console.log("RESULT", result);
          this.machines = this.machines.filter(
            machine => machine.id !== machineId
          );
          this.showSnackbar("Machine deleted");
        })
        .catch(error => this.showSnackbar(error));
    },

    createSubscription(subscription: SubscriptionDialogResponse) {
      console.log("SUBSCRIPTION", subscription);
      // this.$apollo.mutate({
      //   mutation: CREATE_MACHINE,
      //   variables: {
      //     createInput
      //   }
      // });
    },

    removeSubscription(subscriptionId: string) {
      this.$apollo
        .mutate({
          mutation: QUALTRICS_REMOVE_SUBSCRIPTION,
          variables: {
            subscriptionId
          }
        })
        .then(httpStatus => {
          console.log("STATUS", httpStatus);
          this.subscriptions = this.subscriptions.filter(
            subscription => subscription.id !== subscriptionId
          );
          this.showSnackbar("Subscription removed");
        })
        .catch(error => this.showSnackbar(error));
    }
  }
});
</script>
