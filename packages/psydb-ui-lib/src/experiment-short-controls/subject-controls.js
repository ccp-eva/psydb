import React from 'react';
import { Pair } from '@mpieva/psydb-ui-layout';

import {
    CommentControl,
    AutoConfirmControl
} from './subject-container-fields';

const SubjectControls = (ps) => {
    var {
        subjectLabel,
        comment,
        autoConfirm,
        onChangeComment,
        onChangeAutoConfirm,
    } = ps;

    return (
        <>
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
        </>
    );
}

export default SubjectControls;
