import  {removeAsync, readJsonAsync, copyAsync, mkdirAsync, existsAsync} from 'fs-extra-promise'
import {createWriteStream} from 'fs'
import {resolve} from  'path';
import {jspmInstall} from "./jspmInstall";
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import WritableStream = NodeJS.WritableStream;

const http = require('http');
const server = http.createServer();

describe('Given a package.json file with dependencies', function () {
    this.timeout(40000);
    let currentDir = process.cwd(),
        testWorkingDirectory;

    beforeEach(async function () {
        testWorkingDirectory = `${currentDir}/../jspmFakeProject`;
        await copyAsync(`${currentDir}/source/mocks/jspmFakeProject`, `${testWorkingDirectory}`);
        process.chdir(testWorkingDirectory);
    });

    describe('And a Web Socket Server', function () {
        let wss: WebSocket.Server,
            ws: WebSocket,
            writeStream: WritableStream;

        beforeEach(async function () {
            wss = new WebSocket.Server({server});

            server.listen(process.env.PORT || 8999, () => {
            });

            // writeStream = createWriteStream(`${currentDir}/source/mocks/jspmInstallTestOutput.txt`);
            //
            // ws = new WebSocket('ws://localhost:8999');
            //
            // ws.on('message', function (message) {
            //     console.log(message)
            //     writeStream.write(message.toString(), 'UTF-8');
            // });

        });

        describe('When jspm install is run', function () {
            beforeEach(async function () {
                await jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
            });

            it('Then it should install those dependencies', async function () {
                const {dependencies}  = (await readJsonAsync(`${testWorkingDirectory}/package.json`)).jspm;
                const dependencyNames = Reflect.ownKeys(dependencies);
                let promises = dependencyNames.map(async function(dependencyName) {
                    expect(await existsAsync(`jspm_packages/npm/${dependencyName}@1.0.1`)).to.be.true
                });

                await Promise.all(promises);
            });

            it('The it should set the auth token for github in the jspm config', async function () {
                const configJson = await readJsonAsync(`${process.env.HOME}/.jspm/config`);
                expect(configJson.registries.github.auth).to.equal(process.env.GITHUB_JSPM_AUTH_TOKEN)
            })
        });

        afterEach( function () {
            // writeStream.end();
            // ws.close();
            server.close(function () {
            });
        })
    });

    afterEach( async function () {
        process.chdir(currentDir);
        await removeAsync(testWorkingDirectory)
    })
});