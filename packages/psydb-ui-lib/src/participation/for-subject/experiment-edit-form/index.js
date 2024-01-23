import React from 'react';
import ExperimentEditForm from '../../for-study/experiment-edit-form';

const Outer = (ps) => {
    var {
        experimentId, labMethodKey,
        preselectedSubjectId
    } = ps;

    return (
        <ExperimentEditForm
            experimentId={ experimentId }
            preselectedSubjectId={ preselectedSubjectId }

            labMethodKey={ labMethodKey }
        />
    )
}

export default Outer;
