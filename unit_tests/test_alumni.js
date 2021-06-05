var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");


describe("Receber todos os Alumnis:", function() {
    it("Deve retornar todos os alumnis", function(done) {
        server
            .get("/alumni")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            });
    });

});