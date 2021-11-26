import React, { useState } from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSelectionReducer } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import { StudyTopicSelector } from './study-topic-selector';
import { AvailableStudies } from './available-studies';
import { ExcludedStudies } from './excluded-studies';

const checkEqual = (a,b) => ( a._id === b._id );

const StudyExclusionModalBody = (ps) => {
    var {
        studyId,
        studyType,
        excludedOtherStudyIds,
        studyTopicIds,

        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var [ selectedTopic, onSelectTopic ] = useState();
    var excludedStudySelection = useSelectionReducer({
        defaultSelection: excludedOtherStudyIds.map(it => ({
            _id: it,
            _recordLabel: relatedRecordLabels.study[it]._recordLabel
        })),
        checkEqual
    });

    return (
        <div className='d-flex'>
            <div className='flex-grow' style={{ width: '33.333%' }}>
                <header className='mb-1 pb-1 border-bottom'>
                    <b>Themengbiete</b>
                </header>
                <StudyTopicSelector
                    onSelect={ onSelectTopic }
                    selectedTopicId={ selectedTopic && selectedTopic._id }
                />
            </div>
            <div className='flex-grow ml-3' style={{ width: '33.333%' }}>
                <header className='mb-1 pb-1 border-bottom'>
                    <b>Alle Studien</b>
                </header>
                <AvailableStudies
                    studyType={ studyType }
                    selectedTopicId={ selectedTopic && selectedTopic._id }
                    onSelect={ excludedStudySelection.add }
                />
            </div>
            <div className='flex-grow ml-3' style={{ width: '33.333%' }}>
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
