import React, { useState } from 'react';

import { only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    Alert,
    Button,
    SmallFormFooter,
    LoadingIndicator,
    SplitPartitioned,
} from '@mpieva/psydb-ui-layout';

const PreviewStage = (ps) => {
    var { studyId, subjectType, formValues, gotoPrepare } = ps;
    var {
        locationType,
        locationId,
        labOperatorIds = [],
        fileId,
    } = formValues['$'];

    var saneLabOperatorIds = filterTruthy(labOperatorIds);

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.previewCSVExperimentImport({
            fileId,
            studyId,
            subjectType,
            locationId,
            labOperatorIds,
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { previewRecords, related, csvErrors } = fetched.data;
    
    return (
        <>
            <div className='d-flex flex-column gapy-2'>
                { previewRecords.map((it, ix) => {
                    return (
                        <PreviewRecord
                            key={ ix }
                            previewRecord={ it }
                            related={ related }
                        />
                    )
                })}
            </div>
        </>
    )
}

const PreviewRecord = (ps) => {
    var { previewRecord, related } = ps;
    var {
        interval,
        subjectData,
        subjectGroupId,
        experimentName,
        roomOrEnclosure
    } = previewRecord.state;

    return (
        <div className='bg-white py-2 px-3 border'>
            <SplitPartitioned partitions={[ 1, 1 ]}>
                <div>Zeitpunkt: { interval.start }</div>
                <div>SubjectGroup: { subjectGroupId }</div>
            </SplitPartitioned>
            <SplitPartitioned partitions={[ 1, 1 ]}>
                <div>Experiment Name: { experimentName }</div>
                <div>RoomOrEnclosure: { roomOrEnclosure }</div>
            </SplitPartitioned>
            <div className='mt-2 border-top pt-2'>
                <header><b>Subjects</b></header>
                { subjectData.map((it, ix) => {
                    var { subjectId, comment } = it;
                    return (
                        <SplitPartitioned partitions={[ 1, 1 ]}>
                            <div>{ subjectId }</div>
                            <div>{ comment }</div>
                        </SplitPartitioned>
                    )
                })}
            </div>
        </div>
    );
}

var filterTruthy = (ary) => ary.filter(it => !!it);

export default PreviewStage;
