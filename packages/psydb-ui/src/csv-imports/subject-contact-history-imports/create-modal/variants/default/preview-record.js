import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned } from '@mpieva/psydb-ui-layout';

// FIXME
import {
    DateTime,
    ForeignId,
    ForeignIdList,
} from '@mpieva/psydb-ui-lib/src/data-viewers/utility-components';

const PreviewRecord = (ps) => {
    var { previewRecord, related } = ps;
    var { type, subjectId, contactedAt, contactedBy } = previewRecord;
    var { status, comment } = previewRecord.state;

    var [{ translate }] = useI18N();

    return (
        <div className='bg-white py-2 px-3 border'>
            <SplitPartitioned partitions={[ 1, 2 ]}>
                <span>{ translate('Type') }</span>
                <BE>{ type }</BE>
                <span>{ translate('Subject') }</span>
                <BE><ForeignId
                    value={ subjectId }
                    props={{ collection: 'subject' }}
                    related={ related }
                    newTab={ true }
                    __useNewRelated={ true }
                /></BE>
                <span>{ translate('Contacted At') }</span>
                <BE><DateTime value={ contactedAt } /></BE>
                <span>{ translate('Contacted By') }</span>
                <BE>{ contactedBy }</BE>
                <span>{ translate('Status') }</span>
                <BE>{ type }</BE>
                <span>{ translate('Comment') }</span>
                <BE>{ comment }</BE>
            </SplitPartitioned>
        </div>
    );
}

var BE = (ps) => (
    <b style={{ fontWeight: 600 }} { ...ps } />
);

export default PreviewRecord;
