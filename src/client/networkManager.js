import networkEvents from '../common/constants/networkEvents';

export default class NetworkManager {
  constructor(socket) {
    this.connected = false;
    this.socket = socket;

    this.players = [];
    this.events = {};

    Object
      .keys(networkEvents)
      .forEach((event) => {
        this.events[event] = [];

        socket.on(event, (args) => {
          this.onNetworkEvent(event, args);
        });
      });
  }

  sendClientEvent(eventName, event) {
    this.socket.emit(eventName, event);
  }

  onNetworkEvent(eventName, args) {
    this
      .events[eventName]
      .forEach(eventCallback => {
        eventCallback(args); 
      });
  }

  addEventListener(eventName, callback) {
    this.events[eventName].push(callback);
  }

  removeEventListener(eventName, callback) {
    const index = this.events[eventName].indexOf(callback); 

    this.events[eventName].splice(index, 1);
  }

  removeAllEventListeners(eventName) {
    this.events[eventName] = [];
  }
}
