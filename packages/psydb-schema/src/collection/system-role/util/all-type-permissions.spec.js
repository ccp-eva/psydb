'use strict';
var expect = require('chai').expect,
    createFieldgroupProps = require('./create-fieldgroup-props'),
    AllTypePermissions = require('./all-type-permissions');

describe('AllTypePermissions()', () => {

    it('works for leaf nodes', () => {
        var permissions = AllTypePermissions({
            types: {
                cat: { schemas: { state: {
                    type: 'object',
                    properties: { catname: 'string' }
                }}},
                dog: { schemas: {  state: {
                    type: 'object',
                    properties: { dogname: 'string' }
                }}}
            }
        });

        //console.dir(permissions, { depth: 3 });

        expect(permissions).to.eql({
            type: 'object',
            properties: {
                cat: {
                    type: 'object',
                    properties: createFieldgroupProps({
                        stateSchema: {
                            type: 'object',
                            properties: { catname: 'string' }
                        }
                    }),
                    required: ['_state'],
                },
                dog: {
                    type: 'object',
                    properties: createFieldgroupProps({
                        stateSchema: {
                            type: 'object',
                            properties: { dogname: 'string' }
                        }
                    }),
                    required: ['_state'],
                },
            },
            required: [
                'cat', 'dog',
            ]
        });

    });

    it('works for nodes with children', () => {
        var types = {
            animal: { children: {
                cat: { schemas: { state: {
                    type: 'object',
                    properties: { catname: 'string' }
                }}},
                dog: { schemas: {  state: {
                    type: 'object',
                    properties: { dogname: 'string' }
                }}}
            }},
            human: { children: {
                child: { schemas: { state: {
                    type: 'object',
                    properties: { childname: 'string' }
                }}},
            }},
        };

        var permissions = AllTypePermissions({
            types,
        });

        //console.dir(permissions, { depth: 3 });
        
        expect(permissions).to.eql({
            type: 'object',
            properties: {
                animal: {
                    type: 'object',
                    properties: {
                        types: AllTypePermissions({
                            types: types.animal.children
                        })
                    },
                    required: ['types']
                },
                human: {
                    type: 'object',
                    properties: {
                        types: AllTypePermissions({
                            types: types.human.children
                        })
                    },
                    required: ['types']
                },
            },
            required: [
                'animal', 'human',
            ]
        });

    })
});
