'use strict';
var expect = require('chai').expect;

var convertPointer = require('../src/');

var expectedConversions = {
    '': '',
    '/oneOf/1': '',
    '/allOf/1': '',
    
    '/properties/myprop': '/myprop',
    '/oneOf/1/properties/myprop': '/myprop',
    '/allOf/1/properties/myprop': '/myprop',
    
    '/properties/properties': '/properties',
    '/properties/oneOf': '/oneOf',
    '/properties/allOf': '/allOf',

    '/properties/properties/properties/properties': '/properties/properties',
    '/properties/properties/oneOf/0': '/properties',
    '/properties/properties/oneOf/0/myprop': '/properties/myprop',

    '/properties/myprop/items/properties/myitemprop': '/myprop/myitemprop'
};

describe('basic cases', () => {
    it('converts pointers properly', () => {
        var actualConversions = (
            Object.keys(expectedConversions).reduce((acc, pointer) => ({
                ...acc,
                [pointer]: convertPointer(pointer),
            }), {})
        );
        expect(actualConversions).to.eql(expectedConversions);
    })
})
