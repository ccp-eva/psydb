import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useFetch,
    useModalReducer,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

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

    var translate = useUITranslation();
    var permissions = usePermissions();
    var canWrite = permissions.hasCollectionFlag('study', 'write');

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

    var joinedShorthands = (
        excludedOtherStudyIds.length > 0
        ? (
            excludedOtherStudies
            .map(it => (
                `${it.state.shorthand}`
            ))
            .join(', ')
        )
        : translate('No other studies are excluded')
    );

    var renderedContent = (
        canWrite
        ? ( 
            <a
                className='btn btn-link m-0 p-0'
                onClick={ exclusionModal.handleShow }
            >
                <b>{ joinedShorthands }</b>
            </a>
        )
        : (
            <b>{ joinedShorthands }</b>
        )
    )

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

            <Pair label={ translate('Excluded Studies') }>
                { renderedContent }
            </Pair>
        </div>
    )
}

export default StudyExclusion;
