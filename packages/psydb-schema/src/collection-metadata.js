'use strict';
var internals = require('./collection');

/*var {
    // FIXME: cyclical
    //CustomRecordTypeState,

    HelperSetState,
    HelperSetItemState,
    PersonnelScientificState,
    PersonnelGdprState,
    SubjectScientificState,
    SubjectGdprState,
    LocationState,
    SystemRoleState,
} = require('./collection/');*/

var metadata = {
    // FIXME: cyclical
    customRecordType: {
        customTypes: false,
        createStateSchema: internals.CustomRecordTypeState,
    },
    helperSet: {
        customTypes: false,
        createStateSchema: internals.HelperSetState,
    },
    helperSetItem: {
        customTypes: false,
        createStateSchema: internals.HelperSetItemState,
    },
    personnel: {
        customTypes: false,
        subChannels: {
            gdpr: { createStateSchema: internals.PersonnelGdprState },
            scientific: { createStateSchema: internals.PersonnelScientificState }
        }
    },
    systemRole: {
        customTypes: false,
        createStateSchema: internals.SystemRoleState
    },
    subject: {
        customTypes: true,
        subChannels: {
            gdpr: { createStateSchema: internals.SubjectGdprState },
            scientific: { createStateSchema: internals.SubjectScientificState }
        }
    },
    location: {
        customTypes: true,
        createStateSchema: internals.LocationState
    },
};

var getCollectionMetadata = ({ collection }) => {
    var meta = metadata[collection];
    if (!meta) {
        // TODO:
        throw new Error(`unknown collection "${collection}"`);
    }
    return meta;
}

//getSubChannels({ collection: 'personnel' });
// => [] when no subchannels are available
//      you cannot use subchannels in that case
// => [gdpr, scientific] when there are subchannels
//      has subchannels, in this case one of them required
var getSubChannels = ({ collection }) => {
    var meta = getCollectionMetadata({ collection });

    return (
        meta.subChannels
        ? Object.keys(meta.subChannels)
        : []
    );
}

module.exports = {
    metadata,
    getCollectionMetadata,
    getSubChannels,
}
