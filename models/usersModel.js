const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

// MONGOOSE SCHEMA
const UsersSchema = new mongoose.Schema({
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
    unique: true,
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

// PASSWORD BCRYPT PRE HOOK
UsersSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// PASSWORD BCRYPT LOGIN CHECK HOOK
UsersSchema.statics.login = async function (email, password) {
  // query mongodb for find a user with this email
  const user = await this.findOne({ email });
  // if this user exist, check if passwords are corresponding
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    // if password is ok, funct return this user-id
    if (auth) return user._id;
    // if password not ok, funct throw error
    throw Error("incorrect password");
  }
  // if email not ok, funct throw error
  throw Error("incorrect email");
};

// MONGOOSE MODEL
const UsersModel = mongoose.model("users", UsersSchema);

module.exports = { UsersModel };
