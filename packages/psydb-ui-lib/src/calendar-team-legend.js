import React from 'react';
import { groupBy } from '@mpieva/psydb-core-utils';
import { SplitPartitioned, ColoredBox } from '@mpieva/psydb-ui-layout';

const CalendarTeamLegend = (ps) => {
    var {
        studyRecords,
        experimentOperatorTeamRecords,
        //onClickStudy,
        activeTeamIds = [],
        onClickTeam,
    } = ps;

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
            <b className='d-block mb-2'><u>Legende</u></b>
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
        <SplitPartitioned extraClassName='mb-1' partitions={[ 1, 20 ]}>
            <b>{ studyRecord.state.shorthand }</b>
            <div className='d-flex'>
                { experimentOperatorTeamRecords.map((it, ix) => {
                    var extraStyle = undefined;
                    if (activeTeamIds.includes(it._id)) {
                        extraStyle = { fontWeight: 'bold' };
                    }
                    return (
                        <ColoredBox
                            key={ ix }
                            onClick={ () => (onClickTeam && onClickTeam(it)) }
                            className='border px-3 ml-1'
                            bg={ it.state.color }
                            extraStyle={{
                                cursor: 'pointer',
                                ...extraStyle
                            }}
                        >
                            { it.state.name }
                        </ColoredBox>
                    );
                })}
            </div>
        </SplitPartitioned>
    )
}

export default CalendarTeamLegend;
