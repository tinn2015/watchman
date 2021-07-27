(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WatchMan = factory());
}(this, (function () { 'use strict';

    /**
     * @description: 获取错误类型
     * @param {*} error.message
     * @return {*}
     */
    var getErrorType = function (message) {
        var errorTypes = ['ReferenceError', 'SyntaxError', 'TypeError', 'RangeError'];
        var type = 'OtherError';
        errorTypes.forEach(function (i) {
            if (message.indexOf(i) > -1) {
                type = i;
            }
        });
        return type;
    };

    var sessionStorageName = 'WATCHMAN_REPORT_STASH';
    var Report = /** @class */ (function () {
        function Report(options) {
            this.interval = options.interval || 10 * 60 * 1000;
            this.url = options.url;
            this.timer = null;
            if (this.url) {
                this.setReportInterval();
            }
        }
        Report.send = function (error) {
            var reportData = sessionStorage.getItem(sessionStorageName);
            var result = [];
            if (!reportData) {
                result = [error];
            }
            else {
                var parseData = JSON.parse(reportData);
                parseData.push(error);
                result = parseData;
            }
            sessionStorage.setItem(sessionStorageName, JSON.stringify(result));
        };
        Report.prototype.setReportInterval = function () {
            var _this = this;
            this.timer = window.setInterval(function () {
                var errorData = sessionStorage.getItem(sessionStorageName);
                if (errorData) {
                    fetch(_this.url, {
                        body: errorData,
                        method: 'POST'
                    }).then(function () {
                        console.log('watchman report success', sessionStorage.getItem(sessionStorageName));
                    })["catch"](function () {
                        clearInterval(_this.timer);
                    });
                    sessionStorage.removeItem(sessionStorageName);
                }
            }, this.interval);
        };
        return Report;
    }());

    /**
     * @description:
     *
     * @param {*}
     * @return {*}
     */
    var CatchError = /** @class */ (function () {
        function CatchError() {
            var _this = this;
            window.addEventListener('error', function (err) {
                _this.handleError(err);
            }, true);
            // window.onerror = (message, source, lineno, colno, error) => {
            //   console.log('on error', message, source, lineno, colno, error)
            // }
            /**
             * @description: promise 被reject 被catch时触发
             * @param {*}
             * @return {*}
             */
            // window.onrejectionhandled = (e) => {
            //   console.log('promise onrejectionhandled', e)
            // }
            /**
             * @description: promise 被 reject 但是没有reject对应回掉时触发
             * @param {*} e
             * @return {*}
             */
            window.onunhandledrejection = function (e) {
                _this.handlePromiseError(e);
            };
        }
        CatchError.prototype.handleError = function (e) {
            // srcElement === window 是全局错误 否则是 资源加载错误
            var error = {
                type: ''
            };
            if (e.srcElement === 'window') { // global error
                error.message = e.srcElement.message;
                error.type = getErrorType(error.message);
                error.lineno = error.lineno;
                error.colno = error.colno;
            }
            else { // resource error
                error.type = 'ResourceError';
                error.tagName = e.srcElement.tagName;
                if (error.tagName === 'IMG' || error.tagName === 'SCRIPT') {
                    error.src = e.srcElement.src;
                }
            }
            this.reportError(error);
        };
        CatchError.prototype.handlePromiseError = function (e) {
            var error = {
                type: '',
                reason: {}
            };
            error.type = e.type;
            error.reason = {
                message: e.reason.message,
                stack: e.reason.stack
            };
            Report.send(error);
        };
        CatchError.prototype.reportError = function (error) {
            Report.send(error);
        };
        return CatchError;
    }());

    var Performance = /** @class */ (function () {
        function Performance() {
            var _this = this;
            // this.performance = window.performance
            window.addEventListener('load', function () {
                console.log('load');
                setTimeout(function () {
                    _this.timingHandle();
                }, 1000);
            });
        }
        Performance.prototype.timingHandle = function () {
            var timing = window.performance.timing;
            var timingObj_net = {};
            var timingObj_dom = {};
            timingObj_net['DNS解析用时：'] = (timing.domainLookupEnd - timing.domainLookupStart) / 1000 + 's';
            timingObj_net['TCP完成握手用时：'] = (timing.connectEnd - timing.connectStart) / 1000 + 's';
            timingObj_net['HTTP请求响应完成用时：'] = (timing.responseEnd - timing.responseStart) / 1000 + 's';
            timingObj_net['网络总用时：'] = (timing.responseEnd - timing.navigationStart) / 1000 + 's';
            timingObj_dom['DOM解析完成用时：'] = (timing.domInteractive - timing.domLoading) / 1000 + 's';
            timingObj_dom['DOM解析完成且资源加载完成用时：'] = (timing.domComplete - timing.domLoading) / 1000 + 's';
            timingObj_dom['脚本加载用时：'] = (timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart) / 1000 + 's';
            timingObj_dom['onload事件用时：'] = (timing.loadEventEnd - timing.loadEventStart) / 1000 + 's';
            timingObj_dom['白屏时间：'] = (timing.domLoading - timing.navigationStart) / 1000 + 's';
            timingObj_dom['页面可交互用时：'] = (timing.domInteractive - timing.navigationStart) / 1000 + 's';
            timingObj_dom['页面总耗用时：'] = ((timing.loadEventEnd || timing.loadEventStart || timing.domComplete || timing.domLoading) - timing.navigationStart) / 1000 + 's';
            for (var key in timingObj_net) {
                console.log(key + " " + timingObj_net[key]);
            }
            console.log('---------分割线---------');
            for (var key in timingObj_dom) {
                console.log(key + " " + timingObj_dom[key]);
            }
        };
        return Performance;
    }());

    var WatchMan = /** @class */ (function () {
        function WatchMan(config) {
            if (config === void 0) { config = {}; }
            this.catchError = null;
            this.report = null;
            this.performance = null;
            this.init(config);
        }
        WatchMan.prototype.init = function (config) {
            this.catchError = new CatchError();
            this.performance = new Performance();
            this.report = new Report({ interval: config.interval, url: config.url });
        };
        WatchMan.prototype.send = function (data) {
            Report.send(data);
        };
        return WatchMan;
    }());

    return WatchMan;

})));
//# sourceMappingURL=bundle.js.map
