const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");
const authController = require("../controllers/auth.controller");

//Meal toevoegen
router.post(
  "/api/meal",
  authController.validateToken,
  mealController.validateMeal,
  mealController.addMeal
);

//Gebruiker ophalen op basis van ID
router.get(
  "/api/meal/:mealId",
  authController.validateToken,
  mealController.getMealById
);

//Meal ophalen op basis van ID
router.get("/api/meal/:mealId", mealController.getMealById);

//Verwijderen meal op basis van ID
router.delete(
  "/api/meal/:mealId",
  authController.validateToken,
  mealController.delMealById
);

//Ophalen alle meals
router.get("/api/meal", mealController.getAllMeals);

module.exports = router;
