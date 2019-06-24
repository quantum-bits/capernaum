<template>
  <v-container>
      <v-layout v-if="isFrozen" class="mb-3">
        <v-flex xs12>
                <v-alert
                    :value="true"
                    type="info"
                >
                    Note that this association table has been frozen -- it is no longer editable.
                </v-alert>
        </v-flex>
      </v-layout>
        <div v-if="!editModeOn">
            <v-layout row wrap>
                <v-flex xs8>
                    <h1 class="headline mb-3">{{ title }}</h1>
                    <h2 class="title font-weight-regular mb-1">
                    Survey:
                    <span class="font-weight-light">{{ surveyTitle }}</span>
                    </h2>
                    <h2 class="title font-weight-regular mb-5">
                    Last Update:
                    <span class="font-weight-light">{{ lastUpdate }}</span>
                    </h2>
                </v-flex>
                <v-flex v-if="!isFrozen" xs4 class="text-xs-right">
                    <v-btn
                        color="primary"
                        :disabled="tableEditModeOn"
                        :dark="!tableEditModeOn"
                        @click="toggleEditMode"
                        >
                        Edit
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>
        <div v-else>
            <AssociationTableInfoForm
            :id="id"
            :initialTitle="title"
            :initialSurveyId="surveyId"
            :isNew="isNew"
            v-on:save-info="saveInfo" 
            >
            </AssociationTableInfoForm>
        </div>

    <v-layout v-if="!tableEditModeOn" row wrap>
        <v-flex xs9>
            <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
        </v-flex>
        <v-flex v-if="!isFrozen" xs3 class="text-xs-right">
            <v-btn
                color="primary"
                :disabled="editModeOn"
                :dark="!editModeOn"
                @click="editTable"
                >
                Edit Table
            </v-btn>
        </v-flex>
        <v-flex xs12>
            <v-data-table
                :headers="headers"
                :items="tableData"
                :rows-per-page-items="rowsPerPageItems"
                class="elevation-1"
            >
            <!-- https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table -->
                <template slot="items" slot-scope="myprops">
                    <td v-for="header in headers" :key="header.value" class="text-xs-center">
                        <span v-if="header.value === 'practice'">
                            {{ myprops.item[header.value] }}
                        </span>
                        <span v-else>
                            <v-icon v-if="myprops.item.spiritualFocusOrientationIdDict[header.value]" color="success">check_circle</v-icon>
                        </span>
                    </td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>

    <v-layout v-if="tableEditModeOn" row wrap>
        <v-flex xs9>
            <h2 class="title font-weight-regular mb-3 mt-3">Association Table:</h2>
        </v-flex>
        <v-flex v-if="!isFrozen" xs3 class="text-xs-right">
            <v-btn
                color="success"
                dark
                @click="saveTableEdits"
                >
                Save Table Edits
            </v-btn>
        </v-flex>
        <v-flex xs12>
            <v-data-table
                :headers="headers"
                :items="tableData"
                :rows-per-page-items="rowsPerPageItems"
                class="elevation-1"
            >
            <!-- https://stackoverflow.com/questions/49607082/dynamically-building-a-table-using-vuetifyjs-data-table -->
                <template slot="items" slot-scope="myprops">
                    <td v-for="header in headers" :key="header.value" class="text-xs-center">
                        <span v-if="header.value === 'practice'">
                            {{ myprops.item[header.value] }}
                        </span>
                        <span v-else>
                            <!-- note: deleted :input-value="myprops.item[header.value]", since it seemed superfluous with the addition of v-model -->
                            <v-checkbox
                                v-model="myprops.item.spiritualFocusOrientationIdDict[header.value]"
                                color="primary"
                                hide-details
                                @change="onCheckboxChange"
                            ></v-checkbox>
                        </span>
                    </td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>


  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { AxiosResponse } from "axios";
import _ from "lodash";

//import LetterTextArea from "../components/LetterTextArea.vue";
//import StaticLetterElement from "../components/StaticLetterElement.vue";
import AssociationTableInfoForm from "../components/AssociationTableInfoForm.vue";

//import { LetterElementMenuItemType, LetterElementType, LetterElementEnum } from "./letter-element.types";
import { ScriptureEngagementPractice, TableData, SpiritualFocusOrientation, AssociationTableHeader } from "./association-table.types";

@Component({
  components: { AssociationTableInfoForm }
})
export default class AssociationTable extends Vue {

rowsPerPageItems: any = [
    15,
    30,
    {"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}
]

tableColumns: SpiritualFocusOrientation[] = [];
tableData: TableData[] = [];
headers: AssociationTableHeader[] = [];

tableEditModeOn: boolean = false;

isNew: boolean = false; // true if this is a new table association
editModeOn: boolean = false;
title: string = '';
surveyTitle: string = '';
surveyId: number = -1;
lastUpdate: string = '';
id: number = -1;

isFrozen: boolean = false;

toggleEditMode() {
    this.editModeOn = true;
}

saveInfo() {
    // save the letter info (title, etc....maybe do this in the child component and reload the page?)
    this.editModeOn = false;
}

editTable() {
    this.tableEditModeOn = true;
}

saveTableEdits() {
    // save edits to db....
    this.tableEditModeOn = false;
    //console.log(this.tableData);
    let scriptureEngagementPracticeData: ScriptureEngagementPractice[] = [];
    let spiritualFocusOrientationIds: number[] = [];
    for (let tableRow of this.tableData) {
        spiritualFocusOrientationIds = [];
        //https://stackoverflow.com/questions/16174182/typescript-looping-through-a-dictionary
        Object.entries(tableRow.spiritualFocusOrientationIdDict).forEach(
            ([key, value]) => {
                //console.log(key, value);
                if (value) {
                    // the focus/orientation ids are part of the key in the spiritualFocusOrientationIdDict object
                    // (e.g., "columnId-2" means the focus/orientation id is 2);
                    // if the value is true, the id is harvested from the key and saved to an array
                    let id: number = +key.split("columnId-")[1];
                    spiritualFocusOrientationIds.push(id);
                }
            }
        );
        scriptureEngagementPracticeData.push({
            id: tableRow.practiceId,
            order: tableRow.practiceOrder,
            title: tableRow.practice,
            spiritualFocusOrientationIds: spiritualFocusOrientationIds
        });
    }
    console.log('data ready to be saved: ', scriptureEngagementPracticeData);
}

onCheckboxChange() {
    //console.log(this.tableData);
    //could use this to save data every time a change is made....
}
constructTable(scriptureEngagementPractices: ScriptureEngagementPractice[]) {
    // the data come in from the db in ScriptureEngagementPractice[] format, but we need to create a new
    // data type (TableData) in order to display the data conveniently in a table; when we go to save the data, we
    // revert back to the ScriptureEngagementPractice[] data type; the source for truth (up to this point)
    // in the page is this.tableData, which is of the TableData type
    axios
        .get("http://localhost:3000/spiritual-foci-orientations/")
        .then((response: AxiosResponse) => {
            this.tableColumns = _.orderBy(response.data,"order");
            // construct headers for data table
            this.headers.push({
                text: 'SE Practice',
                align: 'left',
                sortable: true,
                value: 'practice'
            });
            for (let col of this.tableColumns) {
                this.headers.push({
                    text: col.abbr,
                    align: 'left',
                    sortable: true,
                    value: 'columnId-'+col.id
                });
            }

            let newDataRowObject: any = {};
            let colKey: string = '';
            let idDict: any = {};
            for (let row of scriptureEngagementPractices) {
                newDataRowObject = {};
                newDataRowObject.practice = row.title;
                newDataRowObject.practiceId = row.id; // added so that we can figure out which practice this is when we go to save the data
                newDataRowObject.practiceOrder = row.order; // added so we know the original ordering...not sure if we will allow this to change
                idDict = {};
                for (let column of this.tableColumns) {
                    idDict['columnId-'+column.id] = row.spiritualFocusOrientationIds.includes(column.id);
                }
                newDataRowObject.spiritualFocusOrientationIdDict = idDict;
                this.tableData.push(newDataRowObject);
            }
            console.log('table: ', this.tableData);
            console.log('headers: ', this.headers);
        });
}

  // assume that when we edit a text box, we save all of them (to make sure that ordering info is preserved, etc.)
mounted() {
    console.log("route param: ", this.$route.params.id);
    if (this.$route.params.id === undefined) {
      // launch form for creating a new letter
        this.editModeOn = true;
        this.tableEditModeOn = false;
        this.isNew = true;
        axios
            .get("http://localhost:3000/scripture-engagement-practices/")
            .then((response: AxiosResponse) => {
                console.log(response.data);
                let scriptureEngagementPractices: ScriptureEngagementPractice[] = [];
                response.data.forEach((practice: any) => {
                    scriptureEngagementPractices.push({
                        id: practice.id,
                        order: practice.order,
                        title: practice.title,
                        spiritualFocusOrientationIds: []
                    });
                });
                scriptureEngagementPractices = _.orderBy(scriptureEngagementPractices,"order");
                this.constructTable(scriptureEngagementPractices);
            });
    } else {
      axios
        .get("http://localhost:3000/boolean-associations/" + this.$route.params.id)
        .then((response: AxiosResponse) => {
            //console.log(response);
            let scriptureEngagementPractices: ScriptureEngagementPractice[] = [];
            response.data.scriptureEngagementPractices.forEach((practice: any) => {
                scriptureEngagementPractices.push(practice);
            });
            scriptureEngagementPractices = _.orderBy(scriptureEngagementPractices,"order");
            this.title = response.data.title;
            this.surveyTitle = response.data.surveyTitle;
            this.lastUpdate = response.data.lastUpdate;
            this.id = response.data.id;
            this.surveyId = response.data.surveyId;
            this.isFrozen = response.data.isFrozen;
            this.constructTable(scriptureEngagementPractices);
        }); 
    }
  }
}
</script>
