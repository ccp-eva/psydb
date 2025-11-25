import React from 'react';
import { useParams } from 'react-router';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Markdown } from '@mpieva/psydb-ui-layout';

import { ThemeProvider, useThemeContext } from '@mpieva/psydb-ui-lib/src/data-viewers/core/theme-context'; // XXX
import { CustomField } from '@mpieva/psydb-ui-lib/src/data-viewers/utility-components/custom-field'; // XXX
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';
 
const RecordDetails = (ps) => {
    var { studyConsentDocId } = useParams();
    //var { studyConsentDocId } = ps;
    var [{ translate, language }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentDoc.read({ studyConsentDocId })
    ), [ studyConsentDocId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, subjectCRT } = fetched.data;
    subjectCRT = CRTSettings({ data: subjectCRT });

    var { elementValues, studyConsentFormSnapshot } = record.state;
    var { title, titleI18N, elements } = studyConsentFormSnapshot.state;

    return (
        <ThemeProvider value={ Themes.HorizontalSplit }>
            <div>
                <Metadata record={ record } />
                <hr />
                <h1>{ titleI18N?.[language] || title }</h1>
                <hr />
                { elements.map((it, ix) => (
                    <ConsentDocElement
                        { ...it } key={ ix }
                        value={ elementValues[ix] } subjectCRT={ subjectCRT }
                    />
                )) }
            </div>
        </ThemeProvider>
    )
}

const Metadata = (ps) => {
    var { record } = ps;
    var { _rohrpostMetadata } = record;
    var { createdAt } = _rohrpostMetadata;
    
    var [{ translate, fdatetime }] = useI18N();

    var context = useThemeContext();
    var { Field } = context;

    return (
        <>
            <Field label={ translate('Timestamp') }>
                { fdatetime(createdAt) }
            </Field>
        </>
    )
}

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
        <Markdown>
            { markdownI18N?.[language] || markdown }
        </Markdown>
    )
}

const SubjectField = (ps) => {
    var { value, pointer, subjectCRT } = ps;
    var [{ translate }] = useI18N();
    
    var definition = subjectCRT.findOneCustomField({ 'pointer': pointer });

    if (!definition) {
        return <Alert variant='danger'>
            <b>ERROR: Could not find subject field for pointer { pointer }</b>
        </Alert>
    }

    return (
        <CustomField definition={ definition } value={ value } />
    )

    //var { systemType } = definition;
    //var Component = Fields[systemType];
    //return (
    //    <Component
    //        dataXPath={ `$.elementValues.${index}` }
    //        label={ translate.fieldDefinition(definition) }
    //    />
    //)
}

const ExtraField = (ps) => {
    var { value, systemType, displayName, displayNameI18N, props } = ps;
    var [{ language }] = useI18N();

    var definition = {
        type: systemType, displayName, displayNameI18N, props
    };
    return (
        <CustomField definition={ definition } value={ value } />
    )
    
    //var Component = Fields[systemType];
    //return (
    //    <Component
    //        dataXPath={ `$.elementValues.${index}` }
    //        label={ displayNameI18N?.[language] || displayName }
    //    />
    //)
}

const HR = (ps) => {
    return <hr />
}

const Fallback = (ps) => {
    var { type } = ps;
    return `UNKNODNW ${type}`
}

export default RecordDetails;
