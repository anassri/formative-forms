const express = require("express");
const csrf = require("csurf");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

const csurfProtection = csrf({cookie: true});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

const validateUser = (req, res, next)=>{
  
  let { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];
  console.log(req.url);
  if (!firstName) errors.push('Please provide a first name.');
  if (!lastName) errors.push('Please provide a last name.');
  if (!email) errors.push('Please provide an email.');
  if (!password) errors.push('Please provide a password.');
  
  if (!confirmedPassword) errors.push('Please provide a password.');
  if (password != confirmedPassword) errors.push('The provided values for the password and password confirmation fields did not match.');
  
  if(req.url==='/create-interesting'){
    let { age, favoriteBeatle, iceCream } = req.body;
    age = parseInt(age, 10);
    if (!age) errors.push('age is required');
    else if (age < 0 || age > 120) errors.push('age must be a valid age');
    if (!favoriteBeatle) errors.push('favoriteBeatle is required');
    if (favoriteBeatle === "Scooby-Doo") errors.push('favoriteBeatle must be a real Beatle member');
    // if (typeof age !== "number") errors.push('age must be a valid age');
    if (!iceCream) errors.push('Please provide an email.');
  }
  req.errors = errors;
  
  next();
}
app.get("/", (req, res) => {
  res.render('index', { title: 'Existing Users',users });
});

app.get("/create", csurfProtection, (req, res) => {
  res.render("create", { title: "Create User", users, csrfToken: req.csrfToken() })
});


app.post("/create", csurfProtection, validateUser, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  if(req.errors.length > 0){
    res.render("create", {
      errors: req.errors,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      csrfToken: req.csrfToken()
    });
    return;
  }
  const user = { id:users.length+1, firstName, lastName, email, password, confirmedPassword };

  users.push(user);
  res.redirect("/")

});

app.get("/create-interesting", csurfProtection, (req, res) => {
  res.render("create-interesting", { title: "Create Interesting User", users, csrfToken: req.csrfToken() })
});


app.post("/create-interesting", csurfProtection, validateUser, (req, res) => {
  let { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream } = req.body;
  // console.log(req.body);
  if(req.errors.length > 0){
    if (iceCream === 'on') iceCream = true; 
    res.render("create-interesting", {
      errors: req.errors,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      age,
      favoriteBeatle,
      iceCream,
      csrfToken: req.csrfToken()
    });
    return;
  }
  const user = { id: users.length + 1, firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream  };

  users.push(user);
  res.redirect("/");

});

app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;
