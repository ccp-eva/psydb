'use strict';

module.exports = (bag) => {
    var meta = {
        collection: 'experimentVariantSetting',
        isGenericRecord: false,
        hasCustomTypes: false,
        hasFixedTypes: true,
        fixedTypes: [
            'online-survey',
            'online-video-call',
            'inhouse',
            'away-team',

            'apestudies-wkprc-default',
            'manual-only-participation',
        ],
        hasSubChannels: false,
    };
    return meta;
}

