'use strict';
var { Permissions } = require('@mpieva/psydb-common-lib');
var { Self, ResponseBody } = require('@mpieva/psydb-api-lib');

var createResponseBody = async (context) => {
    var { db, personnelId, response } = context;
    
    var self = await Self({ db, query: {
        _id: personnelId
    }});

    var permissions = Permissions.fromSelf({ self });

    response.body = ResponseBody({
        data: {
            record: self.record,
            permissions
        }
    })
}

module.exports = { createResponseBody }
