import React from 'react';

import {
    convertCRTRecordToSettings,
    CRTSettings
} from '@mpieva/psydb-common-lib';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { AgeFrame } from './age-frame';


const AgeFrameList = (ps) => {
    var {
        subjectTypeKey,
        subjectTypeRecord,
        selectorRecord,
        ageFrameRecords,
        onEditAgeFrame,
        onRemoveAgeFrame,
        ...downstream
    } = ps;

    var { type: selectorType } = selectorRecord;
    var subjectCRT = CRTSettings({
        data: convertCRTRecordToSettings(subjectTypeRecord)
    });

    
    var translate = useUITranslation();
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
                    subjectTypeRecord,
                    subjectCRT,

                    selectorRecord,
                    ageFrameRecord,
                    ...(canWrite && {
                        onEdit: onEditAgeFrame,
                        onRemove: onRemoveAgeFrame,
                    }),
                    ...downstream
                })} />
            ))}
        </>
    )
}

export default AgeFrameList;
