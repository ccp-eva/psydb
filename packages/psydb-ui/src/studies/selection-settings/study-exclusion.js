import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Pair } from '@mpieva/psydb-ui-layout';

import StudyExclusionModal from './study-exclusion-modal';

const StudyExclusion = (ps) => {
    var {
        studyId,
        studyType,
        studyRecord,
        studyRelated,

        onSuccessfulUpdate,
    } = ps;

    var { excludedOtherStudyIds, studyTopicIds } = studyRecord.state;
    var { relatedRecordLabels } = studyRelated;

    var exclusionModal = useModalReducer();

    return (
        <div>
            <StudyExclusionModal { ...({
                ...exclusionModal.passthrough,
                show: true,
                studyId,
                studyType,
                excludedOtherStudyIds,
                studyTopicIds,
            })} />

            <Pair label='Studien-Ausschluss'>
                <a
                    className='btn btn-link m-0 p-0'
                    onClick={ exclusionModal.handleShow }
                >
                    <b>Kein Ausschluss</b>
                    { /*<b>
                        { studyTopicIds.map(it => (
                            relatedRecordLabels.studyTopic[it]._recordLabel
                        )).join(',') }
                    </b> */}
                </a>
            </Pair>
        </div>
    )
}

export default StudyExclusion;
