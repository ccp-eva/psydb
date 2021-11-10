import React from 'react';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Icons } from '@mpieva/psydb-ui-layout';
import { AccountFunctionDropdown } from '@mpieva/psydb-ui-lib';

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
