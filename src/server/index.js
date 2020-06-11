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

    rooms[roomId].game = new Game(rooms[roomId]);
  }

  const newPlayer = {
    id: randomPlayerId,
    socket,
  };

  rooms[roomId].players.push(newPlayer);

  socket.join(roomId);

  rooms[roomId].game.addPlayer(newPlayer);

  console.log(Object.keys(rooms).map(room => `${room} ${rooms[room].players.map(player => player.id)}`));

  const connectedPlayers = rooms[roomId].players.map(player => ({ id: player.id }));

  socket.emit('PLAYER_JOINED', { id: randomPlayerId, players: connectedPlayers });
  io.to(roomId).emit('PLAYER_JOINED', { id: randomPlayerId, players: connectedPlayers });


  socket.on('disconnect', () => {
    rooms[roomId].players = [...rooms[roomId].players.filter(({id}) => id !== randomPlayerId)];
    io.to(roomId).emit('PLAYER_DISCONNECTED', { id: randomPlayerId });
  });
});

setInterval(() => {
  Object.keys(rooms).forEach(key => {
    const { game } = rooms[key];
    game.loop();
  });
}, 10);
