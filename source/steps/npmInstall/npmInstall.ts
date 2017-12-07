import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");

export function npmInstall(run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) : Promise<void>{
    return run(`npm install`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}