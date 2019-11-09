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
                      url: 'http://localhost:3000/images/',
                      process: 'process'
                    }"
                    @processfile="fileProcessed"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="green darken-1" text @click="closeDialog()">
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
          <template v-slot:item.image="{ item }">
            <v-img
              :src="`http://localhost:3000/images/${item.id}`"
              :alt="item.title"
              max-height="100"
              aspect-ratio="1"
              :contain="true"
            />
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2">mdi-pencil</v-icon>
            <v-icon small @click="deleteImage(item.id)">mdi-delete</v-icon>
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
  DELETE_IMAGE_MUTATION,
  UPDATE_IMAGE_DETAILS_MUTATION
} from "@/graphql/images.graphql";
import { AllImages_images } from "@/graphql/types/AllImages";
import { FilePondFile } from "@/types/filepond.types";

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
          value: "title",
          width: "35%"
        },
        {
          text: "Image",
          value: "image",
          align: "center",
          width: "50%"
        },
        {
          text: "Action",
          value: "action",
          width: "15%",
          sortable: false
        }
      ],

      isDialogOpen: false,
      valid: true,
      imageDetailsTitle: "" as string,
      imageDetails: [] as AllImages_images[],

      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters"
      ],

      uploadFileDetails: {} as FilePondFile
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
      console.log("FILE FILE FILE", file);
      this.uploadFileDetails = file;
    },

    submitUploadDetails() {
      if (!this.uploadFileDetails) {
        throw Error("Upload file details not set");
      }

      this.$apollo
        .mutate({
          mutation: UPDATE_IMAGE_DETAILS_MUTATION,
          variables: {
            updateInput: {
              id: parseInt(this.uploadFileDetails.serverId),
              title: this.imageDetailsTitle
            }
          }
        })
        .then(response => {
          console.log(JSON.stringify(response, null, 2));
          this.imageDetails.push(response.data.updateImage);
          this.closeDialog();
        })
        .catch(err => {
          throw err;
        });
    },

    deleteImage(id: number) {
      this.$apollo
        .mutate({
          mutation: DELETE_IMAGE_MUTATION,
          variables: {
            id
          }
        })
        .then(_ => {
          this.imageDetails = this.imageDetails.filter(
            detail => detail.id !== id
          );
        })
        .catch(err => {
          throw err;
        });
    },

    openDialog() {
      this.isDialogOpen = true;
    },

    closeDialog() {
      this.isDialogOpen = false;
    }
  }
});
</script>
