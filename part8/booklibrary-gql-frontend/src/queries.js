import { gql } from '@apollo/client';

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  author {
    name
    born
    bookCount
  }
  genres
  id
}
`;

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`;

export const ALL_BOOKS = gql`
query {
  allBooks {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`;

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`;

export const EDIT_AUTHOR = gql`
mutation updateAuthor($name: String!, $born: Int!) {
  editAuthor(name: $name, setBornTo: $born) {
    name
    born
    bookCount
    id
  }
}
`;

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`;

export const USER = gql`
query {
  me {
    username
    favGenre
    id
  }
}
`;

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`;