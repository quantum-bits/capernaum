/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneImage
// ====================================================

export interface OneImage_imageDetails_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface OneImage_imageDetails {
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
  letterElements: OneImage_imageDetails_letterElements[];
}

export interface OneImage {
  imageDetails: OneImage_imageDetails;
}

export interface OneImageVariables {
  id: number;
}
