import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");
import {validatePackageJsonExistence} from "../../helpers/validatePackageJsonExistence/validatePackageJsonExistence";

export async function npmInstall(run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server, existsAsync) : Promise<void>{
    await validatePackageJsonExistence(existsAsync);
    await run(`npm install`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}