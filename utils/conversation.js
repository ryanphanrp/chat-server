let fs = require('fs');
let User = require('./data.js');
let Message = require('./data.js');

listConversation = JSON.parse(fs.readFileSync('./utils/conversation.json', {
  'encoding': 'utf8'
}));

exports.Conversation = (name, users) => {
  return {
    _id: Math.random().toString(36).substring(2, 10),
    name: name,
    users: users,
    messages: [],
    timestamp: (new Date()).toDateString()
  }
}

exports.saveData = () => {
  fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), {
    'encoding': 'utf8'
  });
}

exports.addNewConversation = (conversation) => {
  listConversation.push(conversation);
  fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), { 'encoding': 'utf8' });
}

exports.deleteConversation = (ID) => {
  listConversation = [...listConversation.filter(ele => ele._id === ID)];
  fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), {
    'encoding': 'utf8'
  });
}

exports.getAllConversation = () => {
  return listConversation;
}

exports.getConversation = (ID) => {
  return listConversation.find(ele => ele._id === ID);
}
