const resolvers = {
    // Query resolvers
    Query: {
      me: async (parent, args, context) => {
        // If the user is authenticated
        if (context.user) {
          // Fetch user data, excluding __v and password fields
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password');
          return userData;
        }
        // If user is not authenticated, throw error
        throw new AuthenticationError('Not logged in');
      },
    },
    // Mutation resolvers
    Mutation: {
      addUser: async (parent, args) => {
        // Create new user and sign a token for them
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
        // Try to find user with provided email
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        // Check if provided password is correct
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        // If email and password both match, sign a token
        const token = signToken(user);
        return { token, user };
      },
      saveBook: async (parent, { book }, context) => {
        // If user is authenticated, save a book to their account
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book } },
            { new: true }
          );
          return updatedUser;
        }
        // If user is not authenticated, throw error
        throw new AuthenticationError('You need to be logged in!');
      },
      removeBook: async (parent, { bookId }, context) => {
        // If user is authenticated, remove a book from their account
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        // If user is not authenticated, throw error
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  };
  
  module.exports = resolvers;
  