import gql from "graphql-tag";

export const ALL_SURVEYS_QUERY = gql`
  query getSurveys($includeInactive: Boolean) {
    surveys(includeInactive: $includeInactive) {
      id
      ownerId
      name
      lastModified
      isActive
      creationDate
    }
  }
`;
