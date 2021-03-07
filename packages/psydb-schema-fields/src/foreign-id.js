'use strict';
var Id = require('./id');

// TODO: separate schema for edge constraints?
var ForeignId = (collection, constraints) => {
    if (!collection) {
        throw new Error('missing collection parameter on foreign key creation');
    }
    return ({
        ...Id(),
        ['db:collection']: collection,
        ['db:constraints']: constraints || {},
    });
}

module.exports = ForeignId;
