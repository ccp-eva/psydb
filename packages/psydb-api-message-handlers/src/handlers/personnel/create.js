'use strict';
var GenericRecordHandler = require('../../lib/generic-record-handler');

module.exports = GenericRecordHandler({
    collection: 'personnel',
    op: 'create',

    triggerOtherSideEffects: async () => {}
});
