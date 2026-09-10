import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button, Alert } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

import * as DefinitionAttributes from '../definition-attribute-fields';

export const Component = (ps) => {
    var {
        record,
        hasSubChannels, isUnrestricted,
        initialValues, onSubmit,
    } = ps;

    var [{ translate }] = useI18N();

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
                        record={ record }
                        hasSubChannels={ hasSubChannels }
                        isUnrestricted={ isUnrestricted }
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
    var { record, hasSubChannels, isUnrestricted } = ps;

    var { values } = useFormikContext();
    var { type } = values['$'].props;
    var TypeSpecific = DefinitionAttributes.TypeSpecific[type] || Fallback;

    return (
        <>
            { isUnrestricted && hasSubChannels && (
                <SubChannelKey />
            )}
            <DefinitionAttributes.Core
                dataXPath='$.props'
                record={ record }
                isUnrestricted={ isUnrestricted }
            />
            <TypeSpecific
                dataXPath='$.props'
                record={ record }
                isUnrestricted={ isUnrestricted }
            />
        </>
    )
}

const SubChannelKey = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <Fields.GenericEnum
            label={ translate('Data Channel') }
            dataXPath='$.subChannelKey'
            options={ translate.options({
                'scientific': 'Default',
                'gdpr': 'Data Protection (GDPR)',
            })}
            required
        />
    )
}

const Fallback = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <Alert variant='danger'>
            <b>{ translate('Please select field type!') }</b>
        </Alert>
    )
}
