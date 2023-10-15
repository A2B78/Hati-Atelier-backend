const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
  
const User = mongoose.model('User', UserSchema);

module.exports = User;