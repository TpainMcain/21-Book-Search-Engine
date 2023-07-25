// Import User and Book models
const { User, Book } = require('../models');

// Import AuthenticationError from apollo-server-express, which will be thrown when a user tries to perform an operation they are not authorized for
const { AuthenticationError } = require('apollo-server-express');

// Import the function to sign tokens
const { signToken } = require('../utils/auth');

const resolvers = {
    // Define queries here
    Query: {
        // The 'me' query will return the logged in user's data excluding password and __v
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return userData;
            }
            // If no user is found in the context (not logged in), throw an authentication error
            throw new AuthenticationError('Not logged in');
        }
    },
    // Define mutations here
    Mutation: {
        // The 'addUser' mutation will create a new user and return a signed token along with the user data
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // The 'login' mutation will authenticate a user and return a token along with user data if authentication is successful
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user);
            return { token, user };
        },
        // The 'saveBook' mutation will add a book to the logged in user's savedBooks
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                )
                return updatedUser;
            }
            // If the user is not logged in, throw an authentication error
            throw new AuthenticationError('You need to be logged in!')
        },
        // The 'removeBook' mutation will remove a book from the logged in user's savedBooks
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
        }
    }
};

// Export the resolvers to be used in your Apollo Server
module.exports = resolvers;
