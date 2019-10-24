'use strict';

const express = require('express');
// const app = express();
// const server = app.listen(process.env.PORT || 8080);

const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const socket = require('socket.io');
const io = socket(server, { wsEngine: 'ws' });
const mongoose = require('mongoose');
// mongodb://localhost:27017/versus
mongoose.connect(process.env.MONGODB || 'mongodb://localhost:27017/versus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.once('open', function() {
  console.log('connected to mongodb');
});
db.on('error', function(err) {
  console.log(err);
});

let Connect4 = require('./models/connect4');

io.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  // console.log(typeof socket.id);

  socket.on('createRoom', async function(data) {
    await Connect4.find({}, async function(err, games) {
      if (err) return handleError(err);
      else {
        let roomCodes = [];
        for (let i = 0; i < games.length; i++) {
          roomCodes.push(String(games[i].roomCode));
        }
        // console.log(roomCodes);
        let searchingRoom = true;
        let id = makeId(6);
        while (searchingRoom) {
          if (roomCodes.includes(id)) {
            id = makeId(6);
          } else {
            searchingRoom = false;
          }
        }
        let newRoom = new Connect4({
          roomCode: String(id),
          firstId: String(socket.id),
          firstName: String(data.name)
        });
        socket.emit('creatorInfo', { room: String(id) });
        await newRoom.save(function(err) {
          if (err) return handleError(err);
        });
      }
    });
  });

  socket.on('addUser', async function(data) {
    await Connect4.find({ roomCode: data.room }, async function(err, games) {
      if (err) return handleError(err);
      else {
        if (games.length === 0) {
          socket.emit('noRoom', 'no room is available');
          console.log('noRoom');
        } else if (games[0].secondId != undefined) {
          socket.emit('roomFull', 'the room is full');
          console.log('roomFull');
        } else {
          await Connect4.updateOne(
            { roomCode: data.room },
            { $set: { secondId: socket.id, secondName: data.name } }
          );
          socket.emit('validRoom', { name: games[0].firstName });
          socket.broadcast
            .to(`${games[0].firstId}`)
            .emit('playerJoined', { name: data.name });
          console.log('validRoom');
        }
      }
    });
  });

  socket.on('getGameInfo', async function() {
    await Connect4.find({ firstId: socket.id }, async function(err, games) {
      if (err) return handleError(err);
      if (games.length > 0) {
        socket.emit('setGameInfo', {
          one: games[0].firstName,
          two: games[0].secondName,
          room: games[0].roomCode
        });
      }
    });
    await Connect4.find({ secondId: socket.id }, function(err, games) {
      if (err) return handleError(err);
      if (games.length > 0) {
        socket.emit('setGameInfo', {
          one: games[0].firstName,
          two: games[0].secondName,
          room: games[0].roomCode
        });
      }
    });
  });

  socket.on('disconnect', async function(data) {
    await Connect4.find({ firstId: socket.id }, async function(err, games) {
      if (err) return handleError(err);
      if (games.length > 0) {
        socket.broadcast
          .to(`${games[0].secondId}`)
          .emit('disconnected', 'a player has disconnected');
        Connect4.deleteOne({ firstId: socket.id }, function(err) {
          if (err) return handleError(err);
        });
      }
    });
    await Connect4.find({ secondId: socket.id }, function(err, games) {
      if (err) return handleError(err);
      if (games.length > 0) {
        socket.broadcast
          .to(`${games[0].firstId}`)
          .emit('disconnected', 'a player has disconnected');
        Connect4.deleteOne({ secondId: socket.id }, function(err) {
          if (err) return handleError(err);
        });
      }
    });
  });

  socket.on('column', async function(data) {
    await Connect4.find({}, function(err, games) {
      if (err) return handleError(err);
      let playerOnes = [];
      let playerTwos = [];
      for (let i = 0; i < games.length; i++) {
        playerOnes.push(String(games[i].firstId));
        playerTwos.push(String(games[i].secondId));
      }
      if (playerOnes.includes(socket.id)) {
        socket.broadcast
          .to(`${playerTwos[playerOnes.indexOf(socket.id)]}`)
          .emit('column', data);
      } else if (playerTwos.includes(socket.id)) {
        socket.broadcast
          .to(`${playerOnes[playerTwos.indexOf(socket.id)]}`)
          .emit('column', data);
      }
    });
  });

  socket.on('restart', async function() {
    await Connect4.find({}, function(err, games) {
      if (err) return handleError(err);
      let playerOnes = [];
      let playerTwos = [];
      for (let i = 0; i < games.length; i++) {
        playerOnes.push(String(games[i].firstId));
        playerTwos.push(String(games[i].secondId));
      }
      if (playerOnes.includes(socket.id)) {
        socket.broadcast
          .to(`${playerTwos[playerOnes.indexOf(socket.id)]}`)
          .emit('restart');
      } else if (playerTwos.includes(socket.id)) {
        socket.broadcast
          .to(`${playerOnes[playerTwos.indexOf(socket.id)]}`)
          .emit('restart');
      }
    });
  });
}

function makeId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
