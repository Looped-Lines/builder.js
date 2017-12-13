#!/usr/bin/env node
import {run} from "../helpers/run/run";
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {setupServer} from "../setup/setupServer";
import {Steps} from "../steps/index";
import {main} from "./main";
import {existsAsync, readJsonAsync} from "fs-extra-promise";
import {createServer} from "http";
import {Server} from "ws";

main(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, Server, createServer, setupServer, require, process.argv, existsAsync, readJsonAsync)
    .catch(function (error) {
        if (error)
            console.log(error)
    });