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
    groups: readGroups {
      id
      name
      type {
        id
        name
        code
      }
      otherTypeName
      created
      closedAfter
      adminFirstName
      adminLastName
      adminEmail
      codeWord
      survey {
        id
        qualtricsId
        qualtricsName
        emailKey
        groupCodeKey
        okayForGroup
        surveyLetters {
          letterType {
            id
            key
          }
          letter {
            id
            description
          }
        }
      }
      surveyResponses {
        id
        email
      }
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

export const DELETE_GROUP = gql`
  mutation DeleteGroup($groupId: Int!) {
    deleteGroup(id: $groupId)
  }
`;
