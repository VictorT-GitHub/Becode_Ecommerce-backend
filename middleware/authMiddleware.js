const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");

const checkAuthToken = (req, res, next) => {
  console.log(req.cookie.jwt);
  const token = req.cookie.jwt;
  if (!token) {
    res.locals.user_id = null;
    return res.status(401).send("Access Denied");
  }

  try {
    const jwtCheck = jsonwebtoken.verify(token, process.env.JWT_KEY);
    res.locals.user_id = jwtCheck.user_id;
    next();
  } catch (error) {
    res.locals.user_id = null;
    res.cookie("jwt", "", { maxAge: 1 }); // delete token-cookie
    return res.status(400).send("Invalid Token");
  }
};

const checkIfAdmin = async (req, res, next) => {
  const user = await UsersModel.findById(res.locals.user_id);
  if (user.admin == false) return res.status(401).send("Access Denied");
  next();
};

module.exports = { checkAuthToken, checkIfAdmin };
