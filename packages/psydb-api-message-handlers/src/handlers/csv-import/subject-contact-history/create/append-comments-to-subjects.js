'use strict';
var datefns = require('date-fns');
var { de: deLocale, enUS: enLocale } = require('date-fns/locale');

var { groupBy } = require('@mpieva/psydb-core-utils');
var { createTranslate } = require('@mpieva/psydb-common-lib');
var { swapTimezone, getSystemTimezone }
    = require('@mpieva/psydb-timezone-helpers');

var locales = { de: deLocale, en: enLocale };

// NOTE: appends i.e. [E-Mail 04.03.2026 09:15: "some comment"]
// to the subjects comment for each contact history item with a comment
var appendCommentsToSubjects = async (bag) => {
    var { db, dispatchProps, items, language, timezone } = bag;

    var translate = createTranslate(language);
    var locale = locales[language] || enLocale;
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
            var formatted = datefns.format(localDate, 'P p', { locale });
            var label = translate(`_subjectContactType_${type}`);

            return `[${label} ${formatted}: "${comment}"]`;
        });

        var current = subject.scientific.state.comment || '';
        var comment = [ current, ...lines ].filter(Boolean).join('\n');

        await dispatchProps({
            collection: 'subject',
            channelId: subjectId,
            subChannelKey: 'scientific',
            props: { comment },
        });
    }
}

module.exports = appendCommentsToSubjects;
