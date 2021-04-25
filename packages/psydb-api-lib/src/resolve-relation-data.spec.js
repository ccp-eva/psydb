'use strict';
var expect = require('chai').expect,
    resolveRelationData = require('./resolve-relation-data');

var {
    BasicObject,
    BasicArray,
    ForeignId,
    ForeignIdList,
    HelperSetItemId,
    HelperSetItemIdList,
} = require('@mpieva/psydb-schema-fields');

describe('resolveRelationData()', function () {
    it('does stuff', () => {
        var schema = BasicObject({
            ary: BasicArray(
                BasicObject({
                    somefid: ForeignId({ collection: 'fooCollection' }),
                    somehelper: HelperSetItemId({ set: 'barHelperSet'}),
                    somefidList: ForeignIdList({
                        collection: 'herpCollection'
                    }),
                    somehelperList: HelperSetItemIdList({
                        set: 'derpHelperSet'
                    }),
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

        var out = resolveRelationData({
            schema,
            data,
        });

        console.log(out);
    })
})
