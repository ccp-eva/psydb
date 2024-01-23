import React from 'react';

import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';

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

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label='Locations'>
                { locationTypeKeys.map(it => {
                    return (
                        relatedCustomRecordTypes
                        .location[it].state.label
                    );
                }).join(', ')}
                { locationTypeKeys.length < 1 && (
                    <span>Keine</span>
                )}
            </Pair>
        </DefaultSettingWrapper>
    )
}
