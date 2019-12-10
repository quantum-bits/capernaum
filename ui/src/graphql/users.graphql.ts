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
