import React from 'react';
import { useUIConfig, useUILanguage } from '@mpieva/psydb-ui-contexts';

const LogoImage = (ps) => {
    var config = useUIConfig();
    var [ language ] = useUILanguage();

    var { logos, style } = config.branding.landing;

    return (
        <img
            style={ style }
            src={ logos[language] || logos.en } alt=''
        />
    )
}

export default LogoImage;
