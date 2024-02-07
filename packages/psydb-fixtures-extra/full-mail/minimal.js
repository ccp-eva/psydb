'use strict';
var co = require('co');
var Axios = require('axios');

var config = {
    greenmailApi: {
        url: 'http://127.0.0.1:8081'
    }
}

var main = async () => {
    var axios = Axios.create({ baseURL: config.greenmailApi.url });

    await axios.post('/api/user', {
        email: 'root@example.com',
        login: 'root@example.com',
        password: 'test1234'
    });
}

co(main).catch(console.log);
