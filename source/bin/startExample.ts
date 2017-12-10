import {Steps as StepsClass} from "../steps/index";

export async function start(Steps: typeof StepsClass, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss){
    await Steps.gitClone('Looped-Lines', 'web-app', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    await Steps.npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    await Steps.jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    // await Steps.gulp()
}