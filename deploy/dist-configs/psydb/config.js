module.exports = {
    db: {
        url: 'mongodb://127.0.0.1:27017/psydb',
        dbName: 'psydb',
        useUnifiedTopology: true,
    },
    // configured for mailhog container by default
    smtp: {
        host: '127.0.0.1',
        port: 1025,
        secure: false,
    },
}
