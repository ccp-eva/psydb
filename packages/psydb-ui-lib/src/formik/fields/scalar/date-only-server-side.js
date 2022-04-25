import React, { useState, useContext } from 'react';
import ReactDateTime from 'react-datetime';
import classnames from 'classnames';

import datefns from '../../../date-fns';

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
    var { dataXPath, formikField, formikMeta, disabled } = ps;
    var { error } = formikMeta;
    var { value, onChange } = formikField;
    var isValidDate = (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)
        && !isNaN(new Date(value).getTime())
    );
    //console.log({ value, isValidDate });
    
    // TODO detect via 00:00:00.000Z bc thats alays utc?
    //if (isValidDate) {
    //    value = datefns.startOfDay(new Date(value).getTime() + 1)
    //}

    //var serverTimezone = useContext(ServerTimezoneContext);
    //var clientTimezone = getSystemTimezone();

    var inputClassName = classnames([
        'form-control',
        !!error && 'is-invalid'
    ])
    return (
        <ReactDateTime
            value={ isValidDate ? new Date(value) : value }
            onChange={ (stringOrMomentInstance) => {
                var v = '';
                if (stringOrMomentInstance.toISOString) {
                    console.log(stringOrMomentInstance.toISOString());
                    var str = stringOrMomentInstance.toISOString();
                    // stripping Z from string and reparsing t makes it
                    // localtime
                    var local = new Date(str.slice(0, -1));
                    v = local.toISOString();

                    // FIXME
                    v = str;
                    //console.log(v);
                }
                else {
                    v = String(stringOrMomentInstance);
                }
                return onChange(dataXPath)(v);
            }}
            locale='de-DE'
            timeFormat={ false }
            inputProps={{
                className: inputClassName,
                disabled,
                placeholder: 'tt.mm.jjjj'
            }}
        />
    );

    /*return (
        <InnerControl { ...({
            serverTimezone,
            clientTimezone,
            ...ps,
        })} />
    )*/
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

