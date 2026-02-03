'use strict';
//var { entries } = require('@mpieva/psydb-core-utils');
var PsyDBSchema = require('./psydb-schema');
var verifyPsyDBSchemaDeep = require('./verify-psydb-schema-deep');

// NOTE: manually we would have to do this:
//var AnyString = (keywords = {}) => {
//    var out = {}
//    out.createJSONSchema = () => jss.AnyString(keywords);
//    out.transformValue = (...args) => commonTransformers.scalar({
//        keywords,
//        args,
//    });
//
//    return out;
//}

var SchemaFactory = (bag) => {
    var {
        CLASS = PsyDBSchema,
        systemType: factorySystemType,
        JSONSchema, // json schema creator functio
        T, // e.g. commonTransformers.scalar
    } = bag;

    return (keywords = {}) => {
        if (!keywords.systemType && factorySystemType) {
            keywords.systemType = factorySystemType;
        }

        verifyPsyDBSchemaDeep({ keywords });
        return new CLASS({ keywords, JSONSchema, T })

        //var __SHARED_KEYWORD_REF = allKeywords;
        //return new PsyDBSchema({
        //    // FIXME: how can we make it so we can change the keywords
        //    // after creating the psydb-schema but before createJSONSchema()
        //    // or tranformValue is called and the act according to the
        //    // changed keywords?
        //    keywords: __SHARED_KEYWORD_REF,

        //    createJSONSchema: JSSWrapper({
        //        JSONSchema, keywords: __SHARED_KEYWORD_REF
        //    }),
        //    transformValue: (...args) => T({
        //        args, keywords: __SHARED_KEYWORD_REF
        //    }),
        //})
    }
};

var JSSWrapper = (bag) => {
    var { JSONSchema, keywords } = bag;

    var {
        // XXX: not sure if we want to pass to JSS
        anonT, anonKeep, anonTPrefix,
        
        properties, patternProperties,
        items, prefixItems,
        oneOf,
        
        //if: jssIF, then: jssTHEN, else: jssELSE,
        //not: jssNOT
        
        ...pass
    } = keywords;
    
    var createJSONSchema = () => {
        var nestedJSS = {};

        if (properties) {
            var bag = nestedJSS.properties = {};
            for (var [ k, mfs ] of entries(properties)) {
                bag[k] = mfs.createJSONSchema();
            }
        }
        if (patternProperties) {
            var bag = nestedJSS.patternProperties = {}
            for (var [ k, mfs ] of entries(patternProperties)) {
                bag[k] = mfs.createJSONSchema();
            }
        }

        if (items) {
            nestedJSS.items = items.createJSONSchema();
        }
        if (oneOf) {
            nestedJSS.oneOf = oneOf.map(
                it => it.createJSONSchema()
            );
        }

        return JSONSchema({ ...nestedJSS, ...pass });
    }

    return createJSONSchema;
}

module.exports = SchemaFactory;
