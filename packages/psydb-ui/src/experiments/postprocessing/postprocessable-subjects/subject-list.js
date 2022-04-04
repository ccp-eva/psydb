import React from 'react';
import { usePermissions, useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    Container,
    Row,
    Col,
    EditIconButtonInline,
    DetailsIconButton,
} from '@mpieva/psydb-ui-layout';

import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';
import { DetailedPostprocessModal } from '@mpieva/psydb-ui-compositions';

const SubjectList = ({
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
}) => {
    var subjectModal = useModalReducer();

    var permissions = usePermissions();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canWriteSubjects = permissions.hasFlag('canWriteSubjects');

    var dateOfBirthField = displayFieldData.find(it => (
        it.props.isSpecialAgeFrameField
    ));
   
    var todoSubjects = (
        experimentRecord.state.subjectData.filter(it => (
            it.participationStatus === 'unknown'
        ))
    );

    return (
        <div>
            <DetailedPostprocessModal
                { ...subjectModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            { todoSubjects.map(it => {
                var subjectRecord = records.find(record => (
                    record._id === it.subjectId
                ));
                return <PostprocessSubjectRow { ...({
                    key: it.subjectId,

                    experimentId: experimentRecord._id,
                    experimentRecord,
                    relatedRecordLabels,
                    subjectId: subjectRecord._id,
                    subjectType: subjectRecord.type,
                    subjectRecordLabel: subjectRecord._recordLabel,
                    studyData,
                    
                    canReadSubjects,
                    canWriteSubjects,
                    subjectModal,
                    
                    onSuccessfulUpdate,
                    ...other
                })} />
            })}
        </div>
    )
}

const PostprocessSubjectRow = ({
    experimentId,
    subjectId,
    subjectType,
    subjectRecordLabel,

    studyData,

    experimentRecord,
    relatedRecordLabels,

    canReadSubjects,
    canWriteSubjects,
    subjectModal,

    onSuccessfulUpdate,
}) => {
    var { type: experimentType } = experimentRecord;
    var { enableFollowUpExperiments } = studyData.record.state;

    return (
        <div className='bg-light border mb-2 p-3'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={5} className='d-flex align-items-center'>
                        <span className='d-inline-block mr-2'>
                            { subjectRecordLabel }
                        </span>
                        
                        { canWriteSubjects && (
                            <EditIconButtonInline
                                buttonStyle={{
                                    background: 'transparent',
                                    marginTop: '0px'
                                }}
                                onClick={ () => (
                                    subjectModal.handleShow({
                                        title: `Nachbereitung (${subjectRecordLabel})`,
                                        subjectType,
                                        subjectId,
                                        experimentRecord,
                                        relatedRecordLabels,
                                    })
                                )}
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
                        <PostprocessSubjectForm { ...({
                            experimentType,
                            experimentId,
                            subjectId,
                            enableFollowUpExperiments,
                            onSuccessfulUpdate
                        }) } />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SubjectList;
