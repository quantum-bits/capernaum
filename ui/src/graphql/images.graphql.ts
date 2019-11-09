import gql from "graphql-tag";

export const ALL_IMAGES_QUERY = gql`
  query AllImages {
    images {
      id
      title
      uuid
      mimeType
      originalName
    }
  }
`;

export const UPDATE_IMAGE_DETAILS_MUTATION = gql`
  mutation UpdateImageDetails($updateInput: ImageUpdateInput!) {
    updateImage(updateInput: $updateInput)
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImage($id: Int!) {
    deleteImage(id: $id)
  }
`;
