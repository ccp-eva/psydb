'use strict';
var Collection = require('db').Collection;

module.exports = () => {
    var collection = Collection({ name: 'sessions' });

    // ...

    return collection;
}
