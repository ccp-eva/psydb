import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PageWrappers } from '@mpieva/psydb-ui-layout';

const PageWrapper = (ps) => {
    var { children } = ps;

    var { url } = useRouteMatch();
    var translate = useUITranslation();

    return (
        <PageWrappers.Level1
            title={ translate('Calendars') }
            titleLinkUrl={ url }
        >
            { children }
        </PageWrappers.Level1>
    );
}

export default PageWrapper;
