import React from 'react';
import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';
import {
    Pair,
    EditIconButton,
    RemoveIconButton,
} from '@mpieva/psydb-ui-layout';

export const OnlineSurveySetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        showButtons = true,
        onRemove,
    } = ps;

    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    var { label } = relatedCustomRecordTypes.subject[subjectTypeKey].state;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-center'>
            <div>{ label }</div>
            { showButtons && (
                <div>
                    <RemoveIconButton onClick={ () => (
                        onRemove({ settingRecord, settingRelated })
                    )}/>
                </div>
            )}
        </div>
    )
}
