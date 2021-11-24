import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { AgeFrame } from './age-frame';

const AgeFrameList = (ps) => {
    var {
        selectorRecord,
        ageFrameRecords,
        onEditAgeFrame,
        onRemoveAgeFrame,
        ...downstream
    } = ps;

    var { type: selectorType } = selectorRecord;
    
    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    if (ageFrameRecords.length < 1) {
        return (
            <div className='p-3 text-muted'>
                <b>Keine Altersfenster</b>
            </div>
        )
    }

    return (
        <>
            { ageFrameRecords.map((ageFrameRecord, index) => (
                <AgeFrame key={ index } { ...({
                    index,
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
