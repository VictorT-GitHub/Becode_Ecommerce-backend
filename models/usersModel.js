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

// PASSWORD & EMAIL LOGIN CHECK
UsersSchema.statics.login = async function (email, password) {
  if (!email) throw Error("Missing email");
  if (!password) throw Error("Missing password");

  // query mongodb for find a user with this email
  const user = await this.findOne({ email });
  if (!user) throw Error("Incorrect email");

  // bcrypt check if passwords are corresponding
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) throw Error("Incorrect password");

  // if everything ok, funct return the user id
  return user._id;
};

// MONGOOSE MODEL
const UsersModel = mongoose.model("users", UsersSchema);

module.exports = { UsersModel };
