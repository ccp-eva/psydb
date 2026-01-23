'use strict';
var { ClosedObject, DefaultBool } = require('@mpieva/psydb-schema-fields');

var { AccessRightsByResearchGroup } =
    require('./access-rights-by-research-group');


var SystemPermissions = () => {
    var schema = ClosedObject({
        'accessRightsByResearchGroup': AccessRightsByResearchGroup(),
        'isHidden': DefaultBool(),
    });

    return schema;
}

module.exports = { SystemPermissions };

