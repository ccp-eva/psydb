import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    EditIconButtonInline,
    DetailsIconButton,
    ExperimentIconButton,
    SubjectIconButton,
    Alert,
    Table,
    Button,
} from '@mpieva/psydb-ui-layout';

import { PostprocessSubjectForm } from '@mpieva/psydb-ui-lib';
import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';
import ConsentPostprocessModal from './consent-postprocess-modal';

const InhouseList = (ps) => {
    var {
        subjectType, subjectCRT,
        records, related,
        onSuccessfulUpdate
    } = ps;

    var [ subjectModal, postprocessModal ] = useModalReducer.many(2);

    var permissions = usePermissions();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    if (records.length < 1) {
        return <Fallback />
    }

    return (
        <>
            <DetailedPostprocessModal
                { ...subjectModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <ConsentPostprocessModal
                { ...postprocessModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Table>
                <TableHead />
                <tbody>
                    { records.map((experimentRecord, index) => (
                        <ExperimentSubjectItems { ...({
                            key: index,
                            
                            subjectType, subjectCRT,
                            experimentRecord, related,
                            
                            canReadSubjects, canWriteSubjects,
                            subjectModal, postprocessModal,
                            onSuccessfulUpdate
                        })} />
                    )) }
                </tbody>
            </Table>
        </>
    )
}

const ExperimentSubjectItems = (ps) => {
    var {
        subjectType, subjectCRT,
        experimentRecord, related,
        canReadSubjects, canWriteSubjects,

        subjectModal, postprocessModal,
        onSuccessfulUpdate
    } = ps;

    var [{ translate, locale, fdate }] = useI18N();

    var { _enableFollowUpExperiments, state } = experimentRecord;
    var { studyId, subjectData, interval } = state;
    
    subjectData = subjectData.filter(it => (
        it.subjectType === subjectType && it.participationStatus === 'unknown'
    ))

    var studyLabel = related.records.study[studyId]._recordLabel;

    return (
        <>
            { subjectData.map((it, index) => {
                var subjectLabel = (
                    related.records.subject[it.subjectId]._recordLabel
                );

                var onClickEdit = () => subjectModal.handleShow({
                    title: translate(
                        'Postprocessing (${subject} - ${study})',
                        {
                            subject: subjectLabel,
                            study: studyLabel
                        }
                    ),
                    subjectType, subjectCRT, subjectId: it.subjectId,
                    experimentRecord, related,
                });

                return (
                    <tr key={ `${experimentRecord._id}_${it.subjectId}` }>
                        <Cell>
                            { subjectLabel }
                            { canWriteSubjects && (
                                <EditIconButtonInline
                                    onClick={ onClickEdit }
                                />
                            )}
                            { !canWriteSubjects && canReadSubjects && (
                                <SubjectIconButton
                                    to={`/subjects/${subjectType}/${it.subjectId}`}
                                    target='_blank'
                                />
                            )}
                        </Cell>
                        <Cell>
                            { fdate(interval.start, 'P p') }
                            {' - '}
                            { fdate(interval.end, 'p') }
                            {' '}
                            <ExperimentIconButton
                                to={`/experiments/${experimentRecord.type}/${experimentRecord._id}`}
                                target='_blank'
                            />
                        </Cell>
                        <Cell>{ studyLabel }</Cell>
                        <Cell>
                            <Button onClick={ () => (
                                postprocessModal.handleShow({
                                    experimentRecord,
                                    subjectId: it.subjectId,
                                })
                            )}>
                                { translate('Postprocess') }
                            </Button>
                            {/*<PostprocessSubjectForm { ...({
                                subjectLabel,
                                experimentId: experimentRecord._id,
                                subjectId: it.subjectId,
                                onSuccessfulUpdate,
                                enableFollowUpExperiments: (
                                    _enableFollowUpExperiments
                                )
                            }) } />*/}
                        </Cell>
                    </tr>
                );
            })}
        </>
    );
}

const Cell = ({ children }) => (
    <td style={{ verticalAlign: 'middle' }}>
        { children }
    </td>
);

const TableHead = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <thead>
            <tr>
                <th>{ translate('Subject') }</th>
                <th>{ translate('Date') }</th>
                <th>{ translate('Study') }</th>
                <th>{ translate('Status') }</th>
            </tr>
        </thead>
    );
}

const Fallback = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <>
            <Table className='mb-1'>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>{ translate('No unprocessed appointments found.') }</i>
            </Alert>
        </>
    )
}

export default InhouseList;
