/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    async newUser(req, res) {

        if (!req.body || !req.body.userName) {
            res.send("Invelid user");
            return;
        }

        let user = await User.find({ name: req.body.userName });

        if (user.length === 0) {
            const createdUser = await User.create({ name: req.body.userName });
            res.send(createdUser);
            return;
        }

        user = user[0];

        res.send(user);

    },
    async enter(req, res) {
        res.send(await User.findOrCreate(
            {
                name: req.params.name
            },
            {
                name: req.params.name
            }));
    },
    async getAllUsers(req, res) {
        res.send(await User.find({}));
    }
};

