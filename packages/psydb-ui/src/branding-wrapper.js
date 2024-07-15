import React, { useEffect, useState } from 'react';
import { entries } from '@mpieva/psydb-core-utils';
import { useUIConfig } from '@mpieva/psydb-ui-contexts';

import branding from './branding';
import DevPanel from './dev-panel';

const BrandingWrapper = (ps) => {
    var { children } = ps;
    var config = useUIConfig();

    var setBrandingBodyCSS = (theBranding) => {
        var { cssvars } = branding[theBranding];
        for (var [ key, value ] of entries(cssvars)) {
            document.body.style.setProperty(key, value);
        }
    }

    var [ isCSSDone, setCSSDone ] = useState(false);
    useEffect(() => {
        setBrandingBodyCSS(config.branding);
        setCSSDone(true)
    }, [ config.branding ]);

    if (!isCSSDone) {
        return null;
    }

    return (
        <>
            { config.dev_enableStagingBanner && (
                <h3
                    className='pr-2 pl-2 border-right border-bottom text-danger border-danger'
                    style={{ position: 'absolute', backgroundColor: '#ffffffaa'}}
                >
                    <b>STAGING-SYSTEM</b>
                </h3>
            )}
            { config.dev_enableDevPanel && (
                <DevPanel />
            )}
            <div className={ config.branding || 'mpiccp' }>
                { children }
            </div>
        </>
    )
}

export default BrandingWrapper;
