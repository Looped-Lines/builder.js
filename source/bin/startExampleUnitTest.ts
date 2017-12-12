import {start} from "./startExample";
import {Steps} from "../steps/index";
import {run} from "../helpers/run/run";
import {spawn} from "../helpers/spawn/spawn";
import {spawn as nativeSpawn} from "child_process";
import {pushStreamThroughWebSocketConnections} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import * as WebSocket from "ws";
import {existsAsync, mkdirAsync, readJsonAsync, removeAsync} from "fs-extra-promise";

const http = require('http');
const server = http.createServer();
const currentDir = process.cwd();

describe('UNIT UNDER TEST: startExample', function () {
    describe('Given a web socket server', function () {
        this.timeout(100000);
        const wss = new WebSocket.Server({server});
        const testWorkingDirectory = `${currentDir}/../testWorkingDirectory`;

        beforeEach(async function () {
            await mkdirAsync(`${testWorkingDirectory}`);
            process.chdir(testWorkingDirectory);
        });

        describe('And a startScript example', function () {
            describe('When the script is executed', function () {
                beforeEach(async function () {
                    sinon.spy(Steps, 'gitClone');
                    sinon.spy(Steps, 'npmInstall');
                    sinon.spy(Steps, 'jspmInstall');
                    sinon.spy(Steps, 'gulp');
                    await start(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync, readJsonAsync)
                });

                it('Then the Steps should execute in the order, gitClone, npmInstall, jspmInstall, gulp', function () {
                    sinon.assert.callOrder(Steps.gitClone, Steps.npmInstall, Steps.jspmInstall, Steps.gulp)
                })
            })
        });

        afterEach(async function () {
            process.chdir(currentDir);
            await removeAsync(testWorkingDirectory)
        })
    });
});
