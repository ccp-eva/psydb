import React from 'react';
import { only } from '@mpieva/psydb-core-utils';

import {
    TwoFactorAuthCodeMismatch,
    checkIfAnyTwoFactorStatusCode
} from './two-factor-status-helper';

import TwoFactorCodeInput from './two-factor-code-input';
import SignIn from './sign-in';

const PublicLanding = (ps) => {
    var { authResponseStatus } = ps;

    var pass = only({ from: ps, keys: [
        'authResponseCode',
        'onSuccessfulUpdate',
        'onFailedUpdate',
    ]});

    return (
        checkIfAnyTwoFactorStatusCode(authResponseStatus)
        ? <TwoFactorCodeInput { ...pass } />
        : <SignIn { ...pass } />
    )
}

export default PublicLanding;
