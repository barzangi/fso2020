const config = require('./utils/config');
const { ApolloServer, UserInputError, AuthenticationError, PubSub, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const pubsub = new PubSub();

const JWT_SECRET = process.env.SECRET;

console.log('Connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
  });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let getBooks = await Book.find({}).populate('author', { name: 1, born: 1, bookCount: 1 });
      if (args.author) {
        getBooks = getBooks.filter(b => b.author.name === args.author);
      }
      if (args.genre) {
        getBooks = getBooks.filter(b => b.genres.includes(args.genre));
      }
      return getBooks;
    },
    allAuthors: () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  /*
  Author: {
    bookCount: (root) => {
      console.log('bookCount');
      return root.booksBy.length;
      // const getBooks = await Book.find({}).populate('author', { name: 1 });
      // return getBooks.filter(b => b.author.name === root.name).length;
    }
  },
  */
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      // if no logged in user, throw error
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated');
      }

      // data validation checks
      if (args.title.length < 2) {
        throw new UserInputError(
          'Book title cannot be shorter than 2 characters',
          { invalidArgs: args }
        );
      }
      if (args.author.length < 4) {
        throw new UserInputError(
          'Author name cannot be shorter than 4 characters',
          { invalidArgs: args }
        );
      }

      // check if new or existing author
      const checkAuthorExists = async authorName => {
        const authorExists = await Author.findOne({ name: authorName });
        if (!authorExists) {
          // if author does not exist, add to list
          const author = new Author({ name: authorName, born: null, bookCount: 0 });
          try {
            const savedAuthor = author.save();
            return savedAuthor;
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            });
          }
        } else {
          return authorExists;
        }
      };

      const getAuthor = await checkAuthorExists(args.author);
      const book = new Book({ ...args, author: getAuthor });
      try {
        await book.save();
        getAuthor.bookCount = getAuthor.bookCount + 1;
        await getAuthor.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      // if no logged in user, throw error
      if (!currentUser) {
        throw new AuthenticationError('Not authenticated');
      }
      
      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
      return author;
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favGenre: args.favGenre });

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new UserInputError('Wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriiptioins ready at ${subscriptionsUrl}`);
});