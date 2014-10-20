(function() {
  "use strict";
  
  var WS = WebSocket;

  // Less verbose eventing
  WS.prototype.on  = WS.prototype.addEventListener;
  WS.prototype.off = WS.prototype.removeEventListener;

  // Better send method
  WS.prototype._send = WS.prototype.send;

  /**
   * override default `send` method to allow for sending objects
   */
  WS.prototype.send = function(data) {
    // Do some quick type checking to ensure that the type of data we're sending
    // is supported by the send method.  If it's not, we'll try to stringify it.
    if(
      !(window.ArrayBuffer && data instanceof ArrayBuffer) &&
      !(window.Blob && data instanceof Blob) &&
      typeof(data) != "string"
    ) {
      try {
        data = JSON.stringify(data);
      } catch(e) {
        throw new Error("Unable to send data with type, " + typeof(data));
      }
    }

    this._send(data);
  };

  /**
   * Light wrapper around the websocket constructor to allow for relative paths
   *
   * @constructs WebSocket
   *
   * @param {String} url - the URL or path to connect to
   */
  function Sock(url) {
    if(url[0] === "/") {
      // our URL is really a path.  Gotta make it absolute
      url = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + url;
    }

    return new WS(url);
  }

  window.WebSocket = Sock;
}());
