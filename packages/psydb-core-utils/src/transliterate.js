'use strict';

// this is equivalent to perl "tr///d"
const transliterate = (str, search, replace = '') => {
    var strChars = [ ...str ];
    var out = [ ...str ];
    
    for (let [ is, stringChar ] of strChars.entries()) {
        for (let [ ic, searchChar ] of [ ...search ].entries()) {
            if (stringChar === searchChar) {
                out[is] = replace.at(ic) || '';
                break;
            }
        }
    }

    return out.join('');
}

module.exports = transliterate;
