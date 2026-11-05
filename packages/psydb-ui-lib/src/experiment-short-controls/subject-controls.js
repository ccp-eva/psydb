import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
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

    var [{ translate }] = useI18N();

    return (
        <>
            <Pair className='mb-2' label={ translate('Subject') }>
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
