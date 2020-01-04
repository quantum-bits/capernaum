import gql from "graphql-tag";

export const CREATE_MACHINE = gql`
  mutation CreateMachine($createInput: MachineCreateInput!) {
    createMachine(createInput: $createInput) {
      id
      name
      hostName
      active
    }
  }
`;

export const ALL_MACHINES = gql`
  query AllMachines {
    machines {
      id
      name
      hostName
      active
    }
  }
`;

export const DELETE_MACHINE = gql`
  mutation DeleteMachine($machineId: Int!) {
    deleteMachine(id: $machineId)
  }
`;
