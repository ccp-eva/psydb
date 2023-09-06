import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

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
