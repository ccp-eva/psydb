'use strict';
var { ClosedObject, DefaultArray } = require('../core-composition');
var { MongoFk, DefaultBool, AnyString } = require('../scalar');

var SystemPermissions = () => {
    var schema = ClosedObject({
        'accessRightsByResearchGroup': DefaultArray({
            items: ClosedObject({
                'permission': AnyString({ anonKeep: true }),
                'researchGroupId': MongoFk({
                    collection: 'researchGroup', anonKeep: true
                }),
            })
        }),
        'isHidden': DefaultBool({ anonKeep: true }),
    });

    return schema;
}

module.exports = SystemPermissions;
