'use strict';
var Axios = require('axios');
var { ImapFlow } = require('imapflow');
var fixtures = require('../test-fixtures');

var config = {
    greenmailApi: {
        url: 'http://127.0.0.1:8081'
    },
    imap: {
        host: '127.0.0.1',
        port: 3143,
        auth: {
            user: 'root@example.com',
            pass: 'test1234'
        }
    }
}

var setupInbox = async (bag) => {
    var { fixtures: fixtureNames } = bag;

    //await Axios.post(`${config.greenmailApi.url}/api/user`, {
    //    email: config.imap.auth.user,
    //    login: config.imap.auth.user,
    //    password: config.imap.auth.password,
    //});

    var imap = new ImapFlow(config.imap);
    await imap.connect();

    for (var name of fixtureNames) {
        var data = fixtures.getContent(name);
        await imap.append('INBOX', data, [], new Date());
    }

    await imap.logout();
}

module.exports = setupInbox;
