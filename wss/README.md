# Chromecast Emulator Demo - WebSocket Server

Running this WebSocketServer will generate a server that listens to Google Cast IPC messages and can re-broadcast those messages to any connected WebSockets.

> | Port | Namespace |
> | -- | -- |
> | 8008 | urn:x-cast:com.google.cast

## How to Use
To run the server, run the following command:
```
npx tsx .
```
or
```
npm run serve
```

## How to Send Events to Emulate
This server uses the custom namespace of `urn:x-cast:cast-emulation` to send emulated events.
### How to Format