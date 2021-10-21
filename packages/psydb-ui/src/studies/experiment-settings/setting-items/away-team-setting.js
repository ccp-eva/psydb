import React from 'react';
import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';


export const AwayTeamSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        customRecordTypes,
    } = ps;

    var {
        subjectTypeKey,
        subjectLocationFieldPointer,
    } = settingRecord.state;

    var subjectType = customRecordTypes.find(it => (
        it.collection === 'subject' && it.type === subjectTypeKey
    ));

    var fieldLabels = (
        subjectType.state.settings.subChannelFields.scientific
        .reduce((acc, field) => {
            var { key, displayName } = field;
            var pointer = (
                `/scientific/state/custom/${key}`
            );
            return { ...acc, [pointer]: displayName };
        }, {})
    );

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label='Termine in'>
                { fieldLabels[subjectLocationFieldPointer] }
            </Pair>
        </DefaultSettingWrapper>
    )
}
