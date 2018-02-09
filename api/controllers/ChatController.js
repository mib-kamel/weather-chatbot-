/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const Wit = require('node-wit').Wit
const token = "4QB2QB6Z4UNH2UON5RCI7MTTRMVT3BIA"

module.exports = {

    async newMessage(req, res) {

        if (!req.body || !req.body.messageTxt || !req.body.userName) {
            res.send("invalid message");
            return;
        }

        let messageTxt = req.body.messageTxt;
        let user = (await User.find({ name: req.body.userName }));

        if (user.length === 0) {
            res.send("Invalid user");
            return;
        }

        user = user[0];

        const client = new Wit({ accessToken: token });
        client.message(messageTxt, {})
            .then((data) => {
                res.send({
                    message: messageTxt,
                    user,
                    data
                })
            })
            .catch(console.error);
    }

};

