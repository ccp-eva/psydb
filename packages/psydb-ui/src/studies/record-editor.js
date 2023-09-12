import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { only } from '@mpieva/psydb-core-utils';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useSendPatch } from '@mpieva/psydb-ui-hooks';
import { Pair } from '@mpieva/psydb-ui-layout';
import {
    withRecordEditor,
    GenericRecordEditorFooter
} from '@mpieva/psydb-ui-lib';
import MainForm from './main-form';


const EditForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record, crtSettings, related } = fetched;
    var { fieldDefinitions } = crtSettings;
    
    var { path, url } = useRouteMatch();
    
    var translate = useUITranslation();
    var permissions = usePermissions();

    var send = useSendPatch({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });
    
    var defaults = MainForm.createDefaults({
        fieldDefinitions,
        permissions
    });
    
    var initialValues = only({
        from: record.state,
        paths: [
            'name',
            'shorthand',
            'runningPeriod',
            'enableFollowUpExperiments',
            'researchGroupIds',
            'scientistIds',
            'studyTopicIds',

            'custom',
            'systemPermissions',
        ]
    });

    // FIXME: use deep merge
    initialValues = {
        ...defaults,
        ...initialValues,
        custom: {
            ...defaults.custom,
            ...initialValues.custom
        }
    }

    var {
        sequenceNumber,
        onlineId
    } = record;

    var renderedContent = (
        <>
            { sequenceNumber && (
                <Pair 
                    label={ translate('ID No.') }
                    wLeft={ 3 } wRight={ 9 } className='px-3'
                >
                    { sequenceNumber }
                </Pair>
            )}
            { sequenceNumber && (
                <hr />
            )}
            <MainForm.Component
                title={ translate('Edit Study') }
                crtSettings={ crtSettings }
                initialValues={ initialValues }
                onSubmit={ send.exec }
                related={ related }
                permissions={ permissions }
                renderFormBox={ false }
            />
            <hr />
            <GenericRecordEditorFooter.RAW
                id={ id }
                collection={ collection }
                recordType={ recordType }
                fetched={ fetched }
                permissions={ permissions } 

                enableHide={ false }
                enableRemove={ true }
                onSuccessfulUpdate={ () => {} }
           
                removeUrl={`${up(url, 2)}/remove`}
                className='d-flex justify-content-between mt-3 mb-3'
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});

export default RecordEditor;
