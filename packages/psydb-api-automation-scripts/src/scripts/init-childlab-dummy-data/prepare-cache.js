'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');

module.exports = async (context) => {
    var { db, cache } = context;
    
    var fetchAll = (collection) => (
        db.collection(collection).find().toArray()
    )

    var systemRolesByName = keyBy({
        items: await fetchAll('systemRole'),
        byPointer: '/state/name',
        transform: (it) => (it._id)
    });

    cache.merge({
        systemRole: systemRolesByName,
    });

    console.log(cache.get());
}
