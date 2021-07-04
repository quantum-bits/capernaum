<template>
  <v-container>
    <page-header title="Uploaded Images">
      <v-btn color="primary" @click.stop="openDialogForCreate">
        Upload New Image
      </v-btn>
    </page-header>
    <v-row>
      <v-col>
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
          <template v-slot:item.usedIn="{ item }">
            {{ usedInLetters(item) || "(None)" }}
          </template>
          <template v-slot:item.updated="{ item }">
            {{ item.created | standardDate }} /
            {{ item.updated | standardDate }}
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
              <span>
                This image is being used in a letter and cannot be deleted.
              </span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

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
            <v-row v-if="showFilePond">
              <v-col>
                <file-pond
                  name="filepondUpload"
                  :server="{ url: '/images/', process: 'process' }"
                  @processfile="fileProcessed"
                  @removefile="fileRemoved"
                />
              </v-col>
            </v-row>
            <v-row v-if="fileNotUploadedMessage">
              <v-col class="text-center red--text">
                {{ fileNotUploadedMessage }}
              </v-col>
            </v-row>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL_IMAGES_QUERY,
  DELETE_IMAGE,
  UPDATE_IMAGE_DETAILS,
} from "@/graphql/images.graphql";
import { AllImages, AllImages_imageDetails } from "@/graphql/types/AllImages";
import vueFilePond from "vue-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import { FilePondFile } from "@/types/filepond.types";
import PageHeader from "@/pages/PageHeader.vue";
import * as _ from "lodash";

enum DialogMode {
  CLOSED,
  OPEN_FOR_CREATE,
  OPEN_FOR_EDIT,
}

interface DialogState {
  heading: string;
  mode: DialogMode;
  title: string;
  itemForUpdate: AllImages_imageDetails;
}

export default Vue.extend({
  name: "Images",

  components: {
    FilePond: vueFilePond(FilePondPluginImagePreview),
    PageHeader,
  },

  data() {
    return {
      headers: [
        { text: "Title", value: "title" },
        { text: "Image", value: "image", width: "40%" },
        { text: "Created/Updated", value: "updated" },
        { text: "Used In Letter(s)", value: "usedIn" },
        { text: "Action", value: "action" },
      ],

      valid: false,

      imageDetails: [] as AllImages_imageDetails[],
      dialogState: {
        heading: "",
        mode: DialogMode.CLOSED,
        title: "",
        itemForUpdate: {} as AllImages_imageDetails,
      } as DialogState,

      titleRules: [
        (v: string) => !!v || "Title is required",
        (v: string) =>
          (v && v.length <= 50) ||
          "Title of letter must be fewer than 50 characters",
      ],

      fileUploaded: false,
      fileNotUploadedMessage: "",

      uploadFileDetails: {} as FilePondFile,
    };
  },

  apollo: {
    imageDetails: {
      query: ALL_IMAGES_QUERY,
      update(data: AllImages) {
        return data.imageDetails;
      },
      fetchPolicy: "network-only",
    },
  },

  methods: {
    usedInLetters(image: AllImages_imageDetails) {
      return _.chain(image.letterElements)
        .flatMap((elt) => elt.letter)
        .map("title")
        .value()
        .join(", ");
    },

    fileProcessed(err: Error, file: FilePondFile) {
      if (err) {
        this.fileUploaded = false;
        throw err;
      }
      this.uploadFileDetails = file;
      this.fileUploaded = true;
      this.fileNotUploadedMessage = "";
      if (!this.valid) {
        // If the form is currently not valid (possibly because of an attempted submission
        // with no file uploaded), recheck it.
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
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
      if (this.fileUploaded) {
        this.$apollo
          .mutate({
            mutation: UPDATE_IMAGE_DETAILS,
            variables: {
              updateInput: {
                id: parseInt(this.uploadFileDetails.serverId),
                title: this.dialogState.title,
              },
            },
          })
          .then((response) => {
            console.log("data for new image: ", response.data.updateImage);
            this.imageDetails.push(response.data.updateImage);
            this.closeDialog();
          })
          .catch((err) => {
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
          mutation: UPDATE_IMAGE_DETAILS,
          variables: {
            updateInput: {
              id: this.dialogState.itemForUpdate.id,
              title: this.dialogState.title,
            },
          },
        })
        .then(() => {
          this.dialogState.itemForUpdate.title = this.dialogState.title;
          this.closeDialog();
        })
        .catch((err) => {
          throw err;
        });
    },

    handleDialogSubmit() {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
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
          mutation: DELETE_IMAGE,
          variables: {
            id,
          },
        })
        .then(() => {
          this.imageDetails = this.imageDetails.filter(
            (detail) => detail.id !== id
          );
        })
        .catch((err) => {
          throw err;
        });
    },

    openDialogForCreate() {
      this.dialogState.heading = "Upload a new image";
      if (this.$refs.form) {
        (this.$refs.form as Vue & { reset: () => boolean }).reset();
      }
      this.dialogState.mode = DialogMode.OPEN_FOR_CREATE;
    },

    openDialogForUpdate(item: AllImages_imageDetails) {
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

    canDelete(item: AllImages_imageDetails) {
      return item.letterElements.length === 0;
    },
  },

  computed: {
    showDialog(): boolean {
      return this.dialogState.mode !== DialogMode.CLOSED;
    },

    showFilePond(): boolean {
      return this.dialogState.mode === DialogMode.OPEN_FOR_CREATE;
    },
  },
});
</script>
