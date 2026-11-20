'use strict';
var datefns = require('date-fns');
var { de: deLocale, enUS: enLocale } = require('date-fns/locale');

var { groupBy } = require('@mpieva/psydb-core-utils');
var { createTranslate } = require('@mpieva/psydb-common-lib');
var { swapTimezone, getSystemTimezone }
    = require('@mpieva/psydb-timezone-helpers');

var locales = { de: deLocale, en: enLocale };

// NOTE: en uses month names to avoid US/GB day-month ambiguity
// TODO: maybe add a server locale or config locale instead of
// hardcoding formats per language
var formats = { de: 'P p', en: 'MMM do, yyyy HH:mm' };

// NOTE: appends/prepends i.e. [Telefon 04.03.2026 09:15: "some comment"]
// to the subjects comment for each contact history item with a comment;
// options: 'append' | 'prepend' | true | { mode, language }
// true means 'append'; language defaults to 'en'
var injectCommentsIntoSubjects = async (bag) => {
    var { db, dispatchProps, items, timezone, options = true } = bag;
    var { mode, language } = normalizeOptions(options);

    var translate = createTranslate(language);
    var locale = locales[language];
    var serverTimezone = getSystemTimezone();

    var withComment = items.filter(it => it.parts.state.comment);
    var itemsForSubject = groupBy({
        items: withComment,
        createKey: (it) => String(it.parts.core.subjectId),
    });

    for (var group of Object.values(itemsForSubject)) {
        var { subjectId } = group[0].parts.core;
        var subject = await db.collection('subject').findOne(
            { _id: subjectId },
            { projection: { 'scientific.state.comment': true }}
        );

        var sorted = [ ...group ].sort((a, b) => (
            a.parts.core.contactedAt - b.parts.core.contactedAt
        ));

        var lines = sorted.map(it => {
            var { type, contactedAt } = it.parts.core;
            var { comment } = it.parts.state;

            var localDate = swapTimezone({
                date: contactedAt,
                sourceTZ: timezone,
                targetTZ: serverTimezone,
            });
            var formatted = datefns.format(localDate, formats[language], { locale });
            var label = translate(`_subjectContactType_${type}`);

            return `[${label} ${formatted}: "${comment}"]`;
        });

        var current = subject.scientific.state.comment || '';
        // NOTE: prepend puts newest first, append puts newest last
        var comment = (
            mode === 'prepend'
            ? [ ...lines.reverse(), current ]
            : [ current, ...lines ]
        ).filter(Boolean).join('\n');

        await dispatchProps({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            props: { comment },
        });
    }
}

var normalizeOptions = (options) => {
    var { mode = 'append', language = 'en' } = (
        typeof options === 'object' && options !== null
        ? options
        : { mode: options === true ? 'append' : options }
    );
    if (![ 'append', 'prepend' ].includes(mode)) {
        throw new Error(`unknown inject mode "${mode}"`);
    }
    if (!locales[language]) {
        throw new Error(`unknown inject language "${language}"`);
    }
    return { mode, language };
}

module.exports = injectCommentsIntoSubjects;
