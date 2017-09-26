'use strict';

importScripts('socket.js');
console.log("Imported Socket");

onmessage((message) => {

  console.log("Worker Message Received", message);
});
