import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid } from '@mpieva/psydb-ui-layout';

const CurrentView = (ps) => {
    var { record, related } = ps;
    var { tasks } = record.state;
    
    var [{ translate }] = useI18N();

    return (
        <Grid
            cols={[ '110px', '110px', '1fr', '130px', '250px']}
            gap='.5rem'
        >
            <b>{ translate('Start') }</b>
            <b>{ translate('End') }</b>
            <b>{ translate('Description') }</b>
            <b>{ translate('Status') }</b>
            <b>{ translate('Assigned To') }</b>
            
            { tasks.map((it, ix) => (
                <Task key={ ix } data={ it } related={ related } />
            ))}
        </Grid>
    )
}

const Task = (ps) => {
    var { data, related } = ps;
    var { start, end, description, status, assignedTo } = data;
    
    var [{ fdate, translate }] = useI18N();

    return (
        <>
            <span>{ fdate(start) }</span>
            <span>{ fdate(end) }</span>
            <span>{ description }</span>
            <span>{ translate('_studyRoadmapStatus_' + status) }</span>
            <span>{ assignedTo }</span>
        </>
    )
}

export default CurrentView;
