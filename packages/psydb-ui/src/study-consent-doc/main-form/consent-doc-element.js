import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Markdown } from '@mpieva/psydb-ui-layout';
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
    var { index, markdown, markdownI18N } = ps;
    var [{ language }] = useI18N();

    return (
        <Markdown>
            { markdownI18N?.[language] || markdown }
        </Markdown>
    )
}

const SubjectField = (ps) => {
    var { index, pointer, subjectCRT, isRequired = false } = ps;
    var [{ translate }] = useI18N();
    
    var definition = subjectCRT.findOneCustomField({ 'pointer': pointer });

    if (!definition) {
        return <Alert variant='danger'>
            <b>ERROR: Could not find subject field for pointer { pointer }</b>
        </Alert>
    }

    var { systemType } = definition;
    var Component = Fields[systemType];
    return (
        <Component
            dataXPath={ `$.elementValues.${index}` }
            label={ translate.fieldDefinition(definition) }
            required={ isRequired }
        />
    )
}

const ExtraField = (ps) => {
    var {
        index, systemType,
        displayName, displayNameI18N,
        isRequired = false
    } = ps;

    var [{ language }] = useI18N();
    
    var Component = Fields[systemType];
    return (
        <Component
            dataXPath={ `$.elementValues.${index}` }
            label={ displayNameI18N?.[language] || displayName }
            required={ isRequired }
        />
    )
}

const HR = (ps) => {
    return <hr />
}

const Fallback = (ps) => {
    var { type } = ps;
    return `UNKNODNW ${type}`
}

export default ConsentDocElement;
