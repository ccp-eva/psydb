import React, { useReducer }from 'react';

import { Button } from 'react-bootstrap';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFCustomTheme from './rjsf-theme';
import ErrorResponseModal from './error-response-modal';

var SchemaForm = withTheme(RJSFCustomTheme);

const DefaultSchemaForm = ({
    buttonLabel,
    onSubmit,
    ...downstream
}) => {
    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        validationErrors,
        apiError,
        showErrorModal,
    } = state;


    var handleValidationError = (errors) => {
        dispatch({ type: 'set-validation-errors', payload: errors });
    }

    var wrappedOnSubmit = (...args) => {
        var promise = onSubmit(...args);
        promise.catch(error => {
            if (error.response) {
                dispatch({ type: 'set-api-error', payload: error.response })
            }
            else {
                throw error;
            }
        })
    }

    var handleHideErrorModal = () => {
        dispatch({ type: 'hide-error-modal' });
    }

    return (
        <>
            <ErrorResponseModal
                show={ showErrorModal }
                onHide={ handleHideErrorModal }
                errorResponse={ apiError }
            />
            <SchemaForm
                noHtml5Validate={ true }
                showErrorList={ false }
                onSubmit={ wrappedOnSubmit }
                onError={ /*handleValidationError*/ () => {} }
                { ...downstream }
            >
                <div className='d-flex align-items-center'>
                    <Button type="submit" className="btn btn-primary">
                        { buttonLabel || 'Speichern' }
                    </Button>
                    <div className='pl-3 pr-3'>
                        { validationErrors && (
                            <b className='text-danger'>
                                Ungültige Eingabedaten!
                            </b>
                        )}
                    </div>
                </div>
            </SchemaForm>
        </>
    );
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'set-validation-errors':
            return ({
                ...state,
                validationErrors: action.payload
            });
        case 'set-api-error':
            return ({
                ...state,
                apiError: action.payload,
                showErrorModal: true
            })
        case 'hide-error-modal':
            return({
                ...state,
                showErrorModal: false
            })
    }
}


export default DefaultSchemaForm;
