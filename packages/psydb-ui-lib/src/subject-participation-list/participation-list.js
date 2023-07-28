import React from 'react';
import {
    Table,
    SortableTH,
    StudyIconButton,
    ExperimentIconButton,
    EditIconButtonInline,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    useModalReducer,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import datefns from '../date-fns';
import calculateAge from '../calculate-age';

import FieldDataHeadCols from '../record-list/field-data-head-cols';
import FieldDataBodyCols from '../record-list/field-data-body-cols';

import {
    EditModal,
    RemoveModal
} from '../participation';

import TimestampAndMaybeAge from './timestamp-and-maybe-age';

const ParticipationList = ({
    sorter,
    subjectId,
    subjectType,
    subjectRecord,

    studyType,
    ageFrameField,
    ageFrameFieldValue,

    participation,
    studyRecordsById,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,

    onSuccessfulUpdate,
    enableItemFunctions,
}) => {
    var editModal = useModalReducer();
    var removeModal = useModalReducer();
    return (
        <>
            <EditModal
                { ...editModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <RemoveModal
                { ...removeModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Table className='bg-white border'>
                <thead>
                    <tr>
                        {/*<FieldDataHeadCols
                            displayFieldData={ displayFieldData }
                        />*/}
                        <SortableTH
                            label='Studie'
                            sorter={ sorter }
                            path='study.shorthand'
                        />
                        <SortableTH
                            label='Zeitpunkt'
                            sorter={ sorter }
                            path='timestamp'
                        />
                        { ageFrameField && (
                            <th>Alter</th>
                        )}
                        <SortableTH
                            label='Status'
                            sorter={ sorter }
                            path='status'
                        />
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        participation
                        .map((it, index) => (
                            <ParticipationListRow { ...({
                                key: index,
                                item: it,

                                subjectId,
                                subjectType,
                                subjectRecord,

                                studyType,
                                ageFrameField,
                                ageFrameFieldValue,
                                
                                studyRecordsById,
                                relatedRecordLabels,
                                relatedHelperSetItems,
                                relatedCustomRecordTypeLabels,
                                displayFieldData,

                                onEdit: editModal.handleShow,
                                onRemove: removeModal.handleShow,
                                
                                enableItemFunctions,
                            }) } />
                        ))
                    }
                </tbody>
            </Table>
        </>
    )
}

const ParticipationListRow = (ps) => {
    var {
        subjectRecord,

        item: participationData,

        studyType,
        ageFrameField,
        ageFrameFieldValue,
        studyRecordsById,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        displayFieldData,

        onEdit,
        onRemove,
        
        enableItemFunctions: showItemFunctions,
    } = ps;

    var { _id: subjectId, type: subjectType } = subjectRecord;

    var permissions = usePermissions();

    var showEdit = permissions.hasFlag('canWriteParticipation');
    var showRemove = permissions.hasFlag('canWriteParticipation');

    var {
        type: participationType,
        status: participationStatus,
        experimentId,
        studyId,
        studyType,
        timestamp,
    } = participationData;

    var hasExperiment = ( participationType !== 'manual' && experimentId );
    var enableEdit = (
        participationStatus === 'participated'
        && (!hasExperiment || permissions.isRoot())
    );
    var enableRemove = ( !hasExperiment || permissions.isRoot() );

    return (
        <tr>
            <td>{ studyRecordsById[studyId]?.state.shorthand || studyId  }</td>
            <TimestampAndMaybeAge { ...({
                timestamp,
                record: subjectRecord,
                dateOfBirthField: ageFrameField
            })} />

            <td>
                { formatStatus(participationData.status) }
            </td>
            { showItemFunctions ? (
                <td className='d-flex justify-content-end'>
                    { hasExperiment && (
                        <ExperimentIconButton to={
                            `/experiments/${participationType}/${experimentId}`
                        } />
                    )}
                    <StudyIconButton
                        to={`/studies/${studyType}/${studyId}`}
                    />
                    { showEdit && (
                        <EditIconButtonInline
                            onClick={ () => onEdit({
                                subjectId, subjectType,
                                ...participationData
                            }) }
                            disabled={ !enableEdit }
                        />
                    )}
                    { showRemove && (
                        <RemoveIconButtonInline
                            onClick={ () => onRemove({
                                ...participationData
                            }) }
                            disabled={ !enableRemove }
                        />
                    )}
                </td>
            ) : (
                <td></td>
            )}
        </tr>
    );
}

var formatStatus = (status) => {
    return {
        'unknown': 'unb.',
        'participated': 't.g.',
        'didnt-participate': 'n.t.g.',
        'showed-up-but-didnt-participate': 'gek.',
        'didnt-show-up': 'n. gek.',
        'canceled-by-participant': 'abg.',
        'canceled-by-institute': 'ausg.',
    }[status] || 'ERROR'
}

export default ParticipationList;
