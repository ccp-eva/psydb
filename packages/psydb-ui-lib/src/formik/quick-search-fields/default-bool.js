import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Form, FormHelpers } from '@mpieva/psydb-ui-layout';
import WithField from '../with-field';

// NOTE: tri-state; empty means no filter, otherwise filters by
// exact boolean value
export const DefaultBool = WithField({
    Control: (ps) => {
        var { dataXPath, formikField, formikForm, disabled, autoFocus } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var translate = useUITranslation();

        var onChange = (event) => {
            var next = ({
                'true': true, 'false': false
            })[event.target.value];
            setFieldValue(dataXPath, next);
        }

        return (
            <Form.Control
                as='select'
                disabled={ disabled }
                autoFocus={ autoFocus }
                value={ typeof value === 'boolean' ? String(value) : '' }
                onChange={ onChange }
            >
                <option value=''>{ translate('Any') }</option>
                <option value='true'>{ translate('_DefaultBool_true') }</option>
                <option value='false'>{ translate('_DefaultBool_false') }</option>
            </Form.Control>
        )
    },
    DefaultWrapper: FormHelpers.QuickSearchWrapper
})
