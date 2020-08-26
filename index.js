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

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.render('index', { title: 'Existing Users',users });
});

app.get("/create", csurfProtection, (req, res) => {
  res.render("create", { title: "Create User", users, csrfToken: req.csrfToken() })
});

app.post("/create", csurfProtection, (req, res) => {
  console.log(req.body)
  const { firstName, lastName, email, password, confirmedPassword } = req.body;

  const user = { id:users.length+1, firstName, lastName, email, password, confirmedPassword };
  // req.body.id = users.length + 1;
  users.push(user);
  res.redirect("/")

});

app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;
