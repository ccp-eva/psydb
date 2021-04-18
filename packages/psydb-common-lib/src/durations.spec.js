'use strict';
var chai = require('chai');

var expect = chai.expect,
    { Duration, FormattedDuration } = require('./durations');

describe('durations', () => {
    describe('Duration()', () => {
        it('throws when invalid string', () => {
            var invalid = [
                'aaa',
                '12',
                '0:61',
            ]
            invalid.forEach(str => {
                var error = undefined;
                try {
                    var int = Duration(str);
                } catch (e) {
                    error = e;
                }
                expect(error).to.exist
            }) 
        });
        it('convert duration string to int', () => {
            var mapping = {
                '0:31': 1860000,
                '-0:31': -1860000,
                '0:00:30': 30000,
                '0:00:30': 30000,
                '100:00': 3600000 * 100,
            }
            Object.keys(mapping).forEach(str => {
                var int = Duration(str);
                expect(int).to.eql(mapping[str]);
            }) 
        });
    });
})
