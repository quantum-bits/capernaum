import gql from "graphql-tag";

export const ONE_USER_QUERY = gql`
  query OneUser($userId: Int!) {
    user(id: $userId) {
      id
      email
      firstName
      lastName
      roles {
        id
        name
      }
    }
  }
`;

export const ALL_USERS_QUERY = gql`
  query AllUsers {
    users {
      id
      email
      firstName
      lastName
      roles {
        id
        name
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($credentials: LoginCredentials!) {
    login(loginCredentials: $credentials) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        roles {
          id
          name
          description
        }
      }
    }
  }
`;

export const USER_MUTATION = gql`
  mutation UpdateUser($updateInput: UserUpdateInput!) {
    updateUser(updateInput: $updateInput) {
      id
      email
      firstName
      lastName
    }
  }
`;

export const PASSWORD_MUTATION = gql`
  mutation ChangePassword($passwordInput: ChangePasswordInput!) {
    changePassword(passwordInput: $passwordInput)
  }
`;
