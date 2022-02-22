import React from 'react';
import classnames from 'classnames';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Icons } from '@mpieva/psydb-ui-layout';
import { AccountFunctionDropdown } from '@mpieva/psydb-ui-lib';

import { SwitchResearchGroupModal } from './switch-research-group-modal';
import { ChangePasswordModal } from './change-password-modal';


const TopFunctions = (ps) => {
    var {
        onSignOut,
        extraClassName
    } = ps;

    var switchRGModal = useModalReducer();
    var changePasswordModal = useModalReducer();

    var className = classnames([
        'd-flex justify-content-end pt-2 pb-1 media-print-hidden',
        extraClassName,
    ]);

    return (
        <div
            className={ className }
            style={{
                // FIXME: dropdown on behaves wierd when
                // overfloing over small screen bounds
                // it adds white space on the right of the
                // page
                overflowX: 'clip'
            }}
        >
            <SwitchResearchGroupModal { ...switchRGModal.passthrough } />
            <ChangePasswordModal { ...changePasswordModal.passthrough } />
            <AccountFunctionDropdown { ...({
                onClickForceResearchGroup: switchRGModal.handleShow,
                onClickChangePassword: changePasswordModal.handleShow
            })} />

            <a
                className='btn btn-link p-0 ml-3'
                onClick={ onSignOut }
            >
                <Icons.DoorClosedFill className='align-middle' />
                <u className='d-inline-block ml-1 align-middle'>
                    Abmelden
                </u>
            </a>
        </div>
    )
}

export default TopFunctions;
