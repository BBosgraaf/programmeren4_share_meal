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
  //UC-201-1 Verplicht veld ontbreekt
  describe("UC-201-1 Verplicht veld ontbreekt", () => {
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

  //UC-201-4 Gebruiker bestaat al
  describe("UC-201-4 Gebruiker bestaat al", () => {
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
          status.should.equals(409);
          message.should.be
            .a("string")
            .that.equals("Emailaddress already exists");

          done();
        });
    });
  });

  //UC-201-5 Succesvol toevoegen
  describe("UC-201-5 Succesvol toevoegen", () => {
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
  //UC-202 Alls users ophalen
  describe("UC-202 Alle users ophalen", () => {
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

  //UC-202-3 Toon gebruiker met zoekterm op niet bestaande naam"
  describe("UC-202-3 Toon gebruiker met zoekterm op niet bestaande naam", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een leeg object terug gegeven", (done) => {
      chai
        .request(server)
        .get("/api/user?name=nietbestaandenaam")
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

  //UC-202-4 Toon gebruiker met zoekterm isActive=false"
  describe("UC-202-5 Toon gebruiker met zoekterm isActive=false", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er een user terug gegeven met de naam waar op gezocht wordt", (done) => {
      chai
        .request(server)
        .get("/api/user?isActive=false")
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

  //UC-202-5 Toon gebruiker met zoekterm isActive=true"
  describe("UC-202-5 Toon gebruiker met zoekterm isActive=true", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er een user terug gegeven met de naam waar op gezocht wordt", (done) => {
      chai
        .request(server)
        .get("/api/user?isActive=true")
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

  //UC-202-6 Toon gebruiker met zoekterm op bestaande naam"
  describe("UC-202-6 Toon gebruiker met zoekterm op bestaande naam", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er een user terug gegeven met de naam waar op gezocht wordt", (done) => {
      chai
        .request(server)
        .get("/api/user?name=John")
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

//UC-203
describe("UC-203 Gebruikerprofiel opvragen ", () => {
  //UC-203-1 Gebruiker profiel ophalen geldige token
  describe("UC-203-1 Gebruiker profiel ophalen geldige token", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een 200 status gegeven worden", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set("authorization", "Bearer " + jwt.sign({ userId: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status } = res.body;
          status.should.equals(200);

          done();
        });
    });
  });

  //UC-203-2 Gebruiker profiel ophalen ongeldige token
  describe("UC-203-2 Gebruiker profiel ophalen ongeldige token", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een fout code gegeven worden", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set("authorization", "Bearer 123")

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be.a("string").that.equals("Not authorized");

          done();
        });
    });
  });
});

//UC-204
describe("UC-204 Details van gebruikers ", () => {
  //UC-204-1 Ongeldige token
  describe("UC-204-1 Ongeldige token", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een foutmelding worden terug gegeven dat de token ontbreekt", (done) => {
      chai
        .request(server)
        .get("/api/user/1")

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
  //UC-204-2 Gebruiker-ID bestaat niet
  describe("UC-204-2 Gebruiker-ID bestaat niet", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een foutmelding worden terug gegeven met het id die niet gevonden is", (done) => {
      chai
        .request(server)
        .get("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found");

          done();
        });
    });
  });
  //UC-204-3 Gebruiker-ID bestaat
  describe("UC-204-3 Gebruiker-ID bestaat", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een user terug gegeven", (done) => {
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
  //UC-205-1 Verplicht veld emailadress ontbreekt
  describe("UC-205-1 Verplicht veld emailadress ontbreekt", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een bericht gegeven dat het email ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 6 }, jwtSecretKey))
        .send({
          firstName: "Mariëtte",
          lastName: "van den Dullemen",
          isActive: 1,
          password: "secret",
          phoneNumber: "",
          roles: "",
          street: "",
          city: "",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Emailaddress is missing!");

          done();
        });
    });
  });
  //UC-205-4 Gebruiker bestaat niet
  describe("UC-205-4 Gebruiker bestaat niet", () => {
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
  //UC-205-5 Niet ingelogd
  describe("UC-205-5 Niet ingelogd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een bericht gegeven dat het email al wordt gebruikt", (done) => {
      chai
        .request(server)
        .post("/api/user/99999")
        .set("authorization", "Bearer ")
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
          message.should.be.a("string").that.equals("Not authorized");

          done();
        });
    });
  });
  //UC-205-6 Gebruiker succesvol gewijzigd
  describe("UC-205-6 Gebruiker succesvol gewijzigd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een succesvol wijziging bericht gegeven", (done) => {
      chai
        .request(server)
        .post("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))
        .send({
          firstName: "Mariëtte",
          lastName: "van den Dullemen",
          isActive: 1,
          emailAdress: "verandering@ver.nl",
          password: "secret",
          phoneNumber: "",
          roles: "",
          street: "",
          city: "",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be
            .a("string")
            .that.equals("User with ID 6 succesfully changed");

          done();
        });
    });
  });
});

//UC-206
describe("UC-206 Verwijderen gebruiker ", () => {
  //UC-206-1 Gebruiker bestaat niet
  describe("UC-206-1 Gebruiker bestaat niet", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een bericht gegeven dat de gebruiker niet bestaat", (done) => {
      chai
        .request(server)
        .delete("/api/user/99999")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found!");

          done();
        });
    });
  });

  //UC-206-2 Niet ingelogd
  describe("UC-206-2 Niet ingelogd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een melding gegeven dat er niemand is ingelogd", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(403);
          message.should.be
            .a("string")
            .that.equals("You are not the owner of this user account");

          done();
        });
    });
  });

  //UC-206-3 Actor is geen eigenaar
  describe("UC-206-3 Actor is geen eigenaar", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een melding gegeven dat er de actor niet de eigenaar is", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(403);
          message.should.be
            .a("string")
            .that.equals("You are not the owner of this user account");

          done();
        });
    });
  });

  //UC-206-4 Gebruiker succesvol verwijderen
  describe("UC-206-4 Gebruiker succesvol verwijderen", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er wordt een melding gegeven dat er de actor niet de eigenaar is", (done) => {
      chai
        .request(server)
        .delete("/api/user/6")
        .set("authorization", "Bearer " + jwt.sign({ userId: 6 }, jwtSecretKey))

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(200);
          message.should.be.a("string").that.equals("User with ID 6 deleted!");

          done();
        });
    });
  });
});
