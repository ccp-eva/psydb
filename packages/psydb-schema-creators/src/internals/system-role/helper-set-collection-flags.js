'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadHelperSets: WideBool({
        title: 'kann Hilfstabellen einsehen'
    }),
    canWriteHelperSets: WideBool({
        title: 'kann Hilfstabellen bearbeiten'
    }),
}
