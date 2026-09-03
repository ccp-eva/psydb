'use strict';
var snake = require('just-snake-case');
var { FieldDefinitionSchemas } = require('@mpieva/psydb-common-lib');
var { INIT_STEP_BAG } = require('./init');
var { CRT, HELPER_SET } = require('./steps');

describe('custom-record-types/add-field-definition', function () {
    before(INIT_STEP_BAG());

    //HELPER_SET.create('Some Helper Set', { as: 'someHSI' });
    //CRT.create('location', 'cat_shelter');
    CRT.create('subject', 'cat_owner');
    CRT.create('subject', 'cat');
    
    CRT('cat').addFieldDefinition({
        systemType: 'SaneString',
        key: snake('SaneString'), subChannelKey: 'scientific',
    });

    //for (var systemType of ['SaneString']) {
    //    CRT('cat').addFieldDefinition({
    //        systemType: systemType,
    //        key: snake(systemType), subChannelKey: 'scientific',
    //    });
    //}
})
