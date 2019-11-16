import gql from "graphql-tag";

export const ALL_IMAGES_QUERY = gql`
  query AllImages {
    images {
      id
      title
      url
      uuid
      mimeType
      originalName
      created
      updated
    }
  }
`;

export const ONE_IMAGE_QUERY = gql`
  query OneImage($id: Int!) {
    image(id: $id) {
      id
      title
      originalName
      mimeType
      created
      updated
      url
    }
  }
`;

export const UPDATE_IMAGE_DETAILS_MUTATION = gql`
  mutation UpdateImageDetails($updateInput: ImageUpdateInput!) {
    updateImage(updateInput: $updateInput) {
      id
      title
      uuid
      mimeType
      originalName
      url
    }
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation DeleteImage($id: Int!) {
    deleteImage(id: $id)
  }
`;
