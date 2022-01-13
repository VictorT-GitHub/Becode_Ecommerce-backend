const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");

const maxAge = 3 * 24 * 60 * 60 * 1000;

// JWT LOGIN (POST)
router.post("/login", async (req, res) => {
  try {
    // login() : mongoose-schema statics async function created in usersModel.js
    // this funct need frontend email and password inputs
    const user_id = await UsersModel.login(req.body.email, req.body.password);

    // create a token for the user
    const token = jsonwebtoken.sign({ user_id }, process.env.TOKEN_SECRET, {
      expiresIn: maxAge,
    });
    // send the token to the user by cookies
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user_id });
  } catch (error) {
    res.status(200).json({ error });
  }
});

// LOGOUT (GET)
router.get("/logout", (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } catch (error) {
    res.status(200).json({ error });
  }
});

module.exports = router;
