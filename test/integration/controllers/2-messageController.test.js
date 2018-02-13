var chai = require('chai');
var request = require('supertest'),
    should = require('should');

var expect = chai.expect;

describe('Messages tests.', function () {

    const unregisteredUserName = "registered";
    const registeredUserName = "test";

    before(function (done) {
        done(null, sails);
        Message.destroy().exec((err, res) => { });
        User.destroy().exec((err, res) => { });
    });

    it('Should create the user then reply with the proper answer.', function (done) {
        request(sails.hooks.http.app)
            .get('/api/enter/testUser')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.haveOwnProperty("name");
                done();
            });
    });

    it('Should reply with the proper answer.', function (done) {
        request(sails.hooks.http.app)
            .post('/api/message')
            .send({ userName: 'testUser', messageTxt: 'what is the weather in cairo ?' })
            .expect(200)
            .end(function (err, res) {
                console.log(res.body)
                if (err) return done(err);
                expect(res.body.respMessage).to.contains("The temprature in");
                done();
            });
    });

});
