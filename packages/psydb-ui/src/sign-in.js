import React, { useEffect } from 'react';

import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'

import {
    PublicSignIn
} from '@mpieva/psydb-api-endpoint-schemas'

import { simple as agent } from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(Bootstrap4Theme);

var schema = PublicSignIn.RequestBody();
//var uiSchema = generateUISchema(schema);
var uiSchema = {
    password: {
        'ui:widget': 'password',
    }
}

const SignIn = ({ onSignedIn }) => {
    
    var onSubmit = ({ formData, ...unused }) => (
        agent.post('/api/sign-in', formData)
        .then(
            (response) => {
                console.log('signed in', response);
                onSignedIn();
            },
            (error) => {
                console.log('ERR:', error)
                alert('TODO')
            }
        )
    );

    return (
        <div>
            Login
            <SchemaForm
                schema={ schema }
                uiSchema={ uiSchema }
                onSubmit={ onSubmit }
            >
                <div>
                    <button type="submit" className="btn btn-info">
                        Anmelden
                    </button>
                </div>
            </SchemaForm>
        </div>
    )
}

export default SignIn
