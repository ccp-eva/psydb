'use strict';
var { expect } = require('chai');
var Anonymizer = require('../../anonymizer');
var { AnyString } = require('../scalar');
var ClosedObject = require('./exact-object');

describe('ClosedObject()', () => {
    it('doit', () => {
        var schema = ClosedObject({
            foo: AnyString({ anonT: 'append' }),
            bar: ClosedObject({
                quux: AnyString()
            }, { anonKeep: true }),

            baz: ClosedObject({
                herp: AnyString({ anonT: 'append' })
            }),

            quux: AnyString({ anonKeep: false }),
        })

        var jss = schema.createJSONSchema();
        console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'pass': ({ value }) => value,
            'append': ({ value, root }) => {
                console.log({ root });
                return `${value} APPEND`
            }
        }})
       
        var value = {
            foo: 'foo',
            bar: { quux: 'quux' },
            baz: { herp: 'herp' }
        }

        a.setupCache({ value });

        var T = schema.transformValue({
            transform: a.anonymize,
            value,
        })

        console.log(T.value);
    });
})
