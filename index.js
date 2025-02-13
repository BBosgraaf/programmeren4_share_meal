const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const userRouter = require("./src/routes/user.routes");
const mealRouter = require("./src/routes/meal.routes");
const authRoutes = require("./src/routes/auth.routes");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let id = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

//Router gebruiken met alle routes van users
app.use(userRouter, mealRouter);
app.use("/api", authRoutes, mealRouter);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

//Error handler
// app.use((err, req, res, next) => {
//   console.log("Error: " + err.toString());
//   res.status(400).json({
//     status: 400,
//     message: err.toString(),
//   });
// });

app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
