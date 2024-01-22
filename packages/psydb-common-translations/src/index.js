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

var createTranslate = (lang = 'en') => {
    var _translate = (template, props) => translate(lang, template, props);
    _translate.options = (options) => translate.options(lang, options);

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
