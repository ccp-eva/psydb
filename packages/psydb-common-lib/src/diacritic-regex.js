'use strict';
// https://github.com/pocesar/js-diacritic-regex/blob/master/index.ts

/**
 * expect the transliterated value as key, and a string with replacements
 */
let mappings = {
    'a': String.fromCharCode(65, 97, 192, 224, 193, 225, 194, 226, 195, 227, 196, 228, 229, 258, 259),
    'e': String.fromCharCode(69, 101, 200, 232, 201, 233, 202, 234, 203, 235),
    'i': String.fromCharCode(73, 105, 204, 236, 205, 237, 206, 238, 207, 239),
    'o': String.fromCharCode(79, 111, 210, 242, 211, 243, 212, 244, 213, 245, 214, 246),
    'n': String.fromCharCode(78, 110, 209, 241),
    'u': String.fromCharCode(85, 117, 217, 249, 218, 250, 219, 251, 220, 252),
    'c': String.fromCharCode(67, 99, 199, 231),
    'y': String.fromCharCode(89, 121, 221, 253, 159, 255),
}

function mergeMappings(innerMappings) {
    let base = {};

    for (let mapping in mappings) {
        base[mapping] = mappings[mapping];
    }

    if (innerMappings) {
        for (let mapping in innerMappings) {
            base[mapping] = innerMappings[mapping];
        }
    }

    return base;
}

function replacer(input, mappings) {
    return input.split('').map((letter) => {
        for (const mapping in mappings) {
            if (
                mapping && mapping !== mappings[mapping]
                && (
                    mapping === letter 
                    || mappings[mapping].indexOf(letter) !== -1
                )
            ) {
                letter = (
                    Array.isArray(mappings[mapping])
                    ? (mappings[mapping]).join('')
                    : `[${mappings[mapping]}]`
                );
                break;
            }
        }
        return letter;
    }).join('');
}

// Generate a function that returns a RegExp,
// that can be reused with the same options
function toRegex(options = {}) {
    let innerMappings = mergeMappings(
        typeof options.mappings === 'object'
        ? options.mappings
        : null
    );

    return (input) => {
        return new RegExp(
            replacer(input, innerMappings),
            typeof options.flags === 'string' ? options.flags : 'i'
        );
    }
}

// Generate a function that returns a string,
// that can be reused with the same options
function toString(options = {}) {
    let innerMappings = mergeMappings(
        typeof options.mappings === 'object'
        ? options.mappings
        : null
    );

    return (input) => {
        return replacer(input, innerMappings);
    }
}

module.exports = {
    toRegex, toString
}
