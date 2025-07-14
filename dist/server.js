"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth")); // Rota de autenticação
const app = (0, express_1.default)();
// Configuração explícita do CORS
const corsOptions = {
    origin: "http://localhost:5173", // Apenas o frontend que está rodando neste domínio pode fazer requisições
    methods: ["GET", "POST"], // Se necessário, ajuste os métodos
    allowedHeaders: ["Content-Type", "Authorization"], // Adapte conforme necessário
};
app.use((0, cors_1.default)(corsOptions)); // Aplica a configuração do CORS
// Configurações para aceitar JSON no corpo das requisições
app.use(express_1.default.json()); // Middleware para parsear JSON
// Usando a rota de autenticação
app.use("/auth", auth_1.default);
// Iniciando o servidor na porta 3001
app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});
//# sourceMappingURL=server.js.map