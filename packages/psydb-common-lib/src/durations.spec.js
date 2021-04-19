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
                '00:00:30.123': 30123, 
            }
            Object.keys(mapping).forEach(str => {
                var int = Duration(str);
                expect(int).to.eql(mapping[str]);
            }) 
        });
    });

    describe('toDurationString()', () => {
        it('convert duration string to int', () => {
            var mapping = [
                [  1860000, '00:31', 'MINUTE' ],
                [ -1860000, '-00:31', 'MINUTE' ],
                [ 3600000 * 100, '100:00', 'MINUTE' ],
                [ 30000, '00:00:30', 'SECOND' ],
                [ 30123, '00:00:30.123' ],
            ]
            mapping.forEach(([ int, expected, resolution ]) => {
                var converted = FormattedDuration(int, { resolution });
                expect(converted).to.eql(expected);
            }) 
        });
    });
})
