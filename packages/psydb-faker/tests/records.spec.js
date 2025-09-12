'use strict';
var { expect } = require('chai');
var { faker } = require('@faker-js/faker');
var { Records } = require('../src/');

describe('records', () => {
    var crtSettings = [];

    it('does the thing', () => {
        faker.seed(1);

        var refcache = {};
        var order = [
            { c: 'systemRole' },
            { c: 'researchGroup' },
            { c: 'personnel' },
        ];

        for (var [ ix, it ] of order.entries()) {
            var { c: collection, t: recordType } = it;
            
            if (recordType) {
                var faked = Records[collection]({
                    crtSettings, recordType, refcache
                });
                console.dir(faked, { depth: null });
                
                refcache[collection] = { [recordType] : [] };
                refcache[collection][recordType].push(ix * 111);
            }
            else {
                var faked = Records[collection]({ refcache });
                console.dir(faked, { depth: null });

                refcache[collection] = [];
                refcache[collection].push(ix * 111);
            }
        }
        
        console.dir(refcache, { depth: null });
    })
})
