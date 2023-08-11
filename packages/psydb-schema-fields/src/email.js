var Email = ({ ...keywords } = {}) => ({
    type: 'string',
    format: 'email',
    title: 'Email',
    systemType: 'Email',
    ...keywords
});

module.exports = Email;
