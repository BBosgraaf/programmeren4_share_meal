const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

let database = [];
let id = 0;

router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal API",
  });
});

//Profiel ophalen (Functionaliteit nog niet gerealiseerd)
router.get(
  "/api/user/profile",
  authController.validateToken,
  userController.userProfile
);

//Gebruiker toevoegen (met email check)
router.post("/api/user", userController.validateUser, userController.addUser);

//Gebruiker ophalen op basis van ID
router.get(
  "/api/user/:userId",
  authController.validateToken,
  userController.getUserById
);

//Verwijderen gebruiker op basis van ID
router.delete(
  "/api/user/:userId",
  authController.validateToken,
  userController.delUserById
);

//Updaten van gebruiker op basis van ID
router.post(
  "/api/user/:userId",
  authController.validateToken,
  userController.updateUserById
);

//Ophalen alle gebruikers
router.get(
  "/api/user",
  authController.validateToken,
  userController.getAllUsers
);

module.exports = router;
