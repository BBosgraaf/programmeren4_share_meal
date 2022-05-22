const assert = require("assert");

const dbconnection = require("../../dbconnection");

const jwtSecretKey = require("../config/config").jwtSecretKey;
const jwt = require("jsonwebtoken");

let controller = {
  validateMeal: (req, res, next) => {
    let user = req.body;
    let {
      isActive,
      isVega,
      isVegan,
      isToTakeHome,
      maxAmountOfParticipants,
      price,
      name,
      description,
      allergenes,
    } = user;
    try {
      assert(typeof isActive === "string", "isActive is missing!");
      assert(typeof isVega === "string", "isVega is missing!");
      assert(typeof isVegan === "string", "isVegan is missing!");
      assert(typeof isToTakeHome === "string", "isToTakeHome is missing!");
      assert(
        typeof maxAmountOfParticipants === "string",
        "maxAmountOfParticipants is missing!"
      );
      assert(typeof price === "string", "price is missing!");
      assert(typeof name === "string", "name is missing!");
      assert(typeof description === "string", "description is missing!");
      assert(typeof allergenes === "string", "allergenes is missing!");

      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };

      next(error);
    }
  },
  addMeal: (req, res) => {
    let meal = req.body;

    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    userTokenId = decoded.userId;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Don't use the connection here, it has been returned to the pool.
      //console.log("Aantal results = ", results.length);
      connection.query(
        "SELECT MAX(id) as maxId FROM meal;",
        function (error, resultsId, fields) {
          id = resultsId[0].maxId + 1;
          user = {
            id,
            ...meal,
          };
          console.log(meal);

          connection.query(
            "INSERT INTO meal (id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES(" +
              id +
              ",'" +
              meal.isActive +
              "','" +
              meal.isVega +
              "','" +
              meal.isVegan +
              "','" +
              meal.isToTakeHome +
              "','" +
              meal.dateTime +
              "','" +
              meal.maxAmountOfParticipants +
              "','" +
              meal.price +
              "','" +
              meal.imageUrl +
              "','" +
              userTokenId +
              "','" +
              new Date().toISOString().slice(0, 19).replace("T", " ") +
              "','" +
              meal.updateDate +
              "','" +
              meal.name +
              "','" +
              meal.description +
              "','" +
              meal.allergenes +
              "')"
          );
          res.status(201).json({
            status: 201,
            message: `Meal succefully added`,
          });

          connection.release();
        }
      );
    });
  },

  delMealById: (req, res, next) => {
    const mealId = req.params.mealId;
    console.log(`Searched for meal with ID: ${mealId}`);

    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    userTokenId = decoded.userId;

    let idCheck;
    let mealCookId;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM meal", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == mealId) {
            idCheck = false;
            mealCookId = results[i].cookId;
            console.log("Cook Id:" + mealCookId);
            break;
          }
        }
        // Use the connection
        if (idCheck == false) {
          if (userTokenId == mealCookId) {
            connection.query(
              "DELETE FROM meal WHERE meal.id = " + mealId + ";",
              function (error, results, fields) {
                // When done with the connection, release it.
                // Handle error after the release.
                if (error) throw error;

                // Don't use the connection here, it has been returned to the pool.
                console.log("results = ", results.length);
                res.status(200).json({
                  status: 200,
                  message: `Meal with ID ${mealId} deleted!`,
                });

                connection.release();
              }
            );
          } else {
            res.status(403).json({
              status: 403,
              message: `You are not the owner of this meal`,
            });
          }
        } else {
          res.status(404).json({
            status: 404,
            message: `Meal with ID ${mealId} not found!`,
          });
        }
      });
    });
  },

  // updateMealById: (req, res, next) => {
  //   const mealId = req.params.mealId;
  //   console.log(`Meal met ID ${mealId} gezocht`);

  //   const authHeader = req.headers.authorization;
  //   const token = authHeader.substring(7, authHeader.length);
  //   var decoded = jwt.verify(token, jwtSecretKey);

  //   userTokenId = decoded.userId;

  //   let idCheck;

  //   let meal = req.body;
  //   dbconnection.getConnection(function (err, connection) {
  //     if (err) throw err; // not connected!

  //     // Use the connection
  //     connection.query("SELECT * FROM meal", function (error, results, fields) {
  //       // When done with the connection, release it.
  //       connection.release();

  //       for (let i = 0; i < results.length; i++) {
  //         if (results[i].id == mealId) {
  //           idCheck = true;
  //         }
  //       }

  //       // Don't use the connection here, it has been returned to the pool.
  //         if (idCheck == true) {

  //           //id, isActive, isVega, isVegan, isToTakeHome, dateTime, maxAmountOfParticipants, price,
  //           //imageUrl, cookId, createDate, updateDate, name, description, allergenes

  //                   connection.query(
  //                     "UPDATE `meal` SET `isActive`='" +
  //                       user.firstName +
  //                       "',`isVega`='" +
  //                       user.lastName +
  //                       "',`isVegan`='" +
  //                       user.emailAdress +
  //                       "',`isToTakeHome`='" +
  //                       user.password +
  //                       "',`dateTime`='" +
  //                       user.phoneNumber +
  //                       "',`maxAmountOfParticipants`='" +
  //                       user.street +
  //                       "',`price`='" +
  //                       user.city +
  //                       "' WHERE id = " +
  //                       mealId +
  //                       ""
  //                   );
  //                   console.log(`Meal with ID ${mealId} succesfully changed`);
  //                   res.status(200).json({
  //                     status: 200,
  //                     message: `Meal with ID ${mealId} succesfully changed`,
  //                   });

  //         } else {
  //           console.log(`Meal with ID ${mealId} not found`);
  //           res.status(401).json({
  //             status: 401,
  //             message: `Meal with ID ${mealId} not found`,
  //           });
  //         }
  //     });
  //   });
  // },

  getAllMeals: (req, res, next) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) next(err); // not connected!

      // Use the connection
      connection.query(
        "SELECT * FROM meal;",
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) next(error);

          // Don't use the connection here, it has been returned to the pool.
          console.log("result = ", results.length);
          res.status(200).json({
            status: 200,
            result: results,
          });
        }
      );
    });
  },

  getMealById: (req, res, next) => {
    const mealId = req.params.mealId;
    console.log(`Searched for meal with ID: ${mealId}`);

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        "SELECT * FROM meal;",
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          let meal = results.filter((item) => item.id == mealId);

          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
          console.log("result = ", results.length);
          if (meal.length > 0) {
            console.log(meal);
            res.status(200).json({
              status: 200,
              result: meal,
            });
          } else {
            res.status(404).json({
              status: 404,
              message: `Meal with ID ${mealId} not found`,
            });
          }
        }
      );
    });
  },
};

module.exports = controller;
