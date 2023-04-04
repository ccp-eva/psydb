import React from 'react';
import { convertPointerToPath, hasNone } from '@mpieva/psydb-core-utils';

import {
    useModalReducer,
    usePermissions,
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    TableHead,
    TableHeadCustomCols,
    TableBodyCustomCols,
    TableEmptyFallback,

    SortableTH,
    SubjectIconButton,
    ExperimentIconButton,
    EditIconButtonInline,
    RemoveIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    EditModal,
    RemoveModal
} from '@mpieva/psydb-ui-lib/src/participation';

import TimestampAndMaybeAge from './timestamp-and-maybe-age';

const ParticipationList = (ps) => {
    var {
        records,
        definitions,
        transformer,
        sorter,

        className,
        onSuccessfulUpdate,
    } = ps;

    var permissions = usePermissions();
    
    var editModal = useModalReducer();
    var removeModal = useModalReducer();

    var dateOfBirthField = definitions.find(it => (
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

    var modalBag = { onSuccessfulUpdate };
    var headBag = { definitions, dateOfBirthField, sorter }

    if (hasNone(records)) {
        return (
            <TableEmptyFallback
                tableExtraClassName={ className }
                emptyInfoText='Keine Studienteilnahmen gefunden'
            >
                <TableHeadCols { ...headBag } />
            </TableEmptyFallback>
        )
    }

    return (
        <>
            <EditModal { ...modalBag } { ...editModal.passthrough } />
            <RemoveModal { ...modalBag } { ...removeModal.passthrough } />

            <Table className={ className }>
                <TableHead>
                    <TableHeadCols { ...headBag } canSort />
                </TableHead>
                <tbody>
                    { records.map((record, ix) => (
                        <ParticipationListRow key={ ix } { ...({
                            permissions,

                            record,
                            definitions,
                            transformer,
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

const TableHeadCols = (ps) => {
    var {
        definitions,
        dateOfBirthField,
        sorter,
        canSort,
    } = ps;

    return (
        <>
            <TableHeadCustomCols
                definitions={ definitions }
                sorter={ sorter }
                canSort={ canSort }
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
                    path={ convertPointerToPath( dateOfBirthField.pointer )}
                />
            )}
            <SortableTH
                label='Status'
                sorter={ sorter }
                path='scientific.state.internals.participatedInStudies.status'
            />
        </>
    )
}

const ParticipationListRow = (ps) => {
    var {
        permissions,

        record,
        definitions,
        transformer,
        dateOfBirthField,

        onEdit,
        onRemove,
    } = ps;

    var showEdit = permissions.hasFlag('canWriteParticipation');
    var showRemove = permissions.hasFlag('canWriteParticipation');

    var { _id: subjectId, type: subjectType } = record;

    var participationData = (
        record.scientific.state.internals.participatedInStudies[0]
    );

    var {
        type: participationType,
        experimentId,
        timestamp,
    } = participationData;

    var hasExperiment = ( participationType !== 'manual' && experimentId );
    var enableEdit = ( !hasExperiment && permissions.isRoot() );
    var enableRemove = ( !hasExperiment && permissions.isRoot() );

    return (
        <tr>
            <TableBodyCustomCols { ...({
                record,
                definitions,
                transformer,
            }) } />
            <TimestampAndMaybeAge { ...({
                timestamp,
                record,
                dateOfBirthField
            })} />
            <td>
                { formatStatus(participationData.status) }
            </td>
            <td className='d-flex justify-content-end'>
                { hasExperiment && (
                    <ExperimentIconButton to={
                        `/experiments/${participationType}/${experimentId}`
                    } />
                )}
                <SubjectIconButton to={
                    `/subjects/${record.type}/${record._id}`
                } />
                { showEdit && (
                    <EditIconButtonInline
                        onClick={ () => onEdit({
                            subjectId, subjectType,
                            title: `Teilnahme - ${record._recordLabel}`,
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
