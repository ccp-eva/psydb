'use strict';
var expect = require('chai').expect,
    createDiff = require('deep-diff'),
    createClone = require('copy-anything').copy,
    diffToRohrpost = require('./diff-to-rohrpost');

describe('diffToRohrpost()', () => {
    it('does the thing', () => {
        var a = {
            foo: 42,
            aryedit: [
                100,
                { bar: 43, aryinner: [1,2] },
                'will-update',
            ],
            arydel: [
                1,'will-delete',3
            ],
            arypush: [
                1,2,3
            ],
            obj: {
                baz: 44
            },
            'tilde~path': 1,
            'slash/path': 2
        };

        var b = createClone(a);
        delete b.foo
        b.obj.baz = 440;
        
        b.aryedit[0] = 101;
        b.aryedit[1].bar = 430;
        b.aryedit[1].aryinner.push('added-that');
        b.aryedit.splice(2, 1);
        b.aryedit.push('added-that');
        b.arypush.push(102);
        b.arydel.splice(1, 1);

        b['tilde~path'] = 10;
        b['slash/path'] = 20;


        //console.dir(b, { depth: null });
        
        var diff = createDiff(a, b);
        //console.dir(diff, { depth: null });

        var messages = diffToRohrpost(diff);
        //console.dir(messages, { depth: null });

        expect(messages).to.eql([
            { type: 'remove', payload: { prop: '/foo' } },
            { type: 'put', payload: {
                prop: '/aryedit/2', value: 'added-that'
            }},
            { type: 'put', payload: { prop: '/aryedit/1/bar', value: 430 } },
            { type: 'put', payload: {
                prop: '/aryedit/1/aryinner/2',
                value: 'added-that'
            }},
            { type: 'put', payload: { prop: '/aryedit/0', value: 101 } },

            // NOTE: when deleting an element in an array
            // diff assumes you deleted the last element and moves
            // all the values on step to the left
            // this is because its impossible to figure out
            // which item has been deleted when the elements itsel
            // can be of any type i.e. objects/array
            { type: 'remove', payload: { prop: '/arydel/2' } },
            { type: 'put', payload: { prop: '/arydel/1', value: 3 } },
            
            { type: 'put', payload: { prop: '/arypush/3', value: 102 } },
            { type: 'put', payload: { prop: '/obj/baz', value: 440 } },
            
            // paths containing slashed and tilde need to be escaped
            { type: 'put', payload: { prop: '/tilde~0path', value: 10 } },
            { type: 'put', payload: { prop: '/slash~1path', value: 20 } }
        
        ])
    });
});
