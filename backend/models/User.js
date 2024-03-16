const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// Password hashing middleware before saving a user
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return next(err);
    }

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return next(err);
      }
      this.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      console.error('Error comparing password:', err);
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);