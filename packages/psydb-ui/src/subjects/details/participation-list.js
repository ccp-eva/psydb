import React from 'react';
import {
    Table,
    StudyIconButton,
    ExperimentIconButton,
    EditIconButtonInline,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    useModalReducer,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

import {
    EditModal,
    RemoveModal
} from '@mpieva/psydb-ui-lib/src/participation';

const ParticipationList = ({
    subjectId,
    subjectType,

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
                        <th>Studie</th>
                        <th>Zeitpunkt</th>
                        { ageFrameField && (
                            <th>Alter</th>
                        )}
                        <th>Status</th>
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

                                studyType,
                                ageFrameField,
                                ageFrameFieldValue,
                                
                                studyRecordsById,
                                relatedRecordLabels,
                                relatedHelperSetItems,
                                relatedCustomRecordTypeLabels,
                                displayFieldData,

                                onEdit: editModal.handleShow,
                                onRemove: removeModal.handleShow
                            }) } />
                        ))
                    }
                </tbody>
            </Table>
        </>
    )
}

const ParticipationListRow = ({
    subjectId,
    subjectType,

    item,

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
}) => {
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteParticipation');
    var canRemove = permissions.hasFlag('canWriteParticipation');

    var date = new Date(item.timestamp);
    var formattedDate = datefns.format(
        date,
        'dd.MM.yyyy HH:mm'
    );
    // FIXME: this is really hacky but we have
    // experiments old stuff in db
    var is1970 = (
        date.toISOString() === '1970-01-01T00:00:00.000Z'
        //formattedDate === '01.01.1970 00:00'
    );

    return (
        <tr>
            {/*<FieldDataBodyCols { ...({
                record: studyRecordsById[item.studyId],
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />*/}
            <td>{ studyRecordsById[item.studyId]?.state.shorthand || item.studyId  }</td>

            <td>{ is1970 ? '-' : formattedDate }</td>
            { ageFrameField && (
                <td>
                    { 
                        is1970
                        ? '-'
                        : calculateAge({
                            base: ageFrameFieldValue,
                            relativeTo: item.timestamp
                        })
                    }
                </td>
            )}
            <td>
                { formatStatus(item.status) }
            </td>
            <td className='d-flex justify-content-end'>
                { item.type !== 'manual' && item.experimentId && (
                    <ExperimentIconButton
                        to={`/experiments/${item.type}/${item.experimentId}`}
                    />
                )}
                <StudyIconButton
                    to={`/studies/${item.studyType}/${item.studyId}`}
                />
                { canWrite && (
                    <EditIconButtonInline
                        onClick={ () => onEdit({
                            subjectType, subjectId, ...item
                        }) }
                        iconStyle={{
                            ...(
                                item.experimentId && !permissions.isRoot()
                                && { color: '#888' }
                            )
                        }}
                        buttonProps={{
                            disabled: (
                                item.experimentId && !permissions.isRoot()
                            )
                        }}
                    />
                )}
                { canRemove && (
                    <RemoveIconButtonInline
                        onClick={ () => onRemove({
                            ...item
                        }) }
                        iconStyle={{
                            ...(
                                item.experimentId && !permissions.isRoot()
                                && { color: '#888' }
                            )
                        }}
                        buttonProps={{
                            disabled: (
                                item.experimentId && !permissions.isRoot()
                            )
                        }}
                    />
                )}
            </td>
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
