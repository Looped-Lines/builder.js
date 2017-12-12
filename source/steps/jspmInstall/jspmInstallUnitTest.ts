import {removeAsync, readJsonAsync, copyAsync, existsAsync, mkdirAsync} from 'fs-extra-promise'
import {jspmInstall} from "./jspmInstall";
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {setupServer} from "../../setup/setupServer";
import {Server} from "http";

const http = require('http');
const currentDir = process.cwd();

describe('UNIT UNDER TEST: jspmInstall', function () {
    describe('Given a Web Socket Server', function () {
        this.timeout(100000);
        let testWorkingDirectory,
            server: Server,
            wss: WebSocket.Server;

        beforeEach(async function () {
            ({server, wss} = await setupServer(WebSocket.Server, http.createServer));
        });

        describe('And a jspm project with a package.json and config file declaring its dependencies', function () {

            beforeEach(async function () {
                testWorkingDirectory = `${currentDir}/../jspmFakeProject`;
                await copyAsync(`${currentDir}/source/mocks/jspmFakeProject`, `${testWorkingDirectory}`);
                process.chdir(testWorkingDirectory);
            });

            describe('When jspm install is run', function () {
                beforeEach(async function () {
                    await jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, readJsonAsync, existsAsync);
                });

                it('Then it should install those dependencies', async function () {
                    const {dependencies} = (await readJsonAsync(`${testWorkingDirectory}/package.json`)).jspm;
                    const dependencyNames = Reflect.ownKeys(dependencies);
                    let promises = dependencyNames.map(async function (dependencyName) {
                        expect(await existsAsync(`jspm_packages/npm/${dependencyName}@1.0.1`)).to.be.true
                    });

                    await Promise.all(promises);
                });

                it('Then it should set the auth token for github in the jspm config', async function () {
                    const configJson = await readJsonAsync(`${process.env.HOME}/.jspm/config`);
                    expect(configJson.registries.github.auth).to.equal(process.env.GITHUB_JSPM_AUTH_TOKEN)
                })
            });

            afterEach(async function () {
                process.chdir(currentDir);
                await removeAsync(testWorkingDirectory)
            })
        });

        describe(`And a non jspm project`, function () {
            let testWorkingDirectory, server;

            beforeEach(async function () {
                testWorkingDirectory = `${currentDir}/../nonJspmFakeProject`;
                await copyAsync(`${currentDir}/source/mocks/nonJspmFakeProject`, `${testWorkingDirectory}`);
                process.chdir(testWorkingDirectory);
            });

            describe('When jspm install is run', function () {
                let promise;

                beforeEach(async function () {
                    promise = jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, readJsonAsync, existsAsync);
                });

                it('Then an error indicating that it\'s not a jspm project should be thrown', async function () {
                    await expect(promise).to.be.eventually.rejectedWith('Project is not a jspm project, no jspm details in package.json');
                })
            });

            afterEach(async function () {
                process.chdir(currentDir);
                await removeAsync(testWorkingDirectory)
            })
        });

        describe(`And an empty project`, function () {
            let testWorkingDirectory, server;

            beforeEach(async function () {
                testWorkingDirectory = `${currentDir}/../nonJspmFakeProject`;
                await mkdirAsync(`${testWorkingDirectory}`);
                process.chdir(testWorkingDirectory);
            });


            describe('When jspm install is run', function () {
                let promise;

                beforeEach(async function () {
                    promise = jspmInstall(process.env.GITHUB_JSPM_AUTH_TOKEN, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss, readJsonAsync, existsAsync);
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


