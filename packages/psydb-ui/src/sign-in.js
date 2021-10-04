import React, { useEffect, useReducer } from 'react';

import {
    Button
} from 'react-bootstrap'

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import { RJSFCustomTheme } from '@mpieva/psydb-ui-schema-form';

import {
    PublicSignIn
} from '@mpieva/psydb-api-endpoint-schemas'

import { simple as agent } from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(RJSFCustomTheme);

var schema = PublicSignIn.RequestBody();
//var uiSchema = generateUISchema(schema);
var uiSchema = {
    password: {
        'ui:widget': 'password',
    }
}

const SignIn = ({ onSignedIn }) => {
    var [ state, dispatch ] = useReducer(reducer, {});

    var {
        hasError,
        revision
    } = state;

    var onSubmit = ({ formData, ...unused }) => (
        agent.post('/api/sign-in', formData)
        .then(
            (response) => {
                onSignedIn();
            },
            (error) => {
                if (error.response.status === 401) {
                    dispatch({ type: 'login-error' })
                }
                else {
                    throw error;
                }
            }
        )
    );

    return (
        <div 
            style={{
                minWidth: '500px',
                position: 'absolute',
                top: '38%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <h5
                className='pt-3 pb-3 pl-4 text-white m-0'
                style={{ background: '#006c66'}}
            >
                PsyDB Login
            </h5>
            <div className='p-4 bg-light border-left border-bottom border-right'>
                <SchemaForm
                    key={ revision }
                    noHtml5Validate={ true }
                    showErrorList={ false }
                    schema={ schema }
                    uiSchema={ uiSchema }
                    onSubmit={ onSubmit }
                >
                    <div className='d-flex justify-content-between align-items-center pt-2'>
                        <div>
                            { hasError && (
                                <span className='text-danger'>
                                    Ungültige Anmeldedaten!
                                </span>
                            )}
                        </div>
                        <Button type='submit'>
                            Anmelden
                        </Button>
                    </div>
                </SchemaForm>
            </div>
        </div>
    )
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'login-error':
            return {
                ...state,
                hasError: true,
                revision: (state.revision || 0) + 1
            }
    }
}


export default SignIn
