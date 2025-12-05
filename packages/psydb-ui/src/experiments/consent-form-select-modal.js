import React from 'react';
import classnames from 'classnames';
import { JsonBase64 } from '@cdxoo/json-base64';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import {
    WithDefaultModal,
    LoadingIndicator,
    Icons,
} from '@mpieva/psydb-ui-layout';

const ConsentFormSelectModalBody = (ps) => {
    var {
        onHide,
        experimentData,
        modalPayloadData,
        onSuccessfulUpdate,
    } = ps;

    var { _id: experimentId, state: { studyId }} = experimentData.record;
    var { subjectRecord } = modalPayloadData;
    var { _id: subjectId, type: subjectType } = subjectRecord;

    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.study.relatedStudyConsentForms({
            studyId, subjectType,
        })
    }, []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;

    if (records.length < 1) {
        return (
            <Alert variant='info'>
                <i>{ translate('No consent forms found...') }</i>
            </Alert>
        )
    }

    return (
        <nav>
            { records.map((it, ix) => {
                var { _id: studyConsentFormId, state } = it;
                var { internalName } = state;

                var q = JsonBase64.encode({
                    experimentId,
                    subjectId,
                    studyId, studyConsentFormId
                });

                var href = `/#/full-screen/study-consent-doc/fill/?q=${q}`;
                return (
                    <NavItem key={ ix } href={ href } target='_blank'>
                        { internalName }
                    </NavItem>
                );
            }) }
        </nav>
    );
}

const NavItem = (ps) => {
    var { href, bg = 'light', children, ...pass } = ps;

    var className = classnames([
        'd-flex justify-content-between align-items-center',
        `bg-${bg} p-3 border mt-2 mb-2`
    ]);
    
    return (
        <a 
            className='link' style={{ color: '#212529' }}
            href={ href }
            { ...pass }
        >
            <b className={ className } role='button'>
                <span>{ children }</span>
                <Icons.ChevronDoubleRight />
            </b>
        </a>
    )
}

export const ConsentFormSelectModal = WithDefaultModal({
    title: 'Consent Form',
    size: 'lg',
    bodyClassName: 'bg-white pt-3 pr-3 pl-3',
    Body: ConsentFormSelectModalBody,
});

