import React from 'react';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';

const LogoImage = (ps) => {
    var config = useUIConfig();
    var [{ language }] = useI18N();

    var { logos, style } = config.branding.landing;

    return (
        <img
            style={ style }
            src={ logos[language] || logos.en } alt=''
        />
    )
}

export default LogoImage;
