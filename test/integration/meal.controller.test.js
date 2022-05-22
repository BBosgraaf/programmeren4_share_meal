const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");

const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

let database = [];

chai.should();
chai.use(chaiHttp);

//UC-301
describe("UC-301 Maaltijd aanmaken ", () => {
  //UC-301-1 Verplicht veld ontbreekt
  describe("UC-301-1 Verplicht veld ontbreekt", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat er een vled ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
          //isActive : "1",
          isVega: "1",
          isVegan: "0",
          isToTakeHome: "0",
          dateTime: "2022-05-22 20:30:00",
          maxAmountOfParticipants: "4",
          price: "10",
          imageUrl:
            "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
          updateDate: "",
          name: "Pasta Bolognese met tomaat, spekjes en kaas",
          description:
            "Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!",
          allergenes: "",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("isActive is missing!");

          done();
        });
    });
  });

  //UC-301-2 Niet ingelogd
  describe("UC-301-2 Niet ingelogd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een fout code gegeven worden", (done) => {
      chai
        .request(server)
        .post("/api/meal")

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("Authorization header missing!");

          done();
        });
    });
  });

  //UC-301-1 Succesvol toevoegen
  describe("UC-301-1 Succesvol toevoegen", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Zodra een meal succesvol wordt aangemaakt komt er een geslaagde melding", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))
        .send({
          isActive: "1",
          isVega: "1",
          isVegan: "0",
          isToTakeHome: "0",
          dateTime: "2022-05-22 20:30:00",
          maxAmountOfParticipants: "4",
          price: "10",
          imageUrl:
            "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
          updateDate: "",
          name: "Pasta Bolognese met tomaat, spekjes en kaas",
          description:
            "Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!",
          allergenes: "",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(201);
          message.should.be.a("string").that.equals("Meal succefully added");

          done();
        });
    });
  });
});

//UC-303
describe("UC-303 Lijst van maaltijden opvragen ", () => {
  //UC-303-1 Lijst van maaltijden geretourneerd
  describe("UC-303-1 Lijst van maaltijden geretourneerd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet lijst van maaltijden terug gegeven worden", (done) => {
      chai
        .request(server)
        .get("/api/meal")
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

//UC-304
describe("UC-304 Details van een maaltijd opvragen ", () => {
  //UC-304-1 Maaltijd bestaat niet
  describe("UC-304-1 Maaltijd bestaat niet", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen de maaltijd niet bestaat", (done) => {
      chai
        .request(server)
        .get("/api/meal/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("Meal with ID 99999 not found");

          done();
        });
    });
  });

  //UC-304-2 Details van maaltijd geretourneerd
  describe("UC-304-2 Details van maaltijd geretourneerd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een maaltijd terug gegeven worden met de details erin", (done) => {
      chai
        .request(server)
        .get("/api/meal/1")
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

//UC-305
describe("UC-305 Maaltijd verwijderen ", () => {
  //UC-305-2 Niet ingelogd
  describe("UC-305-2 Niet ingelogd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een fout code gegeven worden", (done) => {
      chai
        .request(server)
        .delete("/api/meal/6")

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("Authorization header missing!");

          done();
        });
    });
  });

  //UC-305-3 Niet de eigenaar van de maaltijd
  describe("UC-305-3 Niet de eigenaar van de maaltijd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat de gebruiker niet de eigenaar is", (done) => {
      chai
        .request(server)
        .delete("/api/meal/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 2 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(403);
          message.should.be
            .a("string")
            .that.equals("You are not the owner of this meal");

          done();
        });
    });
  });

  //UC-305-4 Maaltijd bestaat niet
  describe("UC-305-4 Maaltijd bestaat niet", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat de maaltijd niet bestaat", (done) => {
      chai
        .request(server)
        .delete("/api/meal/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("Meal with ID 99999 not found!");

          done();
        });
    });
  });

  //UC-305-5 Maaltijd verwijderen
  describe("UC-305-5 Maaltijd verwijderen", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat de maaltijd succesvol verwijdert", (done) => {
      chai
        .request(server)
        .delete("/api/meal/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string").that.equals("Meal with ID 6 deleted!");

          done();
        });
    });
  });
});
