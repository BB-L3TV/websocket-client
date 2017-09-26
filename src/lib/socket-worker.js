'use strict';

import Socket from './socket.js';

let socket;

onmessage = (message) => {

  let messageData = message.data || {};

  if( !socket && messageData.type === 'options') {
    socket = new Socket(messageData.data);

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

  }
};

function passMessageToCaller(type, data) {
  let messageObj = {type: type, data: data};
  postMessage(messageObj);
}
