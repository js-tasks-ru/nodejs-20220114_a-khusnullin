const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);
  
  //Socket authentication
  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    //If token doesn't exist => throw Error
    if (!token){
      next(new Error("anonymous sessions are not allowed"));
    }
    const session = await Session.findOne({token}).populate('user');
    //If session doesn't exist => throw Error
    if (!session){
      next(new Error("wrong or expired session token"));
    }
    //Define socket.user
    socket.user = {
      id: session.user._id,
      displayName: session.user.displayName,
    };
    //If everything fine => next middleware
    next();
  });

  io.on('connection', async function(socket) {
    //If message received
    socket.on('message', async (msg) => {
      //Save to DB
      await Message.create({
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
