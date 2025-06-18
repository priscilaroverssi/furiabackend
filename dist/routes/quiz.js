"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../firebase");
const router = (0, express_1.Router)();
router.post("/quiz", async (req, res) => {
    try {
        const { tipoFa, maisFa, menosFa, respostas } = req.body;
        const docRef = await firebase_1.db.collection("resultados_quiz").add({
            tipoFa,
            maisFa,
            menosFa,
            respostas,
            criadoEm: new Date(),
        });
        res.status(201).json({ id: docRef.id, message: "Resultado salvo com sucesso!" });
    }
    catch (error) {
        console.error("Erro ao salvar quiz:", error);
        res.status(500).json({ message: "Erro ao salvar quiz." });
    }
});
exports.default = router;
//# sourceMappingURL=quiz.js.map