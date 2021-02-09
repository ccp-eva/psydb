'use strict';
// TODO: just provisional for testing some stuff
var {
    PersonnelScientificState,
    PersonnelGdprState,
    SubjectScientificState,
    SubjectGdprState,
    LocationState,
    SystemRoleState,
} = require('./collection/');

var metadata = {
    personnel: {
        customTypes: false,
        subChannels: {
            gdpr: { createStateSchema: PersonnelGdprState },
            scientific: { createStateSchema: PersonnelScientificState }
        }
    },
    systemRole: {
        customTypes: false,
        createStateSchema: SystemRoleState
    },
    subject: {
        customTypes: true,
        subChannels: {
            gdpr: { createStateSchema: SubjectGdprState },
            scientific: { createStateSchema: SubjectScientificState }
        }
    },
    location: {
        customTypes: true,
        createStateSchema: LocationState
    },
};

//getSubChannels({ collection: 'personnel' });
// => [] when no subchannels are available
//      you cannot use subchannels in that case
// => [gdpr, scientific] when there are subchannels
//      has subchannels, in this case one of them required
var getSubChannels = ({ collection }) => {
    var meta = metadata[collection];
    if (!meta) {
        // TODO:
        throw new Error('unknown collection');
    }

    return (
        meta.subChannels
        ? Object.keys(meta.subChannels)
        : []
    );
}

module.exports = {
    metadata,
    getSubChannels,
}
