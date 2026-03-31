'use strict';

var step = function (msg, asyncFN) {
    // NOTE: i copied this verbatim from npm:mocha-steps
    function markRemainingTestsAndSubSuitesAsPending(currentTest) {
        if (
            currentTest._retries !== -1
            && currentTest._currentRetry < currentTest._retries
        ) {
            return;
        }
        var tests = currentTest.parent.tests;
        var suites = currentTest.parent.suites;

        for (
            var index = tests.indexOf(currentTest) + 1;
            index < tests.length;
            index++
        ) {
            var test = tests[index];
            test.pending = true;
        }

        for (var index = 0; index < suites.length; index++) {
            var suite = suites[index];
            suite.pending = true;
        }
    }

    var asyncWrapper = function (done) {
        var context = this;
        var onError = () => {
            markRemainingTestsAndSubSuitesAsPending(context.test);
            process.removeListener('uncaughtException', onError);
        }

        process.addListener('uncaughtException', onError);

        try {
            //console.log('CALLING');
            var promise = asyncFN.call(context);

            //console.log(promise);
            promise.then(() => {
                //console.log('THEN_DONE')
                process.removeListener('uncaughtException', onError);
                done(null)
            }).catch((error) => {
                //console.log('THEN_ERROR')
                onError();
                done(error)
            });

        } catch (e) {
            onError();
            throw e;
        }
    }

    it(msg, asyncWrapper);
}

step.skip = (...args) => it.skip(...args)

global.step = step;
module.exports.step = step;
