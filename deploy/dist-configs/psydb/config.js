module.exports = {
    // uses node mongodb driver version 3
    db: {
        // see https://www.mongodb.com/docs/drivers/node/v3.6/fundamentals/connection/connect/
        // for more information on connection string
        url: 'mongodb://mongodb:27017/psydb',
        dbName: 'psydb',
        
        // see https://mongodb.github.io/node-mongodb-native/3.6/api/global.html#MongoClientOptions
        // for other available options
        useUnifiedTopology: true,
    },
    // uses nodemailer under the hood
    // see https://nodemailer.com/smtp/
    // for other available options
    // (configured for mailhog container by default)
    smtp: {
        host: 'mailhog',
        port: 1025,
        secure: false,
        //auth: {
        //    user: 'my_user', // smtp user
        //    pass: 'my_pass', // smtp password
        //},
    },
}
