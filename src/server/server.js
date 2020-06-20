import express from 'express';
import socketio from 'socket.io';

import Game from './game';

const PORT = process.env.PORT || 3000;

const app = express();
const server = app.listen(PORT);
const io = socketio(server);

const rooms = {};
console.log(`Listening on port ${PORT}`);

io.on('connection', socket => {
  const roomId = socket.handshake.query.room;
  const uname = socket.handshake.query.uname;

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
    userName: uname,
    socket,
  };

  rooms[roomId].players.push(newPlayer);

  socket.join(roomId);

  rooms[roomId].game.addPlayer(newPlayer);

  console.log(Object.keys(rooms).map(room => `${room} ${rooms[room].players.map(player => player.id + ' ' + player.userName)}`));

  const connectedPlayers = rooms[roomId].players.map(player => ({ id: player.id }));

  // send player data to client;
  socket.emit('PLAYER_CONNECTED', { id: randomPlayerId, players: connectedPlayers });

  // inform all in room sockets;
  io.to(roomId).emit('PLAYER_JOINED', { id: randomPlayerId, players: connectedPlayers });

  socket.on('disconnect', () => {
    rooms[roomId].players = [...rooms[roomId].players.filter(({id}) => id !== randomPlayerId)];
    io.to(roomId).emit('PLAYER_LEFT', { id: randomPlayerId });
  });
});

setInterval(() => {
  Object.keys(rooms).forEach(key => {
    const { game } = rooms[key];
    game.loop();
  });
}, 10);
