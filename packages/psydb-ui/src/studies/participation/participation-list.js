import React from 'react';
import {
    jsonpointer,
    convertPointerToPath,
    hasNone
} from '@mpieva/psydb-core-utils';

import {
    useModalReducer,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import {
    Alert,
    Table,
    SortableTH,
    SubjectIconButton,
    ExperimentIconButton,
    EditIconButtonInline,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';

// FIXME: those import are bad; move thos somewhere else
import FieldDataHeadCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-head-cols';
import FieldDataBodyCols from '@mpieva/psydb-ui-lib/src/record-list/field-data-body-cols';

import {
    EditModal,
    RemoveModal
} from '@mpieva/psydb-ui-lib/src/participation';



const ParticipationList = ({
    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,

    sorter,
    className,
    onSuccessfulUpdate,
}) => {
    var editModal = useModalReducer();
    var removeModal = useModalReducer();

    var dateOfBirthField = displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));

    records = records.filter(it => {
        var participationStatus = (
            it.scientific.state.internals.participatedInStudies[0].status
        );
        // FIXME maybe not store it in subject at all then?a
        // keep in experiment though
        return !(['didnt-participate'].includes(participationStatus));
    })

    if (hasNone(records)) {
        return (
            <Fallback
                className={ className }
                displayFieldData={ displayFieldData }
                sorter={ sorter }
                dateOfBirthField={ dateOfBirthField }
            />
        )
    }

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
            <Table className={ className }>
                <TableHead
                    displayFieldData={ displayFieldData }
                    sorter={ sorter }
                    dateOfBirthField={ dateOfBirthField }
                />
                <tbody>
                    { records.map((it, index) => (
                        <ParticipationListRow { ...({
                            key: index,
                            record: it,
                            relatedRecordLabels,
                            relatedHelperSetItems,
                            relatedCustomRecordTypeLabels,
                            displayFieldData,
                            dateOfBirthField,
                            
                            onEdit: editModal.handleShow,
                            onRemove: removeModal.handleShow
                        })} />
                    ))}
                </tbody>
            </Table>
        </>
    )
}

const Fallback = (ps) => {
    var {
        className,
        displayFieldData,
        sorter,
        dateOfBirthField
    } = ps;

    return (
        <div className={ className }>
            <Table className='mb-1'>
                <TableHead
                    displayFieldData={ displayFieldData }
                    sorter={ sorter }
                    dateOfBirthField={ dateOfBirthField }
                />
            </Table>
            <Alert variant='info' className='mt-1'>
                <i>Keine Studienteilnahmen gefunden</i>
            </Alert>
        </div>
    )
}

const TableHead = (ps) => {
    var {
        displayFieldData,
        sorter,
        dateOfBirthField
    } = ps;

    return (
        <thead>
            <tr>
                <FieldDataHeadCols
                    displayFieldData={ displayFieldData }
                    sorter={ sorter }
                    canSort={ true }
                />
                <SortableTH
                    label='Zeitpunkt'
                    sorter={ sorter }
                    path='scientific.state.internals.participatedInStudies.timestamp'
                />
                { dateOfBirthField && (
                    <SortableTH
                        label='Alter'
                        sorter={ sorter }
                        path={ convertPointerToPath(
                            dateOfBirthField.pointer
                        )}
                    />
                )}
                <SortableTH
                    label='Status'
                    sorter={ sorter }
                    path='scientific.state.internals.participatedInStudies.status'
                />
            </tr>
        </thead>
    )
}

const ParticipationListRow = ({
    record,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,
    dateOfBirthField,

    onEdit,
    onRemove,
}) => {
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteParticipation');
    var canRemove = permissions.hasFlag('canWriteParticipation');

    var { _id: subjectId, type: subjectType } = record;

    var participationData = (
        record.scientific.state.internals.participatedInStudies[0]
    );

    var date = new Date(participationData.timestamp);
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

    var {
        type: participationType,
        experimentId,
    } = participationData;

    var hasExperiment = (
        participationType !== 'manual' && experimentId
    );

    return (
        <tr>
            <FieldDataBodyCols { ...({
                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            })} />
            <td>{ is1970 ? '-' : formattedDate }</td>
            { dateOfBirthField && (
                <td>
                    { 
                        is1970
                        ? '-'
                        : calculateAge({
                            base: jsonpointer.get(
                                record, dateOfBirthField.dataPointer
                            ),
                            relativeTo: participationData.timestamp
                        })
                    }
                </td>
            )}
            <td>
                { formatStatus(participationData.status) }
            </td>
            <td className='d-flex justify-content-end'>
                { hasExperiment && (
                    <ExperimentIconButton
                        to={`/experiments/${participationType}/${experimentId}`}
                    />
                )}
                <SubjectIconButton
                    to={`/subjects/${record.type}/${record._id}`}
                />
                { canWrite && (
                    <EditIconButtonInline
                        onClick={ () => onEdit({
                            subjectId, subjectType,
                            title: `Teilnahme - ${record._recordLabel}`,
                            ...participationData
                        }) }
                        iconStyle={{
                            ...(
                                experimentId && !permissions.isRoot()
                                && { color: '#888' }
                            )
                        }}
                        buttonProps={{
                            disabled: (
                                experimentId && !permissions.isRoot()
                            )
                        }}
                    />
                )}
                { canRemove && (
                    <RemoveIconButtonInline
                        onClick={ () => onRemove({
                            ...participationData
                        }) }
                        iconStyle={{
                            ...(
                                hasExperiment && !permissions.isRoot()
                                && { color: '#888' }
                            )
                        }}
                        buttonProps={{
                            disabled: (
                                hasExperiment && !permissions.isRoot()
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
