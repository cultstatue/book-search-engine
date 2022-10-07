const { User, Book } = require('../models');

const resolvers = {
    Query: {
      users: async () => {
        return User.find().sort({ createdAt: -1 });
      }
    }
  };
  
module.exports = resolvers;