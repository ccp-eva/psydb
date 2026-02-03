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

        var store = {
            'personnel': [ 'p_111', 'p_222' ],
            'subject': {
                cats: [ 'cat_111', 'cat_222' ],
                mice: [ 'mouse_111', 'mouse_222']
            },
            'helperSetItem': {
                hs_one: [ 'hs_one_a', 'hs_one_b' ],
                hs_two: [ 'hs_two_a', 'hs_two_b' ]
            }
        }

        var other = [
            Fields.ForeignId.getRandomValue({ definition: {
                props: { collection: 'personnel' }
            }, fromStore: store }),

            Fields.ForeignId.getRandomValue({ definition: {
                props: { collection: 'subject', recordType: 'mice' }
            }, fromStore: store }),

            Fields.ForeignIdList.getRandomValue({ definition: {
                props: { collection: 'personnel', minItems: 1 }
            }, fromStore: store }),
            
            Fields.HelperSetItemId.getRandomValue({ definition: {
                props: { setId: 'hs_one' }
            }, fromStore: store }),
            
            Fields.HelperSetItemIdList.getRandomValue({ definition: {
                props: { setId: 'hs_two', minItems: 1 }
            }, fromStore: store }),
        ];

        console.log({ other });
    })
})
