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
      letterElements {
        id
        letter {
          id
          title
        }
      }
    }
  }
`;

export const ONE_IMAGE_QUERY = gql`
  query OneImage($id: Int!) {
    image(id: $id) {
      id
      title
      url
      uuid
      originalName
      mimeType
      created
      updated
      letterElements {
        id
      }
    }
  }
`;

export const UPDATE_IMAGE_DETAILS = gql`
  mutation UpdateImageDetails($updateInput: ImageUpdateInput!) {
    updateImage(updateInput: $updateInput) {
      id
      title
      url
      uuid
      originalName
      mimeType
      created
      updated
      letterElements {
        id
        letter {
          id
          title
        }
      }
    }
  }
`;

export const DELETE_IMAGE = gql`
  mutation DeleteImage($id: Int!) {
    deleteImage(id: $id)
  }
`;
