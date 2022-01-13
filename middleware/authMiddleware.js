const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jsonwebtoken.verify(
      token,
      process.env.JWT_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          res.cookie("jwt", "", { maxAge: 1 }); // logout
          next();
        } else {
          let user = await UsersModel.findById(decodedToken.user_id);
          res.locals.user = user;
          next();
        }
      }
    );
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jsonwebtoken.verify(
      token,
      process.env.JWT_KEY,
      async (err, decodedToken) => {
        if (err) {
          console.log(err);
        } else {
          console.log(decodedToken.user_id);
          next();
        }
      }
    );
  } else {
    console.log("No token");
  }
};

module.exports = { checkUser, requireAuth };
