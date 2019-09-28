export interface QualtricsResponse<T> {
  result: T;
  meta: {
    requestId: string;
    httpStatus: string;
  };
}

export interface CreateResponseData {
  format: string;
  startDate?: string;
  endDate?: string;
}

type ResponseExportStatus = "inProgress" | "complete" | "failed";

export interface CreateResponseExportResponse {
  progressId: string;
  percentComplete: number;
  status: ResponseExportStatus;
}

export interface ResponseExportProgress {
  percentComplete: number;
  status: ResponseExportStatus;
  fileId: string;
}

export interface QualtricsOrganization {
  id: string;
  name: string;
  baseUrl: string;
  type: string;
  status: string;
  creationDate: string;
  expirationDate: string;
  stats: object;
}

export interface QualtricsQuestion {
  questionType: {
    type: string;
    selector: string;
    subSelector: string;
  };
  questionText: string;
  questionLabel: string | null;
  validation: object;
  questionName: string;
  choices?: {
    [key: string]: {
      recode: string;
      description: string;
      choiceText: string;
      imageDescription: string | null;
      variableName: string | null;
      analyze: boolean;
    };
  };
}

export interface QualtricsSurveyMetadata {
  id: string;
  name: string;
  ownerId: string;
  lastModified: string;
  creationDate: string;
  isActive: boolean;
}

export interface QualtricsSurveyList {
  elements: QualtricsSurveyMetadata[];
  nextPage: string | null;
}

export interface QualtricsSurvey {
  id: string;
  name: string;
  ownerId: string;
  organizationId: string;
  isActive: boolean;
  creationDate: string;
  lastModifiedDate: string;
  expiration: {
    startDate: string | null;
    endDate: string | null;
  };
  questions: {
    [key: string]: QualtricsQuestion;
  };
  exportColumnMap: object;
  blocks: object;
  flow: object;
  embeddedData: object;
}

export interface QualtricsSurveyResponse {
  responseId: string;
  values: {
    // Examples:
    // "startDate": "2019-09-28T15:38:36Z",
    // "endDate": "2019-09-28T15:44:29Z",
    // "status": 0,
    // "ipAddress": "68.45.127.81",
    // "progress": 100,
    // "duration": 352,
    // "finished": 1,
    // "recordedDate": "2019-09-28T15:44:30.083Z",
    // "_recordId": "R_3CPi4xzet6nopn0",
    // "locationLatitude": "40.43060302734375",
    // "locationLongitude": "-84.9927978515625",
    // "distributionChannel": "anonymous",
    // "userLanguage": "EN",
    // "QID2_TEXT": "tnurkkala@cse.taylor.edu",
    // "QID4": 1,
    // "QID7": 5,
    // "QID8": 5,
    // ... and so forth with answers to questions.
    [key: string]: string;
  };
  labels: {
    // Examples:
    // "status": "IP Address",
    // "finished": "True",
    // "QID4": "This is the first time I've taken the survey",
    // "QID7": "Weekly",
    // "QID8": "Weekly",
    // "QID10": "Daily",
    // ... and so forth with answers to questions
    [key: string]: string;
  };
  displayedFields: string[];
  displayedValues: {
    [key: string]: number[];
  };
}
