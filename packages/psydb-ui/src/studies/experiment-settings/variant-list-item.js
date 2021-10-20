import React from 'react';
import { experimentVariants as evEnum } from '@mpieva/psydb-schema-enums';
import { Button } from '@mpieva/psydb-ui-layout';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        settingRecords,
        onAddSetting
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
                    <b>Ablauf { index + 1 } - { evEnum.mapping[variantType] }</b>
                </header>
                <SettingList { ...({
                    variantType,
                    settingRecords,
                })} />

                <hr />

                <Button
                    size='sm'
                    onClick={ () => onAddSetting({ variantRecord })}
                >
                    + Probandentyp
                </Button>
            </div>
        </div>
    )
}

const SettingList = (ps) => {
    var {
        variantType,
        settingRecords
    } = ps;

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <i>Keine Probanden-Typen</i>
            </div>
        )
    }

    /*var SettingComponent = ({
        'inhouse': InhouseSetting,
        'away-team': AwayTeamSetting,
        'online-video-call': OnlineVideoCallSetting,
        'online-survey': OnlinseSurveySetting
    })[variantType];*/

    return (
        <div>
        </div>
    )
}

export default VariantListItem;
