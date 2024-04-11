'use strict';
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var maybeAsObjectId = (value) => (
    /[0-9A-Fa-f]{24}/.test(value)
    ? ObjectId(value)
    : value
);
var split = (value) => value.split(/\s*,\s*/);

var deserializers = {
    'HelperSetItemIdList': ({ value, definition }) => (
        split(value).map(maybeAsObjectId)
    ),
    'ForeignIdList': ({ value, definition }) => (
        split(value).map(maybeAsObjectId)
    ),
    'HelperSetItemId': ({ value, definition }) => (
        maybeAsObjectId(value)
    ),
    'ForeignId': ({ value, definition }) => (
        maybeAsObjectId(value)
    ),
    'EmailList': ({ value, definition }) => (
        split(value).map((it, ix) => ({
            email: it, isPrimary: ix === 0,
        }))
    ),
    'PhoneWithTypeList': ({ value, definition }) => (
        split(value).map((it, ix) => ({
            number: it, type: 'private'
        }))
    ),
    'PhoneList': ({ value }) => split(value),
    'SaneStringList': ({ value }) => split(value),
    'URLStringList': ({ value }) => split(value),
    'DefaultBool': ({ value, definition }) => {
        var lcvalue = value.toLowerCase();
        if (['true', 'false'].includes(lcvalue)) {
            return (lcvalue === 'true');
        }
        else {
            return value;
        }
    },
    'Integer': ({ value, definition }) => {
        var i = parseInt(value);
        if (Number.isNaN(i)) {
            return value;
        }
        else {
            return i;
        }
    }
}

module.exports = deserializers;
