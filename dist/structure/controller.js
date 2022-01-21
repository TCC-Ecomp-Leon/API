"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = __importDefault(require("./context"));
class Controller {
    async runNavigation(navigation, req, res) {
        const context = new context_1.default(req);
        console.log(context.method);
        console.log(context.url);
        console.log(context.body);
        const handlersResponse = await navigation.navigate(context);
        if (handlersResponse.success) {
            console.log(handlersResponse.status);
            console.log(handlersResponse.body);
            res.status(handlersResponse.status).send(handlersResponse.body);
        }
        else {
            console.warn('ERROR');
            console.warn(handlersResponse.error);
            res.status(500).send({});
        }
    }
}
exports.default = Controller;
//# sourceMappingURL=controller.js.map