'use strict';
var Sessions = require('collections/session');

module.exports = () => ({
    get: async (sid) => {
        return await Sessions().findOne({ sid });
    },
    set: async (sid, data) => {
        data.sid = sid;
        data.ttl = new Date(new Date().getTime() + (86400 * 1000)); // now + one day
        await Sessions().replaceOne({ sid }, data, { upsert: true })
    },
    destroy: async (sid) => {
        await Sessions().deleteOne({ sid });
    }
});
