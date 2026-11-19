import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const AwayTeamSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        availableSubjectCRTs,
    } = ps;

    var {
        subjectTypeKey,
        subjectLocationFieldPointer,
    } = settingRecord.state;

    var subjectCRT = availableSubjectCRTs.find({
        type: subjectTypeKey
    });
    var [ locationField ] = subjectCRT.findCustomFields({
        'pointer': subjectLocationFieldPointer
    });

    var [{ translate }] = useI18N();

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label={ translate('Appointments In') }>
                { translate.fieldDefinition(locationField) }
            </Pair>
        </DefaultSettingWrapper>
    )
}
