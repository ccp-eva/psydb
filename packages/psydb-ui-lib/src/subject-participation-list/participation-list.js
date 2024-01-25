import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    useModalReducer,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    SortableTH,
    StudyIconButton,
    ExperimentIconButton,
    EditIconButtonInline,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import calculateAge from '../calculate-age';

import FieldDataHeadCols from '../record-list/field-data-head-cols';
import FieldDataBodyCols from '../record-list/field-data-body-cols';

import {
    EditModal,
    RemoveModal
} from '../participation/for-subject';

import TimestampAndMaybeAge from './timestamp-and-maybe-age';

const ParticipationList = (ps) => {
    var {
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
    } = ps;

    var translate = useUITranslation();
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
                            label={ translate('Study') }
                            sorter={ sorter }
                            path='study.shorthand'
                        />
                        <SortableTH
                            label={ translate('Date/Time') }
                            sorter={ sorter }
                            path='timestamp'
                        />
                        { ageFrameField && (
                            <th>{ translate('T-Age') }</th>
                        )}
                        <th>{ translate('Lab Workflow') }</th>
                        <SortableTH
                            label={ translate('Status') }
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

    var translate = useUITranslation();
    var permissions = usePermissions();

    var showEdit = permissions.hasFlag('canWriteParticipation');
    var showRemove = permissions.hasFlag('canWriteParticipation');

    var {
        type: participationType,
        realType,
        status: participationStatus,
        experimentId,
        studyId,
        studyType,
        timestamp,
    } = participationData;

    var actualParticipationType = (
        realType ||participationType
    );
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
                { translate(`_labWorkflow_${actualParticipationType}`) }
            </td>
            <td>
                { translate(formatStatus(participationData.status)) }
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
        'unknown': 'unknwon_short',
        'participated': 'participated_short',
        'didnt-participate': 'didnt-participate_short',

        'showed-up-but-didnt-participate': 'showed-up-but-didnt-participate_short',
        'didnt-show-up': 'didnt-show-up_short',
        'canceled-by-participant': 'canceled-by-participant_short',
        'canceled-by-institute': 'canceled-by-institute_short',
        'moved': 'moved_short',
    }[status] || 'ERROR'
}

export default ParticipationList;
