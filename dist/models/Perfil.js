"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegraPerfil = void 0;
/**
 * Regra de uso do perfil de um usuário no sistema.
 */
var RegraPerfil;
(function (RegraPerfil) {
    /**
     * Conta responsável pela aplicação como um todo. Ela terá acesso a todas informações do sistema.
     */
    RegraPerfil[RegraPerfil["Administrador"] = 1] = "Administrador";
    /**
     * Conta responsável pela gerência de um projeto no sistema. Cada projeto terá uma conta desse tipo.
     */
    RegraPerfil[RegraPerfil["Projeto"] = 2] = "Projeto";
    /**
     * Demais usos da aplicação que terão regras de uso atreladas aos relacionamentos armazenados no
     * banco de dados para cada um dos usuários.
     */
    RegraPerfil[RegraPerfil["Geral"] = 3] = "Geral";
})(RegraPerfil = exports.RegraPerfil || (exports.RegraPerfil = {}));
//# sourceMappingURL=Perfil.js.map