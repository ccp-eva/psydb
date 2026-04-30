import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { only } from '@mpieva/psydb-core-utils';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useSend } from '@mpieva/psydb-ui-hooks';
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

    var {
        record, crtSettings, related,
        studyRoadmap, /*studyRoadmapHistory*/
    } = fetched.data;

    var { path, url } = useRouteMatch();
    
    var { dev_enableWKPRCPatches, dev_enableStudyRoadmap } = useUIConfig();
    var permissions = usePermissions();
    var [{ translate }] = useI18N();

    var send = useSend((formData) => {
        var { studyRoadmap, ...props } = formData;
        return { type: 'study/patch', payload: {
            _id: record._id,
            props,

            ...(dev_enableStudyRoadmap && {
                studyRoadmap
            })
        }}
    }, { onSuccessfulUpdate });
 
    var defaults = MainForm.createDefaults({
        fieldDefinitions: crtSettings.fieldDefinitions,
        permissions
    });
   
    var paths = [
        'name',
        'shorthand',
        'runningPeriod',
        'enableFollowUpExperiments',
        'researchGroupIds',
        'scientistIds',
        'studyTopicIds',

        'custom',
        'systemPermissions',
    ];

    if (dev_enableWKPRCPatches) {
        paths = paths.filter(it => (![ 'shorthand' ].includes(it)));
        paths.push('experimentNames');
    }

    var initialValues = only({
        from: record.state,
        paths: paths
    });

    // FIXME: use deep merge
    initialValues = {
        ...defaults,
        ...initialValues,
        custom: {
            ...defaults.custom,
            ...initialValues.custom
        },
        studyRoadmap: { props: studyRoadmap?.state || {}}
    }

    var { sequenceNumber } = record;

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
                permissions={ permissions }
                renderFormBox={ false }
                related={ related }
                studyRoadmap={ studyRoadmap }
            />
            <hr />
            <GenericRecordEditorFooter.RAW
                id={ id }
                collection={ collection }
                recordType={ recordType }
                fetched={ fetched.data }
                permissions={ permissions } 

                enableHide={ false }
                enableRemove={ true }
                onSuccessfulUpdate={ () => {} }
           
                removeUrl={`${up(url, 2)}/remove`}
                className='d-flex justify-content-between mt-3'
            />
        </>
    );

    return (
        <div className='mt-3'>
            { renderedContent }
        </div>
    );
}

export const RecordEditor = withRecordEditor({
    EditForm,
    shouldFetchSchema: false,
});
