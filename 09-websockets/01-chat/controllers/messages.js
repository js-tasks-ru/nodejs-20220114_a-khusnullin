const Message = require('../models/Message');
const Session = require('../models/Session');

module.exports.messageList = async function messages(ctx, next) {
  //Check Authorization Header
  if (!ctx.request.header.authorization){
    ctx.throw(401, "Пользователь не залогинен");
  }
  //Define token
  const token = ctx.request.header.authorization.split(" ")[1];
  //Find Session
  const session = await Session.findOne({token}).populate('user');
  //If session not found or wrong token => Error 404
  if (!session || token != session.token){
    ctx.throw(401, "wrong or expired session token");
  }
  //Else => find messages in DB & save to messagesList
  const tmpList = await Message.find({chat: session.user.id});
  let messagesList = [];
  tmpList.forEach((item, index) => {
    messagesList[index] = {
      date: item.date,
      id: item.id,
      text: item.text,
      user: item.user,
    };
  });
  //Return messagesList
  ctx.body = {messages: messagesList};
  return next();  
};
