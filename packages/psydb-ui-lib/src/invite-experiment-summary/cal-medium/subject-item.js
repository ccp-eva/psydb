import React from 'react';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import {
    StudyConsentDocIconButton_TODO,
    StudyConsentDocIconButton_DONE,
} from '@mpieva/psydb-ui-layout';

import ExperimentSubjectDropdown from '../../experiment-subject-dropdown';


const SubjectItem = (ps) => {
    var {
        inviteType,
        subjectDataItem,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        
        hasStudyConsentDoc,
        onClickConsent,
        onClickComment,
        onClickMove,
        onClickFollowUp,
        onClickRemove,

        onClickConfirm,
        onClickMailbox,
        onClickContactFailed,
    } = ps;

    var [{ translate }] = useI18N();

    var { subjectId, invitationStatus, comment } = subjectDataItem;
    var subjectRecord = subjectRecordsById[subjectId];

    // FIXME
    subjectRelated = __fixRelated(subjectRelated, { isResponse: false });
    subjectDisplayFieldData = __fixDefinitions(
        Array.isArray(subjectDisplayFieldData)
        ? subjectDisplayFieldData
        : subjectDisplayFieldData[subjectRecord.type]
    );

    return (
        <li>
            <div className='d-flex mb-1'>
                <div className='flex-grow'>
                    { subjectDisplayFieldData.map((def, ix) => (
                        <DisplayPair
                            key={ ix }
                            record={ subjectRecord }
                            definition={ def }
                            related={ subjectRelated }
                        />
                    ))}
                    { comment && (
                        <div className='d-flex'>
                            <span style={{ width: '90px' }}>
                                { translate('Comment') }
                            </span>
                            <i className='flex-grow ml-3'>{ comment }</i>
                        </div>
                    )}
                </div>
                <div
                    style={{ width: '35px' }}
                    className='d-flex flex-column align-items-center'
                >
                    <ExperimentSubjectDropdown { ...({
                        experimentType: inviteType,
                        variant: 'calendar',
                        subjectRecord,
                        
                        onClickConsent,
                        onClickComment,
                        onClickMove,
                        onClickFollowUp,
                        onClickRemove,

                        onClickConfirm,
                        onClickMailbox,
                        onClickContactFailed,
                    }) } />
                    { onClickConsent && (
                        <StudyConsentDocIconButton { ...({
                            hasStudyConsentDoc,
                            onClick: () => onClickConsent({ subjectRecord }),
                        }) } />
                    )}
                    { invitationStatus !== 'scheduled' && (
                        <b 
                            className='pl-2 pr-2'
                            style={{ fontSize: '120%', border: '1px solid' }}
                        >
                            { translate(invitationStatusLabels[invitationStatus] )}
                        </b>
                    )}
                </div>
            </div>
        </li>
    )
}

const StudyConsentDocIconButton = (ps) => {
    var { hasStudyConsentDoc, onClick } = ps;
    var IconButton = (
        hasStudyConsentDoc
        ? StudyConsentDocIconButton_DONE
        : StudyConsentDocIconButton_TODO
    );
    return (
        <IconButton
            onClick={ onClick }
            buttonProps={{ variant: 'other' }}
            buttonStyle={{ color: 'inherit', marginTop: 0, marginLeft: '2px' }}
        />
    );
}

const DisplayPair = (ps) => {
    var { record, definition, related } = ps;
    var [ i18n ] = useI18N();
    var { translate } = i18n;

    var { systemType } = definition;
    var stringify = Fields[systemType]?.stringifyValue;
    
    var label = translate.fieldDefinition(definition);
    var value = stringify ? (
        stringify({ record, definition, related, i18n })
    ) : '[!!ERROR!!]';

    if (value === '' || value === null || value === undefined) {
        return null;
    }
    else {
        return (
            <div className='d-flex'>
                <span style={{ width: '90px' }}>{ label }</span>
                <b className='flex-grow ml-3'>{ value }</b>
            </div>
        )
    }
}

const invitationStatusLabels = {
    'confirmed': 'confirmed_icon',
    'mailbox': 'mailbox_icon',
    'contact-failed': 'contact-failed_icon',
}

export default SubjectItem;
