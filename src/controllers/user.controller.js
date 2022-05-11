const assert = require("assert");
let database = [];
const dbconnection = require("../../dbconnection");
let id = 0;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let { firstName, lastName, emailAdress, password } = user;
    try {
      assert(typeof firstName === "string", "Firstname must be a string");
      assert(typeof lastName === "string", "Lastname must be a string");
      assert(typeof emailAdress === "string", "Emailaddress must be a string");
      assert(typeof password === "string", "Password must be a string");

      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };

      next(error);
    }
  },
  addUser: (req, res) => {
    let user = req.body;
    let emailAdress = req.body.emailAdress;
    let emailCheck;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].emailAdress == emailAdress) {
            emailCheck = false;
          }
        }
        // Handle error after the release.
        if (error) throw error;
        // Don't use the connection here, it has been returned to the pool.
        console.log("Aantal results = ", results.length);
        connection.query(
          "SELECT MAX(id) as maxId FROM user;",
          function (error, resultsId, fields) {
            if (emailCheck != false) {
              id = resultsId[0].maxId + 1;
              user = {
                id,
                ...user,
              };
              console.log(user);

              connection.query(
                "INSERT INTO user (id, firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES(" +
                  id +
                  ",'" +
                  user.firstName +
                  "','" +
                  user.lastName +
                  "','','" +
                  user.emailAdress +
                  "','" +
                  user.password +
                  "'," +
                  user.phoneNumber +
                  ",'','" +
                  user.street +
                  "','" +
                  user.city +
                  "')"
              );
              res.status(201).json({
                status: 201,
                message: `User succefully added`,
              });
            } else {
              res.status(401).json({
                status: 401,
                message: `Emailaddress already exists`,
              });
            }
            connection.release();
            // dbconnection.end((err) => {
            //   console.log("pool was closed.");
            // });
          }
        );
      });
    });
  },

  getAllUsers: (req, res, next) => {
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        "SELECT * FROM user;",
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
          console.log("result = ", results.length);
          res.status(200).json({
            statusCode: 200,
            results: results,
          });
        }
      );
    });
  },

  getUserById: (req, res, next) => {
    const userId = req.params.userId;
    console.log(`Searched for user with ID: ${userId}`);

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        "SELECT * FROM user;",
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          let user = results.filter((item) => item.id == userId);

          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
          console.log("result = ", results.length);
          if (user.length > 0) {
            console.log(user);
            res.status(200).json({
              status: 200,
              result: user,
            });
          } else {
            res.status(401).json({
              status: 401,
              message: `User with ID ${userId} not found`,
            });
          }
        }
      );
    });
  },

  delUserById: (req, res, next) => {
    const userId = req.params.userId;
    console.log(`Searched for user with ID: ${userId}`);

    let idCheck;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == userId) {
            idCheck = false;
            break;
          }
        }
        // Use the connection
        if (idCheck == false) {
          connection.query(
            "DELETE FROM user WHERE user.id = " + userId + ";",
            function (error, results, fields) {
              // When done with the connection, release it.
              // Handle error after the release.
              if (error) throw error;

              // Don't use the connection here, it has been returned to the pool.
              console.log("#results = ", results.length);
              res.status(200).json({
                status: 200,
                result: `User with ID ${userId} deleted!`,
              });

              connection.release();
            }
          );
        } else {
          res.status(401).json({
            status: 401,
            result: `User with ID ${userId} not found!`,
          });
        }
      });
    });
  },

  updateUserById: (req, res, next) => {
    const userId = req.params.userId;
    console.log(`user met ID ${userId} gezocht`);

    let idCheck;
    let emailCheck = true;
    let user = req.body;
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == userId) {
            idCheck = true;
          }
        }

        // Don't use the connection here, it has been returned to the pool.
        if (idCheck == true) {
          connection.query(
            "SELECT * FROM user WHERE id = " + userId + "",
            function (error, results2, fields) {
              for (let i = 0; i < results.length; i++) {
                if (results[i].emailAdress == user.emailAdress) {
                  emailCheck = false;
                  break;
                }
                if (results2[0].emailAdress == user.emailAdress) {
                  emailCheck = true;
                  break;
                }
              }
              if (emailCheck == true) {
                console.log(results2[0].emailAdress);
                // Handle error after the release.
                if (error) throw error;
                id = parseInt(userId);
                user = {
                  id,
                  ...user,
                };

                connection.query(
                  "UPDATE `user` SET `firstName`='" +
                    user.firstName +
                    "',`lastName`='" +
                    user.lastName +
                    "',`emailAdress`='" +
                    user.emailAdress +
                    "',`password`='" +
                    user.password +
                    "',`phoneNumber`='" +
                    user.phoneNumber +
                    "',`street`='" +
                    user.street +
                    "',`city`='" +
                    user.city +
                    "' WHERE id = " +
                    userId +
                    ""
                );
                console.log(`User with ID ${userId} succesfully changed`);
                res.status(201).json({
                  status: 201,
                  result: `User with ID ${userId} succesfully changed`,
                });
              } else {
                console.log(`Emailaddress  already exists`);
                res.status(401).json({
                  status: 401,
                  result: `Emailaddress  already exists`,
                });
              }
            }
          );
        } else {
          console.log(`User with ID ${userId} not found`);
          res.status(401).json({
            status: 401,
            result: `User with ID ${userId} not found`,
          });
        }
      });
    });
  },
};

module.exports = controller;
