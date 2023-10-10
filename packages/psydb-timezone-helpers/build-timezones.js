var { formatInTimeZone } = require('date-fns-tz');
var { getAllTimezones } = require('countries-and-timezones');
//console.log(getAllTimezones());

var data = require('./data.json');

//console.log(data.timezones);

var keyed = {};
for (var key of Object.keys(data.timezones)) {
    var it = data.timezones[key];

    keyed[key] = true;
    if (it.a) {
        keyed[it.a] = true
    }
}

var now = new Date();
for (var key of Object.keys(keyed)) {
    formatInTimeZone(now, key, 'P p')
}

var out = Object.keys(keyed);
console.log(JSON.stringify(out, null, 4))
