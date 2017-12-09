import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");

export async function jspmInstall(gitHubAuthToken: string, run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) : Promise<void>{
    await run(`jspm config registries.github.auth ${gitHubAuthToken}`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
    await run(`jspm install`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}