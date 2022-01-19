const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");
const { registerErrors, loginErrors } = require("../utils/errors.utils.js");

const maxAge = 3 * 24 * 60 * 60 * 1000;

// REGISTER new User (POST)
router.post("/register", (req, res) => {
  const newUser = new UsersModel({
    address: req.body.address,
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    phone: req.body.phone,
    admin: req.body.admin,
    cart: [], // inutile ?
  });

  newUser.save((err, data) => {
    if (err) {
      const errors = registerErrors(err);
      res.status(400).send({ errors });
    } else {
      res.status(201).send(data._id);
    }
  });
});

// JWT LOGIN (POST)
router.post("/login", async (req, res) => {
  try {
    // login() : mongoose-schema statics async function created in usersModel.js
    // this funct need frontend email and password inputs
    const user_id = await UsersModel.login(req.body.email, req.body.password);

    // create a token for the user
    const token = jsonwebtoken.sign({ user_id }, process.env.JWT_KEY, {
      expiresIn: maxAge,
    });
    // send the token to the user by cookies
    res.cookie("jwt", token, { maxAge: maxAge });
    res.status(200).json({ user: user_id });
  } catch (err) {
    const errors = loginErrors(err);
    res.status(400).send({ errors });
  }
});

// LOGOUT (GET)
router.get("/logout", (req, res) => {
  res.locals.user_id = null; // inutile ?
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/products");
});

module.exports = router;
