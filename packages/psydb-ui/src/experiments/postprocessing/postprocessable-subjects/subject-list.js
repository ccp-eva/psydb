import React from 'react';
import {
    Container,
    Row,
    Col,
    DetailsIconButton,
} from '@mpieva/psydb-ui-layout';

import PostprocessSubjectForm from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-form';

const SubjectList = ({
    experimentRecord,

    records,
    relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
    displayFieldData,

    className,
    ...other
}) => {
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
            { todoSubjects.map(it => {
                var subjectRecord = records.find(record => (
                    record._id === it.subjectId
                ));
                return <PostprocessSubjectRow { ...({
                    key: it.subjectId,

                    experimentId: experimentRecord._id,
                    subjectId: subjectRecord._id,
                    subjectType: subjectRecord.type,
                    subjectRecordLabel: subjectRecord._recordLabel,
                    
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

    onSuccessfulUpdate,
}) => {
    return (
        <div className='bg-light border mb-2 p-3'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={5} className='d-flex align-items-center'>
                        <span className='d-inline-block mr-2'>
                            { subjectRecordLabel }
                        </span>
                        
                        <DetailsIconButton
                            buttonStyle={{
                                background: 'transparent',
                                marginTop: '0px'
                            }}
                            to={`/subjects/${subjectType}/${subjectId}`}
                        />
                    </Col>
                    <Col sm={7}>
                        <PostprocessSubjectForm { ...({
                            experimentId,
                            subjectId,
                            onSuccessfulUpdate
                        }) } />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SubjectList;
