/**
 * Used when fetching survey items; this enum parallels one defined in the server-side code
 */
export enum WhichItems {
  ALL = "All",
  WITH_INDEX = "WithIndex",
  WITHOUT_INDEX = "WithoutIndex",
}

/**
 * These interfaces represent _views_ of the data in the UI.
 */
export interface GroupResponsesQueryVariables {
  groupId: number;
}
