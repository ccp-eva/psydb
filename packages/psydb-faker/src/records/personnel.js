'use strict';
var { Fields, applyOverrides } = require('../utils');

var fakeRecord = (bag) => {
    var { refcache, overrides } = bag;

    var record = {
        'gdpr': { 'state': {
            'firstname': Fields.SaneString({ minLength: 1 }),
            'lastname': Fields.SaneString({ minLength: 1 }),

            'emails': Fields.EmailWithPrimaryList({ minItems: 1 }),
            'phones': Fields.PhoneWithTypeList({ minItems: 1 }),

            'description': Fields.FullText(),
        }},
        'scientific': { 'state': {
            'canLogIn': Fields.DefaultBool(),
            'hasRootAccess': Fields.DefaultBool(),
            'researchGroupSettings': [
                { 
                    'researchGroupId': Fields.ForeignId({
                        collection: 'researchGroup'
                    }, { fromStore: refcache }),
                    'systemRoleId': Fields.ForeignId({
                        collection: 'systemRole'
                    }, { fromStore: refcache })
                }
            ],
            'systemPermissions': Fields.SystemPermissions({}, {
                fromStore: refcache,
            }),
        }}
    }

    applyOverrides({ record, refcache, overrides });

    return record;
}

module.exports = fakeRecord;
