import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { PostprocessSubjectForm } from '@mpieva/psydb-ui-lib';

import { Cell } from './utils';
import ConsentPostprocessModal from './consent-postprocess-modal';

const PostprocessingCells = (ps) => {
    var {
        shouldHaveStudyConsentDoc,
        experimentRecord, subjectData,
        onSuccessfulUpdate
    } = ps;
    
    var bag = {
        shouldHaveStudyConsentDoc,
        experimentRecord, subjectData,
        onSuccessfulUpdate
    }

    if (shouldHaveStudyConsentDoc) {
        return (
            <>
                <StudyConsentDocCell { ...bag } />
                <StatusUpdateCell { ...bag } />
            </>
        )
    }
    else {
        return (
            <StatusUpdateCell { ...bag } />
        )
    }

}

const StudyConsentDocCell = (ps) => {
    var { experimentRecord, subjectData, onSuccessfulUpdate } = ps;
    var {
        subjectId,
        _studyConsentDocId, _studyConsentDocHasIssue
    } = subjectData;

    var [{ translate }] = useI18N();
    var modal = useModalReducer();

    if (!_studyConsentDocId) {
        return (
            <Cell><b className='text-danger'>
                { translate('No Consent Doc!') }
            </b></Cell>
        )
    }

    var onClick = () => modal.handleShow({
        studyConsentDocId: _studyConsentDocId
    });
    var renderedButton = (
        ['yes', 'no'].includes(_studyConsentDocHasIssue) ? (
            <Button size='sm' onClick={ onClick }>
                { translate('Edit') }
            </Button>
        ) : (
            <Button size='sm' onClick={ onClick } variant='danger'>
                { translate('Postprocess') }
            </Button>
        )
    )

    return (
        <Cell>
            <ConsentPostprocessModal
                { ...modal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
        
            { renderedButton }
        </Cell>
    )
}

const StatusUpdateCell = (ps) => {
    var {
        shouldHaveStudyConsentDoc,
        experimentRecord, subjectData,
        onSuccessfulUpdate
    } = ps;
    
    var { _id: experimentId, type: experimentType } = experimentRecord;
    var { _enableFollowUpExperiments } = experimentRecord; // FIXME
    var {
        subjectId,
        _studyConsentDocId, _studyConsentDocHasIssue
    } = subjectData;


    var hasPostrocessedStudyConsentDoc = (
        _studyConsentDocId && ['yes', 'no'].includes(_studyConsentDocHasIssue)
    );
    var enableForm = (
        !shouldHaveStudyConsentDoc
        || !_studyConsentDocId // FIXME: idk
        || hasPostrocessedStudyConsentDoc
    );

    var bag = {
        experimentId, subjectId,
        enableForm,
        enableFollowUpExperiments: _enableFollowUpExperiments,
        onSuccessfulUpdate,
    }
    return (
        <Cell>
            <PostprocessSubjectForm { ...bag } />
        </Cell>
    )
}

export default PostprocessingCells;
