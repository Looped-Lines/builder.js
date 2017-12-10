import WebSocket = require("ws");
import {Server} from "http";

export function setupServer(Server: typeof WebSocket.Server, createServer) : Promise<{ wss: WebSocket.Server, server: Server}> {
    const server = createServer();
    const wss = new Server({server});
    return new Promise<{ wss: WebSocket.Server, server: Server}>(function (resolve, reject) {
        server.listen(8999, function(){
            resolve({server, wss});
        })
    })
}