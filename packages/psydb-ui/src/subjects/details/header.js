import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUITranslation, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { LinkButton, Button } from '@mpieva/psydb-ui-layout';

import SelectSubjectContainer from './select-subject-container';

const Header = ({
    title,
    editLabel,
    editUrl,
    onEditClick,
    canEdit,
    
    historyLabel,
    historyUrl,
    canHistory,

    experimentSearchUrl,

    subjectId,
    subjectType,
    canWriteParticipation,
    canSelectSubjects,
    canSelectSubjectsForExperiments,
}) => {
    var { path, url } = useRouteMatch();
    var translate = useUITranslation();
    var { dev_enableWKPRCPatches } = useUIConfig();

    title = title || translate('Record Details');
    editLabel = editLabel || translate('Edit');
    historyLabel = historyLabel || translate('History');

    return (
        <h5 className='d-flex justify-content-between align-items-start'>
            <span className='d-inline-block pt-3'>{ title }</span>
            <div>
                { experimentSearchUrl && (
                    <LinkButton className='mr-3' to={ experimentSearchUrl }>
                        { translate('_participation_search_link') }
                    </LinkButton>
                )}
                { canHistory && historyUrl && (
                    <LinkButton className='mr-3' to={ historyUrl }>
                        { historyLabel }
                    </LinkButton>
                )}
                { canEdit && editUrl && (
                    <LinkButton to={ editUrl }>
                        { editLabel }
                    </LinkButton>
                )}
                { canEdit && onEditClick && (
                    <Button onClick={ onEditClick }>
                        { editLabel }
                    </Button>
                )}
                { (
                    canSelectSubjectsForExperiments
                    && !dev_enableWKPRCPatches
                ) && (
                    <SelectSubjectContainer
                        className='ml-3'
                        subjectId={ subjectId }
                        subjectType={ subjectType }
                    />
                )}
            </div>
        </h5>
    )
}

export default Header;
