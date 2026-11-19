import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const ManualOnlyParticipationSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
    } = ps;

    var {
        locationTypeKeys,
    } = settingRecord.state;

    var { relatedCustomRecordTypes } = settingRelated;

    var [{ translate }] = useI18N();

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
