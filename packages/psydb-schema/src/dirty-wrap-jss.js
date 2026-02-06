'use strict';
var PsyDBSchema = require('./psydb-schema');

var dirtyWrapJSS = (jss) => (
    new PsyDBSchema({
        keywords: { systemType: jss.systemType },
        createJSONSchema: () => jss,
        transformValue: ({ value }) => ({ shouldStore: true, value }),
    })
)

module.exports = dirtyWrapJSS;
