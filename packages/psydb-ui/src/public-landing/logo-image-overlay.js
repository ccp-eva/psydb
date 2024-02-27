import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const LogoImageOverlay = () => {
    var translate = useUITranslation();

    return (
        <h5
            className='py-2 m-0 border-top text-muted'
            style={{
                textAlign: 'right',
                width: '315px',
                position: 'absolute',
                right: 0,
                bottom: '5px',
                paddingLeft: '20px',
                paddingRight: '30px',
                //background: '#006c66'
                //color: '#006c66',
                //color: '#555'
            }}
        >
            { translate('PsyDB Sign In') }
        </h5>
    )
}

export default LogoImageOverlay;
