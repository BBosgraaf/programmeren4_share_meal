let database = [];
let id = 0;

let controller = {
  addUser: (req, res) => {
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
  },

  getAllUsers: (req, res, next) => {
    res.status(200).json({
      status: 200,
      result: database,
    });
  },

  getUserById: (req, res, next) => {
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
  },

  delUserById: (req, res, next) => {
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
  },

  updateUserById: (req, res, next) => {
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
  },
};

module.exports = controller;
