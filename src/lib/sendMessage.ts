import { browser } from "$app/environment";

export const IPC_EMULATION_NAMESPACE: string = 'urn:x-cast:cast-emulation'; // this must match the namespace of your wss

const sendMessage = (ws: WebSocket | null, message: Record<string, any>) => {
    if (!browser) return;
    if (ws?.readyState !== WebSocket.OPEN) return;
    // package our custom message so the Chromecast will like it!
    const ipcData = JSON.stringify({
        namespace: IPC_EMULATION_NAMESPACE,
        data: JSON.stringify(message)
    });

    if (ws) {
        ws.send(new Blob([ipcData]));
    }
}

export default sendMessage