import React from 'react';
import { jsonpointer } from '@mpieva/psydb-core-utils';
import { calculateAge } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    Container,
    Row,
    Col,
    EditIconButtonInline,
    DetailsIconButton,
    Button,
    Icons,
} from '@mpieva/psydb-ui-layout';

import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';
import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

import { RemoveSubjectManualModal } from '../../remove-subject-manual-modal';

const SubjectList = (ps) => {
    var {
        studyData,
        experimentRecord,

        records,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
        displayFieldData,

        className,
        onSuccessfulUpdate,
        ...other
    } = ps;

    var permissions = usePermissions();

    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');
    var canRemoveSubject = permissions.hasLabOperationFlag(
        experimentRecord.type, 'canRemoveExperimentSubject'
    );

    var subjectModal = useModalReducer();
    var removeManualModal = useModalReducer();


    var dateOfBirthField = displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));
   
    var todoSubjects = (
        experimentRecord.state.subjectData.filter(it => (
            it.participationStatus === 'unknown'
        ))
        .map(it => {
            var subjectRecord = records.find(record => (
                record._id === it.subjectId
            ));
            return { ...it, _recordLabel: subjectRecord._recordLabel }
        })
        .sort((a,b) => (
            a._recordLabel.localeCompare(b._recordLabel)
        ))
    );

    return (
        <div>
            <RemoveSubjectManualModal
                experimentData={{ record: experimentRecord }}
                onSuccessfulUpdate={ onSuccessfulUpdate }
                { ...removeManualModal.passthrough }
            />
            <DetailedPostprocessModal
                { ...subjectModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            { todoSubjects.map(it => {
                var subjectRecord = records.find(record => (
                    record._id === it.subjectId
                ));
                
                var dobFieldValue = (
                    dateOfBirthField
                    ? calculateAge({
                        base: jsonpointer.get(
                            subjectRecord, dateOfBirthField.dataPointer
                        ),
                        relativeTo: experimentRecord.state.interval.start
                    })
                    : undefined
                );

                return <PostprocessSubjectRow { ...({
                    key: it.subjectId,

                    experimentId: experimentRecord._id,
                    experimentRecord,
                    relatedRecordLabels,
                    subjectId: subjectRecord._id,
                    subjectType: subjectRecord.type,
                    subjectRecordLabel: subjectRecord._recordLabel,
                    subjectRecord,
                    dobFieldValue, 
                    studyData,
                    
                    canReadSubjects,
                    canWriteSubjects,
                    canRemoveSubject,
                    subjectModal,
                    
                    onClickRemoveManual: removeManualModal.handleShow,
                    onSuccessfulUpdate,
                    ...other
                })} />
            })}
        </div>
    )
}

const PostprocessSubjectRow = (ps) => {
    var {
        experimentId,
        subjectId,
        subjectType,
        subjectRecordLabel,
        subjectRecord,
        dobFieldValue,

        studyData,

        experimentRecord,
        relatedRecordLabels,

        canReadSubjects,
        canWriteSubjects,
        canRemoveSubject,
        subjectModal,

        onClickRemoveManual,
        onSuccessfulUpdate,
    } = ps;

    var { type: experimentType } = experimentRecord;
    var { enableFollowUpExperiments } = studyData.record.state;

    var translate = useUITranslation();

    var handleEdit = () => (
        subjectModal.handleShow({
            title: translate(
                'Edit (${subjectLabel})',
                { subjectLabel: subjectRecordLabel }
            ),
            subjectType,
            subjectId,
            experimentRecord,
            relatedRecordLabels,
        })
    )

    return (
        <RowWrapper>
            <Col sm={5} className='d-flex align-items-center'>
                <span className='d-inline-block mr-2'>
                    { subjectRecordLabel }
                    { dobFieldValue && (
                        ` ${translate('T-Age')}: ${dobFieldValue}`
                    )}
                </span>
                
                { canWriteSubjects && (
                    <EditIconButtonInline
                        buttonStyle={{
                            background: 'transparent',
                            marginTop: '0px'
                        }}
                        onClick={ handleEdit }
                    />
                )}
                { !canWriteSubjects && canReadSubjects && (
                    <DetailsIconButton
                        buttonStyle={{
                            background: 'transparent',
                            marginTop: '0px'
                        }}
                        to={`/subjects/${subjectType}/${subjectId}`}
                    />
                )}
            </Col>
            <Col sm={7}>
                <div className='d-flex'>
                    <div className='flex-grow-1 mr-3'>
                        <PostprocessSubjectForm { ...({
                            experimentType,
                            experimentId,
                            subjectId,
                            enableFollowUpExperiments,
                            onSuccessfulUpdate
                        }) } />
                    </div>
                    { experimentType === 'away-team' && canRemoveSubject && (
                        <Button
                            variant='danger'
                            onClick={ () => {
                                return onClickRemoveManual({
                                    subjectRecord,
                                })
                            }}
                        >
                            <Icons.X style={{
                                width: '20px',
                                height: '20px',
                                marginTop: '-2px'
                            }} />
                        </Button>
                    )}
                </div>
            </Col>
        </RowWrapper>
    );
}

var RowWrapper = (ps) => {
    var { children } = ps;
    return (
        <div className='bg-light border mb-2 p-3'>
            <Container>
                <Row className='align-items-center'>
                    { children }
                </Row>
            </Container>
        </div>
    )
}

export default SubjectList;
