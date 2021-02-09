'use strict';
module.exports = {
    createAllSchemas: require('./create-all/'),
    collectionMetadata: require('./collection-metadata'),
    
    ...require('./collection/'),
};
