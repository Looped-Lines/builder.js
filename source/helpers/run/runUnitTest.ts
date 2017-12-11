import {run} from './run';
import {spawn as nativeSpawn} from 'child_process';
import Stream from "xstream";
import {NativeSpawnFunc} from "../spawn/spawn";
import xs from 'xstream';
import WebSocket = require("ws");
import {WebSocketServerMockProxy} from "../../mocks/websocketServerMock";

describe('UNIT UNDER TEST: run', function () {
    describe('Given a Web Socket Server', function () {
        const wss = new WebSocketServerMockProxy();
        const outgoingMessages$ = xs.fromArray([
            'message1',
            'message2'
        ]);

        describe('And a valid command line command', function () {
            let spawnMock,
                pushStreamThroughWebSocketConnectionsMock;

            beforeEach(function () {
                spawnMock = createSpawnMock(outgoingMessages$);
                pushStreamThroughWebSocketConnectionsMock = createPushStreamThroughWebSocketConnectionsMock();
            });

            describe('When run is executed with the command', function () {
                let promise,
                    command = 'valid command';

                beforeEach(function () {
                    promise = run(command, spawnMock, nativeSpawn, pushStreamThroughWebSocketConnectionsMock, wss);
                });

                it('Then it should execute the command', function () {
                    expect(spawnMock).to.have.been.calledWith(command, nativeSpawn);
                });

                it('Then it should send all the stderr and stdout messages through a Web Socket', function () {
                    expect(pushStreamThroughWebSocketConnectionsMock).to.have.been.calledWith(outgoingMessages$, wss)
                });

                it('Then it should eventually return a promise resolved successfully indicating the end of the command execution', function () {
                    return expect(promise).to.eventually.be.fulfilled
                })
            })
        });

        describe('And an invalid command', function () {
            const error = new Error('this is an error');
            let spawnMock,
                pushStreamThroughWebSocketConnectionsMock;

            beforeEach(function () {
                spawnMock = createSpawnMock(outgoingMessages$, error);
                pushStreamThroughWebSocketConnectionsMock = createPushStreamThroughWebSocketConnectionsMock();
            });

            describe('When run is executed with the command', function () {
                let promise,
                    command = 'invalid command';

                beforeEach(function () {
                    promise = run(command, spawnMock, nativeSpawn, pushStreamThroughWebSocketConnectionsMock, wss);
                });

                it('Then it should return a rejected promise with an error', async function () {
                    await expect(promise).to.be.eventually.rejectedWith(error)
                })
            })
        })
    });
});

function createSpawnMock(messages$: Stream<string>, error?: Error) {
    function spawn(command: string, nativeSpawn: NativeSpawnFunc): { messages$: Stream<string>, completed: Promise<Error> } {
        let completed = new Promise<Error>((resolve, reject) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        });

        return {
            messages$,
            completed
        }
    }

    return sinon.spy(spawn);
}

function createPushStreamThroughWebSocketConnectionsMock() {
    function pushStreamThroughWebSocketConnections(outgoingMessages$: Stream<string>, WebSockServer: WebSocket.Server): void {

    }

    return sinon.spy(pushStreamThroughWebSocketConnections)
}