var Email = ({ ...keywords } = {}) => ({
    type: 'string',
    //format: 'email', // TODO: reenable
    title: 'Email',
    systemType: 'Email',
    ...keywords
});

module.exports = Email;
