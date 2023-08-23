
// Try looking at 21-MERN/01-Activities/Day3/24-Stu_Decode-JWT/Solved/server/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gameIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  // Other user properties...
});

const User = mongoose.model('User', userSchema);

module.exports = User;
