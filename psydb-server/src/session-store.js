'use strict';
var Sessions = require('collections/session');

module.exports = () => ({
    get: async (sid) => {
        return await Sessions().findOne({ sid });
    },
    set: async (sid, data) => {
        data.sid = sid;
        data.ttl = (new Date()) + (86400 * 1000); // now + one day
        await Sessions().update({ sid }, data, { upsert: true })
    },
    destroy: async (sid) => {
        await Sessions().remove({ sid });
    }
});
