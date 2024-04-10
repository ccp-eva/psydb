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

// FIXME
import {
    DateTime,
    ForeignId
} from '@mpieva/psydb-ui-lib/src/data-viewers/utility-components';

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

    var translate = useUITranslation();

    return (
        <div className='bg-white py-2 px-3 border'>
            <SplitPartitioned partitions={[ 1, 1, 1, 1 ]}>
                <span>Zeitpunkt:</span>
                <BE><DateTime value={ interval.start } /></BE>

                <span>{ translate('Subject Group') }:</span>
                <BE><ForeignId
                    value={ subjectGroupId }
                    props={{ collection: 'subjectGroup' }}
                    related={ related }
                    newTab={ true }
                    __useNewRelated={ true }
                /></BE>
            </SplitPartitioned>
            <SplitPartitioned partitions={[ 1, 1, 1, 1 ]}>
                <span>{ translate('Experiment Name') }:</span>
                <BE>{ experimentName }</BE>
                <span>{ translate('Room/Enclosure') }:</span>
                <BE>{ roomOrEnclosure }</BE>
            </SplitPartitioned>
            <div className='mt-2 border-top pt-2'>
                <header><b>
                    { translate('Subjects') }
                </b></header>
                { subjectData.map((it, ix) => {
                    var { subjectId, comment } = it;
                    return (
                        <SplitPartitioned partitions={[ 1, 1 ]}>
                            <ForeignId
                                value={ subjectId }
                                props={{ collection: 'subject' }}
                                related={ related }
                                newTab={ true }
                                __useNewRelated={ true }
                            />
                            <i>{ comment }</i>
                        </SplitPartitioned>
                    )
                })}
            </div>
        </div>
    );
}

var BE = (ps) => (
    <b style={{ fontWeight: 600 }} { ...ps } />
);
var filterTruthy = (ary) => ary.filter(it => !!it);

export default PreviewStage;
