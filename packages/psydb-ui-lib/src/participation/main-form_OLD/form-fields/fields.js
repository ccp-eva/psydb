import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import { Fields, useFormikContext } from '../../../formik';
export const DefaultBool = Fields.DefaultBool;

export const Timestamp = (ps) => {
    var translate = useUITranslation();
    return (
        <Fields.DateTime
            label={ translate('Date/Time') }
            dataXPath='$.timestamp'
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
                        '$.experimentOperatorTeamId',
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
            dataXPath='$.experimentOperatorTeamId'
            teamRecords={ filtered }
            disabled={ disabled }
        />
    )
}

export const Status = (ps) => {
    var { type } = ps;
    var translate = useUITranslation();

    var options = ({
        'invite': {
            ...enums.inviteParticipationStatus.mapping,
            ...enums.inviteUnparticipationStatus.mapping,
        },
        'away-team': {
            ...enums.awayTeamParticipationStatus.mapping,
            ...enums.awayTeamUnparticipationStatus.mapping,
        },
        'online-survey': {
            ...enums.awayTeamParticipationStatus.mapping,
            ...enums.awayTeamUnparticipationStatus.mapping,
        }
    }[type]);

    return (
        <Fields.GenericEnum
            label={ translate('Status') }
            dataXPath='$.status'
            options={ Object.keys(options).reduce((acc, key) => ({
                ...acc, [key]: translate('_participationStatus_' + key)
            }), {}) }
        />
    );
}

export const ExperimentOperators = (ps) => {
    var translate = useUITranslation();
    return (
        <Fields.ForeignIdList
            label={ translate('Experimenters') }
            dataXPath='$.experimentOperatorIds'
            collection='personnel'
        />
    )
}

export const LabProcedureType = (ps) => {
    var { settingsByType, types, disabled } = ps;
    var translate = useUITranslation();
    var { setFieldValue } = useFormikContext();

    return (
        <Fields.GenericEnum
            label={ translate('Lab Workflow') }
            dataXPath='$.labProcedureType'
            options={ types.reduce((acc, it) => ({
                ...acc, [it]: enums.LabMethods.getLabel(it)
            }), {}) }
            extraOnChange={(next) => {
                if (next === 'online-survey') {
                    setFieldValue('$.experimentOperatorTeamId', undefined);
                    setFieldValue('$.experimentOperatorIds', undefined);
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
    var { locations, related } = ps;
    var translate = useUITranslation();
    return (
        <Fields.GenericEnum
            label={ translate('Room') }
            dataXPath='$.locationId'
            options={ locations.reduce((acc, it) => {
                var type = it.customRecordTypeKey;
                var id = it.locationId;

                var typeLabel = (
                    related.crts.location[type].state.label
                );
                var idLabel = (
                    related.records.location[id]._recordLabel
                )

                return { ...acc, [id]: `${typeLabel} - ${idLabel}` }
            }, {}) }
        />
    )
}

export const AwayLocation = (ps) => {
    var { label, locationId, locationLabel, disabled } = ps;

    return (
        <Fields.GenericEnum
            label={ label }
            dataXPath='$.locationId'
            options={{ 
                ...(locationId && {
                    [locationId]: locationLabel
                })
            }}
            disabled={ disabled }
        />
    )
}
