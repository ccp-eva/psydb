import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, Alert } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from '@mpieva/psydb-ui-form-controls';

const SelectBar = (ps) => {
    var { subjectRecords, experiments, state, mergeTargetId } = ps;
    var { past, future } = experiments;
    var [ id, setId ] = state;

    return (
        <Grid className='bg-light border p-3 mb-3' cols={[ '1fr', '1fr' ]}>
            <ItemSelect
                items={ subjectRecords } value={ id } onChange={ setId }
                disabledId={ mergeTargetId }
            />
            <SubjectExperimentSummary past={ past } future={ future } />
        </Grid>
    )
}

const ItemSelect = (ps) => {
    var { items, value, onChange, disabledId } = ps;

    var options = {};
    for (var it of items) {
        options[it._id] = it._recordLabel;
    }
    return (
        <GenericEnum
            options={ options }
            value={ value }
            onChange={ onChange }
            disabledValues={[ disabledId ]}
        />
    )
}

const SubjectExperimentSummary = (ps) => {
    var { past, future } = ps;

    return (
        <div className='d-flex gapx-3 align-items-center justify-content-end'>
            <b>{ past.length } Teilnahmen</b>
            <b>{ future.length } Termine</b>
        </div>
    )
}
export default SelectBar;
