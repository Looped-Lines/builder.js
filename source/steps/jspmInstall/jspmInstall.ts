import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");

export async function jspmInstall(gitHubAuthToken: string, run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server, readJsonAsync) : Promise<void>{
    let packageJson = await readJsonAsync('package.json');

    const isJspmPackage = packageJson.jspm !== undefined;

    if(isJspmPackage) {
        await run(`jspm config registries.github.auth ${gitHubAuthToken}`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
        await run(`jspm install`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    } else {
        throw Error('Project is not a jspm project')
    }
}