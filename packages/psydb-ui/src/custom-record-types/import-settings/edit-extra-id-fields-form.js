import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { AsyncButton } from '@mpieva/psydb-ui-layout';
import { FormBox, DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
});

const EditExtraIdFieldsForm = (ps) => {
    var { crt, initialValues, onSubmit, isTransmitting } = ps; 
    var [{ translate }] = useI18N();

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <ColumnSelect
                        columnLabel={ translate('Extra Id Fields') }
                        dataXPath='$.extraIdFields'
                        columns={ crt.findCustomFields({
                            type: { $in: [ 'SaneString', 'DefaultInt' ]}
                        }).map(it => ({
                            pointer: it.pointer,
                            label: it.displayName
                        }))}
                        enableColumnOrder={ false }
                    />
                    <AsyncButton
                        type='submit'
                        isTransmitting={ isTransmitting }
                    >
                        { translate('Save') }
                    </AsyncButton>
                </>
            )}
        </DefaultForm>
    );
}

export default EditExtraIdFieldsForm;
