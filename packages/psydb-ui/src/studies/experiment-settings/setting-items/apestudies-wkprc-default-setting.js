import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const ApestudiesWKPRCDefaultSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        customRecordTypes,
    } = ps;

    var {
        locationTypeKeys,
    } = settingRecord.state;

    var { relatedCustomRecordTypes } = settingRelated;

    var translate = useUITranslation();

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label={ translate('Locations') }>
                { locationTypeKeys.map(it => (
                    translate.crt(relatedCustomRecordTypes.location[it])
                )).join(', ')}
                { locationTypeKeys.length < 1 && (
                    <span>{ translate('None') }</span>
                )}
            </Pair>
        </DefaultSettingWrapper>
    )
}
