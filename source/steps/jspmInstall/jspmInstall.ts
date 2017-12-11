import {RunFunc} from "../../helpers/run/run";
import {NativeSpawnFunc, SpawnFunc} from "../../helpers/spawn/spawn";
import {PushStreamThroughWebSocketConnectionsFunc} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WebSocket = require("ws");
import {validatePackageJsonExistence} from "../../helpers/validatePackageJsonExistence/validatePackageJsonExistence";

export async function jspmInstall(gitHubAuthToken: string, run: RunFunc, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server, readJsonAsync, existsAsync): Promise<void> {
    await validatePackageJsonExistence(existsAsync);
    await validateIsJspmProject(readJsonAsync);
    await install(run, gitHubAuthToken, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
}

async function install(run: RunFunc, gitHubAuthToken: string, spawn: SpawnFunc, nativeSpawn: NativeSpawnFunc, pushStreamThroughWebSocketConnections: PushStreamThroughWebSocketConnectionsFunc, wss: WebSocket.Server) {
    await run(`jspm config registries.github.auth ${gitHubAuthToken}`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    await run(`jspm install`, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
}

async function validateIsJspmProject(readJsonAsync) {
    const packageJson = await readJsonAsync('package.json');
    const isJspmProject = packageJson.jspm !== undefined;

    if (!isJspmProject) {
        throw Error('Project is not a jspm project, no jspm details in package.json')
    }
}