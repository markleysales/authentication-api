const mongoose = require('mongoose');

const User = mongoose.model('User', {
  name: String,
  number: String,
  email: String,
  password: String
});

module.exports = User;
