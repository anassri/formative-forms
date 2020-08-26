const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");

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



app.listen(port, () => console.log(`Listening on port ${port}!`));

module.exports = app;
