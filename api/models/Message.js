/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  async saveMessage(messageTxt, entity, messageDate, userID, isFromUser = false) {
    return await Message.create({
      messageTxt,
      entity,
      userID,
      messageDate,
      isFromUser
    });
  },

  async getUserLastMsg(userID) {
    return (await Message.find({ userID, isFromUser: false })
      .sort('createdAt DESC')
      .limit(1));
  }
}

