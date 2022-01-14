const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");
const { checkAuthToken } = require("../middleware/authMiddleware.js");
const { loginErrors } = require("../utils/errors.utils.js");

const maxAge = 3 * 24 * 60 * 60 * 1000;

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
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
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
