'use strict';
var { expect } = require('chai');
var { BaselineDeltas } = require('@mpieva/psydb-mocha-baseline-deltas');
var { TestScalar, TestArray, TestObject } = require('../test-tools');

var SimpleObject = () => TestObject({
    properties: {
        'foo': TestScalar(),
        'bar': TestScalar(),
        'baz': TestScalar(),
    },
    required: [ 'foo', 'bar' ]
});

describe('fn/project', () => {
    it('simple object : only', () => {
        var original = SimpleObject();
        var projected = original.project({ only: [
            '/foo', '/baz'
        ]});

        expect(original).to.not.equal(projected);
        expect(original.keywords).to.not.equal(projected.keywords);

        var deltas = BaselineDeltas();
        deltas.push(original.createJSONSchema());
        deltas.push(projected.createJSONSchema());

        deltas.test({ expected: {
            '/properties/bar': BaselineDeltas.DeletedValue(),
            '/required': [ 'foo' ]
        }})
    })
    
    it('simple object : omit', () => {
        var original = SimpleObject();
        var projected = original.project({ omit: [
            '/foo', '/baz'
        ]});

        var deltas = BaselineDeltas();
        deltas.push(original.createJSONSchema());
        deltas.push(projected.createJSONSchema());

        deltas.test({ expected: {
            '/properties/foo': BaselineDeltas.DeletedValue(),
            '/properties/baz': BaselineDeltas.DeletedValue(),
            '/required': [ 'bar' ]
        }})
    })

    it('nested object : only', () => {
        var original = TestObject({ properties: {
            'foo': SimpleObject(),
            'bar': TestScalar(),
            'baz': TestScalar(),
        }, required: [ 'foo', 'bar' ]});

        var projected = original.project({ only: [
            '/foo/foo', '/foo/baz', '/baz'
        ]});

        var deltas = BaselineDeltas();
        deltas.push(original.createJSONSchema());
        deltas.push(projected.createJSONSchema());

        deltas.test({ expected: {
            '/properties/foo/properties/bar': BaselineDeltas.DeletedValue(),
            '/properties/foo/required': [ 'foo' ],
            '/properties/bar': BaselineDeltas.DeletedValue(),
            '/required': [ 'foo' ]
        }})
    })
    
    it('nested object : omit', () => {
        var original = TestObject({ properties: {
            'foo': SimpleObject(),
            'bar': TestScalar(),
            'baz': TestScalar(),
        }, required: [ 'foo', 'bar' ]});

        var projected = original.project({ omit: [
            '/foo/foo', '/foo/baz', '/baz'
        ]});

        var deltas = BaselineDeltas();
        deltas.push(original.createJSONSchema());
        deltas.push(projected.createJSONSchema());

        deltas.test({ expected: {
            '/properties/foo/properties/foo': BaselineDeltas.DeletedValue(),
            '/properties/foo/properties/baz': BaselineDeltas.DeletedValue(),
            '/properties/foo/required': [ 'bar' ],

            '/properties/baz': BaselineDeltas.DeletedValue(),
        }})
    })

    it('nested object : __RENAME', () => {
        var original = TestObject({ properties: {
            'foo': SimpleObject(),
            'bar': TestScalar(),
            'baz': TestScalar(),
        }, required: [ 'foo', 'bar' ]});

        var projected = original.project({
            only: [ '/foo', '/baz' ],
            __RENAME: [{ from: 'foo', to: 'RENAMED' }]
        });

        var deltas = BaselineDeltas();
        deltas.push(original.createJSONSchema());
        deltas.push(projected.createJSONSchema());

        deltas.test({ expected: {
            '/properties/foo': BaselineDeltas.DeletedValue(),
            '/properties/bar': BaselineDeltas.DeletedValue(),
            '/required': [ 'bar', 'RENAMED' ],

            '/properties/RENAMED': SimpleObject().createJSONSchema(),
        }})
    })

})

