import * as fs from 'fs'
import {promisify} from "util";
import {npmInstall} from "./npmInstall";
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

describe('Given a package.json file with dependencies', function () {
    this.timeout(10000);
    let currentDir = process.cwd(),
        testWorkingDirectory;

    beforeEach( async function () {
        testWorkingDirectory = `${currentDir}/../fakeModule`;
        await mkdir(testWorkingDirectory);
        await copyFile(`${currentDir}/source/mocks/package.json`, `${testWorkingDirectory}/package.json`);
        process.chdir(testWorkingDirectory);
    });

    describe('And a Web Socket Server', function () {
        let wss: WebSocket.Server;

        beforeEach(async function () {
            wss = new WebSocket.Server({server});

            server.listen(process.env.PORT || 8999, () => {
            });
        });

        describe('When npm install is run', function () {
            beforeEach(async function () {
                await npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
            });

            it('Then it should install those dependencies', async function () {
                const textBuffer = await readFile('package.json');
                const {dependencies} = JSON.parse(textBuffer.toString());
                const dependencyNames = Reflect.ownKeys(dependencies);
                let promises = dependencyNames.map(async function(dependencyName) {
                    expect(await exists(`node_modules/${dependencyName}`)).to.be.true
                });

                await Promise.all(promises);
            })
        });

        afterEach(function () {
            server.close();
        })
    });

    afterEach(function () {
        process.chdir(currentDir);
    })
});