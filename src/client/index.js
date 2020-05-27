import io from 'socket.io-client';

let playerId = -1;

const MOVE_UP = 0;
const MOVE_DOWN = 1;
const MOVE_LEFT = 2;
const MOVE_RIGHT = 3;

function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function connect() {
  let roomId = window.location.pathname.split('/')[1];

  if(!roomId) {
    roomId = makeId(6);
    window.location.pathname = roomId;
    return;
  } 

  const address = `http://localhost:3000/?room=${roomId}`;

  const socket = io(address);

  socket.on('joined', data => {
    playerId = data.id;

    document.querySelector('#message').innerHTML = 'Connected';
  });

  socket.on('player_disconnected', data => {
    console.log('disconnected');

    document.querySelector('#message').innerHTML = 'Not connected';
  });

  socket.on('GAME_TICK', entities => {
    entities.forEach((entity, index) => {
      const element = document.querySelector(`#entity_${index}`);
      element.style.top = entity.components['Ph'].y + 'px';
      element.style.left = entity.components['Ph'].x + 'px';
    });
  });

  window.addEventListener('keydown', (event) => {
    switch(event.key) {
      case 'ArrowUp':
        socket.emit('CLIENT_EVENT', { event: MOVE_UP, playerId });
        break;
      case 'ArrowDown':
        socket.emit('CLIENT_EVENT', { event: MOVE_DOWN, playerId });
        break;
      case 'ArrowLeft':
        socket.emit('CLIENT_EVENT', { event: MOVE_LEFT, playerId });
        break;
      case 'ArrowRight':
        socket.emit('CLIENT_EVENT', { event: MOVE_RIGHT, playerId });
        break;
    }
  });
}

connect();
