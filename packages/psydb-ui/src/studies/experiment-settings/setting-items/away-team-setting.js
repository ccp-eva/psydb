import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label={ translate('Appointments In') }>
                { translate.fieldDefinition(locationField) }
            </Pair>
        </DefaultSettingWrapper>
    )
}
