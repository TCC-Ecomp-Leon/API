"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(req) {
        this.hostname = req.hostname;
        this.url = req.url;
        this.header = req.headers;
        this.body = req.body;
        this.method = req.method;
        if (this.method === undefined || this.method === null)
            throw Error('Invalid http method');
        this.params = { ...req.params };
        this.query = { ...req.query };
        this._variables = new Object();
    }
    setVariable(key, variable) {
        this._variables[key] = variable;
    }
    getVariable(key) {
        return this._variables[key];
    }
    getAuthToken() {
        const authField = this.header.authorization;
        if (authField === undefined)
            return null;
        const fields = authField.split('Bearer ');
        if (fields.length < 2)
            return null;
        return fields[1];
    }
}
exports.default = Context;
//# sourceMappingURL=context.js.map