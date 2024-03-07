'use strict';
var { crc32, faker } = require('../externals');

var reseed = (n) => {
    faker.seed(n);
}

var reseedForDocId = (doc) => {
    reseed(getSeedForDocId(doc));
}

var getSeedForDocId = (doc) => {

    // NOTE: faker uses Number.MAX_SAFE_INTEGER as ceiling
    // that is:
    //     9007199254740991
    //     1f ff ff ff ff ff ff
    // 
    // ObjectId is 12 byte UInt8 Buffer
    // that is
    //     ff ff ff ff ff ff ff ff ff ff ff ff
    // 0-7 are timestamp
    // 8-13 is machine id
    // 14-17 is process id
    // 18-23 is extra an auto increment initialized at random
    //     0  2  4  6  8  10 12 14 16 18 20 24
    //     tt tt tt tt mm mm mm pp pp ii ii ii
    //
    // its not really posisble to manipulate the object id
    // to fit into the desired space
    // so instead we use crc32 to has the thing

    var n = crc32(doc._id.toString());
    return n;
}

module.exports = {
    reseed,
    getSeedForDocId,
    reseedForDocId,
}
