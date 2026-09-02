'use strict';
var { FieldDefinitions } = require('@mpieva/psydb-common-lib');
var { INIT_STEP_BAG } = require('./init');
var {
    CREATE_HELPER_SET,
    CREATE_CRT,
    ADD_FIELD_DEFINITION
} = require('./steps');

describe('custom-record-types/add-field-definition', function () {
    before(INIT_STEP_BAG());
    var db, login, send;
    before(async function () {
        await this.restore('init-minimal');
        
        db = this.getDbHandle();
        login = await this.createFakeLogin({ email: 'root@example.com' });
        ([ send ]) = this.createMessenger({ ...login });
    });

    CREATE_HELPER_SET('Some Helper Set');
    CREATE_CRT('location', 'cat_shelter');
    CREATE_CRT('subject', 'cat_owner');
    CREATE_CRT('subject', 'cat');

    for (var systemType of Object.keys(FieldDefinitions)) {
        ADD_FIELD_DEFINITION({ systemType: type });
    }
})
