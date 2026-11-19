import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { AgeFrame } from './age-frame';


const AgeFrameList = (ps) => {
    var {
        subjectTypeKey,
        subjectCRT,
        selectorRecord,
        ageFrameRecords,
        ageFrameRelated,
        onEditAgeFrame,
        onRemoveAgeFrame,
    } = ps;

    var { type: selectorType } = selectorRecord;
    
    var [{ translate }] = useI18N();
    var permissions = usePermissions();
    var canWrite = (
        permissions.hasFlag('canWriteStudies')
        && permissions.isSubjectTypeAvailable(subjectTypeKey)
    );

    if (ageFrameRecords.length < 1) {
        return (
            <div className='p-3 text-muted'>
                <b>{ translate('No Age Ranges') }</b>
            </div>
        )
    }

    return (
        <>
            { ageFrameRecords.map((ageFrameRecord, index) => (
                <AgeFrame key={ index } { ...({
                    index,
                    subjectCRT,

                    selectorRecord,
                    ageFrameRecord,
                    ageFrameRelated,
                    ...(canWrite && {
                        onEdit: onEditAgeFrame,
                        onRemove: onRemoveAgeFrame,
                    }),
                })} />
            ))}
        </>
    )
}

export default AgeFrameList;
