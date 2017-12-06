#!/usr/bin/env node
import {gitClone} from '../steps/gitClone';
import {run} from "../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {setupServer} from "../setup/setupServer";

const express = require('express');
const http = require('http');

async function bootstrap() {
    const {wss, server} = await setupServer(WebSocket.Server, express, http.createServer);

    const {start} = require(process.argv[2]);

    await start(gitClone, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
}

bootstrap();