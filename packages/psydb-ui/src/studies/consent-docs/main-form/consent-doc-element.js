import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';

const ConsentDocElement = (ps) => {
    var { type } = ps;
    var ElementVariant = switchElementVariant(type);

    return (
        <ElementVariant { ...ps } />
    )
}

const switchElementVariant = (type) => {
    switch (type) {
        case 'info-text-markdown':
            return InfoTextMarkdown;
        case 'subject-field':
            return SubjectField;
        case 'extra-field':
            return ExtraField;
        case 'hr':
            return HR;
        default:
            return Fallback;
    }
}

const InfoTextMarkdown = (ps) => {
    var { markdown, markdownI18N } = ps;
    var [{ language }] = useI18N();

    return (
        <pre>
            { markdownI18N?.[language] || markdown }
        </pre>
    )
}

const SubjectField = (ps) => {
    var { pointer, subjectCRT } = ps;
    return pointer;
}

const ExtraField = (ps) => {
    var { systemType } = ps;
    return systemType;
}

const HR = (ps) => {
    return <hr />
}

const Fallback = (ps) => {
    var { type } = ps;
    return `UNKNODNW ${type}`
}

export default ConsentDocElement;
