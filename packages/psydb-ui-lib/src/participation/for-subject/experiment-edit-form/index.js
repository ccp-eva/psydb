import React from 'react';
import ExperimentEditForm from '../../for-study/experiment-edit-form';

const Outer = (ps) => {
    return (
        <ExperimentEditForm { ...ps } />
    )
}

export default Outer;
