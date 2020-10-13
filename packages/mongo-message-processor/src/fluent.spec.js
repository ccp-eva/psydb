'use strict';
var expect = require('chai').expect;

var Foo = () => {
    var foo = {};
    
    foo.createBar = async () => {
        var id = await Promise.resolve(1);
        return Bar({ id });
    }

    return foo;
}

var Bar = ({ id }) => {
    var bar = {};

    bar.something = async () => {
        return await Promise.resolve(42);
    }

    return bar;
}

describe('fluent', () => {
    it('test', async () => {
        var foo = Foo();
        var bar = await foo.createBar();
        var out = await bar.something();

        console.log(out);

        await Foo().createBar().something();
    });
});
