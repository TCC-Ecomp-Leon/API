"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaMateria = void 0;
exports.schemaMateria = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        idCurso: { type: 'string' },
        nome: { type: 'string' },
        idPerfilProfessor: { type: 'string', nullable: true },
        descricao: { type: 'string' },
    },
    required: ['id', 'idCurso', 'nome', 'descricao'],
};
//# sourceMappingURL=materia.js.map