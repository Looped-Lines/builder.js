import {RunFunc} from "../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");

export function gitClone(orgName: string, repoName: string, run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server): Promise<void>{
    return run(`git clone https://github.com/${orgName}/${repoName}.git --depth 1`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
}