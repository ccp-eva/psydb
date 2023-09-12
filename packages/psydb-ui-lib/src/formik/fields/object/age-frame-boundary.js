import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { InputGroup, Form } from '@mpieva/psydb-ui-layout';

const PartField = withField({
    type: 'number',
    fakeDefault: Infinity,
    Control: (ps) => {
        var { isInvalid, formikField, disabled, min = 0, max, step = 1 } = ps;
        return (
            <Form.Control { ...({
                type: 'number', disabled, min, max, step,
                isInvalid,
                ...formikField
            })} />
        )
    },
    DefaultWrapper: 'NoneWrapper'
})

export const AgeFrameBoundary = withField({ Control: (ps) => {
    var {
        dataXPath,
        formikField,
        formikForm,
        formikMeta,
        disabled,
    } = ps;

    var { error } = formikMeta;
    var translate = useUITranslation();

    return (
        <InputGroup>
            <PartField
                dataXPath={`${dataXPath}.years`}
                disabled={ disabled }
                isInvalid={ !!error }
            />
            <PartField
                dataXPath={`${dataXPath}.months`}
                disabled={ disabled }
                max={ 12 }
                isInvalid={ !!error }
            />
            <PartField
                dataXPath={`${dataXPath}.days`}
                disabled={ disabled }
                isInvalid={ !!error }
                max={ 30 }
            />
            <InputGroup.Append>
                <InputGroup.Text>
                    { translate('_age_frame_placeholder') }
                </InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    )
}});
