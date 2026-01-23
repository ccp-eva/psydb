import React from 'react';

import { withContext, composeAsComponent }
    from '@cdxoo/react-compose-contexts';
import { PublicAgent }
    from '@mpieva/psydb-ui-request-agents'
import { AgentContext, UIConfigContext, I18NContext }
    from '@mpieva/psydb-ui-contexts';

const ContextComposition = composeAsComponent(
    withContext(UIConfigContext, 'config'),
    withContext(I18NContext, 'i18n'),
    withContext(AgentContext, 'agent')
);

const PublicContexts = (ps) => {
    var { children, config, i18n, agent = PublicAgent } = ps;
    var contextBag = { config, i18n, agent };
    return (
        <ContextComposition { ...contextBag }>
            { children }
        </ContextComposition>
    )
}

export default PublicContexts;
