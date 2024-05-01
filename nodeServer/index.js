// node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
        origin: true,
        credentials: true,
      },
      allowEIO3: true,
  });

const users = {};
//running socket.io server (instance of http) 
//listen to incoming events
//io.on: socket.io instance that listens to all connections
//socket.on handles whatever happens with that connection
//socket.on listening to user-joined event

io.on('connection', socket => {
    // if new user joins let other users know 
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); //emits event to everyone except the one joined
    });

    //if a user sends message then send the message to all other users
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //if someone left the chat, inform others
    //disconnect is inbuilt event fired when someone leaves
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

})