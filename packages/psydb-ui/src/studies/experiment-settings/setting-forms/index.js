import React from 'react';
import { createSend } from '@mpieva/psydb-ui-utils';
import { Button } from '@mpieva/psydb-ui-layout';
import {
    DefaultForm,
    GenericEnumField,
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

export * from './away-team-setting';
export * from './online-video-call-setting';
export * from './online-survey-setting';
export {
    InhouseSetting,
}
