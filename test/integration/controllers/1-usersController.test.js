var chai = require('chai');
var request = require('supertest'),
    should = require('should');

var expect = chai.expect;

describe('Users enter tests', function () {

    const unregisteredUserName = "registered";
    const registeredUserName = "test";

    before(function (done) {
        done(null, sails);
        Message.destroy().exec((err, res) => { });
        User.destroy().exec((err, res) => { });
    });

    it('Should create a new user when not registered name enter.', function (done) {
        request(sails.hooks.http.app)
            .get('/api/enter/' + unregisteredUserName)
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).to.haveOwnProperty("name");
                done();
            });
    });

});
