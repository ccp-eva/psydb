'use strict';
var debug = require('debug')('psydb:humankind-cronjobs:remapMailData');
var { sane, AdultFields, ChildFields } = require('../remappers');
var { RemapMailError, RemapPairError } = require('../errors');

var remapMailData = async (context, next) => {
    var { mail, languages, acquisitions } = context;
    var it = mail; // FIXME

    var { seq, pairs } = it;
    
    var adultData = {};
    var childrenData = [];
    
    var inAdultBlock = true;
    var childBlockFirstKey = undefined;
    var childBlockData = undefined;
    for (var [ ix, pair ] of pairs.entries()) {
        if ([
            //'Datenschspeicherung',
            //'Datenschutz',
            'Bitte tragen Sie das Ergebnis der Rechnung in das Feld ein.',
            'Datenschutz & Einwilligungserklärung',
        ].includes(pair.key)) {
            continue;
        }

        if (/Wieviele Kinder/.test(pair.key)) {
            inAdultBlock = false;
            childBlockFirstKey = pairs[ix + 1].key;
            debug({ childBlockFirstKey });
            continue;
        }
        else {
            debug(`raw pair is "${pair.key}" = "${pair.value}"`);

            if (pair.key === childBlockFirstKey) {
                debug("\n", 'found child block at', pair,)
                if (childBlockData) {
                    childrenData.push(childBlockData);
                }
                childBlockData = {};
            }

            var remapHandler, targetBucket;
            if (inAdultBlock || /Auf welchem/.test(pair.key)) {
                remapHandler = AdultFields[pair.key];
                targetBucket = adultData;
            }
            else {
                remapHandler = ChildFields[pair.key];
                targetBucket = childBlockData;
            }
            
            var errorBag = { mail: it, pair }
            if (!remapHandler) {
                throw new RemapMailError(errorBag);
            }
            var path, value;
            try {
                ({ path, value } = remapHandler(
                    sane(pair.value),
                    { languages, acquisitions, allPairs: pairs }
                ));
                debug(`   remapped: "${path}" = "${value}"`);
            } catch (e) {
                if (e instanceof RemapPairError) {
                    throw new RemapMailError(errorBag);
                }
                else {
                    throw e
                }
            }
            if (!path || !value) {
                throw new RemapMailError(errorBag);
            }
            targetBucket[path] = value;
        }
    }

    if (childBlockData) {
        childrenData.push(childBlockData);
    }

    it.adultData = adultData;
    it.childrenData = childrenData;

    await next();
}

module.exports = { remapMailData }
