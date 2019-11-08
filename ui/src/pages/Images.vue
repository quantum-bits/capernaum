<template>
  <v-container>
    <v-layout row wrap>
      <v-dialog v-model="isDialogOpen" persistent max-width="800">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title class="headline">Upload Image</v-card-title>

            <v-card-text>
              <v-text-field
                v-model="imageDetailsTitle"
                label="Title"
                :rules="titleRules"
                :counter="50"
                outlined
                required
                persistent-hint
              />
              <v-layout>
                <v-flex xs6 offset-xs3>
                  <file-pond
                    name="filepondUpload"
                    :server="{
                      url: 'http://localhost:3000/upload/',
                      process: 'process'
                    }"
                    @processfile="fileProcessed"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="green darken-1" text @click="cancelDialog()">
                Cancel
              </v-btn>
              <v-btn
                color="green darken-1"
                :disabled="!valid"
                text
                @click="submitUploadDetails()"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-flex xs9>
        <h1 class="headline mb-5">Uploaded Images</h1>
      </v-flex>

      <v-flex xs3 class="text-xs-right">
        <v-btn color="primary" dark @click="openDialog">
          Upload New Image
        </v-btn>
      </v-flex>

      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="imageDetails"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <!--<td class="text-xs-right">{{ item.description }}</td>-->
              <td class="text-xs-right">{{ item.title }}</td>
              <td class="text-xs-right">{{ item.description }}</td>
              <td class="text-xs-right">
                <!-- https://stackoverflow.com/questions/40899532/how-to-pass-a-value-from-vue-data-to-href -->
                <v-btn text :href="item.moreInfoUrl" target="_blank"
                  >More Info
                </v-btn>
              </td>
              <td class="text-xs-right">
                <v-btn text v-on:click="editSEPractice(item)">
                  Edit
                </v-btn>
                <v-tooltip v-if="!item.canDelete" top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">
                      <v-btn text disabled> Delete</v-btn>
                    </span>
                  </template>
                  <span
                    >This SE Practice cannot be deleted because it has boolean
                    associations.</span
                  >
                </v-tooltip>
                <v-btn v-else text v-on:click="deleteSEPractice(item)">
                  Delete
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import {
  ALL_IMAGES_QUERY,
  UPDATE_IMAGE_DETAILS_MUTATION
} from "@/graphql/images.graphql";

interface FilePondFile {
  id: string;
  serverId: string;
  origin: number;
  status: number;
  fileExtension: string;
  fileSize: number;
  filename: string;
  filenameWithoutExtension: string;
}

export default Vue.extend({
  name: "Images",

  components: {
    FilePond: vueFilePond()
  },

  data() {
    return {
      headers: [
        {
          text: "Title",
          align: "left",
          sortable: true,
          value: "title"
        },
        {
          text: "Image",
          align: "left",
          sortable: false,
          value: "image"
        },
        { text: "Action", sortable: false }
      ],

      isDialogOpen: false,
      valid: true,
      imageDetailsTitle: "" as string,

      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters"
      ],

      uploadFileServerId: ""
    };
  },

  apollo: {
    imageDetails: {
      query: ALL_IMAGES_QUERY,
      update: data => data.images
    }
  },

  methods: {
    fileProcessed(err: Error, file: FilePondFile) {
      if (err) {
        throw err;
      }
      this.uploadFileServerId = file.serverId;
    },

    submitUploadDetails() {
      if (this.uploadFileServerId.length === 0) {
        throw Error("Upload file ID not set");
      }

      this.$apollo
        .mutate({
          mutation: UPDATE_IMAGE_DETAILS_MUTATION,
          variables: {
            updateInput: {
              serverId: this.uploadFileServerId,
              title: this.imageDetailsTitle
            }
          }
        })
        .then(data => {
          console.log("UPDATE IMAGE RESULT", data);
        })
        .catch(err => {
          throw err;
        });
    },

    openDialog() {
      this.isDialogOpen = true;
    },

    cancelDialog() {
      this.isDialogOpen = false;
    }
  }
});
</script>
