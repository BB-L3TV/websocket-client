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

    // set our own value as to not mutate the users wishes
    if( !this.reconnect ) {
      this.reconnect = this.options.reconnect || false;
    }

    if( !this.reconnectionAttempts ) {
      this.reconnectionAttempts = 0;
    }

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

    this.reconnect = false; // prevent the reconnect logic
    this.socket.close();
  }

  shouldAttemptReconnect() {
    if( this.reconnect = false ) {
      return false;
    }

    let raOption;

    if( this.options.hasOwnProperty('reconnectTries') ) {
      let raOption = parseInt(this.options.reconnectTries, 10);
      
      if( isNaN(raOption) ) {
        return true;
      }
      else if( raOption > this.reconnectionAttempts ) {
        return false;
      }
    }

    return true;
  }

  // TODO add support for encoding different message types
  sendMessage(message) {
    this.debug("Sending Message", message);

    this.socket.send(message);
  }

  onMessage(message) {
    this.debug("Message Received", message);

    // @TODO determine if we need to strip any of the message event data beore
    // creating custom event
    let ce = new CustomEvent('message', {detail: message});
    this.dispatchEvent(ce);
  }

  onConnect() {
    this.debug('connection established, onConnect called');

    let ce = new Event('socket::connect');
    this.dispatchEvent(ce);

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
    this.debug('error', err);

    let ce = new CustomEvent('socket::error', {detail: err});
    this.dispatchEvent(ce);
  }

  onDisconnect() {
    this.debug("Disconnected");

    let ce = new Event('socket::disconnect');
    this.dispatchEvent(ce);

    //handle reconnect logic
    if(this.shouldAttemptReconnect() === true) {
      this.debug('Attempting Reconnect');

      setTimeout(() => {
        this.reconnectionAttempts += 1;

        this.connect(this.options);
      }, this.options.reconnectWait || 0);
    }
  }

  debug(message) {
    if( this.options.debug === true ) {
      console.log("ws::debug", ...arguments);
    }
  }
}
