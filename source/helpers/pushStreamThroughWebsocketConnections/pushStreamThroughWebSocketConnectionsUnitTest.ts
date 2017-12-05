import xs from 'xstream'
import {Server} from 'ws'
import {WebSocketMockProxy, WebSocketServerMockProxy} from '../../mocks/websocketServerMock';
import {pushStreamThroughWebSocketConnections} from './pushStreamThroughWebSocketConnections';

describe('Given a Web Socket server', function () {
    let wss: Server;

    beforeEach(function () {
        wss = new WebSocketServerMockProxy();
    });

    describe('And a stream of messages', function () {
        let outgoingMessages = [
            'message1',
            'message2',
            'message3',
            'message4',
        ],

        webSockets = [
            new WebSocketMockProxy(' '),
            new WebSocketMockProxy(' '),
            new WebSocketMockProxy(' '),
            new WebSocketMockProxy(' ')
        ];

        const outgoingMessages$ = xs.fromArray(outgoingMessages);

        describe('When pushStreamThroughWebSocketConnections is run', function () {
            beforeEach(function () {
                pushStreamThroughWebSocketConnections(outgoingMessages$, wss);
                webSockets.forEach( ws => {
                    wss.emit('connection', ws)
                })
            });

            it('Then is should send out all the messages via each Web Socket connection', function () {
                webSockets.forEach((ws) => {
                    expect(outgoingMessages).to.deep.equal((<any>ws).sentMessages);
                })
            })
        })
    })
});
