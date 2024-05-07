import React from 'react';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';

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
            { config.i18n.enableI18NSelect && (
                <LanguageSelection />
            )}
        </CenterBox>
    )
}

export default PublicLayout;
