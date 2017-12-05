import {NativeSpawnFunc, SpawnFunc} from "../spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import Stream from "xstream";
import WebSocket = require("ws");

export function run(command: string, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) {
    const outgoingMessage$: Stream<string> = spawn(command, nativeSpawn).messages$;
    pushStreamThroughWebSocketConnections(outgoingMessage$, wss)
}