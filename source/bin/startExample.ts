import {Steps as StepsClass} from "../steps/index";

export async function start(Steps: typeof StepsClass, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync, readJsonAsync){
    await Steps.gitClone('looped-lines-test-org', 'testrepo', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    process.chdir('testrepo');
    await Steps.npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync);
    await Steps.jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, readJsonAsync, existsAsync);
    await Steps.gulp('doStuff', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}