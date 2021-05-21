/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TossSurveyDimension
// ====================================================

export interface TossSurveyDimension_deleteSurveyDimension {
  /**
   * ID of deleted dimension
   */
  deletedDimensionId: number;
  /**
   * IDs of all deleted indices
   */
  deletedIndexIds: number[];
  /**
   * IDs of all items no longer associated with any deleted index
   */
  deletedItemIds: number[];
}

export interface TossSurveyDimension {
  /**
   * Delete a dimension. Also deletes indices associated with this dimension.
   *     Each index is removed using the equivalent of deleteSurveyIndex.
   *     Returns details of everything that was deleted.
   */
  deleteSurveyDimension: TossSurveyDimension_deleteSurveyDimension;
}

export interface TossSurveyDimensionVariables {
  id: number;
}
