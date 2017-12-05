import * as WebSocket from 'ws'
import {EventEmitter} from 'events'

export class WebSocketMock extends EventEmitter {
    sentMessages: string[] = [];

    constructor(){
        super();
    }

    send(message){
        this.sentMessages.push(message);
    }
}

export let WebSocketMockProxy = new Proxy(WebSocket, {
    construct: function () {
        return new WebSocketMock();
    }
});

export class WebSocketServerMock extends EventEmitter{
    webSockets: WebSocketMock[] = [];

    constructor(){
        super();
    }
}

export let WebSocketServerMockProxy = new Proxy(WebSocket.Server, {
    construct: function () {
        return new WebSocketServerMock()
    }
});