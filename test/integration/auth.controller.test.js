const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");

const jwt = require("jsonwebtoken");
const { jwtSecretKey, logger } = require("../../src/config/config");

let database = [];

chai.should();
chai.use(chaiHttp);
//UC-101
describe("UC-101-1 Verplicht veld ontbreekt", () => {
  //UC-101-1 Verplicht veld ontbreekt
  describe("UC-101-1 Verplicht veld ontbreekt", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat er een vled ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")

        .send({
          //emailAdress: "j.doe@server.com",
          password: "secret",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals(
              "AssertionError [ERR_ASSERTION]: email must be a string."
            );

          done();
        });
    });
  });

  //UC-101-4 Gebruiker bestaat niet
  describe("UC-101-4 Gebruiker bestaat niet", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat de gebruiker niet bestaat", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")

        .send({
          emailAdress: "kees@bestaatniet.nl",
          password: "secret",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("User not found or password invalid");

          done();
        });
    });
  });

  //UC-101-5 Gebruiker succesvol ingelogd
  describe("UC-101-5 Gebruiker succesvol ingelogd", () => {
    beforeEach((done) => {
      databes = [];
      done();
    });

    it("Er moet een melding komen dat de gebruiker niet bestaat", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")

        .send({
          emailAdress: "j.doe@server.com",
          password: "secret",
        })

        .end((err, res) => {
          res.should.be.an("object");
          let { status, results } = res.body;
          status.should.equals(200);
          results.id.should.be.a("number").that.equals(2);

          done();
        });
    });
  });
});
