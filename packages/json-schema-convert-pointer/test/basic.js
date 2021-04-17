'use strict';
var expect = require('chai').expect;

var convertPointer = require('../src/');

var testSet = [
    {
        pointer: '',
        data: undefined,
        expected: '',
    },
    {
        pointer: '/oneOf/1',
        data: undefined,
        expected: '',
    },
    {
        pointer: '/allOf/1',
        data: undefined,
        expected: '',
    },
    
    {
        pointer: '/properties/myprop',
        data: undefined,
        expected: '/myprop',
    },
    {
        pointer: '/oneOf/1/properties/myprop',
        expected: '/myprop'
    },
    {
        pointer: '/allOf/1/properties/myprop',
        expected: '/myprop',
    },
    
    {
        pointer: '/properties/properties',
        expected: '/properties',
    },
    {
        pointer: '/properties/oneOf',
        expected: '/oneOf',
    },
    {
        pointer: '/properties/allOf',
        expected: '/allOf',
    },

    {
        pointer: '/properties/properties/properties/properties',
        expected: '/properties/properties',
    },
    {
        pointer: '/properties/properties/oneOf/0',
        expected: '/properties',
    },
    {
        pointer: '/properties/properties/oneOf/0/myprop',
        expected: '/properties/myprop',
    },
    /*{
        pointer:'/items',
        data: [ 'a', 'b' ],
        expected: [ '/0', '/1' ]
    },
    {
        pointer:'/items/items',
        data: [ [ 1, 2 ], [ 'a', 'b' ]],
        expected: [ '/0/0', '/0/1', '/1/0', '/1/1' ]
    },
    {
        pointer:'/foo/items',
        data: { foo: [ 'a', 'b' ] },
        expected: [ '/foo/0', '/foo/1' ]
    },*/
    {
        pointer:'/foo/items/bar',
        data: { foo: [ { bar: 'a' }, { bar: 'b' } ] },
        expected: [ '/foo/0/bar', '/foo/1/bar' ]
    },
    /*{
        pointer: '/properties/myprop/items/properties/myitemprop',
        data: [],
        expected: [
            '/myprop/0/myitemprop',
            '/myprop/1/myitemprop'
        ],
    },*/
];

describe('basic cases', () => {
    it('converts pointers properly', () => {
        testSet.forEach(it => {
            it.actual = convertPointer(it.pointer, it.data);
        })
        var expectedConversions = testSet.map(it => it.expected);
        var actualConversions = testSet.map(it => it.actual);
        expect(actualConversions).to.eql(expectedConversions);
    })
})
