'use strict';
module.exports = {
    building: {
        kindergarden: require('./kindergarden-building'),
        school: require('./school-building')
    },
    room: {
        default: require('./default-room'),
    },
    gps: require('./gps-location'),
}
