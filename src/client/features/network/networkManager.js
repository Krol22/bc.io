import networkEvents from '../../../common/constants/networkEvents';

/**
 * NetworkManager class - responsible for communication between client <-> server
*/
export default class NetworkManager {
  /**
   * Starts listen on server events based on networkEvents object.
   * @constructor
   * @param {object} socket - player socket connected to game server,
   */
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
          this._onNetworkEvent(event, args);
        });
      });
  }

  /**
    * Send event from client to server with payload.
    * @param {string} eventName - event name
    * @param {object} payload - event payload 
    */
  sendClientEvent(eventName, payload) {
    this.socket.emit(eventName, payload);
  }

  /** 
    * Server event listener callback function
    * @callback eventCallback
    * @param {Object} payload - event payload
    */

  /**
    * Add listener for server event
    * @param {string} eventName - event name
    * @param {eventCallback} callback - event callback
    */
  addEventListener(eventName, callback) {
    this.events[eventName].push(callback);
  }

  /**
    * Remove event listener
    * @param {string} eventName - event name
    * @param {eventCallback} callback - event callback referenct
    */
  removeEventListener(eventName, callback) {
    const index = this.events[eventName].indexOf(callback); 

    this.events[eventName].splice(index, 1);
  }

  /**
    * Remove all event listeners for server event
    * @param {string} eventName - event name
    */
  removeAllEventListeners(eventName) {
    this.events[eventName] = [];
  }

  _onNetworkEvent(eventName, args) {
    this
      .events[eventName]
      .forEach(eventCallback => {
        eventCallback(args); 
      });
  }

}
