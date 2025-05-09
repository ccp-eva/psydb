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
        conditionName,
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
            <SplitPartitioned partitions={[ 1, 1, 1, 1 ]}>
                <span>{ translate('Experiment Name') }:</span>
                <BE>{ experimentName }</BE>
                <span>{ translate('Condition Name') }:</span>
                <BE>{ conditionName || 'NOT FOUND' }</BE>
            </SplitPartitioned>
            
            <SplitPartitioned partitions={[ 1, 1, 1, 1 ]}>
                <span>{ translate('Date/Time') }</span>
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
                <span>{ translate('Location') }:</span>
                <BE><ForeignId
                    value={ locationId }
                    props={{ collection: 'location' }}
                    related={ related }
                    newTab={ true }
                    __useNewRelated={ true }
                /></BE>
                <span>{ translate('Room/Enclosure') }:</span>
                <BE>{ roomOrEnclosure }</BE>
            </SplitPartitioned>
            <SplitPartitioned partitions={[ 1, 1, 1, 1 ]}>
                <span>{ translate('Experimenters') }:</span>
                <BE><ForeignIdList
                    value={ experimentOperatorIds }
                    props={{ collection: 'personnel' }}
                    related={ related }
                    newTab={ true }
                    __useNewRelated={ true }
                /></BE>
                <span>{ translate('Trial Participants') }:</span>
                <BE>{ totalSubjectCount }</BE>
            </SplitPartitioned>
            <div className='mt-2 border-top pt-2'>
                <header><b>
                    { translate('Subjects') }
                </b></header>
                { subjectData.map((it, ix) => {
                    var { subjectId, role, comment } = it;
                    return (
                        <SplitPartitioned key={ ix } partitions={[ 1, 1, 2 ]}>
                            <BE><ForeignId
                                value={ subjectId }
                                props={{ collection: 'subject' }}
                                related={ related }
                                newTab={ true }
                                __useNewRelated={ true }
                            /></BE>
                            <span>{ role }</span>
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

export default PreviewRecord;
