import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetchAll, useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import { RecordPicker } from '@mpieva/psydb-ui-lib';
import * as Controls from '@mpieva/psydb-ui-form-controls';

const ExperimentImportCreateForm = (ps) => {
    
    var triggerBag = only({ from: ps, keys: [
        'onSuccessfulUpdate',
        'onFailedUpdate'
    ]});

    var translate = useUITranslation();
    var [ studyType, setStudyType ] = useState();
    var [ studyRecord, setStudyRecord ] = useState();
    var [ subjectType, setSubjectType ] = useState();
    var [ csvImporter, setCSVImporter ] = useState();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        studyCRTs: agent.fetchAvailableCRTs({ collections: [ 'study' ]}),
    }), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { studyCRTs } = fetched._stageDatas;
    
    var showStudyTypeSelect = true;
    if (studyCRTs.length === 1) {
        showStudyTypeSelect = false;
        studyType = studyCRTs[0].getType()
    }

    return (
        <>
            { showStudyTypeSelect && (
                <FormHelpers.InlineWrapper
                    label={ translate('Study Type') }
                >
                    <Controls.GenericTypeKey
                        value={ studyType }
                        onChange={ setStudyType }
                        collection='study'
                    />
                </FormHelpers.InlineWrapper>
            )}
            { studyType && (
                <FormHelpers.InlineWrapper
                    label={ translate('Study') }
                >
                    <RecordPicker
                        value={ studyRecord }
                        onChange={ setStudyRecord }
                        collection='study'
                        recordType={ studyType }
                    />
                </FormHelpers.InlineWrapper>
            )}
            { studyRecord && (
                <FormHelpers.InlineWrapper
                    label={ translate('Subject Type') }
                >
                    <StudySubjectTypeSelect
                        value={ subjectType }
                        onChange={ setSubjectType }
                        studyId={ studyRecord._id }
                    />
                </FormHelpers.InlineWrapper>
            )}
            { subjectType && (
                <FormHelpers.InlineWrapper
                    label={ translate('Import Type') }
                >
                    <StudyCSVImporterSelect
                        value={ csvImporter }
                        onChange={ setCSVImporter }
                        studyId={ studyRecord._id }
                        subjectType={ subjectType }
                        importType='experiment'
                    />
                </FormHelpers.InlineWrapper>
            )}
        </>
    )
}

const StudyCSVImporterSelect = (ps) => {
    var { value, onChange, studyId, subjectType, importType } = ps;
    
    var translate = useUITranslation();
    var [ language ] = useUILanguage();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyEnabledCSVImporters({
            studyId, subjectType, importType
        })
    ), {
        dependencies: [ studyId, subjectType, importType ],
        extraEffect: (response) => {
            //var crts = response?.data?.data?.crts;
            //if (crts.items().length === 1) {
            //    onChange(crts.items()[0].getType());
            //}
        }
    });

    if (!didFetch) {
        return null;
    }

    var { csvImporters } = fetched.data;

    var options = {};
    for (var it of csvImporters) {
        options[it] = 'csvImporter_experiment_' + it;
    }
    return (
        <Controls.GenericEnum
            value={ value }
            onChange={ onChange }
            options={ translate.options(options) }
        />
    )
}

const StudySubjectTypeSelect = (ps) => {
    var { value, onChange, studyId } = ps;
    var [ language ] = useUILanguage();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchStudyEnabledSubjectCRTs({
            studyId
        })
    ), {
        dependencies: [ studyId ],
        extraEffect: (response) => {
            var crts = response?.data?.data?.crts;
            if (crts.items().length === 1) {
                onChange(crts.items()[0].getType());
            }
        }
    });

    if (!didFetch) {
        return null;
    }

    var { crts } = fetched.data;

    //if (crts.items().length === 1) {
    //    return null;
    //}

    return (
        <Controls.GenericEnum
            value={ value }
            onChange={ onChange }
            options={ crts.asOptions({ language }) }
        />
    )
}

export default ExperimentImportCreateForm;
