'use strict';
var chai = require('chai');

var expect = chai.expect,
    deconstructArrays = require('../src/');

describe('nested-arrays', () => {
    it('arrays within arrays', async () => {
        var schema = {
            type: 'object',
            properties: {
                arys: {
                    type: 'array',
                    items: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                }
            }
        }

        var parts = deconstructArrays(schema);
        console.dir(parts, { depth: null });
        return;

    });
})

