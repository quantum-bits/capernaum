/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneImage
// ====================================================

export interface OneImage_image {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  originalName: string;
  mimeType: string;
  created: any;
  updated: any;
  url: string;
}

export interface OneImage {
  image: OneImage_image;
}

export interface OneImageVariables {
  id: number;
}
