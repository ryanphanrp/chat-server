exports.User = class User {
  constructor(id, name, username, avatarUrl) {
    this._id = id;
    this.name = name;
    this.username = username;
    this.avatarUrl = avatarUrl;
  }

  get() {
    return {
      _id: this._id,
      name: this.name,
      username: this.username,
      avatarUrl: this.avatarUrl
    }
  }
}

exports.Message = class Message {
  constructor(content, senderId) {
    this._id = Math.random().toString(36).substring(2, 10);
    this.content = content;
    this.senderId = senderId;
    this.timestamp = new Date().toDateString();
  }
}
