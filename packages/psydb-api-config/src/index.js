module.exports = {
    db: {
        url: 'mongodb://127.0.0.1:47017/psydb',
        dbName: 'psydb',
        useUnifiedTopology: true,
    },
    smtp: {
        host: '127.0.0.1',
        port: 1025,
        secure: false,
        /*
        // FIXME: figure out how to
        // configure mailhog properly
        auth: {
            user: 'foo',
            pass: 'baz'
        }
        */
    }
}
