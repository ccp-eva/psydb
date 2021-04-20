'use strict';
var chai = require('chai');

var expect = chai.expect,
    slotify = require('./slotify-items');

describe('slotifyItems()', () => {

    it('slotifies via default ptr', () => {
        var items = [
            { start: new Date(100), end: new Date(900) },
            { start: new Date(100), end: new Date(200) },
            { start: new Date(200), end: new Date(300) },
        ];
        
        var slotified = slotify({
            items,
            start: new Date(0),
            end: new Date(1000),
            slotDuration: 100,
        });

        console.log(slotified);
    });

    it('slotifies via custom ptr', () => {
        var items = [
            { foo: { start: new Date(100), end: new Date(900) }},
            { foo: { start: new Date(100), end: new Date(200) }},
            { foo: { start: new Date(200), end: new Date(300) }},
        ];
        
        var slotified = slotify({
            items,
            start: new Date(0),
            end: new Date(1000),
            slotDuration: 100,
            intervalPointer: '/foo'
        });

        console.log(slotified);
    });

});

