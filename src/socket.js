import Emit from './emit';

export default class Socket extends Emit {

  constructor(opts) {
    super();

    this.options = opts || {};

    // if the user doesn't pass autoconnect then default it to true
    this.options.autoConnect = this.options.autoConnect || true;

    if(!this.options.url) throw "No Socket URL Provided";

    if(this.options.autoConnect === true) {
      this.connect(this.options);
    }
  }

  connect(opts) {

    // @TODO add error handleing around protocols
    this.socket = new WebSocket(opts.url);

    if(typeof this.onConnect === "function") {
      this.socket.addEventListener('open', () => {
        this.onConnect();
      });
    }

    return this;
  }

  disconnect() {

    this.socket.close();
  }

  // TODO add support for encoding different message types
  sendMessage(message) {
    this.debug("Sending Message", message);

    this.socket.send(message);
  }

  onMessage(message) {
    this.debug("Message Received", message);

    let ce = new CustomEvent('socket::message', message);
    this.dispatchEvent(ce);
  }

  onConnect() {
    this.debug('connection established, onConnect called');

    // setup the rest of our event handlers
    this.socket.addEventListener('close', () => {
      this.onDisconnect();
    });

    this.socket.addEventListener('error', (err) => {
      this.onError(err);
    });

    this.socket.addEventListener('message', (message) => {
      this.onMessage(message);
    });
  }

  onError(err) {
    console.error("Socket Error", err);
  }

  onDisconnect() {
    this.debug("Disconnected");

    //handle reconnect logic
    if(this.options.reconnect === true) {
      this.debug('Attempting Reconnect');

      setTimeout(function() {
        this.connect(this.options);
      }.bind(this), this.options.reconnectWait || 0);
    }
  }

  debug(message) {
    if( this.options.debug === true ) {
      console.log("ws::debug", ...arguments);
    }
  }
}
