import gql from "graphql-tag";

export const CREATE_GROUP = gql`
  mutation CreateGroup($createInput: GroupCreateInput!) {
    newGroup: createGroup(createInput: $createInput) {
      id
    }
  }
`;

export const ALL_GROUPS = gql`
  query AllGroups {
    allGroups: readGroups {
      id
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup($updateInput: GroupUpdateInput!) {
    updatedGroup: updateGroup(updateInput: $updateInput) {
      id
    }
  }
`;
