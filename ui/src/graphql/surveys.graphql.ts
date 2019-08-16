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

const a = gql`
  query {
    survey(id: 42) {
      items {
        id
        name
      }
    }
  }
`;

const b = gql`
  query {
    surveyDimension {
      id
      name
      surveyIndex {
        id
        name
        surveyItem {
          id
          name
        }
      }
    }
  }
`;
