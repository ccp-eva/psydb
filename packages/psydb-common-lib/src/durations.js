'use strict';
/*var dateutils = require('./date'),
    sprintf = require('sprintf-js').sprintf,
*/
var durations = module.exports = {};

durations.SECOND = 1000;
durations.MINUTE = 60 * durations.SECOND;
durations.HOUR = 60 * durations.MINUTE;

// FIXME: this is pretty hacky
durations.Duration = (string) => {
    var isNegative = false;
    if (string.startsWith('-')) {
        isNegative = true;
    }

    if (isNegative) {
        string = string.slice(1);
    }

    var matched = string.match(
        /^(\d+):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{3}))?)?$/
    );
    if (!matched) {
        throw new Error(`invalid duration string "${string}"`);
    }

    var multipliers = [
        durations.HOUR,
        durations.MINUTE,
        durations.SECOND,
        1 // misslisecond
    ]

    var duration = multipliers.reduce((acc, multiplier, index) => {
        var captureGroup = matched[index + 1];
        if (captureGroup !== undefined) {
            var parsed = parseInt(captureGroup);
            return acc + (parsed * multiplier)
        }
        else {
            return acc;
        }
    }, 0)

    return (
        isNegative
        ? -1 * duration
        : duration
    );
}

// TODO: String.prototype.padStart(4, '0') => '0003'
durations.FormattedDuration = (durationInt, { resolution } = {}) => {
    var isNegative = (
        durationInt < 0
        ? true
        : false
    );

    if (isNegative) {
        durationInt *= -1;
    }

    var resolutions = {
        HOUR: 0,
        MINUTE: 1,
        SECOND: 2,
        MILLISECOND: 3,
    };
    var resolutionIndex = resolutions[(resolution || 'MILLISECOND')];

    var rest = durationInt;
    var segments = {};
    ['HOUR', 'MINUTE', 'SECOND'].forEach((segmentKey) => {
        var timeConstant = durations[segmentKey];
        var segmentValue = Math.floor(rest / timeConstant);
        segments[segmentKey] = segmentValue;
        rest -= segmentValue * timeConstant
    });

    segments.MILLISECOND = rest;

    var acc = zeroPad(segments.HOUR, 2);
    acc += `:${zeroPad(segments.MINUTE, 2)}`;
    if (resolutionIndex >= resolutions.SECOND) {
        acc += `:${zeroPad(segments.SECOND, 2)}`;
    }
    if (resolutionIndex >= resolutions.MILLISECOND) {
        acc += `.${zeroPad(segments.MILLISECOND, 3)}`;
    }

    if (isNegative) {
        acc = `-${acc}`;
    }

    return acc;

    /*var str = '';

    if (duration < 0) {
        str += '-';
    }

    duration = Math.abs(duration);

    str += Math.floor( duration / durations.HOUR );
    duration = duration % durations.HOUR;
    
    str += ':';
    str += sprintf('%02d', Math.floor( duration / durations.MINUTE ));

    return str;*/
}

var zeroPad = (value, n) => (
    String(value).padStart(n, '0')
)
