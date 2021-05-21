import gql from "graphql-tag";

export const ALL_GROUPS = gql`
  query AllGroups {
    allGroups: readGroups {
      id
      name
      type {
        id
        name
        code
      }
      codeWord
      survey {
        qualtricsId
        qualtricsName
      }
    }
  }
`;

export const ADD_GROUP_MUTATION = gql`
  mutation AddGroup($createInput: GroupCreateInput!) {
    createGroup(createInput: $createInput) {
      id
      name
      type {
        id
        name
        code
      }
      codeWord
      survey {
        publicName
        qualtricsName
        detailedDescription
      }
    }
  }
`;

export const ALL_GROUP_TYPES = gql`
  query AllGroupTypes {
    groupTypes: readGroupTypes {
      id
      name
      code
    }
  }
`;
