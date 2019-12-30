import gql from "graphql-tag";

export const ALL_EVENTS_QUERY = gql`
  query AllEvents {
    events {
      id
      date
      type
      details
    }
  }
`;

export const NEW_EVENTS_SUBSCRIPTION = gql`
  subscription NewEvents {
    newEvent {
      date
      id
      date
      type
      details
    }
  }
`;
