# Socks
Socks is a warm, fuzzy, _thin_ wrapper around WebSockets.  Socks aims to add
some basic syntactic sugar to your WebSockets without requiring you to relearn
WebSockets, or even remember that it's there!

## How does Socks change WebSockets
The short answer is 'as little as possible'.  I think the WebSocket interface
is, generally, pretty good, but it has a few quirks that make using it annoying.
Because I didn't really want to have Socks everywhere in my code I did something
that a lot of people may hate:

**Socks wraps and replaces the WebSocket constructor**

Yes, you read that correctly.  Rather than add a shiny `Socks` object, Socks
masquerades as a real WebSocket.  Mostly, this is because Socks doesn't
significantly modify WebSockets.  As long as you're not already modifying the
WebSocket object, Your existing WebSocket code will continue to work just fine
after adding Socks!  Even if you are, it still may work just fine!

### The Construction
Socks allows WebSockets to be built using relative paths, instead of absolute
URLs.  It does the work of assembling the protocol and host portions of the URL
for you:

````javascript
function Sock(url) {
  if(url[0] === "/") {
    // our URL is really a path.  Gotta make it absolute
    url = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + url;
  }
 return new WS(url);
}
````

### `send`
Socks wraps the send method to allow for almost any object to be sent over a
WebSocket:

````javascript
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
````

As you can see, the original `send` method is aliased as `_send`, should you
still need it.

### Events
Socks aliases `addEventListener` and `removeEventListener` to `on` and `off`,
respectively.

# License

> Copyright (c) 2014 Chris Hall
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE
