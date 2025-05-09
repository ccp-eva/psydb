'use strict';
var render = require('es6-template-strings');
var { keyBy } = require('@mpieva/psydb-core-utils');
var maps = require('./phrases');

var byInternal = keyBy({
    items: maps.filter(it => it.internal),
    byProp: 'internal',
});

var byEN = keyBy({
    items: maps.filter(it => it.en),
    byProp: 'en',
});

var translate = (lang = 'en', template, props) => {
    var map = byInternal[template] || byEN[template];
    //var map = maps.find(it => (
    //    it.internal === template || it.en === template
    //));

    var translatedTemplate = map && map[lang];
    if (translatedTemplate) {
        return render(translatedTemplate, props);
    }
    else {
        return render('[!! ' + template + ' !!]', props);
        // FIXME: temp compat
        //return render(template, props);
    }
}

translate.options = (lang, options) => (
    Object.keys(options).reduce((acc, key) => ({
        ...acc, [key]: translate(lang, options[key])
    }), {})
);

translate.crt = (lang = 'en', crt) => {
    var base = crt;
    var base = (
        crt.state // detect crt records
        ? crt.state
        : crt.getRaw // detect wrapped crts
            ? crt.getRaw()
            : crt
    );

    return (
        base.displayNameI18N?.[lang] || base.label
    );
}

var createTranslate = (lang = 'en') => {
    var _translate = (template, props) => translate(lang, template, props);
    _translate.options = (options) => translate.options(lang, options);
    _translate.langCode = lang;

    // FIXME: i would like to unify that unter translate.displayNameI18N;
    _translate.fieldDefinition = (def) => (
        def.displayNameI18N?.[lang] || def.displayName
    );
    _translate.crt = (crt) => (
        translate.crt(lang, crt)
    );
    _translate.helperSet = (record) => (
        record.state.displayNameI18N?.[lang] || record.state.label
    );

    // FIXME: that dsoenst work with GenericEnum
    // and simply shallow cloning doenst wont work either i think
    // maybe we can add mapping prop
    //translate.enum = (enumeration) => {
    //    return {
    //        keys: enumeration.keys,
    //        labels: enumeration.labels.map(it => translate(label))
    //    }
    //};

    return _translate;
}

module.exports = { translate, createTranslate }
