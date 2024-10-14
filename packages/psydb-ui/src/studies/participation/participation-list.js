import React from 'react';
import { convertPointerToPath, hasNone } from '@mpieva/psydb-core-utils';

import {
    useUIConfig,
    useUITranslation
} from '@mpieva/psydb-ui-contexts';

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
} from '@mpieva/psydb-ui-lib/src/participation/for-study';

import TimestampAndMaybeAge from './timestamp-and-maybe-age';

const ParticipationList = (ps) => {
    var {
        studyId,
        records,
        related,
        definitions,
        transformer,
        sorter,

        className,
        onSuccessfulUpdate,
    } = ps;

    var translate = useUITranslation();
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

    var modalBag = { studyId, onSuccessfulUpdate };
    var headBag = { definitions, dateOfBirthField, sorter }

    if (hasNone(records)) {
        return (
            <TableEmptyFallback
                tableExtraClassName={ className }
                emptyInfoText={ translate('No study participations found.') }
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
                            related,
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

    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var translate = useUITranslation();

    return (
        <>
            <TableHeadCustomCols
                definitions={ definitions.filter(it => (
                    IS_WKPRC ? it.key !== 'locationId' : true
                )) }
                sorter={ sorter }
                canSort={ canSort }
            />
            <SortableTH
                label={ translate(IS_WKPRC ? 'Date' : 'Date/Time') }
                sorter={ sorter }
                path='scientific.state.internals.participatedInStudies.timestamp'
            />
            { dateOfBirthField && (
                <SortableTH
                    label={ translate('T-Age') }
                    sorter={ sorter }
                    path={ convertPointerToPath( dateOfBirthField.pointer )}
                />
            )}
            <th>
                { translate('T-Location') }
            </th>
            { IS_WKPRC ? (
                <>
                    <th>{ translate('_wkprc_subjectRole') }</th>
                    <th>{ translate('_wkprc_intradaySeqNumber_short') }</th>
                    <th>{ translate('_wkprc_totalSubjectCount_short') }</th>
                </>
            ) : (
                <SortableTH
                    label={ translate('Status') }
                    sorter={ sorter }
                    path='scientific.state.internals.participatedInStudies.status'
                />
            )}
        </>
    )
}

const ParticipationListRow = (ps) => {
    var {
        permissions,

        record,
        related,
        definitions,
        transformer,
        dateOfBirthField,

        onEdit,
        onRemove,
    } = ps;

    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var translate = useUITranslation();

    var showEdit = permissions.hasFlag('canWriteParticipation');
    var showRemove = permissions.hasFlag('canWriteParticipation');

    var { _id: subjectId, type: subjectType } = record;

    var participationData = (
        record.scientific.state.internals.participatedInStudies[0]
    );

    var {
        type: participationType,
        realType: realParticipationType,
        status: participationStatus,
        experimentId,
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
            <TableBodyCustomCols { ...({
                record,
                definitions: definitions.filter(it => (
                    IS_WKPRC ? it.key !== 'locationId' : true
                )),
                transformer,
            }) } />
            <TimestampAndMaybeAge { ...({
                timestamp,
                record,
                dateOfBirthField
            })} />
            <td> {
                realParticipationType === 'apestudies-wkprc-default'
                ? (
                    related.records
                    .location[participationData.locationId]?._recordLabel
                    + ` (${participationData.roomOrEnclosure})`
                )
                : (
                    related.records
                    .location[participationData.locationId]?._recordLabel
                    || ((
                        participationType === 'online-survey'
                        || realParticipationType === 'online-survey'
                    ) ? 'Online' : '-')
                )
            }</td>
            { IS_WKPRC ? (
                <>
                    <td>{ participationData.role }</td>
                    <td>{ participationData.intradaySeqNumber }</td>
                    <td>{ participationData.totalSubjectCount }</td>
                </>
            ) : (
                <td>
                    { formatStatus(participationData.status) }
                </td>
            )}
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
                            title: `${translate('Study Participation')} - ${record._recordLabel}`,
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
