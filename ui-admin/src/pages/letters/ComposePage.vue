<template>
  <v-container>
    <page-header title="Compose Letter" />

    <v-tabs v-model="currentTab" fixed-tabs>
      <v-tab>Details</v-tab>
      <v-tab>Content</v-tab>
      <v-tab>Preview</v-tab>
    </v-tabs>

    <v-tabs-items v-model="currentTab" v-if="surveyLetter">
      <v-tab-item>
        <letter-details-tab :survey-letter="surveyLetter" />
      </v-tab-item>
      <v-tab-item>
        <letter-content-tab :survey-letter="surveyLetter" />
      </v-tab-item>
      <v-tab-item>
        <letter-preview-tab />
      </v-tab-item>
    </v-tabs-items>

    <!--
          Next:
              - decide on specifics of how to add another text box...do it on the fly?  should probably update it every time the user hits "save"
              - might need to update the db every time a change is made (to the order, too)
    
              - ordering within categories for letters (order by survey, and then more ordering below this level)
    
              - Important(?) need to do something to have multiple vue2-editor instances at the same time(!)
    
              - if the letter contains the "SE strategies for user" element, and the boolean association
              table is dropped for that letter, then the "SE strategies for user" element should also be dropped (or maybe
              the user should get a warning message or something)
          -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Route } from "vue-router";
import PageHeader from "@/pages/PageHeader.vue";
import { SURVEY_LETTER_QUERY } from "@/graphql/surveys.graphql";
import LetterDetailsTab from "@/pages/letters/LetterDetailsTab.vue";
import LetterContentTab from "@/pages/letters/LetterContentTab.vue";
import LetterPreviewTab from "@/pages/letters/LetterPreviewTab.vue";
import {
  SurveyLetter,
  SurveyLetter_surveyLetter,
  SurveyLetter_surveyLetter_letter_letterElements,
} from "@/graphql/types/SurveyLetter";

interface LetterElement
  extends SurveyLetter_surveyLetter_letter_letterElements {
  editModeOn: boolean;
  isNew: boolean;
  key: string;
}

export default Vue.extend({
  name: "ComposePage",

  components: {
    PageHeader,

    LetterDetailsTab,
    LetterContentTab,
    LetterPreviewTab,
  },

  mounted() {
    const surveyLetterId = this.$route.params.surveyLetterId;
    if (!surveyLetterId) {
      throw new Error("No survey letter ID supplied in URL");
    }

    this.$apollo
      .query<SurveyLetter>({
        query: SURVEY_LETTER_QUERY,
        variables: {
          id: parseInt(surveyLetterId),
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        this.surveyLetter = result.data.surveyLetter;
        console.info(
          `SURVEY LETTER LOADED: letter '${this.surveyLetter.letter.title}', survey '${this.surveyLetter.survey.qualtricsName}'`
        );
      })
      .catch((err) => {
        throw err;
      });
  },

  data() {
    return {
      currentTab: 0,
      isChartDialogVisible: false,
      isImageDialogVisible: false,

      surveyLetter: {} as SurveyLetter_surveyLetter,

      // OLD STUFF
      editModeOn: false,
      emailEditModeOn: false,

      // allowHideTable: true,
      // tableIsHidden: true,

      confirmDialog: null,

      name: "",
      generatingPDF: false,
    };
  },

  computed: {
    allEditsSaved(): boolean {
      console.log("email edit mode on:", this.emailEditModeOn);
      let editsSaved = !this.emailEditModeOn;
      // FIXME - no edit mode in letterElement
      // this.surveyLetter.letter.letterElements.forEach((letterElement) => {
      // if (letterElement.editModeOn) {
      //   editsSaved = false;
      // }
      // });
      console.log("edits saved?", editsSaved);
      return editsSaved;
    },
  },

  methods: {
    refreshPage(): void {
      /////////// FIX ME
      console.error("REFRESH PAGE");
      // this.$apollo.queries.surveyLetter.letter.refetch().then(({ data }) => {
      //   console.log("letter data refetched! ", data);
      // });
    },

    setEditModeOn(element: LetterElement): void {
      element.editModeOn = true;
      console.log("edit mode on!", this.surveyLetter.letter.letterElements);
    },

    setEditModeOff(element: LetterElement): void {
      element.editModeOn = false;
      console.log("edit mode off!");
    },

    letterInfoUpdated(): void {
      // letter information has been successfully updated....
      console.log("FIX ME ----- letter info updated!");
      //////////// FIXME
      // this.$apollo.queries.surveyLetter.letter.refetch().then(({ data }) => {
      //   console.log("survey data refetched! ", data);
      // });
      // this.editModeOn = false;
    },

    newLetterCreated(id: number): void {
      // letter information has been successfully created or updated....reload the page, but now with the appropriate letterId
      console.log("new letter created!");
      console.log("id: ", id);
      let idString: string = id.toString();
      // FIXME this.editModeOn = false;
      // FIXME this.isNew = false;
      this.$router.push({ name: "compose", params: { letterId: idString } });
      // now need to refresh the page; this seems to work, but not sure if it's the right way to do this....
      //this.$router.go(0);
    },

    beforeRouteUpdate(
      to: Route,
      from: Route,
      next: (to?: false) => void
    ): void {
      console.log("before route update!");
      this.name = to.params.name;
      next();
    },

    beforeRouteLeave(to: Route, from: Route, next: (to?: false) => void): void {
      console.log("inside before route leave!");
      if (!this.allEditsSaved) {
        const answer = window.confirm(
          "Do you really want to leave? You have unsaved changes in Boilerplate elements and/or the email message!"
        );
        if (answer) {
          next();
        } else {
          next(false);
        }
      } else {
        next();
      }
    },
  },
});

// Credits:
//   https://github.com/kaorun343/vue-property-decorator/issues/38
//   https://jsfiddle.net/jjloneman/e5a6L27u/26/
//   https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
//   https://stackoverflow.com/questions/52109471/typescript-in-vue-property-validate-does-not-exist-on-type-vue-element/52109899
//   https://stackoverflow.com/questions/52109471/typescript-in-vue-property-validate-does-not-exist-on-type-vue-element/52109899
//   https://stackoverflow.com/questions/56901736/vue-router-hooks-not-triggered-in-component-using-typescript
//   https://stackoverflow.com/questions/56901736/vue-router-hooks-not-triggered-in-component-using-typescript
//   https://www.freecodecamp.org/news/an-introduction-to-dynamic-list-rendering-in-vue-js-a70eea3e321/
//   https://www.w3schools.com/jsref/jsref_tostring_number.asp
//   https://www.youtube.com/watch?v=Y3S7KShrRX0
</script>
