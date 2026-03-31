import React from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';

import { merge } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Grid, Button } from '@mpieva/psydb-ui-layout';
import { PlainCheckbox, GenericEnum } from '@mpieva/psydb-ui-form-controls';

export const LabOperatorDropdown = (ps) => {
    var { selection, excludedIds = [] } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.personnel.list({
            target: 'optionlist',
            filters: {},
            limit: 1000,
            offset: 0,
        })
    ), []);

    if (!didFetch) {
        return null;
    }

    var { records } = fetched.data;
    var options = {};
    for (var it of records) {
        // FIXME: pass to fetch
        if (excludedIds.includes(it._id)) {
            continue;
        }

        var { firstname, lastname } = it.gdpr.state;
        options[it._id] = `${firstname} ${lastname}`;
    }

    // NOTE: this should be fine as all the ids that are possible
    // to select in other ways (i.e. multiple ids sleected)
    // are excluded
    var [ selected ] = selection.value;
    return (
        <GenericEnum
            options={ options }
            value={ selected }
            onChange={ (next) => selection.set(next) }
        />
    )
}

export const LabOperatorCheckbox = (ps) => {
    var { _id, related, selection } = ps;
    
    return (
        <PlainCheckbox
            id={ _id }
            label={ fromRelated(related, _id) }
            value={ selection.value.includes(_id) }
            onChange={ () => selection.toggle(_id) }
        />
    )
}

export const GotoButton = (ps) => {
    var {
        experimentId, subjectId, studyId,
        studyConsentFormId, labOperatorIds
    } = ps;
    
    var [{ translate }] = useI18N();
                
    var q = JsonBase64.encode({
        experimentId, subjectId, studyId,
        studyConsentFormId, labOperatorIds
    });

    var href = `/#/full-screen/study-consent-doc/fill/?q=${q}`;
    var isDisabled = (!studyConsentFormId || !labOperatorIds.length);
    return (
        <a target='_blank' href={ href }>
            <Button disabled={ isDisabled }>
                { translate('Go to Consent ->') }
            </Button>
        </a>
    )
}

export const fromRelated = (related, ...args) => {
    if (args.length === 1) {
        var _id = args[0];

        var found = undefined;
        if (related.records[_id]) {
            return related.records[_id]._recordLabel;
        }
        for (var bucket of Object.values(related.records)) {
            if (bucket[_id]) {
                return bucket[_id]._recordLabel;
            }
        }
    }
    else {
        throw new Error('TODO')
    }
}

