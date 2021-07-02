/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ImageUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateImageDetails
// ====================================================

export interface UpdateImageDetails_updateImage_letterElements_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
}

export interface UpdateImageDetails_updateImage_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
  letter: UpdateImageDetails_updateImage_letterElements_letter;
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
  /**
   * Date this image added
   */
  created: any;
  /**
   * Date this image updated
   */
  updated: any;
  /**
   * Letter elements that use this image
   */
  letterElements: UpdateImageDetails_updateImage_letterElements[];
}

export interface UpdateImageDetails {
  updateImage: UpdateImageDetails_updateImage;
}

export interface UpdateImageDetailsVariables {
  updateInput: ImageUpdateInput;
}
