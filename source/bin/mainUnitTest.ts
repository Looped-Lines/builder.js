import {main} from "./main";
import {Steps} from "../steps/index";
import {spawn} from "../helpers/spawn/spawn";
import {spawn as nativeSpawn} from "child_process";
import {run} from "../helpers/run/run";
import {pushStreamThroughWebSocketConnections} from "../helpers/pushStreamThroughWebsocketConnections/pushStreamThroughWebSocketConnections";
import {createServer} from "http";
import {setupServer} from "../setup/setupServer";
import {Server} from 'ws'
import {existsAsync, mkdirAsync, readJsonAsync, removeAsync} from "fs-extra-promise";

const currentDir = process.cwd();

describe('UNIT UNDER TEST: main', function () {
    this.timeout(100000);
    const testWorkingDirectory = `${currentDir}/../testWorkingDirectory`;

    beforeEach(async function () {
        await mkdirAsync(`${testWorkingDirectory}`);
        process.chdir(testWorkingDirectory);
    });

    describe('Given a valid start function', function () {
        describe('When main is called', function () {
            let promise;

            beforeEach(function () {
                promise = main(Steps, run, spawn, nativeSpawn, pushStreamThroughWebSocketConnections, Server, createServer, setupServer, require, ['','','./startExample'], existsAsync, readJsonAsync);
            });

            it('Then it should run the application to completion without error', async function () {
                await expect(promise).to.be.eventually.fulfilled;
            })
        })
    });

    afterEach(async function () {
        process.chdir(currentDir);
        await removeAsync(testWorkingDirectory)
    })
});