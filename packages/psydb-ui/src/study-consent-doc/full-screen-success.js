import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Icons, A4Wrapper } from '@mpieva/psydb-ui-layout';

const FullScreenSuccess = () => {
    var [{ translate }] = useI18N();
    return (
        <A4Wrapper className='bg-light border text-success'>
            <div style={{ width: '20mm', margin: 'auto' }}>
                <Icons.CheckAll style={{
                    width: '20mm', height: '20mm',
                }} />
            </div>
            <div className='text-center text-muted small mt-2'>
                { translate('Please close this tab and refresh the consent doc') }
            </div>
        </A4Wrapper>
    )
}

export default FullScreenSuccess;
