var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

let list_messages = [
  {
    _id: '1',
    content: 'first message',
    senderId: 'partner',
    timestamp: 'hoi nay'
  },
  {
    _id: '2',
    content: 'second message',
    senderId: '__therealTINHTUTE',
    timestamp: 'truoc do'
  },
  {
    _id: '3',
    content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    senderId: 'partner',
    timestamp: 'moi day'
  }
];

// Socket
io.on('connection', (socket) => {
  console.log('New user connected')

  socket.id
  //default username
  socket.username = "Anonymous";

  socket.emit('messages', list_messages);


  socket.on('join_conversation', (data) => {
    console.log(data.conversationID);
    socket.join(data.conversationID);
  });
  //listen on new_message
  socket.on('new_message', (res) => {
    //broadcast the new message
    const data = {
      _id: Math.random().toString(36).substring(2, 10),
      content: res.message.content,
      senderId: res.message.owner,
      timestamp: new Date().toDateString()
    }
    // list_messages.push(data);
    console.log(res);
    socket.to(res.conversationID).emit("new_message", data);
    // socket.broadcast.emit('new_message', data);
  })

  //listen on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username })
  })
});

// Socket Listen
io.listen(3000, () => {
  console.log('Socket listen 3000')
})

app.get('/', (req, res) => res.send('hello!'));
http.listen(4444, () => {
  console.log('listening on *:3000');
});
