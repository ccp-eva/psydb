import React from 'react';
import { Button, Icons } from '@mpieva/psydb-ui-layout';

export const EditButton = (ps) => {
    var {
        hasErrors,
        disabled,
        onClick
    } = ps;

    return (
        <Button
            className={ disabled ? '' : 'bg-white' }
            variant={ hasErrors ? 'outline-danger' : 'outline-primary' }
            onClick={ onClick }
            disabled={ disabled }
            title='Wert Ändern'
        >
            <Icons.PencilFill style={{ marginTop: '-3px' }}/>
        </Button>
    )
}

export const ClearButton = (ps) => {
    var {
        hasErrors,
        disabled,
        onClick
    } = ps;

    return (
        <Button
            className={ disabled ? '' : 'bg-white' }
            variant={ 'outline-secondary' }
            onClick={ onClick }
            disabled={ disabled }
            title='Zurücksetzen'
        >
            <Icons.XLg style={{
                height: '13px',
                width: '13px',
                marginTop: '-2px'
            }} />
        </Button>
    )
}
