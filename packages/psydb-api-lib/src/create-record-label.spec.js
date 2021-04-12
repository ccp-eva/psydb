'use strict';
var expect = require('chai').expect,
    createRecordLabel = require('./create-record-label');

describe('createRecordLabel()', function () {
    it('works on multiple replacements', () => {
        var definition = {
            format: '${#} ___ ${#}',
            tokens: [
                { systemType: 'SaneString', dataPointer: '/foo' },
                { systemType: 'SaneString', dataPointer: '/bar' },
            ]
        };
        var record = {
            foo: 'FOO',
            bar: 'BAR',
        };

        var label = createRecordLabel({ definition, record });
        console.log(label);

        expect(label).to.eql('FOO ___ BAR');
    })
    it('works on mixed redaction', () => {
        var definition = {
            format: '${#} ___ ${#}',
            tokens: [
                { systemType: 'SaneString', dataPointer: '/foo' },
                { systemType: 'SaneString', dataPointer: '/bar' },
            ]
        };
        var record = {
            foo: 'FOO',
        };

        var label = createRecordLabel({ definition, record });
        console.log(label);

    });
})
