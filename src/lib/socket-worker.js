'use strict';

import Socket from './socket.js';
import Serializer from './serializers';

let socket;
let serializer = new Serializer();

onmessage = (message) => {

  let messageData = message.data || {};

  if( !socket && messageData.type === 'options') {
    if( messageData.serializationMode ) {
      serializer = new Serializer(messageData.serializationMode);
    }

    let options = serializer.deserialize(messageData.data)

    let socketOptions = options.socketOptions;

    socket = new Socket(socketOptions);

    // @TODO rework to use all events and just pass through
    socket.on('socket::connect', ($e) => {
      passMessageToCaller('socket::connect', {});
    });

    socket.on('socket::error', ($e) => {
      passMessageToCaller('socket::error', $e.data);
    });

    socket.on('socket::disconnect', ($e) => {
      passMessageToCaller('socket::disconnect', {});
    });

    socket.on('socket::message', ($e) => {
      passMessageToCaller('socket::message', $e.data);
    });

    socket.on('socket::reconnect::exhausted', ($e) => {
      passMessageToCaller('socket::reconnect::exhausted', $e);
    });

  }
  else if( socket && messageData.type === 'debugging' ) {
    let mode = serializer.deserialize(messageData.data);
    socket.setDebugging(mode);
  }
  // If we have socket object then lets send the message
  else if( socket ) {
    let data = serializer.deserialize(messageData.data);
    socket.sendMessage(data);
  }
};

function passMessageToCaller(type, data) {
  let retData = serializer.serialize(data);
  let messageObj = {type: type, data: retData};
  postMessage(messageObj);
}
