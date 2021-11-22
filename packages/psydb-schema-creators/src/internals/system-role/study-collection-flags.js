'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadStudies: WideBool({
        title: 'kann Studien einsehen',
    }),
    canWriteStudies: WideBool({
        title: 'kann Studien anlegen und bearbeiten',
    }),
}
