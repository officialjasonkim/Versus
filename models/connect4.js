let mongoose = require('mongoose');

let connect4Schema = mongoose.Schema({
  roomCode: {
    type: String,
    required: true
  },
  firstId: {
    type: String,
    required: false
  },
  secondId: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  secondName: {
    type: String,
    required: false
  }
});

let Connect4 = (module.exports = mongoose.model('Connect4', connect4Schema));
