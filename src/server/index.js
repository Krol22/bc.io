const express = require('express');
const socketio = require('socket.io');

const Game = require('./game');

const PORT = process.env.PORT || 3000;

const app = express();
const server = app.listen(PORT);

console.log(`Listening on port ${PORT}`);

const io = socketio(server);

const rooms = {};
const games = [];

io.on('connection', socket => {
  const roomId = socket.handshake.query.room;
  const randomPlayerId = Math.floor(Math.random() * 10000);

  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      players: [],
    };
  }

  rooms[roomId].players.push({
    id: randomPlayerId,
    socket,
  });

  socket.join(roomId);

  console.log(Object.keys(rooms).map(room => `${room} ${rooms[room].players.map(player => player.id)}`));

  socket.emit('joined', { id: randomPlayerId });

  if (rooms[roomId].players.length == 2) {
    games.push(new Game(rooms[roomId]));
  }

  socket.on('disconnect', () => {
    // console.log(randomPlayerId);
    rooms[roomId].players = [...rooms[roomId].players.filter(({id}) => id !== randomPlayerId)];
    io.to(roomId).emit('player_disconnected', { id: randomPlayerId });
  });
});

setInterval(() => {
  games.forEach(game => game.loop());
}, 10)
