import {run} from './run';
import {spawn as nativeSpawn} from 'child_process';
import Stream from "xstream";
import {NativeSpawnFunc} from "../spawn/spawn";
import xs from 'xstream';
import WebSocket = require("ws");
import {WebSocketServerMockProxy} from "../../mocks/websocketServerMock";

describe('Given a command line command', function () {
    describe('When run is executed with command', function () {
        let spawnSpy,
            status,
            pushStreamThroughWebSocketConnectionsSpy,
            wss = new WebSocketServerMockProxy(),
            command = 'ping -c www.google.com',
            outgoingMessages$ = xs.fromArray([
                'message1',
                'message2'
            ]);

        beforeEach(function(){
            function spawn(command: string, nativeSpawn: NativeSpawnFunc) : { messages$: Stream<string>, completed: Promise<void>} {
                return {
                    messages$ : outgoingMessages$,
                    completed : new Promise(resolve => resolve())
                }
            }

            function pushStreamThroughWebSocketConnections(outgoingMessages$: Stream<string>, WebSockServer: WebSocket.Server): void{

            }

            spawnSpy = sinon.spy(spawn);

            pushStreamThroughWebSocketConnectionsSpy = sinon.spy(pushStreamThroughWebSocketConnections);

            status = run(command, spawnSpy, nativeSpawn, pushStreamThroughWebSocketConnectionsSpy, wss);
        });

        it('Then it should execute the command', function () {
            expect(spawnSpy).to.have.been.calledWith(command, nativeSpawn);
        });

        it('Then it should send all the stderr and stdout messages through a Web Socket', function () {
            expect(pushStreamThroughWebSocketConnectionsSpy).to.have.been.calledWith(outgoingMessages$, wss)
        });

        it('Then it should eventually return a promise resolved successfully indicating the end of the task', function () {
            return expect(status).to.eventually.be.fulfilled
        })
    })
});