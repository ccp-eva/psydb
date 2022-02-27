'use strict';
var expect = require('chai').expect,
    resolvePossibleRefs = require('./resolve-possible-refs');

var {
    BasicObject,
    BasicArray,
    ForeignId,
    ForeignIdList,
    HelperSetItemId,
    HelperSetItemIdList,
} = require('@mpieva/psydb-schema-fields');

describe('resolvePossibleRefs()', function () {
    it('does stuff', () => {
        var schema = BasicObject({
            ary: BasicArray(
                BasicObject({
                    somefid: ForeignId({ collection: 'fooCollection' }),
                    somehelper: HelperSetItemId({ setId: 'barHelperSet'}),
                    somefidList: ForeignIdList({
                        collection: 'herpCollection'
                    }),
                    somehelperList: HelperSetItemIdList({
                        setId: 'derpHelperSet'
                    }),
                    someOR: { oneOf: [
                        BasicObject({
                            a: ForeignId({ collection: 'fooCollection' }),
                        }),
                        BasicObject({
                            a: HelperSetItemId({ setId: 'barHelperSet'}),
                        }),
                        BasicObject({
                            somehelperList: HelperSetItemIdList({
                                setId: 'derpHelperSet'
                            }),
                        }),

                    ]}
                })
            )
        });
        
        var data = {
            ary: [
                {
                    somefid: '24HcWRqgVJvKCo7Dvimzn',
                    somehelper: 'val1',
                    somefidList: [
                        'eQX9aXf8EouJZspAJAxdB',
                        '0tg2YBEQ3DailDdVbiIbO',
                    ],
                    somehelperList: [
                        'val2',
                        'val3'
                    ]
                }
            ]
        }

        var out = resolvePossibleRefs(schema);

        console.log(out);
    })
})
