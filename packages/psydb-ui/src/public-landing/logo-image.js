import React from 'react';
import { useUIConfig, useUILanguage } from '@mpieva/psydb-ui-contexts';
import branding from '../branding';

const LogoImage = (ps) => {
    var config = useUIConfig();
    var [ language ] = useUILanguage();

    var design = config.whitelabelDesign || 'mpiccp';
    var { logos, style } = branding[design].landing;

    return (
        <img
            style={ style }
            src={ logos[language] || logos.en } alt=''
        />
    )
}

export default LogoImage;
