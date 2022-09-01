module.exports = {
    db: {
        //url: 'mongodb://127.0.0.1:27017/psydb',
        url: 'mongodb://mongodb:27017/psydb',
        dbName: 'psydb',
        useUnifiedTopology: true,
    },
    // configured for mailhog container by default
    smtp: {
        host: 'mailhog',
        port: 1025,
        secure: false,
    },
}
