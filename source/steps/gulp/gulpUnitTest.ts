import {copyAsync, existsAsync} from 'fs-extra-promise';
import * as fs from 'fs';
import {promisify} from "util";
import {npmInstall} from "../npmInstall/npmInstall";
import {run} from "../../helpers/run/run";
import * as WebSocket from 'ws';
import {spawn as nativeSpawn} from 'child_process';
import {spawn} from "../../helpers/spawn/spawn";
import {pushStreamThroughWebSocketConnections} from "../../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {gulp} from "./gulp";

const http = require('http');
const server = http.createServer();

const mkdir = promisify(fs.mkdir);

describe('Given a gulp project with tasks', function () {
    this.timeout(40000);
    let currentDir = process.cwd(),
        testWorkingDirectory;

    beforeEach( async function () {
        testWorkingDirectory = `${currentDir}/../gulpFakeProject`;
        await mkdir(testWorkingDirectory);
        await copyAsync(`${currentDir}/source/mocks/gulpFakeProject`, `${testWorkingDirectory}`);
        process.chdir(testWorkingDirectory);
    });

    describe('And a Web Socket Server', function () {
        let wss: WebSocket.Server;

        beforeEach(async function () {
            wss = new WebSocket.Server({server});

            await npmInstall(run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);

            server.listen(process.env.PORT || 8999, () => {
            });
        });

        describe('When gulp is run on a specific task', function () {
            beforeEach(async function () {
                await gulp('doStuff',run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, wss);
            });

            it('Then that task should be executed ', async function () {
                expect(await existsAsync('executed')).to.be.true
            });
        });

        afterEach(function () {
            server.close();
        })
    });

    afterEach(function () {
        process.chdir(currentDir);
    })
});