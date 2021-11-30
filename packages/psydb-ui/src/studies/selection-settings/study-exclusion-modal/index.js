import React, { useState } from 'react';

import { demuxed, arrify } from '@mpieva/psydb-ui-utils';
import { useSelectionReducer } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import { StudyTopicSelector } from './study-topic-selector';
import { AvailableStudies } from './available-studies';
import { ExcludedStudies } from './excluded-studies';

const checkEqual = (a,b) => ( a._id === b._id );

const StudyExclusionModalBody = (ps) => {
    var {
        studyId,
        excludedOtherStudyIds,
        studyTopicIds,

        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var [ selectedTopic, onSelectTopic ] = useState();
    var topicIdsSelection = useSelectionReducer({
        defaultSelection: studyTopicIds,
    });
    var excludedStudySelection = useSelectionReducer({
        defaultSelection: excludedOtherStudyIds.map(it => ({
            _id: it,
            _recordLabel: relatedRecordLabels.study[it]._recordLabel
        })),
        checkEqual
    });

    return (
        <div className='d-flex'>
            <div
                className='flex-grow d-flex flex-column'
                style={{ width: '33.333%' }}
            >
                <header className='mb-1 pb-1 border-bottom'>
                    <b>Themengbiete</b>
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
                    <b>Alle Studien</b>
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
                    <b>Ausgeschlossen</b>
                </header>
                <ExcludedStudies selection={ excludedStudySelection } />
            </div>
        </div>
    )
}

const StudyExclusionModal = WithDefaultModal({
    title: 'Studienausschluss',
    size: 'xl',

    Body: StudyExclusionModalBody
});

export default StudyExclusionModal;
