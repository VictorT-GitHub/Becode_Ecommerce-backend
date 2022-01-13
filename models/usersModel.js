const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const UsersModel = mongoose.model("users", {
  address: {
    geolocation: {
      lat: {
        type: String,
      },
      long: {
        type: String,
      },
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
    number: {
      type: Number,
    },
    zipcode: {
      type: String,
    },
  },
  name: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  inscriptionDate: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

module.exports = { UsersModel };
