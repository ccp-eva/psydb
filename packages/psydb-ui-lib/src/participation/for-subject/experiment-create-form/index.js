import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import { RecordPicker } from '../../../pickers';
import ExperimentCreateForm from '../../for-study/experiment-create-form';


const Outer = (ps) => {
    var { subjectId, enableTeamSelect, onSuccessfulUpdate } = ps;
    var [ studyType, setStudyType ] = useState();
    var [ studyRecord, setStudyRecord ] = useState();

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection: 'study' })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var showStudyTypeSelect = true;
    if (fetched.data.length === 1) {
        showStudyTypeSelect = false;
        studyType = fetched.data[0].type
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
                <ExperimentCreateForm
                    preselectedSubjectId={ subjectId }
                    subjectsAreTestedTogetherOverride={ true }
                    studyId={ studyRecord._id }
                    enableTeamSelect={ true }
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
            )}
        </>
    )
}

export default Outer;
