import React from 'react';
import InviteTestableSubjectList from '../invite/testable-subject-list';

const InhouseTestableSubjectList = (ps) => {
    return (
        <InviteTestableSubjectList { ...ps } inviteType='inhouse' />
    );
}

export default InhouseTestableSubjectList;
