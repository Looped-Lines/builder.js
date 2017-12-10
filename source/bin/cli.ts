#!/usr/bin/env node
import {run} from "../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {setupServer} from "../setup/setupServer";
import {Steps} from "../steps/index";

const http = require('http');

async function bootstrap() {
    const {wss, server} = await setupServer(WebSocket.Server, http.createServer);

    const {start} = require(process.argv[2]);

    try {
        await start(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
    } finally {
        server.close();
    }
}

bootstrap().then(function (server) {
    console.log('Done!!! Have a nice day')
}).catch(function () {
    console.log('Ooops someone made a boo boo, here is what we know', ...arguments)
});