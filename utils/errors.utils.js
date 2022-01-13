const registerErrors = (err) => {
  let errors = {
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  };

  if (err.message.includes("username"))
    errors.username = "Username missing or already taken";

  if (err.message.includes("email"))
    errors.email = "Email missing or incorrect or already taken";

  if (err.message.includes("password")) errors.password = "Password is missing";

  if (err.message.includes("firstname"))
    errors.firstname = "Firstname is missing";

  if (err.message.includes("lastname")) errors.lastname = "Lastname is missing";

  return errors;
};

const loginErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("email"))
    errors.email = "Email is incorrect or missing";

  if (err.message.includes("password"))
    errors.password = "Password is incorrect or missing";

  return errors;
};

module.exports = { registerErrors, loginErrors };
