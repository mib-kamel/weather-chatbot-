/**
 * WitService.js
 */

const Wit = require('node-wit').Wit
const token = "DCIKJYDHKLNKDCHCUXSPXSQHFSXJB2J4"
let conversation = {}
const actions = {
    send(request, response) {
      // do something when bot sends message
      console.log("Request");
      console.log(request)
      console.log("response");
      console.log(response)
    },
    findTheatre(request) {
      // perform action here and update context
    }
  }

const client = new Wit({accessToken: token, actions})

module.exports = {
  client: new Wit({accessToken: token, actions}),
  setConversation(conv){
    conversation = conv
  }
}