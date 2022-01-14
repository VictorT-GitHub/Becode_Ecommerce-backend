const jsonwebtoken = require("jsonwebtoken");

const { UsersModel } = require("../models/usersModel.js");

const checkAuthToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.user = null;
    return res.status(401).send("Access Denied");
  }

  try {
    const jwtCheck = jsonwebtoken.verify(token, process.env.JWT_KEY);
    res.locals.user_id = jwtCheck.user_id;
    next();
  } catch (error) {
    res.locals.user = null;
    res.cookie("jwt", "", { maxAge: 1 }); // delete token-cookie
    return res.status(400).send("Invalid Token");
  }
};

module.exports = { checkAuthToken };

// fonction tuto fromScratch non utilisée
// const checkUser = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jsonwebtoken.verify(
//       token,
//       process.env.JWT_KEY,
//       async (err, decodedToken) => {
//         if (err) {
//           res.locals.user = null;
//           res.cookie("jwt", "", { maxAge: 1 }); // logout
//           next();
//         } else {
//           let user = await UsersModel.findById(decodedToken.user_id);
//           res.locals.user = user;
//           next();
//         }
//       }
//     );
//   } else {
//     res.locals.user = null;
//     next();
//   }
// };
// // fonction tuto fromScratch non utilisée
// const requireAuth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jsonwebtoken.verify(
//       token,
//       process.env.JWT_KEY,
//       async (err, decodedToken) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(decodedToken.user_id);
//           next();
//         }
//       }
//     );
//   } else {
//     console.log("No token");
//   }
// };
