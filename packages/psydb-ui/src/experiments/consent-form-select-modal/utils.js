import React, { useState } from 'react';
import { JsonBase64 } from '@cdxoo/json-base64';

import { merge } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Grid, Button, InputGroup } from '@mpieva/psydb-ui-layout';
import { PlainCheckbox, GenericEnum } from '@mpieva/psydb-ui-form-controls';

const usePersonnelOptions = ({ excludedIds = [] }) => {
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.personnel.list({
            target: 'optionlist',
            filters: {},
            limit: 1000,
            offset: 0,
        })
    ), []);

    if (!didFetch) {
        return undefined;
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

    return options;
}

export const PersonnelDropdown = (ps) => {
    var { value, onChange, excludedIds = [] } = ps;

    var options = usePersonnelOptions({ excludedIds });
    if (!options) {
        return null;
    }

    return (
        <GenericEnum
            options={ options }
            value={ value }
            onChange={ onChange }
        />
    )
}

export const AddLabOperatorDropdown = (ps) => {
    var { onAdd, excludedIds = [] } = ps;

    var [{ translate }] = useI18N();
    var [ selected, setSelected ] = useState();

    var options = usePersonnelOptions({ excludedIds });
    if (!options) {
        return null;
    }

    var handleAdd = () => {
        onAdd({ _id: selected, label: options[selected] });
        setSelected(undefined);
    }

    return (
        <InputGroup>
            <GenericEnum
                options={ options }
                value={ selected }
                onChange={ setSelected }
            />
            <InputGroup.Append>
                <Button
                    disabled={ !selected || !options[selected] }
                    onClick={ handleAdd }
                >
                    { translate('Add') }
                </Button>
            </InputGroup.Append>
        </InputGroup>
    )
}

export const LabOperatorCheckbox = (ps) => {
    var { _id, label, related, selection } = ps;
    
    return (
        <PlainCheckbox
            id={ _id }
            label={ label || fromRelated(related, _id) }
            value={ selection.value.includes(_id) }
            onChange={ () => selection.toggle(_id) }
        />
    )
}

export const ConsentObtainedByRadio = (ps) => {
    var { _id, related, value, onChange } = ps;

    // NOTE: id needs to differ from the lab operator checkbox
    // as the label 'for' would toggle that one otherwise
    return (
        <PlainCheckbox
            type='radio'
            id={ `consentObtainedBy-${_id}` }
            name='consentObtainedBy'
            label={ fromRelated(related, _id) }
            checked={ value === _id }
            onChange={ () => onChange(_id) }
            useRawOnChange={ true }
        />
    )
}

export const GotoButton = (ps) => {
    var {
        experimentId, subjectId, studyId,
        studyConsentFormId, labOperatorIds, consentObtainedBy
    } = ps;
    
    var [{ translate }] = useI18N();
                
    var q = JsonBase64.encode({
        experimentId, subjectId, studyId,
        studyConsentFormId, labOperatorIds, consentObtainedBy
    });

    var href = `/#/full-screen/study-consent-doc/fill/?q=${q}`;
    var isDisabled = (
        !studyConsentFormId || !labOperatorIds.length || !consentObtainedBy
    );
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

