const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

/* Local import */
const User = require('./utils/data');
const Message = require('./utils/data');
const cs = require('./utils/conversation.js');

/* Get and Load data */
let conversationList = cs.getAllConversation();


/* Pagesite on html */
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});


/*
  Socket
*/
io.on('connection', (socket) => {
  console.log('New user connected')

  socket.id

  //default username
  socket.username = "Anonymous";

  // Emit all message
  socket.emit('messages', []);

  // All Conversations
  socket.emit('conversations', conversationList);

  // New Conversation
  socket.on('new_conversation', (res) => {
    console.log('New Conversation');
    const newCs = cs.Conversation(res.name, res.users);
    cs.addNewConversation(newCs);
    socket.emit('new_conversation', newCs);
  });

  // Join Exist Conversation
  socket.on('join_conversation', (data) => {
    console.log(data);
    const conversation = cs.getConversation(data);
    console.log(conversation);
    socket.join(data);
    socket.to(data).emit("messages", 'vc');
  });


  // listen on new_message
  socket.on('new_message', (res) => {
    // broadcast the new message
    // const data = {
    //   _id: Math.random().toString(36).substring(2, 10),
    //   content: res.message.content,
    //   senderId: res.message.owner,
    //   timestamp: new Date().toDateString()
    // }
    const data = new User(res.message.content, res.message.owner);
    console.log(data);
    //socket.to(res.conversationID).emit("new_message", data);
    socket.broadcast.emit('new_message', data)
  })


  //l isten on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {
      username: socket.username
    })
  })
});


/*
  Server running
*/
server.listen(3000, () => {
  console.log('listening on *:3000');
});
