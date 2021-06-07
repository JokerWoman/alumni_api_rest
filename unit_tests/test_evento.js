var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");


describe("Receber todos os eventos:", function() {
    it("Deve retornar todos os eventos", function(done) {
        server
            .get("/evento")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200);
                done();
            });
    });

});