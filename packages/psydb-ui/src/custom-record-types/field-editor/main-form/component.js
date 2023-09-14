import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button, Alert } from '@mpieva/psydb-ui-layout';
import { DefaultForm, useFormikContext } from '@mpieva/psydb-ui-lib';

import { SubChannelKey } from '../utility-fields';
import CoreDefinitions from '../core-definitions';
import * as allBasicPropDefinitions from '../basic-prop-definitions';
import * as allSpecialPropDefinitions from '../special-prop-definitions';

export const Component = (ps) => {
    var {
        hasSubChannels,
        isUnrestricted,

        initialValues,
        onSubmit,
    } = ps;

    var translate = useUITranslation();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
            useAjvAsync
            ajvErrorInstancePathPrefix = '/payload'
        >
            {(formikProps) => (
                <>
                    <FormFields
                        isUnrestricted={ isUnrestricted }
                        hasSubChannels={ hasSubChannels }
                    />
                    <Button type='submit'>
                        { translate('Save') }
                    </Button>
                </>
            )}
        </DefaultForm>
    )
}

const FormFields = (ps) => {
    var { hasSubChannels, isUnrestricted } = ps;
    var { values } = useFormikContext();
    var { type } = values['$'].props;

    var PropDefinitions = {
        ...allBasicPropDefinitions,
        ...allSpecialPropDefinitions,
    }[type] || Fallback;

    return (
        <>
            { isUnrestricted && hasSubChannels && (
                <SubChannelKey />
            )}
            <CoreDefinitions
                dataXPath='$.props'
                isUnrestricted={ isUnrestricted }
            />
            <PropDefinitions
                dataXPath='$.props'
                isUnrestricted={ isUnrestricted }
            />
        </>
    )
}

const Fallback = (ps) => {
    var translate = useUITranslation();
    return (
        <Alert variant='danger'>
            <b>{ translate('Please select field type!') }</b>
        </Alert>
    )
}
