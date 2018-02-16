import Events from 'ampersand-events';
import Worker from 'worker-loader?inline&name=socket-worker.[hash].js!./socket-worker.js';
import Serializer from './serializers/';

export default class SocketWorker {
  constructor(options) {
    if( !options || !options.socketOptions ) {
      throw new Error('no options passed to SocketWorker');
      return;
    }

    Events.createEmitter(this);

    this.options = options;
    let mode = options.serializationMode || undefined;
    this.Serializer = new Serializer(mode);

    this.worker = new Worker();
    this.worker.onmessage = this.messageHandler.bind(this);

    let optionsMessage = { 
      'type' : 'options',
      'serializationMode': mode,
      'data': options
    };

    this._executeMessage(optionsMessage);
  }

  messageHandler($e) {

    let messageObj = Object.assign({}, $e.data);
    let eventName = messageObj.type;
    messageObj.data = this.Serializer.deserialize(messageObj.data);


    this.trigger(eventName, messageObj);
  }

  sendMessage(message) {
    let messageObj = {
      type: 'generic',
      data: message
    }

    this._executeMessage(messageObj);
  }

  setDebugging(mode) {
    let messageObj = {
      type: 'debugging',
      data: mode
    }

    this._executeMessage(messageObj);
  }

  _executeMessage(messageObj) {
    let message = Object.assign({}, messageObj); // clone so we don't mutate

    message.data = this.Serializer.serialize(message.data);

    if( this.options.debug === true ) {
      console.log('wsc::debug', message);
    }

    this.worker.postMessage(message);
  }

}
