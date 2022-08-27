const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm
const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a vaild email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlenght: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // this only works are not the same!
    validate: {
      validator: function(el) {
        return this.password === el;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userShema.pre('save', async function(next) {
  // Only run this function if password was acctualy modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userShema);

module.exports = User;
