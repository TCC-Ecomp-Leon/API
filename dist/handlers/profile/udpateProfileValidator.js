"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidatorHandler = void 0;
const profile_1 = require("../../schemas/profile");
const handler_1 = __importDefault(require("../../structure/handler"));
exports.updateProfileValidatorHandler = new handler_1.default(async (context) => {
    const profile = context.body['profile'];
    const cursoUniversitario = context.body['cursoUniversitario'];
    if (!profile_1.UpdateProfileValidator(profile)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(profile_1.UpdateProfileValidator.errors),
            },
        };
    }
    if (cursoUniversitario !== undefined) {
        if (!profile_1.UpdateInformacoesCursoUniversitario(cursoUniversitario)) {
            return {
                status: 400,
                body: {
                    error: JSON.stringify(profile_1.UpdateInformacoesCursoUniversitario.errors),
                },
            };
        }
        context.setVariable('updatingCursoUniversitario', cursoUniversitario);
    }
    context.setVariable('updatingProfile', profile);
    return null;
});
//# sourceMappingURL=udpateProfileValidator.js.map