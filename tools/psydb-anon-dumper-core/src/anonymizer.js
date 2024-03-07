'use strict';
var { crc32, faker } = require('./externals');

var Anonymizer = (bag = {}) => {
    var {
        hooks,
        setupCache = () => ({}),
    } = bag;

    var anoncache = {};
    var out = { hooks };
    
    var baseSeed = 0;
    out.seed = (n) => {
        baseSeed = n;
    }
    var shouldReseedProperties = true;
    out.disablePropertyReseed = () => {
        shouldReseedProperties = false;
    }
    
    out.setupCache = (bag) => setupCache({ anoncache, ...bag });

    out.anonymize = ({ keywords, root, value, path }) => {
        //console.log({ keywords, value });
        //console.log({ path });
       
        // FIXME: not sure if we always want that
        if (value === undefined) {
            return { shouldStore: false };
        }

        var { anonKeep, anonT } = keywords;

        
        if (anonT) {
            anonKeep = true;
        }

        if (anonKeep === true) {
            if (anonT) {
                // NOTE: changing this will lead to completely
                // different anonymized values
                if (shouldReseedProperties) {
                    var strpath = path.map(({ key }) => key).join('/');
                    var hash = crc32(String(baseSeed) + strpath);
                    faker.seed(hash);
                }

                var lambda = hooks[anonT];
                if (typeof lambda !== 'function') {
                    throw new Error(`no hook function for anonT "${anonT}"`);
                }

                var anonvalue = lambda({ root, value, anoncache, path });
                if (anonvalue === undefined) {
                    return { shouldStore: false };
                }
                else {
                    return { shouldStore: true, value: anonvalue };
                }
            }
            else {
                return { shouldStore: true, value };
            }
        }
        else {
            //if (path.length < 1) {
            //    console.log({ keywords, value });
            //}
            // FIXME: id like have an option (e.e.warnNoKeep) for warning
            // about anonKeep being falsy, bit we dont have the path or
            // anything to indicate what we skipped 
            // NOTE: we have the path now
            // XXX: scalar keywords are missing?
            // FIXME: also should mf schema and jss schema keywords
            // be seperated ? we probably dont want anonKeep etc
            // in jss
            if (
                anonKeep !== false
                && path.length > 0 // FIXME: why skip root manually?
                && path.slice(-1)[0].type !== 'array'
                && path.slice(-1)[0].type !== 'object'
            ) {
                console.log({ keywords, value });
                console.log({ path });
                console.warn(
                    'skipping path', path.map(t => t.key).join('.')
                );
                throw new Error();
            }
            return { shouldStore: anonKeep };
        }
    }
    return out;
}

module.exports = Anonymizer;
