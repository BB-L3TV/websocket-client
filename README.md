#### WebSocket Client ####
This project was started to create a small wrapper for the native browser WebSocket class while adding a few additional features.

##### Options #####
|Option| Values | Notes |
|---|---|---|
| url | string | The url or endpoint of the websocket server (currently: including the protocol, and port ex. ws://127.0.0.1:9003). This value is **NOT** optional.  An error will be thrown if this option is not set. |
| autoConnect  | bool (true)  | If autoConnect is false socket.connect will have to be called manually  |
| reconnect  | bool (true)  | To reconect or not to reconnect tis the question  |
| reconnectWait | int (0) | Amount of time to wait between reconnection attempts |
| reconnectTries  | int | Setting this to 0 is the same as setting reconnect to false, not setting this value or using a value of null will allow for an infinite number of reconnection attempts |
| debug | bool (false) | Allows for the output of debug messaging |

##### Events #####
Keeping the code base to a minimal size, this proejct makes use of native CustomEvents class.  This means that data passed on events will be under e.detail.

| Event | Description |
|---|---|
| socket::connect | Fired any time a socket connection is successful |
| socket::disconnect | Fired when the socket connection is lost or disconnect is called |
| socket::message | Message is received from the server |
| socket::error | An error has occoured |

##### Methods #####
| Method | Description |
| --- | --- |
| connect | allows for the manual initiation of a socket connection |
| disconnect | disconnects socket connection and prevents future reconnection attempts |
| sendMessage | this method simply sends the message provided, with no mutation |