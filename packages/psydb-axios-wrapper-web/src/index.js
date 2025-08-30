'use strict';
var Axios = require('axios');

var { wrapper: addCookieSupport } = require('axios-cookiejar-support');
var { CookieJar } = require('tough-cookie');

var createAgent = (baseURL, options = {}) => {
    var { enableCookies = false } = options;

    var axios = (
        enableCookies
        ? createWithCookieSupport(bag)
        : createDefault(bag)
    )

    return axios;
}

var createWithCookieSupport = (bag) => {
    var jar = new CookieJar();
    var axios = addCookieSupport(Axios.create({ ...bag, jar }));

    return axios;
}

var createDefault = (bag) => {
    var axios = Axios.create(bag);
    return axios;
}

module.exports = createAgent;
