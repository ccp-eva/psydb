import React from 'react';
import { Container } from 'react-bootstrap';
import Pair from '../pair';

import {
    CommentControl,
    AutoConfirmControl
} from './subject-container-fields';

const SubjectContainer = (ps) => {
    var {
        subjectLabel,
        comment,
        autoConfirm,
        onChangeComment,
        onChangeAutoConfirm,
    } = ps;

    return (
        <Container>
            <Pair className='mb-2' label="Proband">
                { subjectLabel }
            </Pair>
            <CommentControl { ...({
                comment,
                onChangeComment
            })} />
            <AutoConfirmControl { ...({
                autoConfirm,
                onChangeAutoConfirm
            })} />
        </Container>
    );
}

export default SubjectContainer;
