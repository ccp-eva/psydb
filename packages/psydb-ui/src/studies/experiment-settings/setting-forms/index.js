import React from 'react';
import { createSend } from '@mpieva/psydb-ui-utils';
import {
    DefaultForm,
    SaneStringField
} from '@mpieva/psydb-ui-lib/src/formik';

const InhouseSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    return (
        <div>
            <DefaultForm>
                {(formikProps) => (
                    <SaneStringField path='foo' />
                )}
            </DefaultForm>
        </div>
    )
};

const AwayTeamSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;
    return (
        <div>AWAY</div>
    )
};

const OnlineVideoCallSetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;
    return (
        <div>Video</div>
    )
};

const OnlineSurveySetting = (ps) => {
    var {
        variantId,
        allowedSubjectTypes,
        onSuccessfulUpdate
    } = ps;

    return (
        <div>
            <DefaultForm>
                {(formikProps) => (
                    <SaneStringField />
                )}
            </DefaultForm>
        </div>
    )
};

export {
    InhouseSetting,
    AwayTeamSetting,
    OnlineVideoCallSetting,
    OnlineSurveySetting
}
