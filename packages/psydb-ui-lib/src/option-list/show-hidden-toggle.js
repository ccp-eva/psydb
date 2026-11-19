import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Icons } from '@mpieva/psydb-ui-layout';

const ShowHiddenToggle = (ps) => {
    var { showHidden, setShowHidden } = ps;
    var [{ translate }] = useI18N();

    return (
        <div
            role='button'
            className='d-flex align-items-center text-primary'
            onClick={ () => setShowHidden(!showHidden) }
        >
            { showHidden ? (
                <Icons.CheckSquareFill />
            ) : (
                <Icons.Square />
            )}
            <span className='ml-2'>
                { translate('Show Hidden') }
            </span>
        </div>
    )
}

export default ShowHiddenToggle;
