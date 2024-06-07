import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { unique } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import { Fields, useFormikContext } from '../../../formik';
export const SaneString = Fields.SaneString;
export const GenericEnum = Fields.GenericEnum;
export const ForeignId = Fields.ForeignId;
export const ForeignIdList = Fields.ForeignIdList;
export const DefaultBool = Fields.DefaultBool;

export const DateOnlyTimestamp = (ps) => {
    var { ...pass } = ps;
    var translate = useUITranslation();
    return (
        <Fields.DateOnlyServerSide
            label={ translate('Date') }
            dataXPath='$.timestamp'
            { ...pass }
        />
    );
}

export const Timestamp = (ps) => {
    var { ...pass } = ps;
    var translate = useUITranslation();
    return (
        <Fields.DateTime
            label={ translate('Date/Time') }
            dataXPath='$.timestamp'
            { ...pass }
        />
    );
}

export const Interval = (ps) => {
    var { ...pass } = ps;
    var translate = useUITranslation();
    return (
        <>
            <Fields.DateTime
                label={ translate('Start') }
                dataXPath='$.interval.start'
                { ...pass }
            />
            <Fields.DateTime
                label={ translate('End') }
                dataXPath='$.interval.end'
                { ...pass }
            />
        </>
    );
}

export const IntervalStartOnly = (ps) => {
    var { ...pass } = ps;
    var translate = useUITranslation();
    return (
        <Fields.DateTime
            label={ translate('Date/Time') }
            dataXPath='$.interval.start'
            { ...pass }
        />
    );
}

export const Team = (ps) => {
    var { studyId, disabled } = ps;
    
    var translate = useUITranslation();
    var { setFieldValue } = useFormikContext();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchExperimentOperatorTeamsForStudy({ studyId })
    ), {
        dependencies: [ studyId ],
        extraEffect: (response) => {
            if (response.data && response.data.data) {
                var { records } = response.data.data;
                
                var filtered = records.filter(it => (
                    it.state.hidden !== true
                ));
                
                if (filtered.length === 1) {
                    setFieldValue(
                        '$.labTeamId',
                        filtered[0]._id
                    );
                }
            }
        }
    })

    if (!didFetch) {
        return null;
    }

    var filtered = fetched.data.records.filter(it => (
        it.state.hidden !== true
    ));

    return (
        <Fields.OpsTeamSelect
            label={ translate('Team') }
            dataXPath='$.labTeamId'
            teamRecords={ filtered }
            disabled={ disabled }
        />
    )
}

export const Status = (ps) => {
    var { type, ...pass } = ps;
    var translate = useUITranslation();

    var keys = unique({
        'invite': [
            ...enums.inviteParticipationStatus.keys,
            ...enums.inviteUnparticipationStatus.keys,
        ],
        'away-team': [
            ...enums.awayTeamParticipationStatus.keys,
            ...enums.awayTeamUnparticipationStatus.keys,
        ],
        'online-survey': [
            ...enums.awayTeamParticipationStatus.keys,
            ...enums.awayTeamUnparticipationStatus.keys,
        ]
    }[type]);

    return (
        <Fields.GenericEnum
            label={ translate('Status') }
            dataXPath='$.status'
            options={ translate.options(keys.reduce((acc, key) => ({
                ...acc,
                [key]: `_participationStatus_${key}`
            }), {})) }
            { ...pass }
        />
    );
}

export const ExperimentOperators = (ps) => {
    var translate = useUITranslation();
    return (
        <Fields.ForeignIdList
            label={ translate('Experimenters') }
            dataXPath='$.labOperatorIds'
            collection='personnel'
            required
        />
    )
}

export const LabProcedureType_OLD = (ps) => {
    var { settingsByType, types, disabled } = ps;
    
    var translate = useUITranslation();
    var { setFieldValue } = useFormikContext();

    return (
        <Fields.GenericEnum
            label={ translate('Lab Workflow') }
            dataXPath='$.labProcedureType'
            options={ types.reduce((acc, it) => ({
                ...acc, [it]: enums.labMethods.getLabel(it)
            }), {}) }
            extraOnChange={(next) => {
                if (next === 'online-survey') {
                    setFieldValue('$.labTeamId', undefined);
                    setFieldValue('$.labOperatorIds', undefined);
                }
                setFieldValue('$.locationId', undefined);
                
                if (['inhouse', 'online-video-call'].includes(next)) {
                    var settings = settingsByType[next];
                    var { locations } = settings.state;
                    if (locations.length === 1) {
                        var { locationId } = locations[0];
                        setFieldValue('$.locationId', locationId);
                    }
                }
            }}
            disabled={ disabled }
        />
    )
}

export const InviteLocation = (ps) => {
    var { locationItems, related } = ps;

    var translate = useUITranslation();

    var options = {};
    for (var it of locationItems) {
        var type = it.customRecordTypeKey;
        var id = it.locationId;

        var typeLabel = related.crts.location[type].state.label;
        var idLabel = related.records.location[id]._recordLabel;
        
        options[id] = `${typeLabel} - ${idLabel}`;
    }

    return (
        <Fields.GenericEnum
            label={ translate('Room') }
            dataXPath='$.locationId'
            options={ options }
        />
    )
}

export const ApestudiesWKPRCDefaultLocation = (ps) => {
    var { labMethodSettings, related, disabled, required, readOnly } = ps;
    var { locationTypeKeys } = labMethodSettings.state;
    
    var translate = useUITranslation();
    var { values } = useFormikContext();

    var preselectedType = (
        locationTypeKeys.length === 1
        ? locationTypeKeys[0]
        : undefined
    );

    return (
        <>
            { !preselectedType && (
                <Fields.GenericEnum
                    label={ translate('Location Type') }
                    dataXPath='__locationTypeKey'
                    options={
                        locationTypeKeys.reduce((acc, it) => ({
                            ...acc,
                            [it]: (
                                related.crts
                                .location[it].state.label
                            )
                        }), {})
                    }
                    disabled={ disabled || readOnly }
                    required={ required }
                />
            )}
            <Fields.ForeignId
                label={ translate('Location') }
                dataXPath='$.locationId'
                collection='location'
                recordType={ preselectedType || values.__locationTypeKey }
                disabled={
                    disabled
                    || (!preselectedType && !values.__locationTypeKey)
                }
                readOnly={ readOnly }
                required={ required }
            />
        </>
    )
}

export const AwayLocation = (ps) => {
    var { label, locationId, locationLabel } = ps;

    return (
        <Fields.GenericEnum
            label={ label }
            dataXPath='$.locationId'
            options={{ 
                ...(locationId && {
                    [locationId]: locationLabel
                })
            }}
        />
    )
}
