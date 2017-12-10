import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");

export function gulp(task: string, run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) : Promise<void>{
    return run(`gulp ${task}`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}