# Chromecast Emulator Demo - WebSocket Server

Running this WebSocketServer will generate a server that listens to Google Cast IPC messages and can re-broadcast those messages to any connected WebSockets.

## How to Use
To run the server, run the following command:
```
yarn serve
```

## How it Works
Once running, the Websocket Server will listen on port `8008`. This is the same Websocket port that the Chromecast interacts with.

### Initialization
The sender and receiver pages will automatically connect to the server when their pages initially load. If they are not connecting, try reloading the page.

### Custom Sender Messages
The sender page doesn't provide actual Chromecast commands. It provides intents, which the Websocket server reads and will broadcast to the receiver once it receives the message.

These messages are provided to the server with the namespace of `urn:x-cast:cast-emulation`.  The `data` of this message will include the actual Chromecast receiver message that is meant to be broadcasted.

**To write your own custom sender message, you can do so like this:**

```ts
// Chromecast-recognized data
const data = {
	namespace: 'urn:x-cast:com.google.cast.system',
	senderId: 'sender-0',
	data: {
		type: 'senderconnected',
		senderId: 'sender-0'
	}
}

// Emulator wrapper for the Websocket Server to parse
const ipcData = JSON.stringify({
    namespace: 'urn:x-cast:cast-emulation',
    data: JSON.stringify(data)
});

if (ws) {
    ws.send(new Blob([ipcData]));
}
```

We wrap them in custom namespaces so the server can identify which messages are being naturally sent by the Chromecast receiver during its lifecycle, and which ones are being sent by the local sender page.