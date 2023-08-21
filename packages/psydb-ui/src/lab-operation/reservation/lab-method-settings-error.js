import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Alert, Icons } from '@mpieva/psydb-ui-layout';

const LabMethodSettingsError = (ps) => {
    var { studyRecord, urlAffix = '', children } = ps;
    var { _id: studyId, type: studyType } = studyRecord;
    
    var translate = useUITranslation();
    
    return (
        <Alert variant='danger' className='mt-3'>
            { children }
            <br />
            <a 
                className='text-reset'
                href={`#/studies/${studyType}/${studyId}${urlAffix}`}
            >
                <b>{ translate('Go To Study Settings') }</b>
                {' '}
                <Icons.ArrowRightShort style={{
                    height: '20px',
                    width: '20px', marginTop: '-3px'
                }} />
            </a>
        </Alert>
    )
}

export default LabMethodSettingsError;
