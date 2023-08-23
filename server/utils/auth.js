// *TODO* This was just copied from one of the activities.  not sure I understand what it means, or if we have the matching functions in the other files
// copied from 21-MERN/01-Activities/Day3/24-Stu_Decode-JWT/Solved/server/utils/auth.js

const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};