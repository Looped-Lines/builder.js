import {setupServer} from "./setupServer";
import WebSocket = require('ws');
import {Server} from "http";

const express = require('express');
const http = require('http');

describe('When setupServer is executed', function () {
    let connected = true,
        server : Server,
        ws: WebSocket;
    beforeEach(async function () {
        server = (await setupServer(WebSocket.Server, express, http.createServer)).server;

        connected = await new Promise<boolean> (function (resolve, reject) {
            ws = new WebSocket('ws://localhost:8999');
            ws.on('open', function () {
                resolve(true);
            });

            ws.on('error', function (error) {
                reject(false);
            })
        })
    });

    it('then a WebSocket server should be up and running', function () {
        expect(connected).to.equal(true);
    });


    afterEach( function () {
        ws.close();
        server.close();
    })
});