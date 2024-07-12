import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

// FIXME
import {
    DateTime,
    ForeignId,
    ForeignIdList,
} from '@mpieva/psydb-ui-lib/src/data-viewers/utility-components';

const PreviewRecord = (ps) => {
    var { previewRecord, related } = ps;
    var {
        experimentName,
        intradaySeqNumber,
        interval,
        subjectData,
        subjectGroupId,
        locationId,
        roomOrEnclosure,
        experimentOperatorIds,
        totalSubjectCount,
    } = previewRecord.state;

    var translate = useUITranslation();

    return (
        <div className='bg-white py-2 px-3 border'>
            <SplitPartitioned partitions={[ 1, 2, 1, 4 ]}>
                <span>{ translate('Date/Time') }</span>
                <BE><DateTime value={ interval.start } /></BE>
                <span>{ translate('Subject') }</span>
                <BE><ForeignId
                    value={ subjectData[0].subjectId }
                    props={{ collection: 'subject' }}
                    related={ related }
                    newTab={ true }
                    __useNewRelated={ true }
                /></BE>
            </SplitPartitioned>
        </div>
    );
}

var BE = (ps) => (
    <b style={{ fontWeight: 600 }} { ...ps } />
);

export default PreviewRecord;
