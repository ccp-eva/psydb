'use strict';
var { expect } = require('chai');
var { faker } = require('@faker-js/faker');
var { Fields } = require('../src');

describe('stub test', () => {
    it('doit', () => {
        
        faker.seed(1);

        var types = [
            'Address',
            'BiologicalGender',
            'DateOnlyServerSide',
            'DateTime',
            'DefaultBool',
            'EmailList',
            'Email',
            'ExtBool',
            'FullText',
            'GeoCoords',
            'Integer',
            'Phone',
            'PhoneList',
            'PhoneWithTypeList',
            'SaneString',
            'SaneStringList',
            'URLString',
            'URLStringList',
        ];

        for (var it of types) {
            var out = Fields[it].getRandomValue({
                definition: { props: { minItems: 1, minLength: 1 }}
            });

            console.log({ it, out });
        }
            //'ForeignIdList',
            //'ForeignId',
            //'HelperSetItemIdList',
            //'HelperSetItemId',
    })
})
