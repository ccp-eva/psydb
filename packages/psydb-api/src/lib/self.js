'use strict';
var debug = require('debug')('psydb:api:lib:self');
    
var Self = async ({
    db,
    query,
    projection
}) => {
    var self = {
        record: undefined,
        systemRole: undefined
    }

    var requiredProjection = {
        'scientific.state.systemRoleId': true,
        'scientific.state.researchGroupIds': true,
    };

    projection = (
        projection
        ? {
            ...projection,
            ...requiredProjection
        }
        : requiredProjection
    );

    var personnelRecords = await (
        db.collection('personnel').find({
            $and: [
                { 'scientific.state.systemRoleId': {
                    $exists: true
                }},
                { 'scientific.state.systemRoleId': {
                    $not: { $type: 10 } // bson type of null
                }},
            ],
            ...query
        }, projection)
        .toArray()
    );

    if (personnelRecords.length === 1) {
        self.record = personnelRecords[0];
    }
    else {
        debug(`found ${personnelRecords.length} personnel records`);
    }

    if (self.record) {
        var { systemRoleId } = self.record.scientific.state;
        
        var role = await (
            db.collection('systemRole')
            .findOne({
                _id: systemRoleId
            })
        );

        if (role) {
            self.systemRole = role;
        }
    }

    return self;
}

module.exports = Self;
