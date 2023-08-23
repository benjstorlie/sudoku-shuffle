const { Game, User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
// Other imports...


const resolvers = {
  Query: {
    // Define query resolvers...
  },
  Mutation: {
    // Define mutation resolvers...
  },
}

module.exports = resolvers;