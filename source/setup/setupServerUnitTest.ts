import {setupServer} from "./setupServer";
import WebSocket = require('ws');
import {Server} from "http";

const http = require('http');

describe('Given valid input', function () {
    describe('When setupServer is executed', function () {
        let connected = true,
            server: Server,
            ws: WebSocket;
        beforeEach(async function () {
            server = (await setupServer(WebSocket.Server, http.createServer)).server;

            connected = await new Promise<boolean>(function (resolve, reject) {
                ws = new WebSocket('ws://localhost:8999');
                ws.on('open', function () {
                    resolve(true);
                });

                ws.on('error', function (error) {
                    reject(false);
                })
            })
        });

        it('Then a WebSocket server should be up and running', function () {
            expect(connected).to.equal(true);
        });

        afterEach(function () {
            ws.close();
            server.close();
        })
    });
});

describe('Given invalid input', function () {
    describe('When setupServer is executed', function () {
        it('Then it should throw an error', async function () {
            function callStepServer(){
                setupServer(WebSocket.Server, () => {})
            }
            expect(callStepServer).to.throw;
        });
    });
});