import React, { useEffect } from 'react';
import SchemaForm from '@rjsf/core';
import axios from 'axios';

import {
    PublicSignIn
} from '@mpieva/psydb-api-endpoint-schemas'

var schema = PublicSignIn.RequestBody();
//var uiSchema = generateUISchema(schema);
var uiSchema = {
    password: {
        'ui:widget': 'password',
    }
}

const SignIn = ({ onSignedIn }) => {
    
    var onSubmit = (formvalue) => (
        axios.post('/api/sign-in', formvalue)
        .then(
            (res) => {
                console.log('signed in', res);
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
