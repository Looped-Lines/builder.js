import {gitClone} from './gitClone';
import {pathExists} from 'fs-extra'
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {removeAsync, mkdirAsync} from "fs-extra-promise";

const http = require('http');
const server = http.createServer();
const currentDir = process.cwd();

describe('Given a git repository', function () {
    const testWorkingDirectory = `${currentDir}/../testWorkingDirectory`;
    this.timeout(10000);
    const orgName = 'looped-lines-test-org',
        repoName = 'testrepo';

    beforeEach(async function () {
        await mkdirAsync(`${testWorkingDirectory}`);
        process.chdir(testWorkingDirectory);
    });

    describe('And a Web Socket Server', function () {
        let wss: WebSocket.Server;

        beforeEach(async function () {
            wss = new WebSocket.Server({server});

            server.listen(process.env.PORT || 8999, () => {
            });
        });

        describe('When git clone is called', function () {
            beforeEach( async function () {
                await gitClone(orgName, repoName, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
            });

            it('Then is should have cloned the repo', async function () {
                expect(await pathExists(`${repoName}/.git`)).to.be.true
            })
        });

        afterEach(function () {
            server.close();
        })
    });

    afterEach(async function () {
        process.chdir(currentDir);
        await removeAsync(testWorkingDirectory)
    })
});

describe('Given a non existent git repo', function () {

    describe('And a Web Socket Server', function () {
        let wss: WebSocket.Server;

        beforeEach(function () {
            wss = new WebSocket.Server({server});

            server.listen(process.env.PORT || 8999, () => {
            });
        });

        describe('When git clone is called', function () {
            let result;

            beforeEach( function(){
                result = gitClone('fdfdsadfafd', 'fdafdsafsda', run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
            });

            it('Then is should return a rejected promise', function (done) {
                expect(result).to.be.eventually.rejected.notify(done)
            })
        });

        afterEach(function () {
            server.close();
        })
    })
});