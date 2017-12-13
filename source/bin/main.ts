import {Server as ServerClass} from "ws";

export async function main(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, Server: typeof ServerClass, createServer, setupServer, require, args: string[], existsAsync, readJsonAsync) {
    const {wss, server} = await setupServer(Server, createServer);

    const {start} = require(args[2]);

    try {
        await start(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync, readJsonAsync);
    } finally {
        server.close();
    }
}