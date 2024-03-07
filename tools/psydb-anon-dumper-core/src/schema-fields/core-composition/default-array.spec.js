'use strict';
var { expect } = require('chai');
var Anonymizer = require('../../anonymizer');
var { AnyString } = require('../scalar');
var ExactObject = require('./exact-object');
var DefaultArray = require('./default-array');

describe('DefaultArray()', () => {
    it('doit', () => {
        var mfschema = DefaultArray({
            items: ExactObject({
                foo: AnyString({ anonT: 'append' }),
            }),
        })

        var jss = mfschema.createJSONSchema();
        console.dir({ jss }, { depth: null });

        var a = Anonymizer({ hooks: {
            'pass': ({ value }) => value,
            'append': ({ value }) => `${value} APPEND`
        }})
        var T = mfschema.transformValue({
            transform: a.anonymize,
            value: [
                { foo: 'a' },
                { foo: 'b' },
            ]
        })

        console.log(T.value);
    });
})
