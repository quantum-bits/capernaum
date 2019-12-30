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
