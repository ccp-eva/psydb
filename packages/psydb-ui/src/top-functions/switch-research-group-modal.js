import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { Permissions } from '@mpieva/psydb-common-lib';
import { useUITranslation, SelfContext } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    WithDefaultModal,
    BigNavItem,
} from '@mpieva/psydb-ui-layout';

export const SwitchResearchGroupModal = WithDefaultModal({
    title: 'Select Research Group',
    Body: (ps) => {
        var { onHide } = ps;
        var history = useHistory();
        var translate = useUITranslation();
        var { setSelf, ...self } = useContext(SelfContext);

        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.getAxios().get('/api/self/available-research-groups')
        ), []);

        var send = useSend((researchGroupId) => ({
            type: 'self/set-forced-research-group',
            payload: { researchGroupId }
        }), {
            onSuccessfulUpdate: [
                () => history.push('/'),
                //() => { window.location.reload() },
                // FIXME: we need to refresh the self context here
                //() => { window.location.href = '/' },
                (res, [ researchGroupId ]) => {
                    var oldPermissions = self.permissions;
                    var {
                        hasRootAccess,
                        rolesByResearchGroupId,
                        availableResearchGroupIds
                    } = oldPermissions;

                    setSelf({
                        ...self,
                        permissions: Permissions({
                            hasRootAccess,
                            rolesByResearchGroupId,
                            researchGroupIds: availableResearchGroupIds,
                            forcedResearchGroupId: researchGroupId,
                        }),
                    });
                },
                onHide,
            ]
        })

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }
        var { forcedResearchGroupId } = self.permissions;
        return (
            <div>
                <BigNavItem
                    bg='white'
                    isActive={ !forcedResearchGroupId }
                    onClick={ () => send.exec(null) }
                >
                    { translate('All Available') }
                </BigNavItem>
                { fetched.data.records.map(it => (
                    <BigNavItem
                        key={ it._id }
                        bg='white'
                        isActive={ it._id === forcedResearchGroupId }
                        onClick={ () => send.exec(it._id) }
                    >
                        { it._recordLabel }
                    </BigNavItem>
                ))}
            </div>
        )
    }
})
