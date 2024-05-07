import React from 'react';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';

import ccporb from '../ccp-orb-grayscale2.svg';
import CopyNotice from '../copy-notice';

import CenterBox from './center-box';
import LogoImage from './logo-image';
import LogoImageOverlay from './logo-image-overlay';
import LanguageSelection from './language-selection';

const PublicLayout = (ps) => {
    var { children } = ps;
    var config = useUIConfig();

    var contentWrapperClassName = (
        'p-4 bg-light border-left border-bottom border-right'
    );

    return (
        <>
            <CenterBox>
                <div style={{
                    position: 'relative',
                    //overflow: 'hidden'
                }}>
                    { !config.disableLogoOverlay && (
                        <LogoImageOverlay />
                    )}
                    <LogoImage />
                </div>
                <div
                    className={ contentWrapperClassName }
                    style={{ borderTop: '2px solid var(--primary)' }}
                >
                    { children }
                </div>
                <div className='d-flex justify-content-between flex-row-reverse'>
                    { config.i18n.enableI18NSelect && (
                        <LanguageSelection />
                    )}
                    {/*<div className='mt-2'>
                        <CopyNotice />
                    </div>*/}
                </div>
            </CenterBox>
            <div className='border-top py-3' style={{
                position: 'absolute',
                bottom: '0px',
                width: '500px',
                left: '50%',
                transform: 'translate(-50%, 0%)'
            }}>
                <CopyNotice />
            </div>
        </>
    )
}

export default PublicLayout;
