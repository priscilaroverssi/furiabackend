"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const perfil_1 = __importDefault(require("./routes/perfil"));
const app = (0, express_1.default)();
// Configurações básicas
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rotas
app.use("/api", quiz_1.default);
app.use("/perfil", perfil_1.default);
// Rota de health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erro interno do servidor" });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map