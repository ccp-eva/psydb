'use strict';
var expect = require('chai').expect,
    createAll = require('./index');

describe('createAll()', () => {
    it('creates the typed schemas', () => {
        var records = [
            { state: {
                collection: 'location', type: 'gps',
            }},
            /*{ state: {
                collection: 'location', type: 'building', subtype: 'kiga',
            }},
            { state: {
                collection: 'location', type: 'room', subtype: 'default',
            }},
            { state: {
                collection: 'subject', type: 'gorilla',
            }},
            { state: {
                collection: 'externalPerson', type: 'doctor'
            }},
            { state: {
                collection: 'externalOrganization', type: 'bearer'
            }},*/
        ];

        var items = createAll({
            records,
        })
        
        console.dir(items.messages, { depth: 5 });

    })
})
