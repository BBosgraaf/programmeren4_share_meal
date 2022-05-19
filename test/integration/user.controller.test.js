const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");

const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

let database = [];

chai.should();
chai.use(chaiHttp);

//UC-201
describe("UC-201 Registreren als nieuwe gebruiker ", () => {
  //UC-201 Verplicht veld ontbreekt
  describe("UC-201 Verplicht veld ontbreekt", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Wanneer er input ontbreekt zou er een foutmelding moeten plaatsvinden", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          //Firstname is missing
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "email@hotmail.com",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("Firstname must be a string");

          done();
        });
    });
  });

  //UC-201 Onjuist email adres
  describe("UC-201 Onjuist email adres", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Wanneer er een bestaand email adres wordt opgegeven wordt er een foutmelding gegeven", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "naam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "m.vandullemen@server.nl",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("Emailaddress already exists");

          done();
        });
    });
  });

  //UC-201 Succesvol toevoegen
  describe("UC-201 Succesvol toevoegen", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Zodra een user succesvol wordt aangemaakt komt er een geslaagde melding", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "naam",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "testcase@project.nl",
          phoneNumber: "0612345678",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(201);
          message.should.be.a("string").that.equals("User succefully added");

          done();
        });
    });
  });
});

//UC-202
describe("UC-202 Overzicht van gebruikers ", () => {
  //UC-202 Alles users ophalen
  describe("UC-202 Alles users ophalen", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er een user terug gegeven", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("array");

          done();
        });
    });
  });
});

//UC-204
describe("UC-204 Details van gebruikers ", () => {
  //UC-204 user ophalen aan de hand van een niet bestaand id
  describe("UC-204 user ophalen aan de hand van een niet bestaand id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er foutmelding worden terug gegeven met het id die niet gevonden is", (done) => {
      chai
        .request(server)
        .get("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found");

          done();
        });
    });
  });

  //UC-204 user ophalen aan de hand van een bestaand id
  describe("UC-204 user ophalen aan de hand van een bestaand id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er een user terug gegeven", (done) => {
      chai
        .request(server)
        .get("/api/user/1")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("array");

          done();
        });
    });
  });
});

//UC-205
describe("UC-205 Gebruiker wijzigen ", () => {
  //UC-205 Wijzigen gebruiker op basis van id
  describe("UC-205 Wijzigen gebruiker op basis van id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een succesvol wijziging bericht gegeven", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
          firstName: "verandering",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "verandering@project.nl",
          phoneNumber: "0612345678",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(201);
          message.should.be
            .a("string")
            .that.equals("User with ID 6 succesfully changed");

          done();
        });
    });
  });
  //UC-205 Wijzigen gebruiker op basis van id met een verkeerd email-adres
  describe("UC-205 Wijzigen gebruiker op basis van id met een verkeerd email-adres", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een bericht gegeven dat het email al wordt gebruikt", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
          firstName: "verandering",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "m.vandullemen@server.nl",
          phoneNumber: "0612345678",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("Emailaddress  already exists");

          done();
        });
    });
  });

  //UC-205 Wijzigen gebruiker op basis van id met een niet bestaand id
  describe("UC-205 Wijzigen gebruiker op basis van id met een niet bestaand id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een bericht gegeven dat het email al wordt gebruikt", (done) => {
      chai
        .request(server)
        .post("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
          firstName: "verandering",
          lastName: "achternaam",
          password: "password",
          street: "straat",
          city: "stad",
          emailAdress: "m.vandullemen@server.nl",
          phoneNumber: "0612345678",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found");

          done();
        });
    });
  });
});

//UC-206
describe("UC-206 Verwijderen gebruiker ", () => {
  //UC-206 Verwijderen gebruiker op basis van id
  describe("UC-201 Verwijderen gebruiker op basis van id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een succesvol verwijderd bericht gegeven", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string").that.equals("User with ID 6 deleted!");

          done();
        });
    });
  });

  //UC-206 Verwijderen gebruiker op basis van een niet bestaand id
  describe("UC-206 Verwijderen gebruiker op basis van een niet bestaand id", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een succesvol verwijderd bericht gegeven", (done) => {
      chai
        .request(server)
        .delete("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found!");

          done();
        });
    });
  });
});
