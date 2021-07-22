(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    // import watchError from './lib/error'
    // export default {
    //   watchError
    // }
    window.addEventListener('error', function (err) {
        console.log('addEventListener', err);
    });
    console.log('tttt');
    window.onerror = function (err) {
        console.log('onerror', err);
    };

})));
//# sourceMappingURL=bundle.js.map
