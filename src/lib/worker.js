import Events from 'ampersand-events';
import Worker from 'worker-loader?inline&name=socket-worker.[hash].js!./socket-worker.js';

export default class SocketWorker {
  constructor(socketOptions) {
    if( !socketOptions ) {
      throw new Error('no options passed to SocketWorker');
      return;
    }

    Events.createEmitter(this);

    this.worker = new Worker();
    this.worker.onmessage = this.messageHandler.bind(this);

    let optionsMessage = { 
      'type' : 'options',
      'data': socketOptions
    };

    this.worker.postMessage(optionsMessage);
  }

  messageHandler($e) {
    let messageObj = $e.data;
    let eventName = messageObj.type;

    this.trigger(eventName, messageObj);
  }

  sendMessage(message) {
    let messageObj = {
      type: 'generic',
      data: message
    }

    this.worker.postMessage(messageObj);
  }

  setDebugging(mode) {
    let messageObj = {
      type: 'debugging',
      data: mode
    }

    this.worker.postMessage(messageObj);
  }
}
