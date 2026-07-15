'use strict';
var { DefaultArray } = require('../core-compositions');
var CustomRecordTypeKey = require('./custom-record-type-key');

var CustomRecordTypeKeyList = (bag) => {
    var { collection, enableResearchGroupFilter,...pass } = bag;

    var schema = DefaultArray({
        systemType: 'CustomRecordTypeKeyList',
        items: CustomRecordTypeKey({
            collection, enableResearchGroupFilter
        }),
        ...pass,
    });

    return schema;
}

module.exports = CustomRecordTypeKeyList;
