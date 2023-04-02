import React from 'react';

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
                        hasSubChannel={ hasSubChannels }
                    />
                    <Button type='submit'>Speichern</Button>
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
    return (
        <Alert variant='danger'>
            <b>Bitte Feld-Typ auswählen!</b>
        </Alert>
    )
}
