import React from 'react';
import { useHistory } from 'react-router';
import { useModalReducer, useFetch, useSend } from '@mpieva/psydb-ui-hooks';

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

        var [ didFetch, fetched ] = useFetch((agent) => (
            agent.getAxios().get('/api/self/research-groups')
        ), []);

        var send = useSend((researchGroupId) => ({
            type: 'personnel/set-forced-research-group',
            payload: { researchGroupId }
        }), {
            onSuccessfulUpdate: [
                () => history.push('/'),
                onHide,
            ]
        })

        if (!didFetch) {
            return <LoadingIndicator size='lg' />
        }
        return (
            <div>
                { fetched.data.records.map(it => (
                    <BigNavItem
                        key={ it._id }
                        onClick={ () => send.exec(it._id)}
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
