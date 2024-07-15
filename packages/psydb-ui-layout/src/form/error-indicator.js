import React from 'react';
import { Form } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const ErrorIndicator = (ps) => {
    var { index, formikMeta = {} } = ps;
    var { error } = formikMeta;

    var translate = useUITranslation();

    if (error && index >= 0) {
        error = error[index];
    }

    return (
        error && error['@@ERRORS']
        ? (
            <div className='text-danger' style={{ fontSize: '80%' }}>
                { error['@@ERRORS'].map((err, index) => (
                    <div key={ index }>
                        { createFriendlyMessage(err, translate) }
                    </div>
                )) }
            </div>
        )
        : null
    );
}

const createFriendlyMessage = (err, translate) => {
    var { keyword, params } = err;
    console.log(err);
    switch (keyword) {
        case 'type':
        case 'required':
            return translate('This Field is Required. Please provide a value.');
        case 'minLength':
            return (
                params.limit === 1
                ? translate('This Field is Required. Please provide a value.')
                : translate(
                    'Must have at least ${count} characters.',
                    { count: params.limit }
                )
            );
        case 'minItems':
            return (
                params.limit === 1
                ? translate('This Field is Required. Please provide a value.')
                : translate(
                    'Must have at least ${count} items.',
                    { count: params.limit }
                )
            );
        case 'minimum':
            return (
                params.exclusive
                ? translate(
                    'Must be greater than ${limit}.',
                    { limit: params.limit }
                )
                : translate(
                    'Must be greater than or equal ${limit}.',
                    { limit: params.limit }
                )
            );
        case 'format':
            if (['mongodb-object-id'].includes(params.format)) {
                return translate('This Field is Required. Please provide a value.');
            }
            else if (['email', 'email-optional'].includes(params.format)) {
                return translate('This is not a valid e-mail address.')
            }
            else {
                return err.message;
            }
        
        case 'uniqueItemProperties':
            // FIXME: this error message is basically useless
            // FIXME: also the original just says 'should pass
            // uniqteItemProperties' which is also useless
            return translate('Contains invalid duplicate data.');

        case 'FakeAjvError':
            return err.message;
        default:
            console.log(err);
            return err.message;
    }
    return message;
}
