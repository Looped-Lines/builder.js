import {NativeSpawnFunc, SpawnFunc} from "../spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import Stream from "xstream";
import WebSocket = require("ws");
import {error} from "util";

export interface RunFunc{
    (command: string, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) : Promise<void>
}

export function run(command: string, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) : Promise<void> {
    const {messages$, completed} = spawn(command, nativeSpawn);
    pushStreamThroughWebSocketConnections(messages$, wss);

    return completed
}