import chalk from 'chalk';
import { WebSocket, WebSocketServer } from "ws"

let senderClients: WebSocket[] = []

// Chromecast WS listens on port 8008
const wss = new WebSocketServer({ port: 8008 })

console.log(chalk.green('🚀 Server started at:'), wss.address())

const IPC_EMULATION_NAMESPACE: string = 'urn:x-cast:cast-emulation'


const broadcastCustomMessage = (rawData: Record<string, any>, clients: WebSocket[] = []) => {
    const { data, ...rest } = rawData
    const ipcData = {
        ...rest,
        data: JSON.stringify(data)
    }

    const wsClients: WebSocket[] = clients.length > 0 ? clients : Array.from(wss.clients.values())


    console.log(chalk.yellow('Broadcasting message to', chalk.blue(wsClients.length), chalk.yellow('clients.')))
    wsClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(ipcData))
        }
    })
}

// Listen on our WebSocketServer for a new connection!
// When our Chromecast receiver or sender page is opened locally on the same network,
//   it will automatically connect to this server (as long as it hasn't timed out).
wss.on('connection', (ws: WebSocket) => {
    console.log(chalk.blue('-------------- Connected to WSS! --------------'))

    ws.on('message', (message: string) => {
        const { namespace, data } = JSON.parse(message)
        const { message: msg, ...rest } = JSON.parse(data || {})

        // EMULATOR MESSAGES
        // if the message comes from our emulation namespace, grab the internal data and pass it along
        if (namespace === IPC_EMULATION_NAMESPACE) {

            // if the data is just called "message", only console log it
            if (msg) {
                console.log(chalk.blue('<< ', namespace), msg)

                // if the sender has a "sender: true" flag, add this to a list of sender clients
                if (!!rest?.sender) {
                    if (!senderClients.includes(ws)) {
                        senderClients.push(ws)
                    }

                    console.log('senders: ', senderClients.length)
                }

                return;
            }

            // otherwise, broadcast it
            if (rest?.namespace) {
                console.log(chalk.blue('<< ', rest.namespace), JSON.stringify(rest))
                broadcastCustomMessage(rest);
                return
            }
        }

        // CAF MESSAGES
        console.log(chalk.green('>> ', namespace), JSON.stringify(rest))
        broadcastCustomMessage(rest, senderClients)
    })

    ws.on('close', () => {
        senderClients = senderClients.filter(w => w != ws)
    })
})

wss.on('close', () => {
    senderClients = []
})