import WebSocket = require("ws");
import {Server} from "http";

export function setupServer(Server: typeof WebSocket.Server, express, createServer) : Promise<{ wss: WebSocket.Server, server: Server}> {
    const app = express();
    const server = createServer(app);
    const wss = new Server({server});
    return new Promise<{ wss: WebSocket.Server, server: Server}>(function (resolve, reject) {
        server.listen(8999, function(){
            resolve({server, wss});
        })
    })
}