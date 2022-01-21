"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMode = void 0;
const mongodbWriteTimeOut = 1000; //ms
var SessionMode;
(function (SessionMode) {
    SessionMode[SessionMode["default"] = 1] = "default";
    SessionMode[SessionMode["bank"] = 2] = "bank";
})(SessionMode = exports.SessionMode || (exports.SessionMode = {}));
class Handler {
    constructor(handler, sessionMode) {
        this.function = handler;
        this.sessionMode =
            sessionMode !== undefined ? sessionMode : SessionMode.default;
    }
    run(context) {
        return this.function(context);
    }
}
exports.default = Handler;
//# sourceMappingURL=handler.js.map