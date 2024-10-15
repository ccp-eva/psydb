'use strict';
var Password = ({ ...keywords } = {}) => ({
    type: 'string',
    systemType: 'Password',
    title: 'Passwort',
    ...keywords
});

module.exports = Password;
