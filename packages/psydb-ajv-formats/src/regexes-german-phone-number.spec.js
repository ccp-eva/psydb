'use strict';
var expect = require('chai').expect,
    regex = require('./regexes').germanPhoneNumber;

var valid = [
    '+49(0)123 1234 1234',
    '+49 (0) 176 / 12345',
    '01213213',
    '030/123123',
    '01753/123123',
    '01753 / 123123',

    '+49(0)121 79536 77',
    '+49(0)12179536 77',
    '+49(0)222139938113',
    '+49 (0) 1739 906 44',
    '+49 (0) 121 7953677',
    '+491517953677',
    '+49 1517953677',
    '+49 151 7953677',
    '+49 151 79536 77',

    '015777953677',
    '01517953677',
    '0173173990644',
    '0173 173990644',
    '0173 990 644 11',
    '0214154914479',

    '06442 / 3893023',
    '06442 / 38 93 02 3',
    '06442/3839023',
    '0176/223444',

    '042/ 88 17 890 0',
    '02141 54 91 44 79',
    '01753 / 1 1 1 1 1 1', // not fond of this one
];

var invalid = [
    '01753 /              1         1',
    '(06442) 3933023',
    '(02852) 5996-0',
    '(042) 1818 87 9919',
    '+49 (221) - 542944 79',
    '+49(0)121-79536 - 77',
    '+49(0)2221-39938-113',
    '+49 (0) 1739 906-44',
    '+49 (173) 1799 806-44',
    '+49 221 549144 – 79',
    '+49 221 - 542194 79',
    '0 52 22 - 9 50 93 10',
    '02162 - 54 91 44 79',
    '(02162) 54 91 44 79',
    'saddsadasdasd',
    'asdasd',
    'asdasd asdasd asd',
    'asdasd',
    'kjn asohas  asdoiasd',
    '23434 234 234 23',
    '323',
    '23434 234----234',
    '///// ----',
    '// id8834 3493934 //',
]

describe('regexes/german-phone-number', () => {

    it('does the thing', () => {
        console.log('valid')
        valid.forEach(it => {
            console.log(it);
            expect(regex.test(it)).to.eql(true);
        })
        console.log('invalid')
        invalid.forEach(it => {
            console.log(it);
            expect(regex.test(it)).to.eql(false);
        })
    });

});
