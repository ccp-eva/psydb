import React from 'react';

import ExperimentContainer from './experiment-container';
import SubjectItem from './subject-item';

const InviteConfirmationListItem = (ps) => {
    var {
        experimentRecord,
        experimentOperatorTeamRecords,
        experimentRelated,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        phoneListField,

        onChangeStatus,
    } = ps;

    var { subjectData } = experimentRecord.state;

    return (
        <ExperimentContainer
            record={ experimentRecord }
            related={ experimentRelated }
        >
            { 
                subjectData
                .map((it, ix) => (
                    <div key={ ix }>
                        <SubjectItem { ...({
                            subjectDataItem: it,
                            subjectRecordsById,
                            subjectRelated,
                            subjectDisplayFieldData,
                            phoneListField,

                            experimentRecord,

                            onChangeStatus,
                        }) } />
                        { ix < subjectData.length - 1 && (
                            <hr />
                        )}
                    </div>
                ))
            }
        </ExperimentContainer>
    );
}


export default InviteConfirmationListItem;
