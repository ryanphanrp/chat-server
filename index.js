const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {
  Server
} = require("socket.io");
const options = {
  cors: {
    origin: '*',
  }
};
const io = new Server(server, options);

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
  console.log('A users connected.');

  socket.id

  //default username
  socket.username = "Anonymous";

  // Online
  socket.once('online', (res) => {
    const message = `${res} has been online.`;
    console.log(message);
    socket.broadcast.emit('online', message);
  });

  // Offline
  socket.on('disconnect', (res) => {
    console.log('User disconnect');
    socket.leave(socket.id);
  })


  /*
    Conversation
  */

  // All Conversations of users
  socket.on('conversations', (data) => {
    console.log(`${data} get conversations.`);
    const listCS = cs.getConversationOfUser(data);
    socket.emit('conversations', listCS);
  });


  // New Conversation
  socket.on('new_conversation', (res) => {
    const newCs = cs.Conversation(res.name, res.users);
    console.log(newCs);
    cs.addNewConversation(newCs);
    //socket.emit('new_conversation', newCs);
  });


  // Join Exist Conversation
  socket.on('join_conversation', (res) => {
    console.log(`${res.username} ask to join ${res.ID} conversation.`);
    const conversation = cs.getConversation(res.ID);
    socket.leave(socket.id);
    socket.join(res.ID);
    socket.to(res.ID).emit('join_conversation', conversation);
    socket.to(res.ID).emit('status', `${res.username} has been joined ${res.ID} conversation`);
  });

  // listen on new_message
  socket.on('new_message', (res) => {
    console.log(`A new message to conversation: ${res.ID}`);
    const conversationID = res.ID;
    const data = {
      _id: Math.random().toString(36).substring(2, 10),
      content: res.content,
      senderId: res.senderId,
      timestamp: new Date().toDateString()
    }
    let conversation = cs.getConversation(res.ID);
    cs.saveMessages(res.ID, data);
    socket.broadcast.to(conversationID).emit('new_message', data);
    console.log(socket.rooms);
  });

  // listen on change_color
  socket.on('change_color', (res) => {
    console.log(`${res.ID} - ${res.color}`);
    cs.changeColor(res.ID, res.color);
    socket.broadcast.to(res.ID).emit('change_color', res.color);
  });


  // Listen on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', {
      username: socket.username
    })
  });
});


/*
  Server running
*/
server.listen(3000, () => {
  console.log('listening on *:3000');
});
