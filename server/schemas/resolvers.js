const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
      users: async () => {
        return User.find().sort({ createdAt: -1 });
      },
      
      me: async (parent, args, context) => {
        if( context.user) {
          const userData = await User.findOne({})
          .select('-__v -password')
          .populate('books')

          return userData;
        }

        throw new AuthenticationError('Not logged in');

      }
    },

    Mutation: {

      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user)

        return { token, user };
      },

      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if(!user) {
          throw new AuthenticationError('Incorrect credentials');
        }

        const correctPw = await user.isCorrectPassword(password);

        if(!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }

        const token = signToken(user);
        return { token, user };
      },
      saveBook: async (parent, { bookInput }, context) => {
        if(context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: bookInput } },
            { new: true }
          )

          return updatedUser;
   
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          )
          return updatedUser;
        }

        throw new AuthenticationError('You need to be logged in!');
      }
    }
  };
  
module.exports = resolvers;