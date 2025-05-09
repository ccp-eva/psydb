import React from 'react';
import classnames from 'classnames';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Icons } from '@mpieva/psydb-ui-layout';
import { AccountFunctionDropdown } from '@mpieva/psydb-ui-lib';

import { SwitchResearchGroupModal } from './switch-research-group-modal';
import { ChangePasswordModal } from './change-password-modal';
import { I18NModal } from './i18n-modal';


const TopFunctions = (ps) => {
    var {
        onSignOut,
        extraClassName
    } = ps;

    var translate = useUITranslation();
    var switchRGModal = useModalReducer();
    var changePasswordModal = useModalReducer();
    var i18nModal = useModalReducer();

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
            <I18NModal { ...i18nModal.passthrough } />

            <AccountFunctionDropdown { ...({
                onClickForceResearchGroup: switchRGModal.handleShow,
                onClickChangePassword: changePasswordModal.handleShow,
                onClickI18N: i18nModal.handleShow
            })} />

            <a
                className='btn btn-link p-0 ml-3'
                onClick={ onSignOut }
            >
                <Icons.DoorClosedFill className='align-middle' />
                <u className='d-inline-block ml-1 align-middle'>
                    { translate('Sign Out') }
                </u>
            </a>
        </div>
    )
}

export default TopFunctions;
