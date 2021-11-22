var { DefaultBool } = require('@mpieva/psydb-schema-fields');

var WideBool = (keywords) => DefaultBool({
    systemProps: { uiSplit: [8,4] },
    ...keywords,
});

module.exports = WideBool;
