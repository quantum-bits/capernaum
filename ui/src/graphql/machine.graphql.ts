import gql from "graphql-tag";

export const CREATE_MACHINE = gql`
  mutation CreateMachine($createInput: MachineCreateInput!) {
    createMachine(createInput: $createInput) {
      id
      name
      hostname
      active
    }
  }
`;

export const ALL_MACHINES = gql`
  query AllMachines {
    machines {
      id
      name
      hostname
      active
    }
  }
`;
