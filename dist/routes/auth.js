"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../firebase");
const router = express_1.default.Router();
// Criação de usuário (email/senha)
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await firebase_1.auth.createUser({
            email,
            password,
        });
        res.status(201).json({ uid: user.uid });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Login de usuário (email/senha) — aqui você valida o token enviado pelo frontend
router.post("/verify-token", async (req, res) => {
    try {
        const { idToken } = req.body;
        const decodedToken = await firebase_1.auth.verifyIdToken(idToken);
        // Verifique se o usuário já existe no seu banco de dados
        const userRecord = await firebase_1.auth.getUser(decodedToken.uid);
        // Se for um novo usuário (Google), crie um registro básico
        if (userRecord.providerData.some(provider => provider.providerId === 'google.com')) {
            // Você pode querer criar um perfil vazio para este usuário
            console.log(`Novo usuário Google: ${userRecord.email}`);
        }
        res.json({
            uid: decodedToken.uid,
            email: decodedToken.email,
            // Outros dados que você queira retornar
        });
    }
    catch (error) {
        console.error("Erro ao verificar token:", error);
        res.status(401).json({ error: "Token inválido" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map