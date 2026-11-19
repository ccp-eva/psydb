import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import {
    SmallFormFooter,
    Button,
    AsyncButton
} from '@mpieva/psydb-ui-layout';

const ButtonHeader = (ps) => {
    var { onSubmit, onClickBack, isTransmitting, enableSubmit } = ps;
    var [{ translate }] = useI18N();

    return (
        <SmallFormFooter>
            <AsyncButton
                onSubmit={ onSubmit }
                isTransmitting={ isTransmitting }
                disabled={ !enableSubmit }
            >
                { translate('Import') }
            </AsyncButton>
            <Button
                disabled={ isTransmitting }
                variant='outline-primary'
                onClick={ onClickBack }
            >
                { translate('Back') }
            </Button>
        </SmallFormFooter>
    )
}

export default ButtonHeader;
