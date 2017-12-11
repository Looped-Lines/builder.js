import {copyAsync, removeAsync, existsAsync, mkdirAsync} from 'fs-extra-promise';
import * as fs from 'fs';
import {promisify} from "util";
import {npmInstall} from "./npmInstall";
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {setupServer} from "../../setup/setupServer";
import {Server} from "http";

const http = require('http');
const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const currentDir = process.cwd();

async function configureNpmProject() {
    let testWorkingDirectory = `${currentDir}/../npmFakeProject`;
    await mkdirAsync(testWorkingDirectory);
    await copyAsync(`${currentDir}/source/mocks/npmFakeProject`, `${testWorkingDirectory}`);
    return testWorkingDirectory;
}

describe('UNIT UNDER TEST: npmInstall', function () {
    describe('Given a Web Socket Server', function () {
        let wss: WebSocket.Server,
            server: Server;

        beforeEach(async function () {
            ({server, wss} = await setupServer(WebSocket.Server, http.createServer))
        });

        describe('And a npm project with package.json declaring its dependencies', function () {
            this.timeout(40000);
            let testWorkingDirectory;

            beforeEach(async function () {
                testWorkingDirectory = await configureNpmProject();
                process.chdir(testWorkingDirectory);
            });


            describe('When npm install is run', function () {
                beforeEach(async function () {
                    await npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync);
                });

                it('Then it should install those dependencies', async function () {
                    const textBuffer = await readFile('package.json');
                    const {dependencies} = JSON.parse(textBuffer.toString());
                    const dependencyNames = Reflect.ownKeys(dependencies);
                    let promises = dependencyNames.map(async function (dependencyName) {
                        expect(await exists(`node_modules/${dependencyName}`)).to.be.true
                    });

                    await Promise.all(promises);
                });
            });


            afterEach(function () {
                process.chdir(currentDir);
            })
        });

        describe(`And an empty project`, function () {
            let testWorkingDirectory, server;

            beforeEach(async function () {
                testWorkingDirectory = `${currentDir}/../nonNpmFakeProject`;
                await mkdirAsync(`${testWorkingDirectory}`);
                process.chdir(testWorkingDirectory);
            });


            describe('When npm install is run', function () {
                let promise;

                beforeEach( function () {
                    promise = npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, existsAsync);
                });

                it('Then it should throw an error indicating that the package.json cannot be found', async function () {
                    await expect(promise).to.be.eventually.rejectedWith('Cannot find a package.json file');
                })
            });

            afterEach(async function () {
                process.chdir(currentDir);
                await removeAsync(testWorkingDirectory)
            })
        });

        afterEach(function () {
            server.close();
        })
    });
});