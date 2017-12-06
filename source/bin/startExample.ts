export async function start(gitClone, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss){
    await gitClone('looped-lines-test-org', 'testrepo', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss)
}