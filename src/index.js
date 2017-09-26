import { default as Socket } from './socket.js';

/*
import Emit from './emit';

class Emitter extends Emit {
  constructor() {
    super();
  }

  trigger(eventName, data) {
    let ce = new CustomEvent(eventName, {'detail': data});
    this.dispatch(ce);
  }
}

var emitterInstance = new Emitter();

export function SocketWorker(socketOptions) {
  if( !window.Worker ) {
    throw new Error("no Worker object found on window");
    return;
  }

  let socketWorker = new Worker('./src/woker.js');
  socketWorker.onmessage = messageHandler;

  let optionsMessage = { 
    'type' : 'options',
    'data': socketOptions
  };

  socketWorker.postMessage(JSON.stringify(optionsMessage));

  return emitterInstance;
}


function messageHandler($e) {

  let messageObj = JSON.parse($e);
  let eventName = messageObj.type;
  let data = messageObj.payload;

  emitterInstance.trigger(eventName, data);
}
*/

module.exports = {
  Socket
};
