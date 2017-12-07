import {Steps as StepsClass} from "../steps/index";

export async function start(Steps: typeof StepsClass, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss){
    await Steps.gitClone('looped-lines-test-org', 'testrepo', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    await Steps.npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}