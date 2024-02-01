import React, { useState } from 'react';

import { demuxed, arrify } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSelectionReducer, useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';

import { StudyTopicSelector } from './study-topic-selector';
import { AvailableStudies } from './available-studies';
import { ExcludedStudies } from './excluded-studies';

const checkEqual = (a,b) => ( a._id === b._id );

const StudyExclusionModalBody = (ps) => {
    var {
        studyId,
        lastKnownEventId,
        excludedOtherStudies,
        studyTopicIds,

        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var translate = useUITranslation();

    var [ selectedTopic, onSelectTopic ] = useState();
    var topicIdsSelection = useSelectionReducer({
        defaultSelection: studyTopicIds,
    });
    var excludedStudySelection = useSelectionReducer({
        defaultSelection: excludedOtherStudies,
        checkEqual
    });

    var send = useSend(() => ({
        type: 'study/set-excluded-other-study-ids',
        payload: {
            id: studyId,
            lastKnownEventId,
            excludedOtherStudyIds: (
                excludedStudySelection.value.map(it => it._id)
            )
        }
    }), {
        onSuccessfulUpdate: demuxed([
            onSuccessfulUpdate,
            onHide
        ])
    })

    return (
        <div className='d-flex'>
            <div
                className='flex-grow d-flex flex-column'
                style={{ width: '33.333%' }}
            >
                <header className='mb-1 pb-1 border-bottom'>
                    <b>{ translate('Study Topics') }</b>
                </header>
                <StudyTopicSelector
                    studyTopicIds={ studyTopicIds }
                    selectedTopicIds={ topicIdsSelection.value }
                    onSelect={ (records) => {
                        if (records) {
                            records = arrify(records);
                            topicIdsSelection.toggle(
                                records.map(it => it._id)
                            );
                        }
                    }}
                    onReset={ (ids = []) => (
                        topicIdsSelection.set(ids) 
                    )}
                />
            </div>

            <div
                className='flex-grow d-flex flex-column ml-3'
                style={{ width: '33.333%' }}
            >
                <header className='mb-1 pb-1 border-bottom'>
                    <b>{ translate('All Studies') }</b>
                </header>
                <AvailableStudies
                    excludedStudyIds={[
                        studyId,
                        ...excludedStudySelection.value.map(it => it._id)
                    ]}
                    selectedTopicIds={ topicIdsSelection.value }
                    onSelect={ excludedStudySelection.add }
                />
            </div>
            
            <div
                className='flex-grow d-flex flex-column ml-3'
                style={{ width: '33.333%' }}
            >
                <header className='mb-1 pb-1 border-bottom'>
                    <b>{ translate('Excluded') }</b>
                </header>
                <ExcludedStudies
                    records={ excludedStudySelection.value }
                    onSelect={ excludedStudySelection.remove }
                />
                <div className='d-flex justify-content-end mt-1'>
                    <Button onClick={ send.exec }>
                        { translate('Save') }
                    </Button>
                </div>
            </div>
        </div>
    )
}

const StudyExclusionModal = WithDefaultModal({
    title: 'Study Exclusion',
    size: 'xl',

    Body: StudyExclusionModalBody
});

export default StudyExclusionModal;
