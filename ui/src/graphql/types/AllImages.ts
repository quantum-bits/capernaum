/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllImages
// ====================================================

export interface AllImages_images {
  /**
   * Unique ID for this entity
   */
  id: number;
  title: string;
  uuid: string;
  mimeType: string;
  originalName: string;
}

export interface AllImages {
  images: AllImages_images[];
}
