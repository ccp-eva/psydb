import React from 'react';
import { Icons, A4Wrapper } from '@mpieva/psydb-ui-layout';

const FullScreenSuccess = () => {
    return (
        <A4Wrapper className='bg-light border text-success'>
            <div style={{ width: '20mm', margin: 'auto' }}>
                <Icons.CheckAll style={{
                    width: '20mm', height: '20mm',
                }} />
            </div>
        </A4Wrapper>
    )
}

export default FullScreenSuccess;
