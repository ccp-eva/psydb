import React from 'react';
import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';
import {
    Pair,
    EditIconButton,
    RemoveIconButton,
} from '@mpieva/psydb-ui-layout';

export const AwayTeamSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
    } = ps;

    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    var { label } = relatedCustomRecordTypes.subject[subjectTypeKey].state;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    { label }
                </header>
            </div>
            <EditIconButton />
        </div>
    )
}
