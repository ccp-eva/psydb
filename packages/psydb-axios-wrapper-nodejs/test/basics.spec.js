'use strict';
var { expect } = require('chai');
var http = require('http');
var createNodeAgent = require('../src');

describe('basics', function () {
    it('with url target', async function () {
        var agent = createNodeAgent('http://www.google.com');
        var r = await agent.get('/');
        expect(r.data).to.contain('<!doctype html>');
    });

    it('with server target', async function () {
        var server = http.createServer(function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('foo');
        }).listen(0);
        
        var agent;
        try {
            agent = createNodeAgent(server);
            var r = await agent.get('/');
            expect(r.data).to.contain('foo');
        }
        finally {
            agent?.close();
        }
    });
    
    it('with function target', async function () {
        var fn = function (req, res) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('foo');
        }
        
        var agent;
        try {
            agent = createNodeAgent(fn);
            var r = await agent.get('/');
            expect(r.data).to.contain('foo');
        }
        finally {
            agent?.close();
        }
    });
});
