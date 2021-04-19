'use strict'
// https://stackoverflow.com/a/596243/1158560
var calculatePercievedBrightness = (colorCode) => {
    if (colorCode.startsWith('#')) {
        colorCode = colorCode.slice(1);
    }
    var R = colorCode.slice(0,2);
    var G = colorCode.slice(2,4);
    var B = colorCode.slice(4,6);

    R = parseInt(R, 16);
    G = parseInt(G, 16);
    B = parseInt(B, 16);

    var pb = Math.sqrt(
        0.299 * R**2
        + 0.587 * G**2 
        + 0.114 * B**2
    );

    return pb;
}

module.exports = calculatePercievedBrightness;
