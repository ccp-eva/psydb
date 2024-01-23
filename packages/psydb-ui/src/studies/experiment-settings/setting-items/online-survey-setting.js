import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    var label = translate.crt(
        relatedCustomRecordTypes.subject[subjectTypeKey]
    );

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
