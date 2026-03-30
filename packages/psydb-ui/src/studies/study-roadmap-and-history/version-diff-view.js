import React from 'react';
import { StringDiff, DiffMethod } from 'react-string-diff';

import { unique } from '@mpieva/psydb-core-utils';
import { keyRecords } from '@mpieva/psydb-common-lib';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid } from '@mpieva/psydb-ui-layout';

const VersionDiffView = (ps) => {
    var { oldRecord, newRecord, related } = ps;

    var { tasks: oldTasks = [] } = oldRecord?.state || {};
    var { tasks: newTasks = [] } = newRecord.state;

    var oldTasksById = keyRecords(oldTasks);
    var newTasksById = keyRecords(newTasks);

    var taskIds = unique([
        ...oldTasks.map(it => it._id), ...newTasks.map(it => it._id)
    ]);
    var taskMapping = [];
    for (var it of taskIds) {
        taskMapping.push({
            oldData: oldTasksById[it],
            newData: newTasksById[it]
        })
    }
    
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
            
            { taskMapping.map((it, ix) => (
                <Task key={ ix } { ...it } related={ related } />
            ))}
        </Grid>
    )
}

const _identity = (x) => (x);
const Diff = (ps) => {
    var { oldValue = '', newValue = '', transform = _identity } = ps;
    
    return (
        <StringDiff
            method={ DiffMethod.WordsWithSpace }
            oldValue={ oldValue ? transform(oldValue) : oldValue }
            newValue={ newValue ? transform(newValue) : newValue }
        />
    )
}

const Task = (ps) => {
    var { oldData = {}, newData = {}, related } = ps;
    var [{ fdate, translate }] = useI18N();

    return (
        <>
            <Diff
                oldValue={ oldData.start } newValue={ newData.start }
                transform={ fdate }
            />
            <Diff
                oldValue={ oldData.end } newValue={ newData.end }
                transform={ fdate }
            />
            <Diff
                oldValue={ oldData.description }
                newValue={ newData.description }
            />
            <Diff
                oldValue={ oldData.status }
                newValue={ newData.status }
                transform={(status) => (
                    translate('_studyRoadmapStatus_' + status)
                )}
            />
            <Diff
                oldValue={ oldData.assignedTo }
                newValue={ newData.assignedTo }
            />
        </>
    )
}

export default VersionDiffView;
