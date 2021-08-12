import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import DetailsIconButton from '../details-icon-button';
import PostprocessSubjectForm from './postprocess-subject-form';

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

export default PostprocessSubjectRow;
