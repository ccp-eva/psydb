import React from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair, FormBox } from '@mpieva/psydb-ui-layout';
import { withRecordEditor } from '../../lib';
import MainForm from '../main-form';
import { SequenceNumber, OnlineId, DuplicateInfo } from '../shared-static';

const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        permissions,
        send,

        renderFormBox = true,
        renderVisibilityButton = false,
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;

    var [{ translate }] = useI18N();

    var defaults = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });

    var initialValues = only({
        from: {
            gdpr: record.gdpr.state,
            scientific: record.scientific.state,
        },
        paths: [
            'gdpr.custom',
            'scientific.custom',
            'scientific.testingPermissions',
            'scientific.systemPermissions',
            'scientific.comment',
        ]
    });

    // FIXME: use deep merge
    // FIXME: we might als need to update all
    // db records, we'll see
    initialValues.gdpr.custom = {
        ...defaults.gdpr.custom,
        ...initialValues.gdpr.custom
    };
    
    initialValues.scientific.custom = {
        ...defaults.scientific.custom,
        ...initialValues.scientific.custom
    };

    var {
        showSequenceNumber,
        showOnlineId,
    } = crtSettings;

    var {
        sequenceNumber,
        onlineId
    } = record;
    
    var { isHidden } = record.scientific.state.systemPermissions;
    var { mergedDuplicates = [] } = record.scientific.state.internals;

    var renderedContent = (
        <div>
            { isHidden && (
                <>
                    <h5 className='text-muted'>
                        { translate('Hidden Record') }
                    </h5>
                    <hr />
                </>
            )}
            <SequenceNumber
                show={ showSequenceNumber }
                value={ sequenceNumber }
            />
            <OnlineId
                show={ showOnlineId }
                value={ onlineId }
            />
            <DuplicateInfo
                mergedDuplicates={ mergedDuplicates }
                showOnlineId={ showOnlineId }
                showSequenceNumber={ showSequenceNumber }
            />

            { (
                (showSequenceNumber && sequenceNumber)
                || (showOnlineId && onlineId)
            ) && (
                <hr />
            )}
            <MainForm.Component
                title={ translate('Edit Subject') }
                crtSettings={ crtSettings }
                initialValues={ initialValues }
                onSubmit={ send.exec }

                record={ record }
                related={ related }
                permissions={ permissions }

                renderFormBox={ false }
                renderVisibilityButton={ renderVisibilityButton }
            />
            { isHidden && (
                <>
                    <hr />
                    <h5 className='text-muted'>
                        { translate('Hidden Record') }
                    </h5>
                </>
            )}
        </div>
    );

    var renderedForm = (
        renderFormBox
        ? (
            <FormBox title={ translate('Edit Subject') }>
                { renderedContent }
            </FormBox>
        )
        : renderedContent
    );

    return (
        <>
            { renderedForm }
        </>
    )
}

export const RecordEditor = withRecordEditor({
    Body: EditForm,
    collection: 'subject',
    subChannels: [ 'gdpr', 'scientific' ],
    shouldFetchSchema: false,
});
