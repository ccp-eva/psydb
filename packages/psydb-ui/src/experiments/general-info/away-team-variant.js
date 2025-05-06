import React from 'react';
import { __fixDefinitions } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Pair, Split, EditIconButtonInline } from '@mpieva/psydb-ui-layout';
import { formatDateInterval, datefns } from '@mpieva/psydb-ui-lib';

import { EditExperimentCommentModal } from '@mpieva/psydb-ui-lib/src/modals';
import TeamNameAndColor from '@mpieva/psydb-ui-lib/src/team-name-and-color';


const AwayTeamVariant = (ps) => {
    var {
        experimentId,
        experimentTypeLabel,
        studyLabel,
        firstResearchGroupId,
        researchGroupLabel,
        interval,

        locationData,

        opsTeamData,
        comment,
        onSuccessfulUpdate
    } = ps;

    var commentModal = useModalReducer();
    var [{ translate, locale, language }] = useI18N();

    var { type: locationType } = locationData.record;

    var weekStart = datefns.startOfWeek(new Date(interval.start));
    var weekStartTimestamp = weekStart.getTime();
    
    var { startDate } = formatDateInterval(interval, { locale });

    return (
        <>
            <EditExperimentCommentModal
                { ...commentModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Split num={2}>
                <div>
                    <Pair label={ translate('Study') }>
                        { studyLabel }
                    </Pair>
                    <Pair label={ translate('Team') }>
                        { 
                            opsTeamData
                            ? <TeamNameAndColor
                                teamRecord={ opsTeamData.record }
                            />
                            : translate('Unknown')
                        }
                    </Pair>
                    <Pair label={ translate('Date') }>
                        <a href={`#/calendars/away-team/${locationType}/${firstResearchGroupId}?d=${weekStartTimestamp}`}>
                            { startDate }
                        </a>
                    </Pair>
                    <Pair label={ translate('Research Group') }>
                        { researchGroupLabel }
                    </Pair>
                    <Pair label={ translate('Type') }>
                        { translate(experimentTypeLabel) }
                    </Pair>
                </div>
                <div>
                    <LocationFields { ...locationData } />
                </div>
            </Split>
            <header className='mt-3'>
                <b>{ translate('Comment') }</b>
                <EditIconButtonInline
                    onClick={ () => commentModal.handleShow({
                        experimentId,
                        experimentComment: comment
                    }) }
                />
            </header>
            <div className='px-3 py-2 bg-white border'>
                { comment ? (
                    comment
                ) : (
                    <i className='text-muted'>
                        { translate('No Comment') }
                    </i>
                )}
            </div>
        </>
    )
};

const LocationFields = (ps) => {
    var { record, related, displayFieldData, recordTypeLabel } = ps;
    var [ i18n ] = useI18N();
    var { translate } = i18n;

    // FIXME
    displayFieldData = __fixDefinitions(displayFieldData);

    return (
        <>
            <Pair label={ translate('Location Type') }>
                { recordTypeLabel }
            </Pair>
            <div className='ml-3 pl-3' style={{
                borderLeft: '3px solid #dfe0e1'
            }}>
                { displayFieldData.map((definition, ix) => {
                    var { systemType } = definition;
                    var stringify = Fields[systemType]?.stringifyValue;

                    var label = translate.fieldDefinition(definition);
                    var value = stringify ? (
                        stringify({ record, definition, related, i18n })
                    ) : '[!!ERROR!!]';

                    return (
                        <Pair key={ ix } wLeft={ 3 } label={ label }>
                            { value }
                        </Pair>
                    )
                })}
            </div>
        </>
    )
}

export default AwayTeamVariant;
