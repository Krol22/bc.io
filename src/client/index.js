import io from 'socket.io-client';
import { MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT } from '../common/networkActions';

let playerId;
let socket;

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

  socket = io(address);

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
}

connect();

window.addEventListener('keydown', (event) => {
  console.log(event);
  switch(event.key) {
    case 'w':
      socket.emit('CLIENT_EVENT', { event: MOVE_UP });
      break;
    case 's':
      socket.emit('CLIENT_EVENT', { event: MOVE_DOWN });
      break;
    case 'a':
      socket.emit('CLIENT_EVENT', { event: MOVE_LEFT });
      break;
    case 'd':
      socket.emit('CLIENT_EVENT', { event: MOVE_RIGHT });
      break;
  }
});
