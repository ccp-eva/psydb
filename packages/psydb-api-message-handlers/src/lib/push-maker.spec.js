'use strict';
var expect = require('chai').expect,
    PushMaker = require('./push-maker');

describe('push-maker', () => {

    it('one prop w/ single value', () => {
        var actual = (
            PushMaker({ personnelId: 1 })
            .one('/state/foo', 10)
        );
        console.log(actual);
    });

    it('one prop w/ multiple value', () => {
        var actual = (
            PushMaker({ personnelId: 1 })
            .one('/state/foo', [ 10, 20, 30 ])
        );
        console.log(actual);
    });

    it('many props w/ single value each', () => {
        var actual = (
            PushMaker({ personnelId: 1 })
            .all({
                '/state/foo': 10,
                '/state/bar': 20,
            })
        );
        console.log(actual);
    });

    it('many props w/ single value each', () => {
        var actual = (
            PushMaker({ personnelId: 1 })
            .all({
                '/state/foo': [ 10, 11 ],
                '/state/bar': [ 20, 21 ],
            })
        );
        console.log(actual);
    });

});
