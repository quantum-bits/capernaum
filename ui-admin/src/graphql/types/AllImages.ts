/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllImages
// ====================================================

export interface AllImages_imageDetails_letterElements_letter {
  /**
   * Unique ID for this entity
   */
  id: number;
  /**
   * Letter title
   */
  title: string;
}

export interface AllImages_imageDetails_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
  letter: AllImages_imageDetails_letterElements_letter;
}

export interface AllImages_imageDetails {
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
   * MIME encoding for this image
   */
  mimeType: string;
  /**
   * Original name of image file
   */
  originalName: string;
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
  letterElements: AllImages_imageDetails_letterElements[];
}

export interface AllImages {
  imageDetails: AllImages_imageDetails[];
}
