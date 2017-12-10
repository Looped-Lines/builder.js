import {GitHubHelper} from '../../helpers/gitHub';
import {gitClone} from './gitClone';
import {pathExists} from 'fs-extra'
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";

const http = require('http');
const server = http.createServer();

describe('Given a git repository', function () {
    this.timeout(10000);
    const orgName = 'looped-lines-test-org',
        repoName = 'testrepo';

    beforeEach(async function () {
        process.chdir('../');
        const gitHubHelper = new GitHubHelper();
        await gitHubHelper.createRepo(orgName, repoName)
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
});

describe('Given a non existent git repo', function () {
    beforeEach(function () {
        process.chdir('../');
    });

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