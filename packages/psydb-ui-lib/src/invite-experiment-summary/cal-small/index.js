import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { ColoredBox } from '@mpieva/psydb-ui-layout';

import ExperimentDropdown from '../../experiment-dropdown';

import {
    MoveExperimentModal,
    ChangeTeamModal,
} from '../../modals';

import {
    CalItemInterval,
    CalItemPair,
    SubjectListContainer,
    PostprocessingStatus
} from '../shared';

const ExperimentSummarySmall = (ps) => {
    var {
        experimentRecord,

        experimentRelated,
        experimentOperatorTeamRecords,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,

        showPast,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();

    var moveExperimentModal = useModalReducer();
    var changeTeamModal = useModalReducer();

    var { type: inviteType } = experimentRecord;
    var { state: {
        studyId,
        locationId,
        interval: { start, end },
        subjectData,
        experimentOperatorTeamId,
        isPostprocessed,
    }} = experimentRecord;

    var teamRecord = experimentOperatorTeamRecords.find(it => (
        it._id === experimentOperatorTeamId
    ));
    
    var isInPast = new Date().getTime() > new Date(end).getTime();
    var hasProcessedSubjects = !!subjectData.find(
        it => it.participationStatus !== 'unknown'
    );
    var isPlaceholder = subjectData.length < 1;

    // TODO: we might also want to send a flag to api
    // so we dont fetch data of those at all
    if (!showPast && isInPast && (isPlaceholder || isPostprocessed)) {
        return null;
    }

    var _related = experimentRelated.relatedRecordLabels;

    return (
        <ColoredBox
            className='pl-2 pr-2 pb-1 pt-1 mb-2'
            bg={ teamRecord.state.color }
        >
            <MoveExperimentModal { ...({
                show: moveExperimentModal.show,
                onHide: moveExperimentModal.handleHide,
                payloadData: moveExperimentModal.data,

                shouldFetch: true,
                experimentId: experimentRecord._id,
                experimentType: inviteType,

                onSuccessfulUpdate,
            }) } />

            <ChangeTeamModal { ...({
                show: changeTeamModal.show,
                onHide: changeTeamModal.handleHide,
                payloadData: changeTeamModal.data,

                experimentType: inviteType,
                experimentId: experimentRecord._id,
                studyId: experimentRecord.state.studyId,
                currentTeamId: experimentRecord.state.experimentOperatorTeamId,

                onSuccessfulUpdate,
            }) } />


            <CalItemInterval start={ start } end={ end } />
            
            { isPlaceholder ? (
                <small className='d-block'>
                    { translate('Placeholder') }
                </small>
            ) : (
                <PostprocessingStatus
                    shouldPostprocess={ isInPast }
                    isPostprocessed={ isPostprocessed }
                    hasProcessedSubjects={ hasProcessedSubjects }
                />
            )}

            <CalItemPair
                label={ translate('Room') }
                extraClassName='mt-2'
            >
                { _related.location[locationId]._recordLabel }
            </CalItemPair>

            <SubjectListContainer label={ translate('Subjects') }>
                { 
                    subjectData
                    .filter(it => (
                        ![
                            'canceled-by-participant',
                            'canceled-by-institute',
                            'deleted-by-institute'
                        ].includes(it.participationStatus)
                    ))
                    .map(it => (
                        <SubjectItem { ...({
                            inviteType,
                            key: it.subjectId,
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
    
                            experimentRecord,
                            experimentRelated,
                        }) } />
                    ))
                }
            </SubjectListContainer>
            
            <CalItemPair
                label={ translate('Team') }
                extraClassName='mt-3'
            >
                { teamRecord.state.name }
            </CalItemPair>
            
            <CalItemPair
                label={ translate('Study') }
                extraClassName=''
            >
                { _related.study[studyId]._recordLabel }
            </CalItemPair>

            <div className='mt-1 d-flex justify-content-end'>
                <ExperimentDropdown { ...({
                    experimentType: inviteType,
                    variant: 'calendar',
                    detailsLink: `/experiments/${inviteType}/${experimentRecord._id}`,
                    onClickMove: moveExperimentModal.handleShow,
                    onClickChangeTeam: changeTeamModal.handleShow
                })} />
            </div>
        </ColoredBox>
    )
}

const SubjectItem = ({
    inviteType,
    subjectDataItem,
    subjectRecordsById,
    subjectRelated,
    subjectDisplayFieldData,
    phoneListField,
    
    experimentRecord,
    experimentRelated,

    onChangeStatus,
}) => {
    var {
        subjectId,
        invitationStatus,
    } = subjectDataItem;

    return (
        <li>
            <span style={{ position: 'relative', left: '-5px' }}>
                { experimentRelated.relatedRecordLabels.subject[subjectId]._recordLabel }
            </span>
        </li>
    )
}


export default ExperimentSummarySmall;
