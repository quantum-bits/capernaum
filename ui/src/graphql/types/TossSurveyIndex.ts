/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TossSurveyIndex
// ====================================================

export interface TossSurveyIndex_deleteSurveyIndex {
  __typename: "SurveyIndexDeleteOutput";
  /**
   * ID of deleted index
   */
  deletedIndexId: number;
  /**
   * IDs of items removed from the deleted index
   */
  deletedItemIds: number[];
}

export interface TossSurveyIndex {
  /**
   * Delete an index. Also removes associations with items; the items are not removed.
   */
  deleteSurveyIndex: TossSurveyIndex_deleteSurveyIndex;
}

export interface TossSurveyIndexVariables {
  id: number;
}
