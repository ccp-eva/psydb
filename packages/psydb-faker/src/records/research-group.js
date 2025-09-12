'use strict';
var { Fields } = require('../utils');

var fakeRecord = (bag) => {
    var { refcache } = bag;

    var basename = Fields.SaneString({ minLength: 1 });

    var systemRoleIds = Fields.ForeignIdList({
        collection: 'systemRole', minItems: 1
    }, { fromStore: refcache });

    var record = {
        'state': {
            'name': `Center for ${basename} Research`,
            'shorthand': `${basename}-Lab`,
            'address': Fields.Address(),
            'description': Fields.FullText(),
            
            'systemRoleIds': systemRoleIds,
            'adminFallbackRoleId': systemRoleIds[0],

            // TODO
            'labMethods': [ 'inhouse', 'away-team' ],
            'studyTypes': [],
            'subjectTypes': [],
            'locationTypes': [],
            'helperSetIds': [],
        }
    }

    return record;
}

module.exports = fakeRecord;
