/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllImages
// ====================================================

export interface AllImages_images_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface AllImages_images {
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
  created: any;
  updated: any;
  letterElements: AllImages_images_letterElements[];
}

export interface AllImages {
  images: AllImages_images[];
}
