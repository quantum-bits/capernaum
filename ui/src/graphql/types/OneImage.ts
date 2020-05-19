/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OneImage
// ====================================================

export interface OneImage_image_letterElements {
  /**
   * Unique ID for this entity
   */
  id: number;
}

export interface OneImage_image {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  url: string;
  uuid: string;
  originalName: string;
  mimeType: string;
  created: any;
  updated: any;
  letterElements: OneImage_image_letterElements[];
}

export interface OneImage {
  image: OneImage_image;
}

export interface OneImageVariables {
  id: number;
}
