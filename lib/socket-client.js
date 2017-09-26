(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("socket-client", [], factory);
	else if(typeof exports === 'object')
		exports["socket-client"] = factory();
	else
		root["socket-client"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _socket = __webpack_require__(1);

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  Socket: _socket2.default
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emit = __webpack_require__(2);

var _emit2 = _interopRequireDefault(_emit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Socket = function (_Emit) {
  _inherits(Socket, _Emit);

  function Socket(opts) {
    _classCallCheck(this, Socket);

    var _this = _possibleConstructorReturn(this, (Socket.__proto__ || Object.getPrototypeOf(Socket)).call(this));

    _this.options = opts || {};

    // if the user doesn't pass autoconnect then default it to true
    _this.options.autoConnect = _this.options.autoConnect || true;

    if (!_this.options.url) throw "No Socket URL Provided";

    if (_this.options.autoConnect === true) {
      _this.connect(_this.options);
    }
    return _this;
  }

  _createClass(Socket, [{
    key: "connect",
    value: function connect(opts) {
      var _this2 = this;

      // set our own value as to not mutate the users wishes
      if (!this.reconnect) {
        this.reconnect = this.options.reconnect || false;
      }

      if (!this.reconnectionAttempts) {
        this.reconnectionAttempts = 0;
      }

      // @TODO add error handleing around protocols
      this.socket = new WebSocket(opts.url);

      if (typeof this.onConnect === "function") {
        this.socket.addEventListener('open', function () {
          _this2.onConnect();
        });
      }

      return this;
    }
  }, {
    key: "disconnect",
    value: function disconnect() {

      this.reconnect = false; // prevent the reconnect logic
      this.socket.close();
    }
  }, {
    key: "shouldAttemptReconnect",
    value: function shouldAttemptReconnect() {
      if (this.reconnect = false) {
        return false;
      }

      var raOption = void 0;

      if (this.options.hasOwnProperty('reconnectTries')) {
        var _raOption = parseInt(this.options.reconnectTries, 10);

        if (isNaN(_raOption)) {
          return true;
        } else if (_raOption > this.reconnectionAttempts) {
          return false;
        }
      }

      return true;
    }

    // TODO add support for encoding different message types

  }, {
    key: "sendMessage",
    value: function sendMessage(message) {
      this.debug("Sending Message", message);

      this.socket.send(message);
    }
  }, {
    key: "onMessage",
    value: function onMessage(message) {
      this.debug("Message Received", message);

      // @TODO determine if we need to strip any of the message event data beore
      // creating custom event
      var ce = new CustomEvent('socket::message', { detail: message });
      this.dispatchEvent(ce);
    }
  }, {
    key: "onConnect",
    value: function onConnect() {
      var _this3 = this;

      this.debug('connection established, onConnect called');

      var ce = new Event('socket::connect');
      this.dispatchEvent(ce);

      // setup the rest of our event handlers
      this.socket.addEventListener('close', function () {
        _this3.onDisconnect();
      });

      this.socket.addEventListener('error', function (err) {
        _this3.onError(err);
      });

      this.socket.addEventListener('message', function (message) {
        _this3.onMessage(message);
      });
    }
  }, {
    key: "onError",
    value: function onError(err) {
      this.debug('error', err);

      var ce = new CustomEvent('socket::error', { detail: err });
      this.dispatchEvent(ce);
    }
  }, {
    key: "onDisconnect",
    value: function onDisconnect() {
      var _this4 = this;

      this.debug("Disconnected");

      var ce = new Event('socket::disconnect');
      this.dispatchEvent(ce);

      //handle reconnect logic
      if (this.shouldAttemptReconnect() === true) {
        this.debug('Attempting Reconnect');

        setTimeout(function () {
          _this4.reconnectionAttempts += 1;

          _this4.connect(_this4.options);
        }, this.options.reconnectWait || 0);
      }
    }
  }, {
    key: "debug",
    value: function debug(message) {
      if (this.options.debug === true) {
        var _console;

        (_console = console).log.apply(_console, ["ws::debug"].concat(Array.prototype.slice.call(arguments)));
      }
    }
  }]);

  return Socket;
}(_emit2.default);

exports.default = Socket;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Emit = function Emit() {
  var _this = this;

  _classCallCheck(this, Emit);

  var delegate = document.createDocumentFragment();
  ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(function (f) {
    _this[f] = function () {
      delegate[f].apply(delegate, arguments);
    };
  });
};

exports.default = Emit;

/***/ })
/******/ ]);
});
//# sourceMappingURL=socket-client.js.map