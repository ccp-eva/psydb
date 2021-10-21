import React from 'react';
import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';
import { Button, RemoveIconButton } from '@mpieva/psydb-ui-layout';

import {
    InhouseSetting,
    AwayTeamSetting,
    OnlineVideoCallSetting,
    OnlineSurveySetting
} from './setting-items';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        onRemove,
        onAddSetting,
        ...downstream
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3'>
                <header className='border-bottom pb-1 mb-3'>
                    <b>
                        Ablauf { index + 1 }
                        {' - '}
                        { variantsEnum.mapping[variantType] }
                    </b>
                </header>

                <SettingList { ...({
                    variantType,
                    ...downstream
                })} />

                <hr />

                <div className='d-flex justify-content-between pr-3'>
                    <Button
                        size='sm'
                        onClick={ () => onAddSetting({ variantRecord })}
                    >
                        + Einstellungen
                    </Button>
                    <RemoveIconButton onClick={ () => onRemove({
                        index,
                        variantRecord,
                    }) } />
                </div>
            </div>
        </div>
    )
}

const SettingList = (ps) => {
    var {
        variantType,
        settingRecords,
        onRemoveSetting,
        onEditSetting,
        ...downstream
    } = ps;

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <i>Keine Probanden-Einstellungen</i>
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
        <div>
            { settingRecords.map((settingRecord, index) => (
                <SettingComponent key={ index } { ...({
                    settingRecord,
                    onEdit: onEditSetting,
                    onRemove: onRemoveSetting,
                    ...downstream
                })} />
            ))}
        </div>
    )
}

export default VariantListItem;
