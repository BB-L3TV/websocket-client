import Events from 'ampersand-events';
import Worker from 'worker-loader?inline&name=socket-worker[hash].js!./socket-worker.js';

var emitter = {};
Events.createEmitter(emitter);

function messageHandler($e) {
  let messageObj = $e.data;
  let eventName = messageObj.type;
  let data = messageObj.data;

  emitter.trigger(eventName, data);
}

export default function SocketWorker(socketOptions) {
  if( !window.Worker ) {
    throw new Error("no Worker object found on window");
    return;
  }

  let socketWorker = new Worker();
  socketWorker.onmessage = messageHandler;

  let optionsMessage = { 
    'type' : 'options',
    'data': socketOptions
  };

  socketWorker.postMessage(optionsMessage);

  return emitter;
}
