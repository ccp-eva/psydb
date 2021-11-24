import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    InhouseSetting,
    AwayTeamSetting,
    OnlineVideoCallSetting,
    OnlineSurveySetting
} from './setting-items';

const SettingList = (ps) => {
    var {
        variantRecord,
        settingRecords,
        onEditSetting,
        onRemoveSetting,
        ...downstream
    } = ps;

    var { type: variantType } = variantRecord;

    var permissions = usePermissions();
    var canWrite = permissions.hasFlag('canWriteStudies');

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <b>Keine Probanden-Einstellungen</b>
            </div>
        )
    }

    var SettingComponent = ({
        'inhouse': InhouseSetting,
        'away-team': AwayTeamSetting,
        'online-video-call': OnlineVideoCallSetting,
        'online-survey': OnlineSurveySetting
    })[variantType];


    return (
        <>
            { settingRecords.map((settingRecord, index) => (
                <SettingComponent key={ index } { ...({
                    variantRecord,
                    settingRecord,
                    showButtons: !!canWrite,
                    ...(canWrite && {
                        onEdit: onEditSetting,
                        onRemove: onRemoveSetting,
                    }),
                    ...downstream
                })} />
            ))}
        </>
    )
}

export default SettingList;
