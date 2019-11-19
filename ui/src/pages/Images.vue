<template>
  <v-container>
    <v-layout row wrap>
      <v-dialog v-model="showDialog" persistent max-width="800">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card>
            <v-card-title class="headline">
              {{ dialogState.heading }}
            </v-card-title>

            <v-card-text>
              <v-text-field
                v-model="dialogState.title"
                label="Title"
                :rules="titleRules"
                :counter="50"
                outlined
                required
                persistent-hint
              />
              <v-layout v-if="showFilePond">
                <v-flex xs6 offset-xs3>
                  <file-pond
                    name="filepondUpload"
                    :server="{
                      url: 'http://localhost:3000/images/',
                      process: 'process'
                    }"
                    @processfile="fileProcessed"
                    @removefile="fileRemoved"
                  />
                </v-flex>
              </v-layout>
              <v-layout v-if="fileNotUploadedMessage">
                <v-flex class="text-center red--text" xs6 offset-xs3>
                  {{ fileNotUploadedMessage }}
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="green darken-1" text @click="closeDialog">
                Cancel
              </v-btn>
              <v-btn
                color="green darken-1"
                :disabled="!valid"
                text
                @click="handleDialogSubmit"
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
        <v-btn color="primary" dark @click.stop="openDialogForCreate">
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
              :src="item.url"
              :alt="item.title"
              max-height="100"
              aspect-ratio="1"
              :contain="true"
            />
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon class="mr-2" @click.stop="openDialogForUpdate(item)">
              mdi-pencil
            </v-icon>
            <v-tooltip v-if="canDelete(item)" top>
              <template v-slot:activator="{ on }">
                <a @click="deleteImage(item.id)" v-on="on">
                  <v-icon>
                    {{ "mdi-close-circle" }}
                  </v-icon>
                </a>
              </template>
              <span>Delete this image.</span>
            </v-tooltip>
            <v-tooltip v-else top>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="grey--text text--lighten-1">
                  {{ "mdi-close-circle" }}
                </v-icon>
              </template>
              <span
                >This image is being used in a letter and cannot be
                deleted.</span
              >
            </v-tooltip>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL_IMAGES_QUERY,
  DELETE_IMAGE_MUTATION,
  UPDATE_IMAGE_DETAILS_MUTATION
} from "@/graphql/images.graphql";
import { AllImages_images } from "@/graphql/types/AllImages";

import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import { FilePondFile } from "@/types/filepond.types";

enum DialogMode {
  CLOSED,
  OPEN_FOR_CREATE,
  OPEN_FOR_EDIT
}

export default Vue.extend({
  name: "Images",

  components: {
    FilePond: vueFilePond(FilePondPluginImagePreview)
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

      valid: false,

      imageDetails: [] as AllImages_images[],
      dialogState: {
        heading: "",
        mode: DialogMode.CLOSED,
        title: "",
        itemForUpdate: {} as AllImages_images
      },

      titleRules: [
        (v: any) => !!v || "Title is required",
        (v: any) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters"
      ],

      fileUploaded: false,
      fileNotUploadedMessage: "",

      uploadFileDetails: {} as FilePondFile
    };
  },

  apollo: {
    imageDetails: {
      query: ALL_IMAGES_QUERY,
      update(data: any) {
        console.log("image data: ", data.images);

        return data.images;
      },
      //update: data => data.images,
      fetchPolicy: "network-only"
    }
  },

  methods: {
    fileProcessed(err: Error, file: FilePondFile) {
      if (err) {
        this.fileUploaded = false;
        throw err;
      }
      this.uploadFileDetails = file;
      this.fileUploaded = true;
      this.fileNotUploadedMessage = "";
      if (!this.valid) {
        // if the form is currently not valid (possibly because of an attempted submission with no file uploaded), recheck it....
        if ((this.$refs.form as any).validate()) {
          this.valid = true;
        }
      }
    },

    fileRemoved(err: Error, file: FilePondFile) {
      console.log("file has been removed: ", file);
      if (err) {
        this.fileUploaded = false;
        throw err;
      }
      this.fileUploaded = false;
      this.valid = false;
      this.fileNotUploadedMessage =
        "Please upload a file before attempting to submit the form.";
    },

    createUploadDetails() {
      //if (!this.fileUploaded) {
      //  //!this.uploadFileDetails) {
      //  throw Error("Upload file details not set");
      //}
      if (this.fileUploaded) {
        this.$apollo
          .mutate({
            mutation: UPDATE_IMAGE_DETAILS_MUTATION,
            variables: {
              updateInput: {
                id: parseInt(this.uploadFileDetails.serverId),
                title: this.dialogState.title
              }
            }
          })
          .then(response => {
            console.log("data for new image: ", response.data.updateImage);
            this.imageDetails.push(response.data.updateImage);
            this.closeDialog();
          })
          .catch(err => {
            throw err;
          });
      } else {
        this.fileNotUploadedMessage =
          "Please upload a file before attempting to submit the form.";
        this.valid = false;
      }
    },

    updateUploadDetails() {
      this.$apollo
        .mutate({
          mutation: UPDATE_IMAGE_DETAILS_MUTATION,
          variables: {
            updateInput: {
              id: this.dialogState.itemForUpdate.id,
              title: this.dialogState.title
            }
          }
        })
        .then(_ => {
          this.dialogState.itemForUpdate.title = this.dialogState.title;
          this.closeDialog();
        })
        .catch(err => {
          throw err;
        });
    },

    handleDialogSubmit() {
      if ((this.$refs.form as any).validate()) {
        console.log(this.uploadFileDetails);
        switch (this.dialogState.mode) {
          case DialogMode.OPEN_FOR_CREATE:
            this.createUploadDetails();
            break;
          case DialogMode.OPEN_FOR_EDIT:
            this.updateUploadDetails();
            break;
          default:
            throw Error(`Invalid dialog state '${this.dialogState}'`);
        }
      }
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

    openDialogForCreate() {
      this.dialogState.heading = "Upload a new image";
      if (this.$refs.form) {
        (this.$refs.form as any).reset(); // FIXME - Don't cast to any.
      }
      this.dialogState.mode = DialogMode.OPEN_FOR_CREATE;
    },

    openDialogForUpdate(item: AllImages_images) {
      this.dialogState.heading = "Update image details";
      this.dialogState.title = item.title;
      this.dialogState.mode = DialogMode.OPEN_FOR_EDIT;
      this.dialogState.itemForUpdate = item;
    },

    closeDialog() {
      this.fileUploaded = false;
      this.fileNotUploadedMessage = "";
      this.dialogState.mode = DialogMode.CLOSED;
    },

    canDelete(item: AllImages_images) {
      return item.letterElements.length === 0;
    }
  },

  computed: {
    showDialog(): boolean {
      return this.dialogState.mode !== DialogMode.CLOSED;
    },

    showFilePond(): boolean {
      return this.dialogState.mode === DialogMode.OPEN_FOR_CREATE;
    }
  }
});
</script>
