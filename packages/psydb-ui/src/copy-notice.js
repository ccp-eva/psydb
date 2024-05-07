import React from 'react';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';
import ccporbgrey from './ccp-orb-grayscale2.svg';
import ccporb from './ccp-orb.svg';

const CopyNotice = (ps) => {
    var { copyNoticeGreyscale = true } = useUIConfig();
    return (
        <a
            href='https://www.eva.mpg.de/comparative-cultural-psychology'
            className='text-light'
        >
            <div className='d-flex align-items-center'>
                <img style={{
                    height: '22px',
                    opacity: copyNoticeGreyscale ? '0.4' : '0.8'
                }} src={ copyNoticeGreyscale ? ccporbgrey : ccporb } alt='' />
                <div style={{
                    marginLeft: '5px',
                    fontSize: '0.7rem',
                    lineHeight: '110%',
                    color: '#b5b5b5',
                }}>
                    &copy;2024 MPI EVA<br />
                    Department of Comparative Cultural Psychology
                </div>
            </div>
        </a>
    )
}

export default CopyNotice;
