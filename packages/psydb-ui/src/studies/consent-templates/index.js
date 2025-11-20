import React, { useState } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer, useRevision, usePermissions }
    from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, Icons, Button, Alert }
    from '@mpieva/psydb-ui-layout';

const ConsentTemplates = (ps) => {
    var { studyId } = ps;
    
    var [{ translate }] = useI18N();
    
    var revision = useRevision();
    var [ showHidden, setShowHidden ] = useState();
    var [ createModal, editModal, hideModal ] = useModalReducer.many(3);

    return (
        <div className=''>
            <div className='d-flex justify-content-between mb-3'>
                <Button size='sm' onClick={ createModal.handleShow }>
                    { '+ ' + translate('New Template') }
                </Button>
                <div
                    role='button'
                    className='d-flex align-items-center text-primary'
                    onClick={ () => setShowHidden(!showHidden) }
                >
                    {
                        showHidden 
                        ? <Icons.CheckSquareFill />
                        : <Icons.Square />
                    }
                    <span className='ml-2'>
                        { translate('Show Hidden') }
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ConsentTemplates;
