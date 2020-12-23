import { buildSchema, graphqlSync, getIntrospectionQuery } from "graphql";

const sdlString = `
"""Scripture engagement practice"""
type ScriptureEngagementPractice {
  """Unique ID for this entity"""
  id: Int!
  title: String!
  description: String!
  moreInfoUrl: String!
  sequence: Int!
  predictionTableEntries: [PredictionTableEntry!]!
}

type LetterType {
  """Unique ID for this entity"""
  id: Int!
  key: String!
  description: String!
  letterElementTypes: [LetterElementType!]!
}

type LetterElementType {
  """Unique ID for this entity"""
  id: Int!
  key: String!
  description: String!
  letterTypes: [LetterType!]!
}

type Letter {
  """Unique ID for this entity"""
  id: Int!
  title: String!
  description: String!
  emailMessage: String!
  created: DateTime!
  updated: DateTime!
  isFrozen: Boolean!
  survey: Survey!
  letterType: LetterType!
  letterElements: [LetterElement!]!
  tableEntries: [PredictionTableEntry!]!
  scriptureEngagementPractices: [ScriptureEngagementPractice!]!
}

"""
A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
"""
scalar DateTime

type Image {
  """Unique ID for this entity"""
  id: Int!
  originalName: String!
  mimeType: String!
  uuid: String!
  title: String!
  created: DateTime!
  updated: DateTime!
  url: String!
  fullPath: String!
  letterElements: [LetterElement!]!
}

type LetterElement {
  """Unique ID for this entity"""
  id: Int!
  sequence: Int!
  textDelta: String
  image: Image
  letter: Letter!
  letterElementType: LetterElementType!
  surveyDimension: SurveyDimension
}

"""One entry in a prediction table"""
type PredictionTableEntry {
  """Unique ID for this entity"""
  id: Int!
  letter: Letter!
  surveyIndex: SurveyIndex!
  practice: ScriptureEngagementPractice!
  sequence: Int!
}

type ChartEntry {
  title: String!
  value: Int!
}

type PredictionDetails {
  title: String!
  abbreviation: String!
  meanResponse: Float!
}

type QualtricsResponseImportStats {
  importCount: Int!
  duplicateCount: Int!
  surveyResponses: [SurveyResponse!]!
}

"""Top-level grouping of questions in Capernaum; contains indices"""
type SurveyDimension {
  """Unique ID for this entity"""
  id: Int!
  survey: Survey
  surveyIndices: [SurveyIndex!]!

  """Title of this dimension (e.g., 'Focus on Prayer')"""
  title: String!

  """Sequence number; dimension are displayed in this order."""
  sequence: Int!
}

type SurveyDimensionDeleteOutput {
  """ID of deleted dimension"""
  deletedDimensionId: Int!

  """IDs of all deleted indices"""
  deletedIndexIds: [Int!]!

  """IDs of all items no longer associated with any deleted index"""
  deletedItemIds: [Int!]!
}

"""Collection of survey items, grouped for analysis"""
type SurveyIndex {
  """Unique ID for this entity"""
  id: Int!
  surveyDimension: SurveyDimension!

  """Use this index in prediction tables?"""
  useForPredictions: Boolean!
  surveyItems: [SurveyItem!]!
  predictionTableEntries: [PredictionTableEntry!]!

  """Abbreviation for this index (e.g., 'FOG')"""
  abbreviation: String!

  """Title of this index"""
  title: String!
}

type SurveyIndexDeleteOutput {
  """ID of deleted index"""
  deletedIndexId: Int!

  """IDs of items removed from the deleted index"""
  deletedItemIds: [Int!]!
}

type Group {
  """Unique ID for this entity"""
  id: Int!

  """Group name"""
  name: String!

  """Type of group"""
  type: String!

  """Date when survey created"""
  created: String!

  """Date when survey closes"""
  closedAfter: String!

  """Group administrator first name"""
  adminFirstName: String!

  """Group administrator last name"""
  adminLastName: String!

  """Group administrator email address"""
  adminEmail: String!

  """Survey code word used by group"""
  codeWord: String!
  survey: Survey!

  """Responses by this group"""
  surveyResponses: [SurveyResponse!]!
}

"""One user's response to a survey"""
type SurveyResponse {
  """Unique ID for this entity"""
  id: Int!
  survey: Survey!
  surveyItemResponses: [SurveyItemResponse!]!
  email: String!
  codeWord: String!
  qualtricsResponseId: String!
  startDate: String!
  endDate: String!
  recordedDate: String!
  status: Int!
  progress: Int!
  duration: Int!
  finished: Int!
  ipAddress: String!
  latitude: String!
  longitude: String!
}

"""One user's response to a single survey question"""
type SurveyItemResponse {
  """Unique ID for this entity"""
  id: Int!
  surveyResponse: SurveyResponse!
  surveyItem: SurveyItem!
  label: String!
  value: Int!
}

"""One item (question) from a survey"""
type SurveyItem {
  """Unique ID for this entity"""
  id: Int!
  survey: Survey!
  surveyIndex: SurveyIndex
  surveyItemResponses: [SurveyItemResponse!]!

  """Sequence number; items will be displayed in this order"""
  sequence: Int!

  """Qualtrics identifier for this question"""
  qualtricsId: String!

  """Text of this question from Qualtrics"""
  qualtricsText: String!
  surveyItemResponse(responseId: Int!): SurveyItemResponse
}

"""All information about a survey imported from Qualtrics"""
type Survey {
  """Unique ID for this entity"""
  id: Int!

  """Fetch the letters for this survey"""
  letters: [Letter!]!

  """
  All the Qualtrics items for this survey; 
      for groupings, see survey dimension and index.
      Pass 'whichItems' to choose which to return (default 'All')
  """
  surveyItems(whichItems: WhichItems = All): [SurveyItem!]!

  """Groups using this survey"""
  groups: [Group!]!

  """Dimensions for this survey; groups indices, which group items."""
  surveyDimensions: [SurveyDimension!]!

  """Responses for this survey"""
  surveyResponses: [SurveyResponse!]!

  """Unique identifier for this survey on Qualtrics"""
  qualtricsId: String!

  """Name of this survey on Qualtrics"""
  qualtricsName: String!

  """Date and time at which this survey was modified on Qualtrics"""
  qualtricsModDate: String!

  """Key of response value containing email address"""
  emailKey: String!

  """Key of response value containing group code"""
  groupCodeKey: String!

  """Make this survey available to groups?"""
  okayForGroup: Boolean!

  """Public name for survey (e.g., in group sign-up)"""
  publicName: String!

  """Detailed description of this survey; mostly for group use"""
  detailedDescription: String!

  """Convenience property to retrieve SE practices"""
  scriptureEngagementPractices: [ScriptureEngagementPractice!]!
}

"""
Which items to retrieve: all, those with an index, those without an index
"""
enum WhichItems {
  All
  WithIndex
  WithoutIndex
}

type ItemSummary {
  id: Int!
  qualtricsId: String!
  qualtricsText: String!
  responseId: Int!
  responseLabel: String!
  responseValue: Float!
}

type IndexSummary {
  id: Int!
  title: String!
  abbreviation: String!
  meanResponse: Float!
  itemSummaries: [ItemSummary!]!
}

type DimensionSummary {
  id: Int!
  title: String!
  indexSummaries: [IndexSummary!]!
}

type SurveySummary {
  id: Int!
  title: String!
  qualtricsId: String!
  qualtricsName: String!
}

type PracticeSummary {
  id: Int!
  title: String!
  description: String!
}

type PredictionSummary {
  practiceSummary: PracticeSummary!
  predictionDetails: [PredictionDetails!]!
  predict: Boolean!
}

type ResponseSummary {
  id: Int!
  qualtricsResponseId: String!
  email: String!
  date: String!
  surveySummary: SurveySummary!
  dimensionSummaries: [DimensionSummary!]!
  predictionSummaries: [PredictionSummary!]!
}

type UserRole {
  """Unique ID for this entity"""
  id: Int!
  name: String!
  description: String!
}

type User {
  """Unique ID for this entity"""
  id: Int!
  email: String!
  firstName: String!
  lastName: String!
  roles: [UserRole!]!
}

type UserPayload {
  id: Float!
  firstName: String!
  lastName: String!
  email: String!
  roles: [UserRole!]!
}

type LoginResponse {
  accessToken: String!
  user: UserPayload!
}

type Envelope {
  from: String!
  to: [String!]!
}

type SendMailResponse {
  accepted: [String!]!
  rejected: [String!]!
  envelopeTime: Float!
  messageTime: Float!
  messageSize: Float!
  response: String!
  envelope: Envelope!
  messageId: String!
}

type Event {
  """Unique ID for this entity"""
  id: Int!
  date: String!
  type: String!
  details: String!
}

type Machine {
  """Unique ID for this entity"""
  id: Int!
  name: String!
  hostName: String!
  active: Boolean!
}

type WriterOutput {
  ok: Boolean!

  """Message to UI"""
  message: String!

  """Name of PDF file (e.g., 'abc.pdf')"""
  pdfFileName: String!

  """Relative path to PDF file (e.g., 'static/pdfs/abc.pdf')"""
  pdfRelativePath: String!

  """
  Absolute path to PDF file (e.g., '/home/capernaum/static/pdfs/abc.pdf')
  """
  pdfAbsolutePath: String!
  responseSummary: ResponseSummary
}

type QualtricsSurveyListItem {
  qualtricsId: String!
  qualtricsName: String!
  qualtricsOwnerId: String!
  qualtricsModDate: String!
  qualtricsCreationDate: String!
  qualtricsIsActive: Boolean!
  importedToCapernaum: Boolean!
}

type QualtricsOrganization {
  id: String!
  name: String!
  baseUrl: String!
  type: String!
  status: String!
  creationDate: String!
  expirationDate: String!
}

type QualtricsSubscription {
  id: String!
  scope: String!
  topics: String!
  publicationUrl: String!
  encrypted: Boolean!
  successfulCalls: Int!
}

type Query {
  survey(id: Int!): Survey!
  surveys: [Survey!]!
  surveyDimensions: [SurveyDimension!]!
  surveyIndices: [SurveyIndex!]!

  """Retrieve all survey items"""
  surveyItems: [SurveyItem!]!
  surveyResponse(id: Int!): SurveyResponse!
  surveyResponses(
    """Limit to one group"""
    groupId: Int
  ): [SurveyResponse!]!
  surveyDimension(id: Int!): SurveyDimension!
  updateSurveyDimension: SurveyDimension!
  scriptureEngagementPractice(id: Int!): ScriptureEngagementPractice!
  scriptureEngagementPractices: [ScriptureEngagementPractice!]!
  user(id: Int!): User!
  users: [User!]!
  userRoles: [UserRole!]!
  letter(id: Int!): Letter!
  letters: [Letter!]!
  letterElementTypes: [LetterElementType!]!
  readLetterTypes: [LetterType!]!
  images: [Image!]!
  image(id: Int!): Image!
  qualtricsSurveys(includeInactive: Boolean = false): [QualtricsSurveyListItem!]!
  organization(organizationId: String = "taylorcfse"): QualtricsOrganization!
  subscriptions: [QualtricsSubscription!]!
  events: [Event!]!
  machines: [Machine!]!
  readGroups: [Group!]!
}

type Mutation {
  """Create a new survey."""
  createSurvey(createInput: SurveyCreateInput!): Survey! @deprecated(reason: "Should only create surveys from Qualtrics")

  """Create a survey dimension."""
  createSurveyDimension(createInput: SurveyDimensionCreateInput!): SurveyDimension!

  """Create a survey index. Can add survey items directly by item ID."""
  createSurveyIndex(createInput: SurveyIndexCreateInput!): SurveyIndex!
  updateSurvey(updateInput: SurveyUpdateInput!): Survey!
  updateSurveyDimension(updateInput: SurveyDimensionUpdateInput!): SurveyDimension!

  """
  Update an index. Field values will replaces existing values in the object.
        (e.g., if you give a value for itemIds, it will replace the current list.
  """
  updateSurveyIndex(updateInput: SurveyIndexUpdateInput!): SurveyIndex!
  deleteSurvey(id: Int!): Int!

  """
  Delete a dimension. Also deletes indices associated with this dimension.
      Each index is removed using the equivalent of deleteSurveyIndex.
      Returns details of everything that was deleted.
  """
  deleteSurveyDimension(id: Int!): SurveyDimensionDeleteOutput!

  """
  Delete an index. Also removes associations with items; the items are not removed.
  """
  deleteSurveyIndex(id: Int!): SurveyIndexDeleteOutput!

  """Delete a survey response"""
  deleteSurveyResponse(id: Int!): Int!
  createPredictionTableEntry(createInput: PredictionTableEntryCreateInput!): PredictionTableEntry!
  replacePredictionTableEntries(replaceInput: PredictionTableEntryReplaceInput!): [PredictionTableEntry!]!

  """Create a scripture engagement practice"""
  createScriptureEngagementPractice(createInput: ScriptureEngagementPracticeCreateInput!): ScriptureEngagementPractice!
  updateScriptureEngagementPractice(updateData: ScriptureEngagementPracticeUpdateInput!): ScriptureEngagementPractice!
  deleteScriptureEngagementPractice(id: Int!): Int!
  createUser(createInput: UserCreateInput!): User!
  updateUser(updateInput: UserUpdateInput!): User!
  changePassword(passwordInput: ChangePasswordInput!): String!
  createUserRole(createInput: UserRoleCreateInput!): UserRole!
  login(loginCredentials: LoginCredentials!): LoginResponse!
  sendLetter(mailInput: SendMailInput!): SendMailResponse!
  createLetter(createInput: LetterCreateInput!): Letter!
  createLetterElement(createInput: LetterElementCreateInput!): LetterElement!
  updateLetter(letterData: LetterUpdateInput!): Letter!
  updateLetterElement(updateInput: LetterElementUpdateInput!): LetterElement!
  deleteLetter(id: Int!): Int!
  deleteLetterElement(id: Int!): Int!
  createLetterType(createInput: LetterTypeCreateInput!): LetterType!
  updateLetterType(updateInput: LetterTypeUpdateInput!): LetterType!
  deleteLetterType(id: Int!): Int!
  updateImage(updateInput: ImageUpdateInput!): Image!
  deleteImage(id: Int!): Int!
  writeLetter(writerInput: WriterInput!): WriterOutput!

  """
  Import a survey from Qualtrics. Always use this to create a Capernaum survey.
  """
  importQualtricsSurvey(updateOk: Boolean!, qualtricsId: String!): Survey!

  """Fetch responses to a survey"""
  importQualtricsSurveyResponses(qualtricsId: String!): QualtricsResponseImportStats!
  createSubscription(createInput: QualtricsSubscriptionCreateInput!): QualtricsSubscription!
  deleteSubscription(subscriptionId: String!): String!
  createEvent(createInput: EventCreateInput!): Event!
  createMachine(createInput: MachineCreateInput!): Machine!
  deleteMachine(id: Int!): Int!
  createGroup(createInput: GroupCreateInput!): Group!
  updateGroup(updateInput: GroupUpdateInput!): Group!
}

input SurveyCreateInput {
  qualtricsId: String!
  qualtricsName: String!
  qualtricsModDate: String!
  emailKey: String!
  groupCodeKey: String!
  okForGroup: Boolean!
  publicName: String!
  detailedDescription: String!
  surveyItems: [SurveyItemCreateInput!]!
}

input SurveyItemCreateInput {
  sequence: Int = -1
  qualtricsId: String!
  qualtricsText: String!
}

"""
Data to create a new dimension. Does not embed indices. Add them with createSurveyIndex.
"""
input SurveyDimensionCreateInput {
  surveyId: Int!
  title: String!
  sequence: Int!
}

input SurveyIndexCreateInput {
  """ID of the dimension to contain this index"""
  surveyDimensionId: Int!

  """List of IDs of the items to include in this index."""
  itemIds: [Int!]!

  """Abbreviation for this index (e.g., 'FOG')"""
  abbreviation: String!

  """Title of this index within the dimension"""
  title: String!

  """Use this index in prediction tables?"""
  useForPredictions: Boolean!
}

input SurveyUpdateInput {
  id: Int!
  qualtricsId: String
  qualtricsName: String
  qualtricsModDate: String
  emailKey: String
  groupCodeKey: String
  okForGroup: Boolean
  publicName: String
  detailedDescription: String
}

input SurveyDimensionUpdateInput {
  id: Int!
  title: String
  sequence: Int
}

input SurveyIndexUpdateInput {
  id: Int!
  itemIds: [Int!]
  abbreviation: String
  title: String
  useForPredictions: Boolean
}

input PredictionTableEntryCreateInput {
  surveyIndexId: Int!
  practiceId: Int!
  sequence: Int!
  letterId: Int!
}

input PredictionTableEntryReplaceInput {
  letterId: Int!
  entries: [PartialPredictionTableEntry!]!
}

input PartialPredictionTableEntry {
  surveyIndexId: Int!
  practiceId: Int!
  sequence: Int!
}

input ScriptureEngagementPracticeCreateInput {
  title: String!
  description: String!
  moreInfoUrl: String!
  sequence: Int!
}

input ScriptureEngagementPracticeUpdateInput {
  id: Int!
  title: String
  description: String
  moreInfoUrl: String
  sequence: Int
}

input UserCreateInput {
  email: String!
  firstName: String!
  lastName: String!
  password: String!
  userRoleIds: [Int!]!
}

input UserUpdateInput {
  id: Int!
  email: String
  firstName: String
  lastName: String
  userRoleIds: [Int!]
}

input ChangePasswordInput {
  userId: Int!
  currentPassword: String!
  newPassword: String!
}

input UserRoleCreateInput {
  name: String!
  description: String!
}

input LoginCredentials {
  email: String!
  password: String!
}

input SendMailInput {
  from: String
  to: String!
  subject: String!
  textContent: String!
  htmlContent: String
  attachmentPath: String
}

input LetterCreateInput {
  title: String!
  description: String!
  emailMessage: String!
  isFrozen: Boolean = false
  surveyId: Int!
  letterTypeId: Int!
}

input LetterElementCreateInput {
  sequence: Int!
  textDelta: String
  imageId: Int
  letterId: Int!
  letterElementTypeId: Int!
  surveyDimensionId: Int
}

input LetterUpdateInput {
  id: Int!
  title: String
  description: String
  emailMessage: String
  isFrozen: Boolean
  surveyId: Int
  letterTypeId: Int
}

input LetterElementUpdateInput {
  id: Int!
  sequence: Int
  textDelta: String
  imageId: Int
  letterElementTypeId: Int
  surveyDimensionId: Int
}

input LetterTypeCreateInput {
  """Human readable key"""
  key: String!

  """Description of this type"""
  description: String!
}

input LetterTypeUpdateInput {
  id: Int!

  """Human readable key"""
  key: String

  """Description of this type"""
  description: String
}

input ImageUpdateInput {
  id: Int!
  title: String!
}

input WriterInput {
  letterId: Int!
  surveyResponseId: Int!
}

input QualtricsSubscriptionCreateInput {
  hostName: String!
  subscriptionType: String!
  surveyId: String
}

input EventCreateInput {
  type: String!
  details: String!
}

input MachineCreateInput {
  name: String!
  hostName: String!
  active: Boolean!
}

input GroupCreateInput {
  """Group name"""
  name: String!

  """Type of group"""
  type: String!

  """Date when survey closes"""
  closedAfter: String!

  """Group administrator first name"""
  adminFirstName: String!

  """Group administrator last name"""
  adminLastName: String!

  """Group administrator email address"""
  adminEmail: String!

  """Survey code word used by group"""
  codeWord: String!
  surveyId: Int!
}

input GroupUpdateInput {
  id: Int!

  """Group name"""
  name: String

  """Type of group"""
  type: String

  """Date when survey closes"""
  closedAfter: String

  """Group administrator first name"""
  adminFirstName: String

  """Group administrator last name"""
  adminLastName: String

  """Group administrator email address"""
  adminEmail: String

  """Survey code word used by group"""
  codeWord: String
  surveyId: Int
}

type Subscription {
  newEvent: Event!
}
`;

const introspectionQuery = getIntrospectionQuery();
// console.log("INTROSPECTION QUERY", introspectionQuery);

const graphqlSchemaObj = buildSchema(sdlString);
// console.log("SCHEMA OBJ", graphqlSchemaObj);

const result = graphqlSync(graphqlSchemaObj, introspectionQuery).data;
console.log("RESULT", JSON.stringify(result, null, 2));
