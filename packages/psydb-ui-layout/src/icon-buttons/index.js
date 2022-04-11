import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { withIconButton } from './with-icon-button';

export { withIconButton };

export const StudyIconButton = withIconButton({
    Icon: Icons.ClipboardData
});

export const ExperimentIconButton = withIconButton({
    Icon: Icons.CalendarDate
});

export const SubjectIconButton = withIconButton({
    //Icon: Icons.PersonSquare,
    //defaultIconStyle: {
    //    width: '20px',
    //    height: '20px',
    //    marginTop: '0px'
    //}
    //Icon: Icons.Postcard,
    
    Icon: Icons.PersonVideo2,
    defaultIconStyle: {
        width: '22px',
        height: '22px',
        marginTop: '2px'
    }
});
