import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SplitPartitioned, ColoredBox } from '@mpieva/psydb-ui-layout';

const CalendarTeamLegend = (ps) => {
    var {
        studyRecords,
        experimentOperatorTeamRecords,
        //onClickStudy,
        activeTeamIds = [],
        onClickTeam,
    } = ps;

    var translate = useUITranslation();

    var teamsForStudy = groupBy({
        items: experimentOperatorTeamRecords,
        byProp: 'studyId'
    })

    if (experimentOperatorTeamRecords.length < 1) {
        return null;
    }

    return (
        <div>
            <hr />
            <b className='d-block mb-2'><u>
                { translate('Legend') }
            </u></b>
            <table>
                <tbody>
                    { studyRecords.map((study, ix) => {
                        var teams = teamsForStudy[study._id];
                        if (!teams) {
                            return null;
                        }
                        return (
                            <StudyRow
                                key={ ix }
                                studyRecord={ study }
                                experimentOperatorTeamRecords={ teams }
                                activeTeamIds={ activeTeamIds }
                                onClickTeam={ onClickTeam }
                            />
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

const StudyRow = (ps) => {
    var {
        studyRecord,
        experimentOperatorTeamRecords,
        activeTeamIds,
        onClickTeam
    } = ps;

    return (
        <tr>
            <td className='pr-3'>
                <b>{ studyRecord.state.shorthand }</b>
            </td>
            <td>
                <div className='d-flex flex-wrap'>
                    { experimentOperatorTeamRecords.map((it, ix) => {
                        var extraStyle = undefined;
                        if (activeTeamIds.includes(it._id)) {
                            extraStyle = { fontWeight: 'bold' };
                        }
                        return (
                            <ColoredBox
                                key={ ix }
                                onClick={ () => (onClickTeam && onClickTeam(it)) }
                                className='border px-3 ml-1 mb-1'
                                bg={ it.state.color }
                                extraStyle={{
                                    ...(onClickTeam && {
                                        cursor: 'pointer',
                                    }),
                                    ...extraStyle
                                }}
                            >
                                { it.state.name }
                                { it._upcomingExperimentCount && (
                                    ` (${it._upcomingExperimentCount})`
                                )}
                            </ColoredBox>
                        );
                    })}
                </div>
            </td>
        </tr>
    )
}

export default CalendarTeamLegend;
