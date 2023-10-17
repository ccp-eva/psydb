'use strict';

// NOTE: this is currently only a stub package we need to move more
// stuff here

var translationExists = ({ language }) => (
    ['de'].includes(language)
);

module.exports = {
    translationExists
};
