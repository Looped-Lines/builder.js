import Stream from 'xstream';
import * as WebSocket from 'ws';

export interface PushStreamThroughWebSocketConnectionsFunc{
    (outgoingMessages$: Stream<string>, WebSockServer: WebSocket.Server) : void
}

export function pushStreamThroughWebSocketConnections(outgoingMessages$: Stream<string>, wss: WebSocket.Server): void{
    wss.on('connection', (ws: WebSocket) => {
        outgoingMessages$.addListener({
            next: (message) => {
                ws.send(message)
            },
            error: err => {},
            complete: () => {}
        })
    })
}