import React from 'react';
import { useParams } from 'react-router';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend, useRevision } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Markdown, A4Wrapper }
    from '@mpieva/psydb-ui-layout';

import { ThemeProvider, useThemeContext } from '@mpieva/psydb-ui-lib/src/data-viewers/core/theme-context'; // XXX
import { CustomField } from '@mpieva/psydb-ui-lib/src/data-viewers/utility-components/custom-field'; // XXX
import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';

import FlagAndCommentForm from './flag-and-comment-form';
 
const RecordDetails = (ps) => {
    var { studyConsentDocId: props_studyConsentDocId } = ps;
    var { studyConsentDocId } = useParams();

    studyConsentDocId = props_studyConsentDocId || studyConsentDocId;

    var revision = useRevision();
    //var { studyConsentDocId } = ps;
    var [{ translate, language }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentDoc.read({ studyConsentDocId })
    ), [ studyConsentDocId, revision.value ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, subjectCRT } = fetched.data;
    return (
        <div>
            <ThemeProvider value={ Themes.HorizontalSplit }>
                <Metadata record={ record } revision={ revision } />
            </ThemeProvider>
            <hr />
            <div className='bg-white border'>
                <A4Wrapper className='bg-light border'>
                    <Inner record={ record } subjectCRT={ subjectCRT } />
                </A4Wrapper>
            </div>
        </div>
    )
}

const Inner = (ps) => {
    var { record, subjectCRT } = ps;
    subjectCRT = CRTSettings({ data: subjectCRT });

    var { elementValues, studyConsentFormSnapshot } = record.state;
    var { title, titleI18N, elements } = studyConsentFormSnapshot.state;

    return (
        <ThemeProvider value={ Themes.HorizontalSplit }>
            <div>
                <h1>{ titleI18N?.[language] || title }</h1>
                <hr />
                { elements.map((it, ix) => (
                    <ConsentDocElement
                        key={ ix }
                        { ...it }
                        value={ elementValues[ix] }
                        subjectCRT={ subjectCRT }
                    />
                )) }
            </div>
        </ThemeProvider>
    )
}

const Metadata = (ps) => {
    var { record, revision } = ps;
    var { _rohrpostMetadata, experimentId, personnelId, subjectId, state }
        = record;

    var { createdAt } = _rohrpostMetadata;
    var { hasIssue = 'unknown', comment = '' } = state;
    
    var [{ translate, fdatetime }] = useI18N();

    var context = useThemeContext();
    var { Field } = context;

    var send = useSend((formData) => ({
        type: 'study-consent-doc/flag-and-comment',
        payload: { _id: record._id, props: formData }
    }), { onSuccessfulUpdate: [ revision.up ] })

    return (
        <>
            <Field label={ translate('Subject ID') }>
                { subjectId }
            </Field>
            <Field label={ translate('Appointment ID') }>
                { experimentId || (
                    <span className='text-muted'>
                        { translate('Not Specified') }
                    </span>
                ) }
            </Field>
            <Field label={ translate('Personnel ID') }>
                { personnelId }
            </Field>
            <Field label={ translate('Timestamp') }>
                { fdatetime(createdAt) }
            </Field>
            <hr />
            <FlagAndCommentForm.Component
                initialValues={{ hasIssue, comment }}
                onSubmit={ send.exec }
            />
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
}

const HR = (ps) => {
    return <hr />
}

const Fallback = (ps) => {
    var { type } = ps;
    return `UNKNODNW ${type}`
}

RecordDetails.Inner = Inner; // FIXME: i dont like 'Inner' as a name
export default RecordDetails;
