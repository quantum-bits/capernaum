/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ImageUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateImageDetails
// ====================================================

export interface UpdateImageDetails_updateImage_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface UpdateImageDetails_updateImage {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Image title from user
   */
  title: string;
  url: string;
  /**
   * Internal unique ID
   */
  uuid: string;
  /**
   * Original name of image file
   */
  originalName: string;
  /**
   * MIME encoding for this image
   */
  mimeType: string;
  created: any;
  updated: any;
  letterElements: UpdateImageDetails_updateImage_letterElements[];
}

export interface UpdateImageDetails {
  updateImage: UpdateImageDetails_updateImage;
}

export interface UpdateImageDetailsVariables {
  updateInput: ImageUpdateInput;
}
