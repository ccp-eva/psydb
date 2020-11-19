'use strict';
var BlockedWeekdays = () => ({
    reactType: 'checkbox-group',
    type: 'object',
    properties: {
        mon: { type: 'boolean', default: false },
        tue: { type: 'boolean', default: false },
        wed: { type: 'boolean', default: false },
        thu: { type: 'boolean', default: false },
        fri: { type: 'boolean', default: false },
        sat: { type: 'boolean', default: false },
        sun: { type: 'boolean', default: false },
    }
})

module.exports = BlockedWeekdays;
