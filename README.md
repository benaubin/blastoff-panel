# blastoff-panel
Watch as your app blasts off!

#### Example:

```
 Rocket Ship starting up...
    ✅  Database ready!
    ⠏  Fuel management starting...
    ◯  HTTP Server
    ◯  WebSocket Server
```


## Usage

Setup your panel.

```js
import blastoffPanel from "blastoff-panel";

const {withStatus} = blastoffPanel({
  serviceName: "Rocket Ship", 
  readyMessage: `Ready for Liftoff.`
});
```

Wrap your startup tasks by specifying a service name and startup function which returns a promise.

```js
const setupDatabase = withStatus("Database", () => database.setup() );
const setupFuelManagment = withStatus("Fuel management", () => management.setup() );

const startHTTPServer = withStatus("HTTP Server", () => app.listen() );
const startSocketServer = withStatus("WebSocket Server", () => sockets.start() );
```

And blast off!

```js
Promise.all([setupDatabase(), setupFuelManagment()])
  .then(() => Promise.all([startHTTPServer(), startSocketServer()] ));
```

Output:

```
🚀   Rocket Ship Ready for Liftoff.
    ✅  Database ready!
    ✅  Fuel management ready!
    ✅  HTTP Server ready!
    ✅  WebSocket Server ready!
```

## Credits

A pretty cool thing brought to you by [Ben Aubin](http://benaubin.com).

## License

MIT