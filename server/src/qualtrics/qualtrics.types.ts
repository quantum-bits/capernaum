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

export interface GetOrganizationResponse extends QualtricsResponse {
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

export interface ListSurveysResponse extends QualtricsResponse {
  result: {
    elements: QualtricsSurveyMetadata[];
    nextPage: string | null;
  };
}

export interface GetSurveyResponse extends QualtricsResponse {
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
    questions: object;
    exportColumnMap: object;
    blocks: object;
    flow: object;
    embeddedData: object;
  };
}
