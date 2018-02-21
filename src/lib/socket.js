import Events from 'ampersand-events';

export default class Socket {

  constructor(opts) {
    this.options = opts || {};

    // if the user doesn't pass autoconnect then default it to true
    this.options.autoConnect = this.options.autoConnect || true;

    if(!this.options.url) throw "No Socket URL Provided";

    if(this.options.autoConnect === true) {
      this.connect(this.options);
    }

    Events.createEmitter(this);
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

    this.debug("Socket", this.socket);

    this.socket.addEventListener('error', this.connectionError.bind(this));

    if(typeof this.onConnect === "function") {
      this.socket.addEventListener('open', () => {
        this.socket.removeEventListener('error', this.connectionError.bind(this));  //remove the connect error listener
        this.onConnect();
      });

    }

    return this;
  }

  disconnect() {

    this.reconnect = false; // prevent the reconnect logic
    this.socket.close();
  }

  setDebugging(mode) {
    this.options.debug = !!mode;
  }

  shouldAttemptReconnect() {
    if( this.reconnect === false ) {
      return false;
    }

    let raOption;

    if( this.options.hasOwnProperty('reconnectTries') ) {
      let raOption = parseInt(this.options.reconnectTries, 10);
      
      if( isNaN(raOption) ) {
        return false;
      }
      else if( raOption < this.reconnectionAttempts ) {
        this.trigger('socket::reconnect::exhausted');
        return false;
      }
    }

    return true;
  }

  // TODO add support for encoding different message types
  sendMessage(message) {
    if( this.socket.readyState !== this.socket.OPEN ) {
      this.debug('NOT sending message, socket not open', message);
      return false;
    }

    this.debug('Sending Message', message);

    return this.socket.send(message);
  }

  onMessage(message) {
    this.debug("Message Received", message);

    this.trigger('socket::message', message);
  }

  onConnect() {
    this.debug('connection established, onConnect called');

    this.reconnectionAttempts = null;
    this.currentReconnectWait = null;

    // setup the rest of our event handlers
    this.socket.addEventListener('close', () => {
      this.onDisconnect();
    });

    this.socket.addEventListener('message', (message) => {
      this.onMessage(message);
    });

    this.trigger('socket::connect');
  }

  connectionError(error) {
    this.debug('Connection Error', error);

    this._reconnect();
  }

  onError(err) {
    this.debug('error handler called from socket event', err);

    this.trigger('socket::error', {detail: err});
  }

  onDisconnect() {
    this.debug('Disconnected');

    this.trigger('socket::disconnect');

    this._reconnect();
  }

  _reconnect() {
    //handle reconnect logic
    if(this.shouldAttemptReconnect() === true) {
      let wait = this.getReconnectWait();

      this.debug(`Attempting Reconnect in ${wait}ms, Attempts Made: ${this.reconnectionAttempts}`);

      setTimeout(() => {
        this.reconnectionAttempts += 1;

        this.connect(this.options);
      }, wait);
    }
  }

  getReconnectWait() {
    let rwi = isNaN(parseInt(this.options.reconnectWaitIncrement, 10)) ? 0 : parseInt(this.options.reconnectWaitIncrement, 10);

    if( this.currentReconnectWait ) {
      this.currentReconnectWait += rwi;
    }
    else {
      this.currentReconnectWait = this.options.reconnectWait || 0;
    }

    return this.currentReconnectWait;
  }

  debug(label, message) {
    if( this.options.debug !== true ) return false;

    if( !this.debugExcludeMessage(message) ) {
      console.log("ws::debug", ...arguments);
    }
  }

  debugExcludeMessage(message) {
    if( !message || !this.options.debugExclude ) return false;

    let ex = this.options.debugExclude;

    if( typeof ex === 'object' ) {
      for( let key in ex ) {
        if( !message[key] || typeof ex[key] !== 'string' ) return false;

        let rex = new RegExp(ex[key], 'i');
        return rex.test(message[key]);
      }
    }
    else if( typeof ex === 'string' ) {
      return ex.test(message);
    }
  }
}
