/* tslint:disable */
/* eslint-disable */
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
  title: string;
  url: string;
  uuid: string;
  mimeType: string;
  originalName: string;
  created: any;
  updated: any;
  letterElements: AllImages_images_letterElements[];
}

export interface AllImages {
  images: AllImages_images[];
}
