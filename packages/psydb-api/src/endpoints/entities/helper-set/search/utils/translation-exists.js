'use strict';

var translationExists = ({ language }) => (
    ['de'].includes(language)
);

module.exports = translationExists;
