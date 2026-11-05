import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, usePermissions } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, DetailsBox, Pair } from '@mpieva/psydb-ui-layout';

const RecordDetails = (ps) => {
    var { id: studyEmailMetaTemplateId } = useParams();
    var { url } = useRouteMatch();
    var [{ translate }] = useI18N();
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyEmailMetaTemplate.read({ studyEmailMetaTemplateId })
    ), [ studyEmailMetaTemplateId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    var { state } = record;

    var canEdit = permissions.hasRecordAccess({
        record, collection: 'studyEmailMetaTemplate', level: 'write'
    });

    return (
        <DetailsBox
            title={ translate('Email Meta Template Details') }
            editUrl={ `${up(url, 1)}/edit` }
            canEdit={ canEdit }
            isRecordHidden={ state.systemPermissions.isHidden }
        >
            <Pair label={ translate('Template-Shorthand') }>
                { state.templateName }
            </Pair>
            <Pair label={ translate('Study Type') }>
                { record.studyType }
            </Pair>
            <Pair label={ translate('Subject Type') }>
                { record.subjectType }
            </Pair>
            <Pair label={ translate('Enabled') }>
                { translate(state.isEnabled ? 'Yes' : 'No') }
            </Pair>

            <hr />

            <Pair label={ translate('Mail Subject') }>
                { state.mailSubject }
            </Pair>
            <Pair label={ translate('Sender') }>
                { state.mailSender }
            </Pair>
            <Pair label={ translate('HTML Text') } textWrap='div'>
                <MailHTMLPreview html={ state.mailHTML } />
            </Pair>
            <Pair label={ translate('Attachments') }>
                <Attachments
                    items={ state.mailAttachments }
                    files={ related.files }
                />
            </Pair>
            <Pair label={ translate('Links') }>
                <PlainList items={ state.mailLinks } />
            </Pair>

            <hr />

            <Pair label={ translate('Record Access for') }>
                <AccessRights
                    items={ state.systemPermissions.accessRightsByResearchGroup }
                    labels={ related.relatedRecordLabels.researchGroup }
                />
            </Pair>
        </DetailsBox>
    );
}

// NOTE: rendering the stored html like the online survey mail preview
const MailHTMLPreview = (ps) => {
    var { html } = ps;
    return (
        <div
            className='bg-white border p-3'
            style={{ fontWeight: 'normal' }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

const Attachments = (ps) => {
    var { items, files = {} } = ps;
    if (items.length < 1) {
        return <None />
    }
    return items.map((it, ix) => {
        var file = files[it.fileId];
        return (
            <div key={ ix }>
                { it.label }
                {' '}
                <span className='text-muted' style={{ fontWeight: 'normal' }}>
                    ({ file ? file.originalFilename : it.fileId })
                </span>
            </div>
        )
    });
}

const AccessRights = (ps) => {
    var { items, labels = {} } = ps;
    var [{ translate }] = useI18N();
    return items.map((it, ix) => {
        var { researchGroupId, permission } = it;
        var label = labels[researchGroupId]?._recordLabel || researchGroupId;
        return (
            <div key={ ix }>
                { label } ({ translate(permission === 'write' ? 'Write' : 'Read') })
            </div>
        )
    });
}

const PlainList = (ps) => {
    var { items } = ps;
    if (items.length < 1) {
        return <None />
    }
    return items.map((it, ix) => <div key={ ix }>{ it }</div>);
}

const None = () => {
    var [{ translate }] = useI18N();
    return <i className='text-muted'>{ translate('None') }</i>
}

export default RecordDetails;
