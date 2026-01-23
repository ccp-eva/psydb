'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'reservation',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: true,
        fixedTypes: [ 'awayTeam', 'inhouse' ],
        hasSubChannels: false,
    };
    return meta;
}

