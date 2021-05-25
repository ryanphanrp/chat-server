let fs = require('fs');
let User = require('./data.js');
let Message = require('./data.js');

listConversation = JSON.parse(fs.readFileSync('./utils/conversation.json', {
  'encoding': 'utf8'
}));

exports.Conversation = (name, users, options) => {
  return {
    _id: Math.random().toString(36).substring(2, 10),
    name: name,
    users: users,
    messages: [],
    timestamp: (new Date()).toDateString(),
    options: options
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

exports.getConversationOfUser = (username) => {
  return listConversation.filter(ele => checkUsers(ele.users, username));
}

exports.getConversation = (ID) => {
  return listConversation.find(ele => ele._id === ID);
}

exports.getP2PConversation = (members) => {
  const res = haveConversation(members);
  if (res.length === 1) {
    return res[0];
  } else {
    const newCs = {
      _id: Math.random().toString(36).substring(2, 10),
      name: 'P2P',
      users: members,
      messages: [],
      timestamp: (new Date()).toDateString(),
      options: '#3498db'
    };
    listConversation.push(newCs);
    fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), { 'encoding': 'utf8' });
    return newCs;
  }
}

exports.saveMessages = (ID, message) => {
  listConversation.map(ele => {
    if (ele._id === ID) {
      ele.messages.push(message);
      return ele;
    } else {
      return ele;
    }
  });
  fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), { 'encoding': 'utf8' });
}

exports.changeColor = (ID, color) => {
  listConversation.map(ele => {
    if (ele._id === ID) {
      ele.options = color;
    } else {
      return ele;
    }
  });
  fs.writeFileSync('./utils/conversation.json', JSON.stringify(listConversation), { 'encoding': 'utf8' });
}

/* Functions */
function checkUsers(users, username) {
  return users.find(ele => ele.username === username);
}

function haveConversation(members) {
  return listConversation.filter(ele => existConversation(ele, members));
}

function existConversation(conversation, members) {
  const length = conversation.users.length === members.length;
  const listID = conversation.users.map(ele => ele._id);
  return members.every(ele => listID.includes(ele._id)) && length;
}

function checkConversation(conversation, members) {
  const listID = conversation.users.map(ele => ele._id);
  return members.every(ele => listID.includes(ele._id));
}
