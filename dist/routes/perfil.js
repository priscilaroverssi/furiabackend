"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase"); // caminho correto do seu arquivo firebase.ts
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { uid, nome, dataNascimento, cidade, jogos, jogadorFavorito } = req.body;
    if (!uid) {
        return res.status(400).json({ error: "UID é obrigatório" });
    }
    try {
        await firebase_1.db.collection("perfis").doc(uid).set({
            uid,
            nome,
            dataNascimento,
            cidade,
            jogos,
            jogadorFavorito,
        });
        res.json({ message: "Perfil salvo com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao salvar perfil" });
    }
});
router.get("/", async (req, res) => {
    const uid = req.query.uid;
    if (!uid) {
        return res.status(400).json({ error: "UID é obrigatório" });
    }
    try {
        const doc = await firebase_1.db.collection("perfis").doc(uid).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Perfil não encontrado" });
        }
        res.json(doc.data());
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar perfil" });
    }
});
exports.default = router;
//# sourceMappingURL=perfil.js.map