import React from 'react';
import {
    Container,
    Row,
    Col,
    DetailsIconButton,
} from '@mpieva/psydb-ui-layout';

import PostprocessSubjectRow from '@mpieva/psydb-ui-lib/src/experiments/postprocess-subject-row';

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


export default SubjectList;
