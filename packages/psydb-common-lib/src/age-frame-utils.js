'use strict';

var split = (value) => {
    var tmp = value;

    var years = Math.floor(tmp / 360);
    tmp %= 360;

    var months = Math.floor(tmp / 30);
    tmp %= 30;

    var days = tmp;

    return { years, months, days };
}

var combine = ({ years, months, days }) => (
    years * 360 + months * 30 + days
)

module.exports = {
    split,
    combine,
};
