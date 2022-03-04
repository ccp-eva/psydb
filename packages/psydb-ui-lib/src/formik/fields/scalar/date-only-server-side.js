import React, { useState, useContext } from 'react';
import { withField } from '@cdxoo/formik-utils';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';

import {
    splitISO,
    checkDate,
    canSwap,
    createInitialDate,
    canParseBack,
    parseBack,
} from '../../../date-only-helpers';

import { Form } from '@mpieva/psydb-ui-layout';
import ServerTimezoneContext from '../../../server-timezone-context';

const Control = (ps) => {
    var serverTimezone = useContext(ServerTimezoneContext);
    var clientTimezone = getSystemTimezone();

    return (
        <InnerControl { ...({
            serverTimezone,
            clientTimezone,
            ...ps,
        })} />
    )
}

class InnerControl extends React.Component {
    state = {
        cachedDate: '',
        hasUserUpdate: false
    };
    
    static getDerivedStateFromProps (ps, state) {
        var {
            formikField,
            serverTimezone,
            clientTimezone,
            isInitialValueSwapped = true
        } = ps;
        var { value } = formikField;
        var { hasUserUpdate } = state;

        /*console.log({
            value,
            serverTimezone,
            clientTimezone,
            isInitialValueSwapped,
        })*/

        if (value === 'INVALID') {
            return null; // no state change
        }
        else {
            var initialDate = createInitialDate({
                value,
                serverTimezone,
                clientTimezone,
                isInitialValueSwapped,
                reverseSwap: hasUserUpdate
            });
            //console.log({ initialDate })
            return {
                cachedDate: initialDate || '',
            }
        }
    }

    useCachedDate () {
        return [
            this.state.cachedDate,
            (next) => this.setState({
                ...this.state,
                cachedDate: next,
                hasUserUpdate: true
            })
        ]
    }


    render () {
        var {
            dataXPath,
            formikField,
            formikForm,
            disabled,
        } = this.props;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var [ cachedDate, setCachedDate ] = this.useCachedDate();
        //console.log({ cachedDate })

        var handleChange = (event) => {
            //console.log('HANDLECHANGE');
            var { target: { value }} = event;
            setCachedDate(value);

            if (canParseBack(value)) {
                var date = parseBack(value);

                //console.log({ date: date.toISOString() });
                setFieldValue(dataXPath, date.toISOString());
            }
            else {
                //console.log('INVALID')
                setFieldValue(dataXPath, 'INVALID');
            }
        }

        return (
            <Form.Control
                type='date'
                lang='de-DE'
                disabled={ disabled }
                { ...formikField }
                value={ cachedDate }
                onChange={ handleChange }
            />
        )
    }
}

export const DateOnlyServerSide = withField({
    Control,
})

