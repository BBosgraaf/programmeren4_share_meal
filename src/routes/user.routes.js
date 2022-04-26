const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

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
router.post("/api/user", userController.validateUser, userController.addUser);

//Gebruiker ophalen op basis van ID
router.get("/api/user/:userId", userController.getUserById);

//Verwijderen gebruiker op basis van ID
router.delete("/api/user/:userId", userController.delUserById);

//Updaten van gebruiker op basis van ID
router.post("/api/user/:userId", userController.updateUserById);

//Ophalen alle gebruikers
router.get("/api/user", userController.getAllUsers);

module.exports = router;
