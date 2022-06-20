import React from 'react';
import InviteTestableSubjectList from '../invite/testable-subject-list';

const InhouseTestableSubjectList = (ps) => {
    return (
        <InviteTestableSubjectList { ...ps } inviteType='online-video-call' />
    );
}

export default InhouseTestableSubjectList;
