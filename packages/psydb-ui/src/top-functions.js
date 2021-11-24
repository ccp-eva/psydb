import React, { useContext, useState } from 'react';
import jsonpointer from 'jsonpointer';

import { useHistory } from 'react-router';
import { Permissions } from '@mpieva/psydb-common-lib';
import { useModalReducer, useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { SelfContext } from '@mpieva/psydb-ui-contexts';

import {
    LoadingIndicator,
    Icons,
    WithDefaultModal,
    BigNavItem,
} from '@mpieva/psydb-ui-layout';

import { AccountFunctionDropdown } from '@mpieva/psydb-ui-lib';

const SwitchResearchGroupModal = WithDefaultModal({
    title: 'Forschungsgruppe wechseln',
    Body: (ps) => {
        var { onHide } = ps;
        var history = useHistory();
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
                    onClick={ () => send.exec(null) }
                    isActive={ !forcedResearchGroupId }
                >
                    Alle Verfügbaren
                </BigNavItem>
                { fetched.data.records.map(it => (
                    <BigNavItem
                        key={ it._id }
                        onClick={ () => send.exec(it._id) }
                        isActive={ it._id === forcedResearchGroupId }
                    >
                        { it._recordLabel }
                    </BigNavItem>
                ))}
            </div>
        )
    }
})

const TopFunctions = (ps) => {
    var {
        onSignOut
    } = ps;

    var switchRGModal = useModalReducer();
    var changePasswordModal = useModalReducer();

    return (
        <div
            className='d-flex justify-content-end pt-2 pb-1'
            style={{
                // FIXME: dropdown on behaves wierd when
                // overfloing over small screen bounds
                // it adds white space on the right of the
                // page
                overflowX: 'clip'
            }}
        >
            <SwitchResearchGroupModal { ...switchRGModal.passthrough } />
            <AccountFunctionDropdown { ...({
                onClickForceResearchGroup: switchRGModal.handleShow,
                //onClickChangePassword: changePasswordModal.handleShow
            })} />

            <a
                className='btn btn-link p-0'
                onClick={ onSignOut }
            >
                <Icons.DoorClosedFill className='align-middle' />
                <u className='d-inline-block ml-2 align-middle'>
                    Abmelden
                </u>
            </a>
        </div>
    )
}

export default TopFunctions;
