const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match user
      User.findOne({ username: username }).then(user => {
        if (!user) {
          console.log('Login attempt with non-registered username:', username);
          return done(null, false, { message: 'That username is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing password for user:', username, err);
            throw err;
          }
          if (isMatch) {
            console.log('User authenticated successfully:', username);
            return done(null, user);
          } else {
            console.log('Incorrect password attempt for user:', username);
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }).catch(err => {
        console.error('Error finding user during login:', err);
        console.error(err.stack);
      });
    })
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.username);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      if (err) {
        console.error('Error deserializing user:', err);
        console.error(err.stack);
      }
      console.log('Deserialized user:', user ? user.username : 'User not found');
      done(err, user);
    });
  });
};