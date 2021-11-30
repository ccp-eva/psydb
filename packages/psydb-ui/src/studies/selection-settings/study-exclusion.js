import React from 'react';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Pair } from '@mpieva/psydb-ui-layout';

import StudyExclusionModal from './study-exclusion-modal';

const StudyExclusion = (ps) => {
    var {
        studyId,
        studyType,
        studyRecord,
        studyRelated,

        onSuccessfulUpdate,
    } = ps;

    //var { studyTopicIds, internals = {} } = studyRecord.state;
    //var { excludedOtherStudyIds = [] } = internals;
    var { studyTopicIds, excludedOtherStudyIds } = studyRecord.state;
    var { relatedRecordLabels } = studyRelated;

    var exclusionModal = useModalReducer();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.getAxios().post('/api/search-studies-for-exclusion', {
            studyIds: excludedOtherStudyIds
        })
    }, [ excludedOtherStudyIds ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records: excludedOtherStudies } = fetched.data;

    return (
        <div>
            <StudyExclusionModal { ...({
                ...exclusionModal.passthrough,
                //show: true,
                studyId,
                studyType,
                lastKnownEventId: studyRecord._lastKnownEventId,
                excludedOtherStudies,
                studyTopicIds,
                onSuccessfulUpdate,
            })} />

            <Pair label='Studien-Ausschluss'>
                <a
                    className='btn btn-link m-0 p-0'
                    onClick={ exclusionModal.handleShow }
                >
                    <b>
                        { excludedOtherStudyIds.length > 0
                            ? (
                                excludedOtherStudies
                                .map(it => (
                                    `${it.state.shorthand}`
                                ))
                                .join(', ')
                            )
                            : 'Keine anderen Studien ausgeschlossen'
                        }
                    </b>
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
