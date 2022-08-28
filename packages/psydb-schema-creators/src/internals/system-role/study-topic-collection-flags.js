'use strict';
var WideBool = require('./wide-bool');

module.exports = {
    canReadStudyTopics: WideBool({
        title: 'kann Themengebiete einsehen',
    }),
    canWriteStudyTopics: WideBool({
        title: 'kann Themengebiete bearbeiten'
    }),
}
