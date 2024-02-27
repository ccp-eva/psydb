import React, { useState } from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetchAll } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, FormHelpers } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

import { RecordPicker } from '../../../pickers';
import ExperimentCreateForm from '../../for-study/experiment-create-form';


const Outer = (ps) => {
    var { subjectId, enableTeamSelect, onSuccessfulUpdate } = ps;
    var [ studyType, setStudyType ] = useState();
    var [ studyRecord, setStudyRecord ] = useState();

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        studyCRTs: agent.fetchCollectionCRTs({ collection: 'study' }),
        subject: agent.readRecord({ collection: 'subject', id: subjectId  }),
    }), [ subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { studyCRTs, subject } = fetched._stageDatas;

    var showStudyTypeSelect = true;
    if (studyCRTs.length === 1) {
        showStudyTypeSelect = false;
        studyType = studyCRTs[0].type
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
                    preselectedSubject={ subject.record }

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
