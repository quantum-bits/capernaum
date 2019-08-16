import { QualtricsSurveyMetadata } from "./qualtrics.models";

export interface CreateResponseData {
  format: string;
  startDate?: string;
  endDate?: string;
}

interface QualtricsResponse {
  meta: {
    requestId: string;
    httpStatus: string;
  };
}

type ResponseExportStatus = "inProgress" | "complete" | "failed";

export interface CreateResponseExportResponse extends QualtricsResponse {
  result: {
    progressId: string;
    percentComplete: number;
    status: ResponseExportStatus;
  };
}

export interface ResponseExportProgress extends QualtricsResponse {
  result: {
    percentComplete: number;
    status: ResponseExportStatus;
    fileId: string;
  };
}

export interface QualtricsOrganization extends QualtricsResponse {
  result: {
    id: string;
    name: string;
    baseUrl: string;
    type: string;
    status: string;
    creationDate: string;
    expirationDate: string;
    stats: object;
  };
}

export interface QualtricsSurveyList extends QualtricsResponse {
  result: {
    elements: QualtricsSurveyMetadata[];
    nextPage: string | null;
  };
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

export interface QualtricsSurvey extends QualtricsResponse {
  result: {
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
  };
}
