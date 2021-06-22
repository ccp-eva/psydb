import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import DetailsIconButton from '@mpieva/psydb-ui-lib/src/details-icon-button';
import PostprocessSubjectForm from './postprocess-subject-form';

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
                    return <SubjectListRow { ...({
                        key: it.subjectId,

                        experimentRecord,
                        experimentSubjectData: it,
                        
                        record: subjectRecord,
                        ...other
                    })} />
                })}
        </div>
    )
}

const SubjectListRow = ({
    experimentRecord,
    experimentSubjectData,

    record,
    onSuccessfulUpdate,
}) => {
    return (
        <div className='bg-light border mb-2 p-3'>
            <Container>
                <Row className='align-items-center'>
                    <Col sm={5} className='d-flex align-items-center'>
                        <span className='d-inline-block mr-2'>
                            { record._recordLabel }
                        </span>
                        
                        <DetailsIconButton
                            buttonStyle={{
                                background: 'transparent',
                                marginTop: '0px'
                            }}
                            to={`/subjects/${record.type}/${record._id}`}
                        />
                    </Col>
                    <Col sm={7}>
                        <PostprocessSubjectForm { ...({
                            experimentRecord,
                            subjectRecord: record,
                            onSuccessfulUpdate
                        }) } />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default SubjectList;
