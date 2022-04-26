const express = require("express");
const router = express.Router();

let database = [];
let id = 0;

router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal API",
  });
});

//Profiel ophalen (Functionaliteit nog niet gerealiseerd)
router.get("/api/user/profile", (req, res) => {
  res.status(416).json({
    status: 416,
    message: "Functionality not realized yet",
  });
});

//Gebruiker toevoegen (met email check)
router.post("/api/user", (req, res) => {
  let user = req.body;
  let emailadress = req.body.emailadress;
  let emailcheck = true;

  //Gaat in de database zoeken of emailadres al bestaat
  for (let i = 0; i < database.length; i++) {
    if (database[i].emailadress == emailadress) {
      emailcheck = false;
    }
  }

  if (emailcheck == true) {
    id++;
    user = {
      id,
      ...user,
    };
    console.log(user);
    database.push(user);
    res.status(201).json({
      status: 201,
      result: database,
    });
  } else {
    res.status(401).json({
      status: 401,
      message: "Emailadress already exists",
    });
  }
});

//Gebruiker ophalen op basis van ID
router.get("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`Searched for user with ID: ${userId}`);
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {
    console.log(user);
    res.status(200).json({
      status: 200,
      result: user,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

//Verwijderen gebruiker op basis van ID
router.delete("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`Searched for user with ID: ${userId}`);

  let delUserId = null;

  for (let i = 0; i < database.length; i++) {
    if (database[i].id == userId) {
      delUserId = i;
      break;
    }
  }

  if (delUserId != null) {
    //User verwijderen uit database(array)
    database.splice(delUserId, 1);

    console.log(`User ${userId} deleted`);
    res.status(200).json({
      status: 200,
      message: `User with ID ${userId} deleted`,
    });
  } else {
    res.status(401).json({
      status: 401,
      message: `User with ID ${userId} not found`,
    });
  }
});

//Updaten van gebruiker op basis van ID
router.post("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  let user = req.body;
  console.log(`Searched for user with ID: ${userId}`);

  let delUserId = null;

  for (let i = 0; i < database.length; i++) {
    if (database[i].id == userId) {
      delUserId = i;
      break;
    }
  }

  if (delUserId != null) {
    database.splice(delUserId, 1);

    id = parseInt(userId);
    user = {
      id,
      ...user,
    };
    console.log(user);
    database.push(user);
    res.status(201).json({
      status: 201,
      result: user,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

//Ophalen alle gebruikers
router.get("/api/user", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
});

module.exports = router;
